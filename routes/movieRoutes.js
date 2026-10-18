const validateMovie = require("../middleware/validateMovie");
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
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

// Create movie and get all movies

router.route("/")
    .post(protect, admin, validateMovie(), createMovie)
    .get(getMovies);

router.route("/:id")
    .get(validateObjectId("movie"), getMovieById)
    .put(
        protect,
        admin,
        validateObjectId("movie"),
        validateMovie(true),
        updateMovie
    )
    .delete(
        protect,
        admin,
        validateObjectId("movie"),
        deleteMovie
    );


module.exports = router;
