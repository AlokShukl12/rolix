const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const {
  userSignupValidation,
  loginValidation,
  updatePasswordValidation
} = require("../validators");
const { signup, login, updatePassword, me } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", userSignupValidation, validate, signup);
router.post("/login", loginValidation, validate, login);
router.get("/me", protect, me);
router.patch("/password", protect, updatePasswordValidation, validate, updatePassword);

module.exports = router;
