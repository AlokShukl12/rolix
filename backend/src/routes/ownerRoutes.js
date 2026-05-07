const express = require("express");
const { protect } = require("../middleware/auth");
const { permit } = require("../middleware/role");
const { ROLES } = require("../config/constants");
const { dashboard } = require("../controllers/ownerController");

const router = express.Router();

router.use(protect, permit(ROLES.OWNER));
router.get("/dashboard", dashboard);

module.exports = router;
