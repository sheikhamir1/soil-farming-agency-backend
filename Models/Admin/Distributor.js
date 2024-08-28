const mongoose = require("mongoose");

const DistributorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email must be a valid email address"], // Adjust regex as needed
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    products: {
      type: [String], // List of products or seeds
      default: [],
    },
    website: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Distributor = mongoose.model("Distributor", DistributorSchema);

module.exports = Distributor;
