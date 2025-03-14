const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  std_id: { type: String, required: true },
  courseCode: { type: String, required: true },
  teacherEmail: { type: String, required: true },
  ratings: {
    teachingStyle: Number,
    courseContent: Number,
    courseDifficulty: Number,
    teacherSincerity: Number,
    studentEngagement: Number,
  },
  comment: { type: String, required: false },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
