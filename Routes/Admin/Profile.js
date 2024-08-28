const mongoose = require("mongoose");
const express = require("express");
const Router = express.Router();
const CheckIfUserLoggedIn = require("../../Middleware/MiddleWareAuth");
const AdminRegister = require("../../Models/Admin/AdminRegister");

Router.get("/fetchprofile", CheckIfUserLoggedIn, async (req, res) => {
  try {
    // Extract userId from req.user.user and ensure it's a string
    const userId = req.user.user.id;
    console.log("User ID:", userId);

    // Fetch the profile of the currently logged-in user
    const userProfile = await AdminRegister.findById({ _id: userId }).select(
      "-password -__v -createdAt -updatedAt -emailVerificationExpires -emailVerificationToken -_id"
    );
    console.log("User Profile:", userProfile);

    // Check if the profile is found
    if (!userProfile) {
      return res.status(404).json({ success: false, msg: "Profile not found" });
    }

    // Send the profile details in response
    res.status(200).json({ success: true, userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

module.exports = Router;
