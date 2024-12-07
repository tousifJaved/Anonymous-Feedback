document.addEventListener("DOMContentLoaded", () => {
    const dashboardSelector = document.getElementById("dashboardSelector");
    const createCourseSection = document.getElementById("createCourseSection");
    const createdCoursesSection = document.getElementById("createdCoursesSection");

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

            courseListContainer.innerHTML = "";

            courses.forEach((course) => {
                const card = createCourseCard(course);
                courseListContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching courses:", error);
            alert("An error occurred while fetching courses.");
        }
    };

    const createCourseCard = (course) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h2");
        title.textContent = course.courseId;

        const department = document.createElement("p");
        department.textContent = `Department: ${course.department}`;

        const teacher = document.createElement("p");
        teacher.textContent = `Created by: ${course.teacherName}`;

        const reviewButton = document.createElement("button");
        reviewButton.textContent = "See Review";
        reviewButton.addEventListener("click", () => {
            window.location.href = `/teacherFeedback.html?createdByEmail=${course.createdByEmail}&courseId=${course.courseId}`;
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Course";
        deleteButton.addEventListener("click", async () => {
            const confirmed = confirm("Are you sure you want to delete this course?");
            if (confirmed) {
                try {
                    const response = await fetch(`/courses/delete/${course.courseId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        alert("Course deleted successfully");
                        fetchCourses(); // Refresh course list after deletion
                    } else {
                        const result = await response.json();
                        alert(result.message);
                    }
                } catch (error) {
                    console.error("Error during course deletion:", error);
                    alert("An error occurred. Please try again.");
                }
            } else {
                window.location.href = "/teacherdashboard";
            }
        });

        card.appendChild(title);
        card.appendChild(department);
        card.appendChild(teacher);
        card.appendChild(reviewButton);
        card.appendChild(deleteButton);

        return card;
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
                fetchCourses(); // Refresh course list after creation
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error during course creation:", error);
            alert("An error occurred. Please try again.");
        }
    });

    toggleSections();
});
