const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// Route to fetch feedback based on created by email and course ID
router.get("/:createdByEmail/:courseId", async (req, res, next) => {
	const { createdByEmail, courseId } = req.params;

	try {
		const feedback = await Feedback.find({
			teacherEmail: createdByEmail,
			courseCode: courseId,
		});

		if (!feedback || feedback.length === 0) {
			return res.status(404).json({ message: "Feedback not found" });
		}

		// Send feedback data to the frontend
		res.json(feedback);
	} catch (error) {
		console.error("Error fetching feedback:", error);
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
