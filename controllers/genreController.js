const Genre = require("../models/Genre");

const createGenre = async (req, res) => {
    try {
        const { name, description } = req.body;

        const genreExists = await Genre.findOne({ name });

        if (genreExists) {
            return res.status(400).json({
                success: false,
                message: "Genre already exists"
            });
        }

        const genre = await Genre.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            message: "Genre created successfully",
            data: genre
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getGenres = async (req, res) => {
    try {
        const genres = await Genre.find();

        res.status(200).json({
            success: true,
            count: genres.length,
            data: genres
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createGenre,
    getGenres
};