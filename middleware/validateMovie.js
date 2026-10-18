
const mongoose = require("mongoose");

const validateMovie = (isUpdate = false) => {
    return (req, res, next) => {
        const body = req.body || {};

        const requiredStrings = [
            "title",
            "description",
            "language",
            "director"
        ];

        for (const field of requiredStrings) {
            const value = body[field];

            if (!isUpdate || value !== undefined) {
                if (
                    typeof value !== "string" ||
                    !value.trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} must be a non-empty string`
                    });
                }
            }
        }

        const numericFields = ["releaseYear", "duration"];

        for (const field of numericFields) {
            const value = body[field];

            if (!isUpdate || value !== undefined) {
                if (
                    typeof value !== "number" ||
                    !Number.isInteger(value) ||
                    value <= 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} must be a positive integer`
                    });
                }
            }
        }

        if (
            body.cast !== undefined &&
            (
                !Array.isArray(body.cast) ||
                !body.cast.every(
                    (person) =>
                        typeof person === "string" &&
                        person.trim()
                )
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Cast must be an array of names"
            });
        }

        if (body.genre !== undefined) {
            if (
                !Array.isArray(body.genre) ||
                !body.genre.every((id) =>
                    mongoose.isObjectIdOrHexString(id)
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Genre must contain valid MongoDB IDs"
                });
            }
        }

        for (const field of ["poster", "trailer"]) {
            if (
                body[field] !== undefined &&
                typeof body[field] !== "string"
            ) {
                return res.status(400).json({
                    success: false,
                    message: `${field} must be a string`
                });
            }
        }

        if (isUpdate && Object.keys(body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide movie details to update"
            });
        }

        next();
    };
};

module.exports = validateMovie;
