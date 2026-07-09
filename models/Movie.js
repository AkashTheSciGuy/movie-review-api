const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        releaseYear: {
            type: Number,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        language: {
            type: String,
            required: true
        },

        director: {
            type: String,
            required: true
        },

        cast: [
            {
                type: String
            }
        ],

        poster: {
            type: String,
            default: ""
        },

        trailer: {
            type: String,
            default: ""
        },

        genre: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Genre"
            }
        ],

        averageRating: {
            type: Number,
            default: 0
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Movie", movieSchema);