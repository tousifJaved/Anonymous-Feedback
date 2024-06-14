const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
	courseId: { type: String, required: true },
	department: { type: String, required: true },
	createdByEmail: { type: String, required: true },
	teacherName: { type: String, required: true }, // Include teacher's name
});

module.exports = mongoose.model("Course", CourseSchema);
