const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// Middleware to authenticate student
function authenticateStudent(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "student") {
    return next();
  } else {
    res.redirect("/login.html?role=student");
  }
}

// ✅ Check if a student has already given feedback for a specific course
router.get("/checkFeedback", authenticateStudent, async (req, res) => {
  const { courseCode, teacherEmail, std_id } = req.query;

  try {
    const existingFeedback = await Feedback.findOne({
      courseCode,
      teacherEmail,
      std_id, // Ensure unique feedback per student-course
    });

    if (existingFeedback) {
      return res.json({ exists: true, feedback: existingFeedback });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Submit new feedback (Students can submit feedback for multiple courses)
router.post("/", authenticateStudent, async (req, res) => {
  const { ratings, comment, teacherEmail, courseCode, std_id } = req.body;

  try {
    const existingFeedback = await Feedback.findOne({
      courseCode, // Unique per course per student
      teacherEmail,
      std_id,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message:
          "You have already given feedback for this course. Update it instead.",
      });
    }

    const newFeedback = new Feedback({
      teacherEmail,
      courseCode,
      std_id,
      ratings: {
        teachingStyle: parseInt(ratings.teachingStyle),
        courseContent: parseInt(ratings.courseContent),
        courseDifficulty: parseInt(ratings.courseDifficulty),
        teacherSincerity: parseInt(ratings.teacherSincerity),
        studentEngagement: parseInt(ratings.studentEngagement),
      },
      comment,
    });

    await newFeedback.save();
    res.status(200).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Failed to process feedback" });
  }
});

// ✅ Update existing feedback for a specific course
router.put("/", authenticateStudent, async (req, res) => {
  const { ratings, comment, teacherEmail, courseCode, std_id } = req.body;

  try {
    const existingFeedback = await Feedback.findOne({
      courseCode, // Only update feedback for the given course
      teacherEmail,
      std_id,
    });

    if (!existingFeedback) {
      return res.status(400).json({
        message:
          "No feedback found for this course. Submit new feedback first.",
      });
    }

    existingFeedback.ratings = {
      teachingStyle: parseInt(ratings.teachingStyle),
      courseContent: parseInt(ratings.courseContent),
      courseDifficulty: parseInt(ratings.courseDifficulty),
      teacherSincerity: parseInt(ratings.teacherSincerity),
      studentEngagement: parseInt(ratings.studentEngagement),
    };
    existingFeedback.comment = comment;
    await existingFeedback.save();

    res.status(200).json({ message: "Feedback updated successfully!" });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Failed to update feedback" });
  }
});

module.exports = router;
