const Movie = require("../models/Movie");

const createMovie = async (req, res, next) => {
    try {

        const {
            title,
            description,
            releaseYear,
            duration,
            language,
            director,
            cast,
            genre,
            poster,
            trailer
        } = req.body;

        const movie = await Movie.create({
            title,
            description,
            releaseYear,
            duration,
            language,
            director,
            cast,
            genre,
            poster,
            trailer,
            createdBy: req.user._id
        });


        res.status(201).json({
            success: true,
            message: "Movie created successfully",
            data: movie
        });

    } catch (error) {
        next(error);
    }
};

const getMovies = async (req, res, next) => {
    try {

        const {
            search,
            genre,
            page = 1,
            limit = 5,
            sort = "latest"
        } = req.query;


        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (
            !Number.isSafeInteger(pageNumber) ||
            pageNumber < 1 ||
            !Number.isSafeInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive integer and limit must be between 1 and 100"
            });
        }


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
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const total = await Movie.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            data: movies
        });

    } catch (error) {
        next(error);
    }
};

const getMovieById = async (req, res, next) => {
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
        next(error);
    }
};

const updateMovie = async (req, res, next) => {
    try {


        const allowedFields = [
            "title",
            "description",
            "releaseYear",
            "duration",
            "language",
            "director",
            "cast",
            "genre",
            "poster",
            "trailer"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid movie fields provided"
            });
        }

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
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
        next(error);
    }
};

const deleteMovie = async (req, res, next) => {
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
        next(error);
    }
};

module.exports = {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie
};