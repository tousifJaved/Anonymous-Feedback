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

// Serve feedbackForm.html with courseCode, teacherEmail, and std_id
router.get("/feedbackForm", authenticateStudent, (req, res) => {
  const { courseCode, teacherEmail, std_id } = req.query;
  res.sendFile(path.join(__dirname, "../frontend/feedbackForm.html"), {
    courseCode,
    teacherEmail,
    std_id,
  });
});


router.get("/updateReviewForm", authenticateStudent, (req, res) => {
  const { courseCode, teacherEmail, std_id } = req.query;
  res.sendFile(path.join(__dirname, "../frontend/feedbackForm.html"), {
    courseCode,
    teacherEmail,
    std_id,
  });
});

// POST /studentFeedback route to handle feedback submission
router.post("/studentFeedback", authenticateStudent, async (req, res) => {
  const { teacherEmail, courseCode, std_id, ratings, comment } = req.body;

  try {
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
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

module.exports = router;
