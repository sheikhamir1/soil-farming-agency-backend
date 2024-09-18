const express = require("express");
const router = express.Router();
const Distributor = require("../../Models/Admin/Distributor");
const CheckIfUserLoggedIn = require("../../Middleware/MiddleWareAuth");
const AdminRegister = require("../../Models/Admin/AdminRegister");

// Create Distributor Details
router.post("/addDistributor", CheckIfUserLoggedIn, async (req, res) => {
  const userId = req.user.user.id;
  //   console.log("this is user", userId);

  const CheckAdmin = await AdminRegister.findOne({ _id: userId });
  if (CheckAdmin.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized access" });
  }
  //   console.log("CheckAdmin", CheckAdmin);

  const checkEmail = await Distributor.findOne({ email: req.body.email });
  if (checkEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  const {
    name,
    contactPerson,
    phoneNumber,
    email,
    address,
    products,
    website,
    rating,
    isActive,
  } = req.body;
  try {
    const distributor = new Distributor({
      name,
      contactPerson,
      phoneNumber,
      email,
      address,
      products,
      website,
      rating,
      isActive,
    });

    console.log("distributor", distributor);

    await distributor.save();
    res.status(201).json({
      success: true,
      message: "Distributor added successfully",
      distributor,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Distributor Details
router.get("/fetchdistributor", CheckIfUserLoggedIn, async (req, res) => {
  const userId = req.user.user.id;
  //   console.log("this is user", userId);

  // const CheckAdmin = await AdminRegister.findOne({ _id: userId });
  // if (CheckAdmin.role !== "admin") {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Unauthorized access" });
  // }
  try {
    const distributor = await Distributor.find();
    res.status(200).json({
      success: true,
      message: "Distributor information fetched",
      distributor,
    });
    console.log("Distributor", Distributor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Distributor Details
router.put("/updatedistributor/:id", CheckIfUserLoggedIn, async (req, res) => {
  const userId = req.user.user.id;
  //   console.log("this is user", userId);
  console.log("this is id", req.params.id);

  const CheckAdmin = await AdminRegister.findOne({ _id: userId });
  if (CheckAdmin.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized access" });
  }

  const { id } = req.params;
  const {
    name,
    contactPerson,
    phoneNumber,
    email,
    address,
    products,
    website,
    rating,
    isActive,
  } = req.body;
  try {
    const distributor = await Distributor.findByIdAndUpdate(
      id,
      {
        name,
        contactPerson,
        phoneNumber,
        email,
        address,
        products,
        website,
        rating,
        isActive,
      },
      { new: true }
    );
    if (!distributor) {
      return res.status(404).json({ error: "Distributor not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Distributor updated", distributor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Soil Details
router.delete(
  "/deletedistributor/:id",
  CheckIfUserLoggedIn,
  async (req, res) => {
    const userId = req.user.user.id;
    //   console.log("this is user", userId);
    //   console.log("this is id", req.params.id);

    const CheckAdmin = await AdminRegister.findOne({ _id: userId });
    if (CheckAdmin.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;
    try {
      const distributor = await Distributor.findByIdAndDelete(id);
      if (!distributor) {
        return res.status(404).json({ error: "Distributor not found" });
      }
      res.status(200).json({
        success: true,
        message: "Distributor deleted successfully",
        distributor,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
