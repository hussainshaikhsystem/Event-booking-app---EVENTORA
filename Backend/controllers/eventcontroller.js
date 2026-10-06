
const bookingmodel = require("../models/bookingmodel.js");
const eventmodel = require("../models/eventmodel.js");
const getallevents = async (req, res) => {
  try {
    const events = await eventmodel.find({});
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json({ message: "unable to fetch events" });
  }
};
const geteventbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventmodel.findById(id);
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ message: "unable to fetch event with this Id" });
  }
};
const createevent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      availableseats,
      totalseats,
      ticketprice,
      imageurl,
    } = req.body;
    const event = await eventmodel.create({
      title,
      description,
      date,
      location,
      category,
      availableseats: availableseats ?? totalseats,
      totalseats,
      ticketprice,
      imageurl,
      createdby: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: "unable to create event" });
    console.error(err.message)
  }
};
const updateevent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      location,
      category,
      availableseats,
      totalseats,
      ticketprice,
      imageurl,
    } = req.body;
    const updatedevent = await eventmodel.findByIdAndUpdate(id, {
      title,
      description,
      date,
      location,
      category,
      availableseats,
      totalseats,
      ticketprice,
      imageurl,
    });
    if (!updatedevent) {
      return res.status(404).json({ error: "event not found" });
    }
    res.status(200).json(updatedevent);
  } catch (err) {
    res.status(400).json({ message: "unable to Update event" });
  }
};
const deleteevent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedevent = await eventmodel.findByIdAndDelete(id);
    if (!deletedevent) {
      return res.status(404).json({ error: "event not found" });
    }
    await bookingmodel.deleteMany({eventid: id})
    res.status(200).json(deletedevent);
  } catch (err) {
    res.status(400).json({ message: "unable to Delete event" });
  }
};
module.exports = {
  createevent,
  getallevents,
  geteventbyid,
  updateevent,
  deleteevent,
};
