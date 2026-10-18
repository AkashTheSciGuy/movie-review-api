
const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || err.status || 500;
    let message = "Internal Server Error";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}`;
    } else if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate record already exists";
    } else if (err.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Invalid JSON request body";
    } else if (statusCode < 500) {
        message = err.message || "Request failed";
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorHandler;
