const express = require("express");
const router = express.Router();
const { protect, admin } = require("../midlewares/authmiddleware.js");
const {bookevent, sendbookingotp, getmybookings, confirmbooking, cancelbooking} = require('../controllers/bookingcontroller.js')
router.post("/", protect, bookevent);
router.post('/send-otp', protect, sendbookingotp)
router.get("/my", protect, getmybookings);
router.put("/:id/confirm", protect, admin , confirmbooking);
router.delete('/:id', protect, cancelbooking)
module.exports = router;
 