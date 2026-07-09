const User = require("../models/User");
const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const Review = require("../models/Review");

const getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalMovies = await Movie.countDocuments();

        const totalGenres = await Genre.countDocuments();

        const totalReviews = await Review.countDocuments();

        const topRatedMovies = await Movie.find()
            .sort({ averageRating: -1 })
            .limit(5)
            .populate("genre", "name");

        const latestMovies = await Movie.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalMovies,
                totalGenres,
                totalReviews,
                topRatedMovies,
                latestMovies
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getDashboard
};