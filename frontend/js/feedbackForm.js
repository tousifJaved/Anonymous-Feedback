document.addEventListener("DOMContentLoaded", () => {
	const feedbackForm = document.getElementById("feedbackForm");

	feedbackForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		// Extract ratings
		const ratings = {
			teachingStyle: document.querySelector(
				'input[name="teachingStyle"]:checked'
			).value,
			courseContent: document.querySelector(
				'input[name="courseContent"]:checked'
			).value,
			courseDifficulty: document.querySelector(
				'input[name="courseDifficulty"]:checked'
			).value,
			teacherSincerity: document.querySelector(
				'input[name="teacherSincerity"]:checked'
			).value,
			studentEngagement: document.querySelector(
				'input[name="studentEngagement"]:checked'
			).value,
		};

		// Extract comment and other fields
		const comment = document.getElementById("comment").value;
		const teacherEmail = document.getElementById("teacherEmail").value;
		const courseCode = document.getElementById("courseCode").value;

		console.log("Submitting feedback:", {
			ratings,
			comment,
			teacherEmail,
			courseCode,
		});

		try {
			const response = await fetch("/studentFeedback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ratings, comment, teacherEmail, courseCode }),
			});

			if (!response.ok) {
				throw new Error("Failed to submit feedback");
			}

			const result = await response.json();
			alert(result.message); // Alert the message from the server
			window.location.href = "/studentDashboard"; // Redirect to student dashboard
		} catch (error) {
			console.error("Error submitting feedback:", error);
			alert("An error occurred. Please try again.");
		}
	});
});
