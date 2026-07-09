const express = require("express");

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
    .post(protect, addFavorite)
    .get(protect, getFavorites);

router.delete("/:movieId", protect, removeFavorite);

module.exports = router;