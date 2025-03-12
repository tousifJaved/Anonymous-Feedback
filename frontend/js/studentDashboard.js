// document.addEventListener("DOMContentLoaded", () => {
//   const homeButton = document.getElementById("home-button");
//   const filterButton = document.getElementById("filterButton");
//   const departmentFilter = document.getElementById("departmentFilter");
//   const teacherFilter = document.getElementById("teacherFilter");
//   const courseListContainer = document.getElementById("courseList");

//   const std_id = window.location.pathname.split("/")[2];
//   const fetchCourses = async (department = "", teacherName = "") => {
//     try {
//       let url = `/courses/all?department=${department}&teacherName=${teacherName}`;
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch courses");
//       }

//       const courses = await response.json();

//       courseListContainer.innerHTML = "";

//       courses.forEach((course) => {
//         const card = document.createElement("div");
//         card.classList.add("card");

//         const title = document.createElement("h2");
//         title.textContent = course.courseId;

//         const department = document.createElement("p");
//         department.textContent = `Department: ${course.department}`;

//         const teacher = document.createElement("p");
//         teacher.textContent = `Created by: ${course.teacherName}`;

//         const reviewButton = document.createElement("button");
//         reviewButton.textContent = "Give Review";
//         reviewButton.addEventListener("click", () => {
//           window.location.href = `/feedbackForm.html?courseCode=${course.courseId}&teacherEmail=${course.createdByEmail}&std_id=${std_id}`;
//         });

//         const updateReviewButton = document.createElement("button");
//         updateReviewButton.textContent = "Update Review";
//         updateReviewButton.addEventListener("click", () => {
//           window.location.href = `/updateReviewForm.html?courseCode=${course.courseId}&teacherEmail=${course.createdByEmail}&std_id=${std_id}`;
//         });

//         card.appendChild(title);
//         card.appendChild(department);
//         card.appendChild(teacher);
//         card.appendChild(reviewButton);
//         card.appendChild(updateReviewButton);

//         courseListContainer.appendChild(card);
//       });
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       alert("An error occurred while fetching courses.");
//     }
//   };

//   filterButton.addEventListener("click", () => {
//     const department = departmentFilter.value.trim();
//     const teacherName = teacherFilter.value.trim();
//     fetchCourses(department, teacherName);
//   });

//   homeButton.addEventListener("click", async (event) => {
//     event.preventDefault();

//     try {
//       const response = await fetch("/users/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         window.location.href = "/";
//       } else {
//         alert("Logout failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//       alert("An error occurred. Please try again.");
//     }
//   });

//   fetchCourses();
// });

document.addEventListener("DOMContentLoaded", () => {
  const courseListContainer = document.getElementById("courseList");

  const std_id = window.location.pathname.split("/")[2];

  const fetchCourses = async (department = "", teacherName = "") => {
    try {
      let url = `/courses/all?department=${department}&teacherName=${teacherName}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch courses");

      const courses = await response.json();
      courseListContainer.innerHTML = "";

      courses.forEach((course) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h2");
        title.textContent = course.courseId;

        const department = document.createElement("p");
        department.textContent = `Department: ${course.department}`;

        const teacher = document.createElement("p");
        teacher.textContent = `Created by: ${course.teacherName}`;

        const reviewButton = document.createElement("button");
        reviewButton.textContent = "Give Review";
        reviewButton.addEventListener("click", async () => {
          const feedbackExists = await checkFeedback(
            course.courseId,
            course.createdByEmail,
            std_id
          );
          if (feedbackExists) {
            alert("You have already given a review. Please update it instead.");
          } else {
            window.location.href = `/feedbackForm.html?courseCode=${course.courseId}&teacherEmail=${course.createdByEmail}&std_id=${std_id}`;
          }
        });

        const updateReviewButton = document.createElement("button");
        updateReviewButton.textContent = "Update Review";
        updateReviewButton.addEventListener("click", async () => {
          const feedbackExists = await checkFeedback(
            course.courseId,
            course.createdByEmail,
            std_id
          );
          if (!feedbackExists) {
            alert("You have not given a review yet. Please submit one first.");
          } else {
            window.location.href = `/updateReviewForm.html?courseCode=${course.courseId}&teacherEmail=${course.createdByEmail}&std_id=${std_id}`;
          }
        });

        card.appendChild(title);
        card.appendChild(department);
        card.appendChild(teacher);
        card.appendChild(reviewButton);
        card.appendChild(updateReviewButton);

        courseListContainer.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("An error occurred while fetching courses.");
    }
  };

  const checkFeedback = async (courseCode, teacherEmail, std_id) => {
    try {
      const response = await fetch(
        `/studentFeedback/checkFeedback?courseCode=${courseCode}&teacherEmail=${teacherEmail}&std_id=${std_id}`
      );
      if (!response.ok) throw new Error("Failed to check feedback");
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking feedback:", error);
      return false;
    }
  };

  fetchCourses();
});
