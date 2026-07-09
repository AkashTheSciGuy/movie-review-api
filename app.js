const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const genreRoutes = require("./routes/genreRoutes");
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "Movie Review API"
    });
});

module.exports = app;