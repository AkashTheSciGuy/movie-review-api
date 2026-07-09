const Movie = require("../models/Movie");

const createMovie = async (req, res) => {
    try {
        const movie = await Movie.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Movie created successfully",
            data: movie
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMovies = async (req, res) => {
    try {

        const {
            search,
            genre,
            page = 1,
            limit = 5,
            sort = "latest"
        } = req.query;

        const query = {};

        if (search) {
            query.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (genre) {
            query.genre = genre;
        }

        let sortOption = {};

        if (sort === "latest") {
            sortOption = { createdAt: -1 };
        } else if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        } else if (sort === "rating") {
            sortOption = { averageRating: -1 };
        }

        const movies = await Movie.find(query)
            .populate("genre", "name")
            .populate("createdBy", "name email")
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Movie.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: movies
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMovieById = async (req, res) => {
    try {

        const movie = await Movie.findById(req.params.id)
            .populate("genre", "name")
            .populate("createdBy", "name email");

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        res.status(200).json({
            success: true,
            data: movie
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateMovie = async (req, res) => {
    try {

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            data: movie
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteMovie = async (req, res) => {
    try {

        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        await movie.deleteOne();

        res.status(200).json({
            success: true,
            message: "Movie deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie
};