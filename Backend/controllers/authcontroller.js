const usermodel = require("../models/usermodel.js");
const otpmodel = require("../models/otpmodel.js");
const { sendotpemail } = require("../utils/sendmail.js");
const bcrypt = require("bcryptjs");
const generatetoken = require("../utils/generatetoken.js");
const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existinguser = await usermodel.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "User already exists with this emaik" });
    }
    const hashedpass = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 90000).toString();

    const user = await usermodel.create({
      name,
      email,
      password: hashedpass,
      role: "user",
      isverified: false,
    });
    await otpmodel.create({ email, otp, action: "account_verification" });

    await sendotpemail(email, otp, "account_verification");
    return res.status(200).json({
      _id: user._id,
      message: "otp sent to email , please verify",
    });
  } catch (err) {
    res.status(400).json({ message: "Unable to register user" });
  }
};
const verifyotp = async (req, res) => {
  try{
    const {email , otp} = req.body;
    const user = await usermodel.findOne({email});
    if(!user){
     return  res.status(400).json({message: 'no user with this email'})
    }
    if(user.isverified){
      return res.status(400).json({message: "user already verified"})
    }
    const otprecord = await otpmodel.findOne({email, otp , action: 'account_verification'});
    if(!otprecord){
     return res.status(400).json({message: "invalid or expired otp"})
    };

    user.isverified = true;
    await user.save();

    await otpmodel.deleteOne({_id: otprecord._id});
     res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: await generatetoken(user._id),
    });
  }catch(err){
    res.status(400).json({message: "Unable to verify otp"})
  }
}
const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }
    if(!user.isverified){
          return res.status(400).json({message: "please verify your email id"})
    }
    const rightpassword = await bcrypt.compare(password, user.password);
    if (rightpassword) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: await generatetoken(user._id)
      });
    } else {
      res.status(400).json({ message: "wrong password" });
    }
  } catch (err) {
    res.status(400).json({ message: "Unable to Login user" });
  }
};
module.exports = { registeruser, loginuser , verifyotp};
