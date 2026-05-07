const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { permit } = require("../middleware/role");
const { ROLES } = require("../config/constants");
const {
  adminCreateUserValidation,
  createStoreValidation,
  userIdRule
} = require("../validators");
const {
  dashboard,
  createUser,
  listUsers,
  getUserById,
  createStore,
  listStores
} = require("../controllers/adminController");

const router = express.Router();

router.use(protect, permit(ROLES.ADMIN));

router.get("/dashboard", dashboard);
router.post("/users", adminCreateUserValidation, validate, createUser);
router.get("/users", listUsers);
router.get("/users/:userId", userIdRule, validate, getUserById);
router.post("/stores", createStoreValidation, validate, createStore);
router.get("/stores", listStores);

module.exports = router;
