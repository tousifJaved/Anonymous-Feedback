const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
	studentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student",
		required: true,
	},
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Course",
		required: true,
	},
	feedback: { type: String, required: true },
	// Add any additional fields as needed
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
