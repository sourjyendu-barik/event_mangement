const Event = require("../models/model.events");
const Booking = require("../models/models.bookings");

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

    // create booking
    const booking = await Booking.create({
      eventId,
      customerId: req.user.id,
      ticketCount,
    });

    // reduce available tickets
    event.availableTickets -= ticketCount;
    await event.save();

    res.status(201).json(booking);
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
module.exports = { createBooking, getUserBookings };
