const Event = require("../models/model.events");
const Booking = require("../models/models.bookings");
const razorpay = require("../utils/razorpay");
const Payment = require("../models/model.payment");
const crypto = require("crypto");
// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { eventId, ticketCount } = req.body;

    // check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // check ticket availability
    if (event.availableTickets < ticketCount) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const amount = event.price * ticketCount * 100;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    const userId = req.user.id;
    // 🎟 create booking (pending)
    const booking = new Booking({
      eventId,
      customerId: userId,
      ticketCount,
      status: "pending",
    });
    await booking.save();
    const payment = new Payment({
      bookingId: booking._id,
      userId: userId,
      amount: amount / 100, // store in rupees
      status: "pending",
      razorpayOrderId: order.id,
    });
    await payment.save();
    // reduce available tickets

    res.status(200).json({
      orderId: order.id,
      amount,
      bookingId: booking._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// GET BOOKINGS BY USER
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.user.id,
    })
      .populate("eventId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;
    //console.log(req.body);

    // 🔐 verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.key_secret)
      .update(body)
      .digest("hex");
    console.log("EXPECTED:", expectedSignature);
    console.log("RECEIVED:", razorpay_signature);
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }
    // 💰 update payment
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true },
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    // 🎟 update booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "confirmed" },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // 📉 reduce tickets
    const event = await Event.findById(booking.eventId);
    if (event) {
      event.availableTickets -= booking.ticketCount;
      await event.save();
    }

    res.status(200).json({
      message: "Payment successful",
      booking,
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getUserBookings, verifyPayment };
