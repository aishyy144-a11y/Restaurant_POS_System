const express = require("express");
const router = express.Router();
const { getDashboardStats, getDishStats } = require("../controllers/statsController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

router.get("/", isVerifiedUser, getDashboardStats);
router.get("/dishes", isVerifiedUser, getDishStats);

module.exports = router;
