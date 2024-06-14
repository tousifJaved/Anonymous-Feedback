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
		// Check if the email already exists
		const existingUser = await (role === "teacher"
			? Teacher.findOne({ email })
			: Student.findOne({ email }));

		if (existingUser) {
			return res.status(400).json({ message: "Email already registered" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user based on role
		let newUser;
		if (role === "teacher") {
			newUser = new Teacher({
				name,
				email,
				password: hashedPassword,
				department,
			});
		} else if (role === "student") {
			newUser = new Student({ name, email, password: hashedPassword, roll });
		} else {
			return res.status(400).json({ message: "Invalid role" });
		}

		// Save the new user
		await newUser.save();
		res.status(201).json({ message: "Registration successful" });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

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

		req.session.user = {
			id: user._id,
			email: user.email,
			name: user.name, // Add the name to the session
			role: role,
		};

		res.status(200).json({ message: "Login successful", role });
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// POST /users/logout
router.post("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error("Error destroying session:", err);
			return res.status(500).json({ message: "Internal server error" });
		}

		res.clearCookie("connect.sid"); // Assuming 'connect.sid' is the cookie name
		res.status(200).json({ message: "Logout successful" });
	});
});

module.exports = router;
