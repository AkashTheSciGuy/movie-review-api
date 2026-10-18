const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");

const {
    createGenre,
    getGenres,
    getGenreById,
    updateGenre,
    deleteGenre
} = require("../controllers/genreController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Create and get all genres
router.post("/", protect, admin, createGenre);
router.get("/", getGenres);

// Single genre operations

router.get("/:id", validateObjectId("genre"), getGenreById);

router.put(
    "/:id",
    protect,
    admin,
    validateObjectId("genre"),
    updateGenre
);

router.delete(
    "/:id",
    protect,
    admin,
    validateObjectId("genre"),
    deleteGenre
);


module.exports = router;
