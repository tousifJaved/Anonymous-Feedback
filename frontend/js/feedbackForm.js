document.addEventListener("DOMContentLoaded", async () => {
  const feedbackForm = document.getElementById("feedbackForm");

  const urlParams = new URLSearchParams(window.location.search);
  const courseCode = urlParams.get("courseCode");
  const teacherEmail = urlParams.get("teacherEmail");
  const std_id = urlParams.get("std_id");

  const isUpdate = window.location.pathname.includes("updateReviewForm");

  if (isUpdate) {
    try {
      const response = await fetch(`/studentFeedback/checkFeedback?courseCode=${courseCode}&teacherEmail=${teacherEmail}&std_id=${std_id}`);
      if (!response.ok) throw new Error("Failed to fetch feedback");

      const result = await response.json();
      if (!result.exists) {
        alert("No existing feedback found. Redirecting to review form.");
        window.location.href = `/feedbackForm.html?courseCode=${courseCode}&teacherEmail=${teacherEmail}&std_id=${std_id}`;
        return;
      }

      const feedback = result.feedback;
      document.querySelector(`input[name="teachingStyle"][value="${feedback.ratings.teachingStyle}"]`).checked = true;
      document.querySelector(`input[name="courseContent"][value="${feedback.ratings.courseContent}"]`).checked = true;
      document.querySelector(`input[name="courseDifficulty"][value="${feedback.ratings.courseDifficulty}"]`).checked = true;
      document.querySelector(`input[name="teacherSincerity"][value="${feedback.ratings.teacherSincerity}"]`).checked = true;
      document.querySelector(`input[name="studentEngagement"][value="${feedback.ratings.studentEngagement}"]`).checked = true;
      document.getElementById("comment").value = feedback.comment;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      alert("An error occurred. Please try again.");
    }
  }

  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const ratings = {
      teachingStyle: document.querySelector('input[name="teachingStyle"]:checked').value,
      courseContent: document.querySelector('input[name="courseContent"]:checked').value,
      courseDifficulty: document.querySelector('input[name="courseDifficulty"]:checked').value,
      teacherSincerity: document.querySelector('input[name="teacherSincerity"]:checked').value,
      studentEngagement: document.querySelector('input[name="studentEngagement"]:checked').value,
    };

    const comment = document.getElementById("comment").value;

    try {
      const response = await fetch("/studentFeedback", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratings, comment, teacherEmail, courseCode, std_id }),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
