
const mongoose = require("mongoose");

const validateReview = (isUpdate = false) => {
    return (req, res, next) => {
        const { movie, rating, review } = req.body || {};

        if (!isUpdate) {
            if (!mongoose.isObjectIdOrHexString(movie)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid movie ID is required"
                });
            }
        }

        if (
            rating !== undefined &&
            (typeof rating !== "number" ||
                !Number.isInteger(rating) ||
                rating < 1 ||
                rating > 5)
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        if (!isUpdate && rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "Rating is required"
            });
        }

        if (
            review !== undefined &&
            (typeof review !== "string" || !review.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Review must be a non-empty string"
            });
        }

        if (!isUpdate && review === undefined) {
            return res.status(400).json({
                success: false,
                message: "Review text is required"
            });
        }

        if (isUpdate) {
            if (movie !== undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Movie cannot be changed"
                });
            }

            if (rating === undefined && review === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Provide rating or review to update"
                });
            }
        }

        next();
    };
};

module.exports = validateReview;
