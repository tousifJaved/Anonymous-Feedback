const express = require("express");
const router = express.Router();
const path = require("path");
const Feedback = require("../models/Feedback");

// Middleware to authenticate student
function authenticateStudent(req, res, next) {
	if (req.session && req.session.user && req.session.user.role === "student") {
		return next();
	} else {
		res.redirect("/login.html?role=student");
	}
}

// Serve feedbackForm.html
router.get("/", authenticateStudent, (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/feedbackForm.html"));
});

// POST /studentFeedback route to handle feedback submission
router.post("/", authenticateStudent, async (req, res) => {
	const { teacherEmail, courseCode, ratings, comment } = req.body;

	try {
		// Create a new Feedback object
		const newFeedback = new Feedback({
			teacherEmail,
			courseCode,
			ratings: {
				teachingStyle: parseInt(ratings.teachingStyle),
				courseContent: parseInt(ratings.courseContent),
				courseDifficulty: parseInt(ratings.courseDifficulty),
				teacherSincerity: parseInt(ratings.teacherSincerity),
				studentEngagement: parseInt(ratings.studentEngagement),
			},
			comment,
		});

		// Save feedback to database
		await newFeedback.save();

		// Respond with a success message
		res.status(200).json({ message: "Feedback submitted successfully!" });
	} catch (error) {
		console.error("Error submitting feedback:", error);
		res.status(500).json({ message: "Failed to submit feedback" });
	}
});

module.exports = router;
