const Review = require("../models/Review");
const Movie = require("../models/Movie");


const updateMovieRating = async (movieId) => {
    const mongoose = require("mongoose");

    const objectId = new mongoose.Types.ObjectId(movieId.toString());

    const stats = await Review.aggregate([
        {
            $match: {
                movie: objectId
            }
        },
        {
            $group: {
                _id: "$movie",
                averageRating: { $avg: "$rating" }
            }
        }
    ]);

    const averageRating =
        stats.length > 0 ? stats[0].averageRating : 0;

    await Movie.findByIdAndUpdate(objectId, {
        averageRating
    });
};


const addReview = async (req, res, next) => {
    try {
        const { movie, rating, review } = req.body;

        const movieExists = await Movie.findById(movie);

        if (!movieExists) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        const alreadyReviewed = await Review.findOne({
            movie,
            user: req.user._id
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You already reviewed this movie"
            });
        }

        const newReview = await Review.create({
            movie,
            user: req.user._id,
            rating,
            review
        });
        await updateMovieRating(movie);

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: newReview
        });

    } catch (error) {
    next(error);
}
};

const getReviews = async (req, res, next) => {
    try {

        const reviews = await Review.find()
            .populate("movie", "title poster")
            .populate("user", "name email");

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateReview = async (req, res, next) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        review.rating = req.body.rating || review.rating;
        review.review = req.body.review || review.review;

        await review.save();

        await updateMovieRating(review.movie);

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });

    } catch (error) {
    next(error);
}

};
const deleteReview = async (req, res, next) => {
    try {

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        const movieId = review.movie;

        await review.deleteOne();

        await updateMovieRating(movieId);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
    next(error);
}

};



const getReviewById = async (req, res, next) => {
    try {
        const mongoose = require("mongoose");

        if (!mongoose.isObjectIdOrHexString(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        const review = await Review.findById(req.params.id)
            .populate("movie", "title poster")
            .populate("user", "name email");

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
    next(error);
}
};

module.exports = {
    addReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
};
