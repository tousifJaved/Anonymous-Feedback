const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST /feedback/submit
router.post("/submit", async (req, res) => {
	const { studentId, courseId, feedback } = req.body;

	try {
		const newFeedback = new Feedback({ studentId, courseId, feedback });
		await newFeedback.save();
		res.status(201).json({ message: "Feedback submitted successfully" });
	} catch (error) {
		console.error("Error submitting feedback:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
