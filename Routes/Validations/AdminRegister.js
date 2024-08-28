const { body } = require("express-validator");

const registerValidator = [
  body("fullName").not().isEmpty().withMessage("fullName Name is required"),
  body("fullName")
    .isLength({ min: 6, max: 20 })
    .withMessage("fullName Name must be between 6 and 20 characters"),

  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Please Enter a valid Email Address"),

  body("password").notEmpty().withMessage("Password is required"),
  body("password")
    .isLength({ min: 8, max: 25 })
    .withMessage("Password must be between 8 and 25 characters"),
];

module.exports = registerValidator;
