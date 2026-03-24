const express = require("express");
const router = express();

const {
  createBooking,
  getUserBookings,
  verifyPayment,
} = require("../controller/bokingController");

router.post("/createOrderId", createBooking);
router.get("/:id", getUserBookings);
router.post("/verify", verifyPayment);
module.exports = router;
