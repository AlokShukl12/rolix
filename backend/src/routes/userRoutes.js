const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { permit } = require("../middleware/role");
const { ROLES } = require("../config/constants");
const { ratingValidation } = require("../validators");
const { listStoresForUser, submitOrUpdateRating } = require("../controllers/userController");

const router = express.Router();

router.use(protect, permit(ROLES.USER));
router.get("/stores", listStoresForUser);
router.post("/stores/:storeId/rating", ratingValidation, validate, submitOrUpdateRating);

module.exports = router;
