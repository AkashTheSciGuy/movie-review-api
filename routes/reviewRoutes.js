const validateReview = require("../middleware/validateReview");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");

const {
    addReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


router.route("/")
    .post(protect, validateReview(), addReview)
    .get(getReviews);

router.route("/:id")
    .get(validateObjectId("review"), getReviewById)
    .put(
        protect,
        validateObjectId("review"),
        validateReview(true),
        updateReview
    )
    .delete(
        protect,
        validateObjectId("review"),
        deleteReview
    );


module.exports = router;
