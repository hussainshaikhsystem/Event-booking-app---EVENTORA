const bookingmodel = require("../models/bookingmodel.js");
const otpmodel = require("../models/otpmodel.js");
const eventmodel = require("../models/eventmodel.js");
const { sendbookingemail, sendotpemail } = require("../utils/sendmail.js");
const generateotp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const sendbookingotp = async (req, res) => {
  try {
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
    console.error(err);
    res.status(400).json({ message: "Unable to send otp" });
  }
};
const bookevent = async (req, res) => {
  try {
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
    if (event.availableseats <= 0) {
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
    await otpmodel.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });
    try {
      await sendbookingemail(req.user.email, event.title, booking._id);
    } catch (err) {
      console.error("Error sending booking email:", err);
    }

    res
      .status(201)
      .json({ message: "booking created , please check ur email for " });
  } catch (err) {
    console.error("bookevent error:", err);
    res.status(500).json({ error: err.message });
  }
};

const confirmbooking = async (req, res) => {
  try {
    const paymentstatus = req.body.paymentstatus;
    if (!["paid", "non-paid"].includes(paymentstatus)) {
      return res.status(400).json({ error: "invalid payment status" });
    }
    const booking = await bookingmodel
      .findById(req.params.id)
      .populate("eventid")
      .populate("userid", "name email");
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.status === "confirmed") {
      return res.status(400).json({ error: "Booking is already confirmed" });
    }
    if(!booking.eventid){
      return res.status(404).json({error: 'Event no longer exists'})
    }
    if(booking.status === 'cancelled'){
      return res.status(400).json({error: "Booking is Cancelled"})
    }
    const event = await eventmodel.findById(booking.eventid._id);
    if (event.availableseats <= 0) {
      return res.status(400).json({ error: "no seats available" });
    }
    booking.status = "confirmed";
    if (paymentstatus) {
      booking.paymentstatus = paymentstatus;
    }
    await booking.save();

    event.availableseats -= 1;

    await event.save();

    // admin confirm booking , send email to user
    try {
      await sendbookingemail(booking.userid.email, event.title, booking._id);
    } catch (err) {
      console.error("Error sending in confirm booking email:", err);
    }
    res.status(200).json({ message: "booking confirmed" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "unable to confirm booking" });
  }
};

const getmybookings = async (req, res) => {
  try {
    const bookings =
      req.user.role === "admin"
        ? await bookingmodel
            .find()
            .populate("eventid")
            .populate("userid", "name email")
            .sort({ createdAt: -1 })
        : await bookingmodel
            .find({ userid: req.user._id })
            .populate("eventid")
            .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "unable to get bookings" });
  }
};

const cancelbooking = async (req, res) => {
  try {
    const booking = await bookingmodel
      .findById(req.params.id)
      .populate("eventid");
    if (!booking) {
      return res.status(404).json({ error: "Booking Not Found" });
    }
    if (
      booking.userid.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Already Cancelled" });
    if (booking.status === "confirmed") {
      const event = await eventmodel.findById(booking.eventid._id);
      event.availableseats += 1;
      await event.save();
    }

    await booking.deleteOne();
    res.json({ message: "Booking Cancelled" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "unable to cancel booking" });
  }
};
module.exports = {
  sendbookingotp,
  bookevent,
  confirmbooking,
  getmybookings,
  cancelbooking,
};
