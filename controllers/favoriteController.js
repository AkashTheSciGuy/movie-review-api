const Favorite = require("../models/Favorite");
const Movie = require("../models/Movie");

const addFavorite = async (req, res, next) => {
    try {

        const { movie } = req.body;

        const movieExists = await Movie.findById(movie);

        if (!movieExists) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        const exists = await Favorite.findOne({
            user: req.user._id,
            movie
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Movie already added to favorites"
            });
        }

        const favorite = await Favorite.create({
            user: req.user._id,
            movie
        });

        res.status(201).json({
            success: true,
            message: "Movie added to favorites",
            data: favorite
        });

    } catch (error) {
    next(error);
}
};

const getFavorites = async (req, res, next) => {

    try {

        const favorites = await Favorite.find({
            user: req.user._id
        })
            .populate("movie")
            .populate("user", "name email");

        res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites
        });

    } catch (error) {
        next(error);
    }

};

const removeFavorite = async (req, res, next) => {

    try {

        const favorite = await Favorite.findOne({
            user: req.user._id,
            movie: req.params.movieId
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: "Favorite not found"
            });
        }

        await favorite.deleteOne();

        res.status(200).json({
            success: true,
            message: "Movie removed from favorites"
        });

    } catch (error) {
        next(error);
    }

    }

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite
};