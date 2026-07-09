const express = require("express");

const { getDashboard } = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, admin, getDashboard);

module.exports = router;