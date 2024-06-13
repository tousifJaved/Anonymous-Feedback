const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.use("/users", userRoutes);

// Home route
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/home.html"));
});

// Connect to MongoDB
mongoose
	.connect("mongodb://localhost:27017/sample", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

module.exports = app;
