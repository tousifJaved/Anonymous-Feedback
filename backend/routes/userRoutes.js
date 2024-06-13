const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

// POST /users/register/:role
router.post("/register/:role", async (req, res) => {
	const { role } = req.params;
	const { name, email, password, department, roll } = req.body;

	try {
		const existingUser = await (role === "teacher"
			? Teacher.findOne({ email })
			: Student.findOne({ email }));
		if (existingUser) {
			return res.status(400).json({ message: "Email already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser =
			role === "teacher"
				? new Teacher({ name, email, password: hashedPassword, department })
				: new Student({ name, email, password: hashedPassword, roll });

		await newUser.save();
		res.status(201).json({ message: "Registration successful" });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// POST /users/login/:role
router.post("/login/:role", async (req, res) => {
	const { role } = req.params;
	const { email, password } = req.body;

	try {
		const user = await (role === "teacher"
			? Teacher.findOne({ email })
			: Student.findOne({ email }));
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		res.status(200).json({ message: "Login successful" });
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
