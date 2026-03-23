const express = require("express");
const router = express();

const {
  createBooking,
  getUserBookings,
} = require("../controller/bokingController");

router.post("/", createBooking);
router.get("/:id", getUserBookings);

module.exports = router;
