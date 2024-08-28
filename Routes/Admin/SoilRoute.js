const express = require("express");
const router = express.Router();
const Soil = require("../../Models/Admin/Soil");
const CheckIfUserLoggedIn = require("../../Middleware/MiddleWareAuth");
const AdminRegister = require("../../Models/Admin/AdminRegister");

// Create Soil Details
router.post("/createsoil", CheckIfUserLoggedIn, async (req, res) => {
  const userId = req.user.user.id;
  //   console.log("this is user", userId);

  const {
    soilType,
    pHLevel,
    organicMatterPercentage,
    texture,
    fertilityRating,
    recommendedCrops,
  } = req.body;

  const CheckAdmin = await AdminRegister.findOne({ _id: userId });
  if (CheckAdmin.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized access" });
  }
  //   console.log("CheckAdmin", CheckAdmin);

  try {
    const soil = new Soil({
      soilType,
      pHLevel,
      organicMatterPercentage,
      texture,
      fertilityRating,
      recommendedCrops,
    });
    await soil.save();
    res
      .status(201)
      .json({ success: true, message: "Soil information added", soil });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Soil Details
router.get("/fetchsoil", CheckIfUserLoggedIn, async (req, res) => {
  const userId = req.user.user.id;
  //   console.log("this is user", userId);

  // const CheckAdmin = await AdminRegister.findOne({ _id: userId });
  // if (CheckAdmin.role !== "admin") {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Unauthorized access" });
  // }
  try {
    const soil = await Soil.find();
    res
      .status(200)
      .json({ success: true, message: "Soil information fetched", soil });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Soil Details
router.put("/updatesoil/:id", CheckIfUserLoggedIn, async (req, res) => {
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
    soilType,
    pHLevel,
    organicMatterPercentage,
    texture,
    fertilityRating,
    recommendedCrops,
  } = req.body;

  try {
    const soil = await Soil.findByIdAndUpdate(
      id,
      {
        soilType,
        pHLevel,
        organicMatterPercentage,
        texture,
        fertilityRating,
        recommendedCrops,
      },
      { new: true }
    );

    if (!soil) {
      return res.status(404).json({ error: "Soil not found" });
    }

    res.json({ success: true, message: "Soil information updated", soil });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Soil Details
router.delete("/deletesoil/:id", CheckIfUserLoggedIn, async (req, res) => {
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
    const soil = await Soil.findByIdAndDelete(id);

    if (!soil) {
      return res.status(404).json({ error: "Soil not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Soil information deleted", soil });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
