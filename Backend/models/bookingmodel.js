const mongoose = require("mongoose");
const bookingschema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentstatus: {
      type: String,
      enum: ["non-paid", "paid"],
      default: "non-paid",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Booking", bookingschema);
