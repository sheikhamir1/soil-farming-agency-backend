const mongoose = require("mongoose");

const AdminRegisterSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullName is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isVerified: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const AdminRegister = mongoose.model("AdminRegister", AdminRegisterSchema);

module.exports = AdminRegister;
