const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendbookingemail = async (useremail, username, eventtitle) => {
  try {
    const mailoptions = {
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: useremail,
      subject: `Booking Confirmed: ${eventtitle}`,
       
      html: `
        <h2>Hi ${username}!</h2>
        <p>Your booking for the event <strong>${eventtitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventora.</p>
      `,
    };
    await transporter.sendMail(mailoptions);
    console.log("Email sent succesfully to", useremail);
  } catch (err) {
    console.error(err.message);
  }
};
const sendotpemail = async (useremail, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Verify Your Eventora account"
        : "Eventora Booking Verification";
    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventora account."
        : "Please use the following OTP to verify and confirm your event booking.";
    const mailoptions = {
      from: process.env.EMAIL_USER,
      to: useremail,
      subject: title,

      html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `,
    };
    await transporter.sendMail(mailoptions);
    console.log(`OTP sent to ${useremail} for ${type}`);
  } catch (err) {
    console.error(err.message);
  }
};
module.exports = {sendbookingemail, sendotpemail};
