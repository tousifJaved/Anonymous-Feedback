document.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const createdByEmail = params.get("createdByEmail");
	const courseId = params.get("courseId");

	if (!createdByEmail || !courseId) {
		console.error("Missing createdByEmail or courseId in query parameters.");
		return;
	}

	fetchFeedback(createdByEmail, courseId);

	async function fetchFeedback(createdByEmail, courseId) {
		try {
			const response = await fetch(
				`/teacherFeedback/${createdByEmail}/${courseId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch feedback");
			}

			const feedback = await response.json();
			displayFeedback(feedback);
		} catch (error) {
			console.error("Error fetching feedback:", error);
			alert("An error occurred while fetching feedback.");
		}
	}

	function displayFeedback(feedback) {
		const feedbackContainer = document.getElementById("feedbackList");

		if (feedback.length === 0) {
			const noFeedbackMessage = document.createElement("p");
			noFeedbackMessage.textContent = "No reviews available for this course.";
			feedbackContainer.appendChild(noFeedbackMessage);
		} else {
			feedback.forEach((item) => {
				const feedbackCard = document.createElement("div");
				feedbackCard.classList.add("card");

				const courseCode = document.createElement("h2");
				courseCode.textContent = `Course Code: ${item.courseCode}`;

				const teachingStyle = document.createElement("p");
				teachingStyle.textContent = `Teaching Style: ${item.ratings.teachingStyle}`;

				const courseContent = document.createElement("p");
				courseContent.textContent = `Course Content: ${item.ratings.courseContent}`;

				const courseDifficulty = document.createElement("p");
				courseDifficulty.textContent = `Course Difficulty: ${item.ratings.courseDifficulty}`;

				const teacherSincerity = document.createElement("p");
				teacherSincerity.textContent = `Teacher Sincerity: ${item.ratings.teacherSincerity}`;

				const studentEngagement = document.createElement("p");
				studentEngagement.textContent = `Student Engagement: ${item.ratings.studentEngagement}`;

				const comment = document.createElement("p");
				comment.classList.add("comment");
				comment.textContent = `Comment: ${item.comment}`;

				feedbackCard.appendChild(courseCode);
				feedbackCard.appendChild(teachingStyle);
				feedbackCard.appendChild(courseContent);
				feedbackCard.appendChild(courseDifficulty);
				feedbackCard.appendChild(teacherSincerity);
				feedbackCard.appendChild(studentEngagement);
				feedbackCard.appendChild(comment);

				feedbackContainer.appendChild(feedbackCard);
			});
		}

		// Add scroll functionality to the feedback container
		feedbackContainer.style.overflowX = "auto";
		feedbackContainer.style.maxWidth = "100%";

		// Smooth scrolling behavior within the feedback container
		feedbackContainer.addEventListener("wheel", (event) => {
			event.preventDefault();
			const scrollStep = 50;
			feedbackContainer.scrollLeft +=
				event.deltaY > 0 ? scrollStep : -scrollStep;
		});
	}
});
