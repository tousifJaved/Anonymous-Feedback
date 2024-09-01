const express = require("express");
const router = express.Router();
const Course = require("../models/course");

// POST /courses/create
router.post("/create", async (req, res) => {
    const { department, courseId } = req.body;
    const createdByEmail = req.session.user.email;
    const teacherName = req.session.user.name;

    try {
        const newCourse = new Course({
            department,
            courseId,
            createdByEmail,
            teacherName,
        });
        await newCourse.save();
        res.status(201).json({ message: "Course created successfully" });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /courses
router.get("/", async (req, res) => {
    const createdByEmail = req.session.user.email;

    try {
        const courses = await Course.find({ createdByEmail });
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /courses/all
router.get("/all", async (req, res) => {
    const { department, teacherName } = req.query;

    let filter = {};
    if (department) {
        filter.department = { $regex: department, $options: "i" };
    }
    if (teacherName) {
        filter.teacherName = { $regex: teacherName, $options: "i" };
    }

    try {
        const courses = await Course.find(filter);
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// DELETE /courses/delete/:courseId
router.delete("/delete/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const createdByEmail = req.session.user.email;

    try {
        const result = await Course.deleteOne({ courseId, createdByEmail });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Course not found or not authorized to delete" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
