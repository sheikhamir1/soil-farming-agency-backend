const mongoose = require("mongoose");

const SoilSchema = new mongoose.Schema(
  {
    soilType: {
      type: String,
      required: [true, "Soil type is required"],
      enum: ["Clay", "Sandy", "Silty", "Peaty", "Chalky", "Loamy"], // Common soil types
    },
    pHLevel: {
      type: Number,
      required: [true, "pH level is required"],
      min: 0,
      max: 14, // pH scale ranges from 0 to 14
    },
    organicMatterPercentage: {
      type: Number,
      required: [true, "Organic matter percentage is required"],
      min: 0,
      max: 100, // Percentage value
    },
    texture: {
      type: String,
      required: [true, "Texture is required"],
      enum: ["Fine", "Medium", "Coarse"], // Basic soil textures
    },
    fertilityRating: {
      type: String,
      enum: ["Low", "Medium", "High"], // Fertility rating for the soil
      default: "Medium",
    },
    recommendedCrops: {
      type: [String], // List of crops suitable for this soil
      default: [],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Soil = mongoose.model("Soil", SoilSchema);

module.exports = Soil;
