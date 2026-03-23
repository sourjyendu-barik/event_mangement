const Event = require("../models/model.events");
const User = require("../models/model.users");
// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizerId: req.user.id,
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizerId");
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE EVENT
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizerId");
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteEvent,
  updateEvent,
  getEventById,
  getEvents,
  createEvent,
};
