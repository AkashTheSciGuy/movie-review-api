
const express = require("express");
const mongoose = require("mongoose");

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

const validateFavoriteBody = (req, res, next) => {
    if (!mongoose.isObjectIdOrHexString(req.body?.movie)) {
        return res.status(400).json({
            success: false,
            message: "Valid movie ID is required"
        });
    }

    next();
};

const validateFavoriteId = (req, res, next) => {
    if (!mongoose.isObjectIdOrHexString(req.params.movieId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid movie ID"
        });
    }

    next();
};

router.route("/")
    .post(protect, validateFavoriteBody, addFavorite)
    .get(protect, getFavorites);

router.delete(
    "/:movieId",
    protect,
    validateFavoriteId,
    removeFavorite
);

module.exports = router;
