const { body, param } = require("express-validator");
const { ROLES } = require("../config/constants");

const nameRule = body("name")
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage("Name must be between 20 and 60 characters");

const emailRule = body("email").isEmail().withMessage("Invalid email").normalizeEmail();

const addressRule = body("address")
  .trim()
  .isLength({ min: 1, max: 400 })
  .withMessage("Address is required and must be at most 400 characters");

const passwordRule = (field = "password") =>
  body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must include at least one uppercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must include at least one special character");

const storeNameRule = body("name")
  .trim()
  .isLength({ min: 2, max: 120 })
  .withMessage("Store name must be between 2 and 120 characters");

const roleRule = body("role")
  .optional()
  .isIn(Object.values(ROLES))
  .withMessage("Role must be ADMIN, USER, or OWNER");

const storeIdRule = param("storeId").isMongoId().withMessage("Invalid store id");
const userIdRule = param("userId").isMongoId().withMessage("Invalid user id");

const userSignupValidation = [nameRule, emailRule, addressRule, passwordRule()];

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

const updatePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  passwordRule("newPassword")
];

const adminCreateUserValidation = [nameRule, emailRule, addressRule, passwordRule(), roleRule];

const createStoreValidation = [
  storeNameRule,
  emailRule,
  addressRule,
  body("ownerId").optional({ values: "falsy" }).isMongoId().withMessage("ownerId must be a valid id")
];

const ratingValidation = [
  storeIdRule,
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be an integer from 1 to 5")
];

module.exports = {
  userSignupValidation,
  loginValidation,
  updatePasswordValidation,
  adminCreateUserValidation,
  createStoreValidation,
  ratingValidation,
  userIdRule
};
