const bookingmodel = require("../models/bookingmodel.js");
const otpmodel = require("../models/otpmodel.js");
const eventmodel = require("../models/eventmodel.js");
const { sendbookingemail, sendotpemail } = require("../utils/sendmail.js");
const generateotp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const sendbookingotp = async (req, res) => {
  try{
     const otp = generateotp();
  await otpmodel.findOneAndDelete({
    email: req.user.email,
    action: "event_booking",
  });
  await otpmodel.create({
    email: req.user.email,
    otp: otp,
    action: "event_booking",
  });
  await sendotpemail(req.user.email, otp, "event_booking");
  res.json({ message: "otp sent to email for booking confimration" });
  } catch (err) {
    res.status(400).json({ message: "Unable to send otp" });
  }
};
const bookevent = async (req, res) => {
  const { eventid, otp } = req.body;
  const otprecord = await otpmodel.findOne({
    email: req.user.email,
    otp,
    action: "event_booking",
  });
  if (!otprecord) {
    return res.status(400).json({ error: "Invalid or expired otp" });
  }
  const event = await eventmodel.findById(eventid);
  if (!event) {
    return res.status(404).json({ error: "event not found" });
  }
  if (event.totalseats <= 0) {
    return res.status(400).json({ error: "No seats available" });
  }
  const existingbooking = await bookingmodel.findOne({
    userid: req.user._id,
    eventid: eventid,
  });
  if (existingbooking) {
    return res
      .status(400)
      .json({ error: "You have already booked this event" });
  }
  const booking = await bookingmodel.create({
    userid: req.user._id,
    eventid,
    status: "pending",
    paymentstatus: "non-paid",
    amount: event.ticketprice,
  });
  await otpmodel.deleteMany({ email: req.user.email, action: "event_booking" });
  await sendbookingemail(req.user.email, event.title, booking._id);
  res
    .status(201)
    .json({ message: "booking created , please check ur email for " });
};

const confirmbooking = async (req, res) => {
  const paymentstatus = req.body.paymentstatus;
  if (!["paid", "non-paid"].includes(paymentstatus)) {
    return res.status(400).json({ error: "invalid payment status" });
  }
  const booking = await bookingmodel
    .findById(req.params.id)
    .populate("eventid");
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  if (booking.status === "confirmed") {
    return res.status(400).json({ error: "Booking is already confirmed" });
  }
  const event = await eventmodel.findById(booking.eventid._id);
  if (event.totalseats <= 0) {
    return res.status(400).json({ error: "no seats available" });
  }
  booking.status = "confirmed";
  if (paymentstatus) {
    booking.paymentstatus = paymentstatus;
  }
  await booking.save();
  event.totalseats -= 1;
  await event.save();

  // admin confirm booking , send email to user
  await sendbookingemail(req.user.email, event.title, booking._id);
  res.status(200).json({ message: "booking confirmed" });
};

const getmybookings = async (req, res) => {
  const bookings = await bookingmodel
    .find({ userid: req.user._id })
    .populate("eventid");
  res.status(200).json(bookings);
};

const cancelbooking = async (req, res) => {
  const booking = await bookingmodel
    .findById(req.params.id)
    .populate("eventid");
  if (!booking) {
    return res.status(404).json({ error: "Booking Not Found" });
  }
  if (booking.userid.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  if (booking.status === "confirmed") {
    const event = await eventmodel.findById(booking.eventid._id);
    event.totalseats += 1;
    await event.save();
  }
  booking.status = "cancelled";
  await booking.save();

  await booking.deleteOne();
  res.json({ message: "Booking Cancelled" });
};
module.exports = {sendbookingotp,bookevent, confirmbooking,getmybookings, cancelbooking}