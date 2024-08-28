const { body } = require("express-validator");

const loginValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Please Enter a valid Email Address"),
  body("password").notEmpty().withMessage("Password is required"),
  body("password")
    .isLength({ min: 8, max: 25 })
    .withMessage("Password must be between 8 and 25 characters"),
];

module.exports = loginValidator;
