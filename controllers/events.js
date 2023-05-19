const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  res.status(200).json({
    ok: true,
    events,
  });
};

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;
    const savedEvent = await event.save();

    res.status(201).json({
      ok: true,
      event: savedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact an administrator",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventID = req.params.id;

  try {
    const event = await Event.findById(eventID);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "There is no event with that id",
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "You are not allowed to edit this event",
      });
    }

    const newEvent = {
      ...req.body,
      user: req.uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventID, newEvent, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact an administrator",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventID = req.params.id;

  try {
    const event = await Event.findById(eventID);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "There is no event with that id",
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "You are not allowed to delete this event",
      });
    }

    await Event.findByIdAndDelete(eventID);

    res.status(200).json({
      ok: true,
      msg: "Event deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact an administrator",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
