const express = require("express");
const router = express();

const {
  createBooking,
  getUserBookings,
  verifyPayment,
  cancelBooking,
} = require("../controller/bokingController");

router.post("/createOrderId", createBooking);
router.get("/:id", getUserBookings);
router.post("/verify", verifyPayment);
router.post("/cancelBooking:id", cancelBooking);
module.exports = router;
