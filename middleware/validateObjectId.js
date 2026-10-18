
const mongoose = require("mongoose");

const validateObjectId = (resource = "record") => {
    return (req, res, next) => {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${resource} ID`
            });
        }

        next();
    };
};

module.exports = validateObjectId;
