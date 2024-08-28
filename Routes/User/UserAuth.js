const express = require("express");
const router = express.Router();
const AdminRegister = require("../../Models/Admin/AdminRegister");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const registerValidator = require("../Validations/AdminRegister");
const loginValidator = require("../Validations/AdminLogin");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
JWT_SECRET_KEY = process.env.JWT_ACCESS_TOKEN;

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(20).toString("hex").toLowerCase();
  // Store the token in lowercase
  user.emailVerificationToken = token;
  user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const verificationURL = `http://localhost:5173/verifyemail/${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Verify Your Email Address",
    html: `<h1>Hi ${user.fullName},</h1>
             <p>Thank you for registering on Soil Farming Agency!</p>
             <p>Please verify your email address by clicking the link below:</p>
             <a href=${verificationURL}>${verificationURL}</a>
             <p>If you did not create an account, please ignore this email.</p>
             <p>Best regards,<br>Cyber hunter Team</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email: " + err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

router.post("/userregister", registerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }

  // console.log("this is body", req.body);
  let { fullName, email, password } = req.body;

  const existingUsers = await AdminRegister.findOne({ email });
  if (existingUsers) {
    return res
      .status(400)
      .json({ success: false, message: "user already exists" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;
    // console.log("this is hashed password", hashedPassword);

    const newUser = new AdminRegister({
      fullName,
      email,
      password,
    });
    // console.log("this is new user", newUser);
    await newUser.save();
    await sendVerificationEmail(newUser);

    res.status(200).json({
      success: true,
      message: "User register successfully please verify your email to login",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error register" });
  }
});

// login route

router.post("/userlogin", loginValidator, async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, error: error.array() });
  }

  const { email, password } = req.body;
  try {
    const existingUsers = await AdminRegister.findOne({ email });
    if (!existingUsers) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    if (!existingUsers.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified please verify to login",
      });
    }

    if (!existingUsers.role === "user") {
      return res.status(403).json({
        success: false,
        message: "Only User can login",
      });
    }

    // console.log("Plaintext Password:", password);
    // console.log("Hashed Password:", existingUsers.password);

    const ismatched = await bcrypt.compare(
      password.toString(),
      existingUsers.password
    );
    if (!ismatched) {
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });
    }
    const JWT_Token = JWT_SECRET_KEY;
    // console.log("this is secretkey", JWT_Token);

    // console.log("this is existingUsers._id", existingUsers._id);
    const payload = {
      user: {
        id: existingUsers._id,
        email: existingUsers.email,
      },
    };
    const authToken = jwt.sign(payload, JWT_Token, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    });
    // console.log(authToken);
    res.status(200).json({
      success: true,
      authToken,
      message: "user logged in successfully",
      role: existingUsers.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error login" });
  }
});

// verify email

router.get("/verifyemail/:token", async (req, res) => {
  const { token } = req.params;
  console.log("Received token:", token);

  try {
    const now = new Date();
    console.log("Current Date:", now);

    const checkUser = await AdminRegister.findOne({
      emailVerificationToken: token.trim().toLowerCase(),
      emailVerificationExpires: { $gt: now },
    });

    console.log("checkUser found:", checkUser);

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        msg: "Verification token is invalid or has expired.",
      });
    }

    // Check if the user is already verified
    if (checkUser.isVerified) {
      return res.status(200).json({
        success: true,
        msg: "Email is already verified. You can now log in.",
      });
    }

    checkUser.isVerified = true;
    checkUser.emailVerificationToken = undefined;
    checkUser.emailVerificationExpires = undefined;

    await checkUser.save();

    res.status(200).json({
      success: true,
      msg: "Email has been verified. You can now log in.",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
