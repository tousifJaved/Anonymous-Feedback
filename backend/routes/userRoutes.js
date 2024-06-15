const express = require("express");
const router = express.Router();
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

		// Create new user based on role
		let newUser;
		if (role === "teacher") {
			newUser = new Teacher({
				name,
				email,
				password, // Save password as plain text
				department,
			});
		} else if (role === "student") {
			newUser = new Student({ name, email, password, roll }); // Save password as plain text
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

		if (password !== user.password) {
			// Check the password directly
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
