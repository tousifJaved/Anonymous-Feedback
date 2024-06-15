const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const teacherFeedbackRoute = require("./routes/teacherFeedbackRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	})
);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/studentFeedback", feedbackRoutes);
app.use("/teacherFeedback", teacherFeedbackRoute);

// Home route
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/home.html"));
});

// Middleware to authenticate teacher
function authenticateTeacher(req, res, next) {
	if (req.session && req.session.user && req.session.user.role === "teacher") {
		return next();
	} else {
		res.redirect("/login.html?role=teacher");
	}
}

// Middleware to authenticate student
function authenticateStudent(req, res, next) {
	if (req.session && req.session.user && req.session.user.role === "student") {
		return next();
	} else {
		res.redirect("/login.html?role=student");
	}
}

// Teacher Dashboard route (secured)
app.get("/teacherDashboard", authenticateTeacher, (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/teacherDashboard.html"));
});

// Student Dashboard route (secured)
app.get("/studentDashboard", authenticateStudent, (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/studentDashboard.html"));
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
