
const mongoose = require("mongoose");
const Genre = require("../models/Genre");
const Movie = require("../models/Movie");

// Create Genre
const createGenre = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Genre name is required"
            });
        }

        if (description !== undefined &&
            typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "Description must be a string"
            });
        }

        const cleanedName = name.trim();

        const existingGenre = await Genre.findOne({
            name: {
                $regex: `^${escapeRegex(cleanedName)}$`,
                $options: "i"
            }
        });

        if (existingGenre) {
            return res.status(409).json({
                success: false,
                message: "Genre already exists"
            });
        }

        const genre = await Genre.create({
            name: cleanedName,
            description: description ?? ""
        });

        res.status(201).json({
            success: true,
            message: "Genre created successfully",
            data: genre
        });
    } catch (error) {
        next(error);
    }
};

// Get All Genres
const getGenres = async (req, res, next) => {
    try {
        const genres = await Genre.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: genres.length,
            data: genres
        });
    } catch (error) {
        next(error);
    }
};

// Get Genre By ID
const getGenreById = async (req, res, next) => {
    try {
        if (!validId(req.params.id)) {
            return invalidId(res);
        }

        const genre = await Genre.findById(req.params.id);

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: "Genre not found"
            });
        }

        res.status(200).json({
            success: true,
            data: genre
        });
    } catch (error) {
        next(error);
    }
};

// Update Genre
const updateGenre = async (req, res, next) => {
    try {
        if (!validId(req.params.id)) {
            return invalidId(res);
        }

        const { name, description } = req.body;

        if (name === undefined && description === undefined) {
            return res.status(400).json({
                success: false,
                message: "Provide name or description to update"
            });
        }

        if (name !== undefined &&
            (typeof name !== "string" || !name.trim())) {
            return res.status(400).json({
                success: false,
                message: "Valid genre name is required"
            });
        }

        if (description !== undefined &&
            typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "Description must be a string"
            });
        }

        const genre = await Genre.findById(req.params.id);

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: "Genre not found"
            });
        }

        if (name !== undefined) {
            const cleanedName = name.trim();

            const existingGenre = await Genre.findOne({
                _id: { $ne: genre._id },
                name: {
                    $regex: `^${escapeRegex(cleanedName)}$`,
                    $options: "i"
                }
            });

            if (existingGenre) {
                return res.status(409).json({
                    success: false,
                    message: "Genre already exists"
                });
            }

            genre.name = cleanedName;
        }

        if (description !== undefined) {
            genre.description = description;
        }

        await genre.save();

        res.status(200).json({
            success: true,
            message: "Genre updated successfully",
            data: genre
        });
    } catch (error) {
        next(error);
    }
};

// Delete Genre
const deleteGenre = async (req, res, next) => {
    try {
        if (!validId(req.params.id)) {
            return invalidId(res);
        }

        const genre = await Genre.findById(req.params.id);

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: "Genre not found"
            });
        }

        const inUse = await Movie.exists({
            genre: genre._id
        });

        if (inUse) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete a genre used by movies"
            });
        }

        await genre.deleteOne();

        res.status(200).json({
            success: true,
            message: "Genre deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// Helpers
const validId = (id) =>
    mongoose.isObjectIdOrHexString(id);

const invalidId = (res) =>
    res.status(400).json({
        success: false,
        message: "Invalid genre ID"
    });

const escapeRegex = (text) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const handleError = (res, error) => {
    console.error(error);

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Genre already exists"
        });
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};

module.exports = {
    createGenre,
    getGenres,
    getGenreById,
    updateGenre,
    deleteGenre
};
