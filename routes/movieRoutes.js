const express = require("express");

const {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie
} = require("../controllers/movieController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.route("/")
    .post(protect, admin, createMovie)
    .get(getMovies);

router.route("/:id")
    .get(getMovieById)
    .put(protect, admin, updateMovie)
    .delete(protect, admin, deleteMovie);

module.exports = router;