document.addEventListener("DOMContentLoaded", () => {
	const feedbackForm = document.getElementById("feedbackForm");

	// Parse URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const courseCode = urlParams.get("courseCode");
	const teacherEmail = urlParams.get("teacherEmail");

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

		// Extract comment
		const comment = document.getElementById("comment").value;

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
			alert(result.message);
			window.location.href = "/studentDashboard"; // Redirect to student dashboard
		} catch (error) {
			console.error("Error submitting feedback:", error);
			alert("An error occurred. Please try again.");
		}
	});
});
