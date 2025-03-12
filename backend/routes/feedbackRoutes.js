// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const Feedback = require("../models/Feedback");

// // Middleware to authenticate student
// function authenticateStudent(req, res, next) {
//   if (req.session && req.session.user && req.session.user.role === "student") {
//     return next();
//   } else {
//     res.redirect("/login.html?role=student");
//   }
// }

// // Serve feedbackForm.html with courseCode, teacherEmail, and std_id
// router.get("/feedbackForm", authenticateStudent, (req, res) => {
//   const { courseCode, teacherEmail, std_id } = req.query;
//   res.sendFile(path.join(__dirname, "../frontend/feedbackForm.html"), {
//     courseCode,
//     teacherEmail,
//     std_id,
//   });
// });


// router.get("/updateReviewForm", authenticateStudent, (req, res) => {
//   const { courseCode, teacherEmail, std_id } = req.query;
//   res.sendFile(path.join(__dirname, "../frontend/feedbackForm.html"), {
//     courseCode,
//     teacherEmail,
//     std_id,
//   });
// });

// // POST /studentFeedback route to handle feedback submission
// router.post("/", authenticateStudent, async (req, res) => {
//   const { ratings, comment, teacherEmail, courseCode, std_id } = req.body;

//   try {
//     const newFeedback = new Feedback({
//       teacherEmail,
//       courseCode,
//       std_id,
//       ratings: {
//         teachingStyle: parseInt(ratings.teachingStyle),
//         courseContent: parseInt(ratings.courseContent),
//         courseDifficulty: parseInt(ratings.courseDifficulty),
//         teacherSincerity: parseInt(ratings.teacherSincerity),
//         studentEngagement: parseInt(ratings.studentEngagement),
//       },
//       comment,
//     });

//     await newFeedback.save();
//     res.status(200).json({ message: "Feedback submitted successfully!" });
//   } catch (error) {
//     console.error("Error submitting feedback:", error);
//     res.status(500).json({ message: "Failed to submit feedback" });
//   }
// });

// module.exports = router;

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

// ✅ Route: Check if feedback exists
router.get("/checkFeedback", authenticateStudent, async (req, res) => {
  const { courseCode, teacherEmail, std_id } = req.query;

  try {
    const existingFeedback = await Feedback.findOne({
      courseCode,
      teacherEmail,
      std_id,
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

// ✅ Route: Serve feedbackForm
router.get("/feedbackForm", authenticateStudent, async (req, res) => {
  const { courseCode, teacherEmail, std_id } = req.query;

  try {
    const existingFeedback = await Feedback.findOne({
      courseCode,
      teacherEmail,
      std_id,
    });

    if (existingFeedback) {
      return res.redirect(
        `/updateReviewForm?courseCode=${courseCode}&teacherEmail=${teacherEmail}&std_id=${std_id}`
      );
    }

    res.sendFile(path.join(__dirname, "../frontend/feedbackForm.html"));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Route: Serve updateReviewForm
router.get("/updateReviewForm", authenticateStudent, async (req, res) => {
  const { courseCode, teacherEmail, std_id } = req.query;

  try {
    const existingFeedback = await Feedback.findOne({
      courseCode,
      teacherEmail,
      std_id,
    });

    if (!existingFeedback) {
      return res.redirect(
        `/feedbackForm?courseCode=${courseCode}&teacherEmail=${teacherEmail}&std_id=${std_id}`
      );
    }

    res.sendFile(path.join(__dirname, "../frontend/updateReviewForm.html"));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Route: Submit New Feedback
router.post("/", authenticateStudent, async (req, res) => {
  const { ratings, comment, teacherEmail, courseCode, std_id } = req.body;

  try {
    const existingFeedback = await Feedback.findOne({
      courseCode,
      teacherEmail,
      std_id,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message:
          "You have already given feedback. Please update your review instead.",
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

// ✅ Route: Update Existing Feedback
router.put("/", authenticateStudent, async (req, res) => {
  const { ratings, comment, teacherEmail, courseCode, std_id } = req.body;

  try {
    const existingFeedback = await Feedback.findOne({
      courseCode,
      teacherEmail,
      std_id,
    });

    if (!existingFeedback) {
      return res
        .status(400)
        .json({ message: "No feedback found. Submit a new review first." });
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
