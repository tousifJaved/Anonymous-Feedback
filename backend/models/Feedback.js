const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
	teacherEmail: { type: String, required: true },
	courseCode: { type: String, required: true },
	ratings: {
		teachingStyle: { type: Number, required: true },
		courseContent: { type: Number, required: true },
		courseDifficulty: { type: Number, required: true },
		teacherSincerity: { type: Number, required: true },
		studentEngagement: { type: Number, required: true },
	},
	comment: { type: String },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
