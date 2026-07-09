const express = require("express");

const {
    createGenre,
    getGenres
} = require("../controllers/genreController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, admin, createGenre);

router.get("/", getGenres);

module.exports = router;