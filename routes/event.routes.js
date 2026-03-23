const express = require("express");

const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controller/eventController");

// CREATE EVENT
router.post("/", createEvent);

// GET ALL EVENTS
router.get("/", getEvents);

// GET SINGLE EVENT
router.get("/:id", getEventById);

// UPDATE EVENT
router.put("/:id", updateEvent);

// DELETE EVENT
router.delete("/:id", deleteEvent);

module.exports = router;
