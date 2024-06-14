document.addEventListener("DOMContentLoaded", () => {
	const dashboardSelector = document.getElementById("dashboardSelector");
	const createCourseSection = document.getElementById("createCourseSection");
	const createdCoursesSection = document.getElementById(
		"createdCoursesSection"
	);

	const toggleSections = () => {
		const selectedValue = dashboardSelector.value;
		if (selectedValue === "createCourse") {
			createCourseSection.classList.add("active");
			createdCoursesSection.classList.remove("active");
		} else {
			createCourseSection.classList.remove("active");
			createdCoursesSection.classList.add("active");
			fetchCourses();
		}
	};

	const fetchCourses = async () => {
		try {
			const response = await fetch("/courses", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch courses");
			}

			const courses = await response.json();
			const courseListContainer = document.getElementById("courseList");

			courseListContainer.innerHTML = ""; // Clear existing content

			courses.forEach((course) => {
				const card = document.createElement("div");
				card.classList.add("card");

				const title = document.createElement("h2");
				title.textContent = course.courseId;

				const department = document.createElement("p");
				department.textContent = `Department: ${course.department}`;

				const teacher = document.createElement("p");
				teacher.textContent = `Created by: ${course.teacherName}`;

				card.appendChild(title);
				card.appendChild(department);
				card.appendChild(teacher);
				courseListContainer.appendChild(card);
			});
		} catch (error) {
			console.error("Error fetching courses:", error);
			alert("An error occurred while fetching courses.");
		}
	};

	dashboardSelector.addEventListener("change", toggleSections);

	const form = document.getElementById("createCourseForm");
	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const department = form.department.value;
		const courseId = form.courseId.value;

		try {
			const response = await fetch("/courses/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ department, courseId }),
			});

			const result = await response.json();
			if (response.ok) {
				alert("Course created successfully");
				form.reset();
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error("Error during course creation:", error);
			alert("An error occurred. Please try again.");
		}
	});

	// Initial toggle to set the correct section based on default selection
	toggleSections();
});
