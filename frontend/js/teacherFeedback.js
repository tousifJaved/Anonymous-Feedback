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
				feedbackCard.classList.add("feedback-card");

				feedbackCard.innerHTML = `
                    <h2>Course Code: ${item.courseCode}</h2>
                    <p>Teaching Style: ${item.ratings.teachingStyle}</p>
                    <p>Course Content: ${item.ratings.courseContent}</p>
                    <p>Course Difficulty: ${item.ratings.courseDifficulty}</p>
                    <p>Teacher Sincerity: ${item.ratings.teacherSincerity}</p>
                    <p>Student Engagement: ${item.ratings.studentEngagement}</p>
                    <p class="comment">Comment: ${item.comment}</p>
                `;

				feedbackContainer.appendChild(feedbackCard);
			});
		}

		// Add scroll functionality to the feedback container
		feedbackContainer.style.overflowY = "auto"; 
		feedbackContainer.style.maxHeight = "70vh";

		// Smooth scrolling behavior within the feedback container
		feedbackContainer.addEventListener("wheel", (event) => {
			event.preventDefault();
			const scrollStep = 50; 
			feedbackContainer.scrollTop +=
				event.deltaY > 0 ? scrollStep : -scrollStep;
		});
	}
});
