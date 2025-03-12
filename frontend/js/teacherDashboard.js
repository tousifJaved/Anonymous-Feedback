document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('courseList');
    const modal = document.getElementById('createCourseModal');
    const addCourseBtn = document.getElementById('addCourseBtn');
    const closeBtn = document.querySelector('.close');
    const createCourseForm = document.getElementById('createCourseForm');

    // Load courses when page loads
    loadCourses();

    async function loadCourses() {
        try {
            const response = await fetch('/courses', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const courses = await response.json();
            displayCourses(courses);
        } catch (error) {
            console.error('Error loading courses:', error);
            displayError();
        }
    }

    function displayCourses(courses) {
        courseList.innerHTML = '';

        if (!Array.isArray(courses) || courses.length === 0) {
            courseList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>No courses created yet</p>
                    <p>Click the + button to create your first course</p>
                </div>
            `;
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.classList.add('card');

            const title = document.createElement('h2');
            title.textContent = course.courseId;

            const department = document.createElement('p');
            department.textContent = `Department: ${course.department}`;

            const teacher = document.createElement('p');
            teacher.textContent = `Created by: ${course.teacherName}`;

            const reviewButton = document.createElement('button');
            reviewButton.textContent = 'See Review';
            reviewButton.addEventListener('click', () => {
                window.location.href = `/teacherFeedback.html?createdByEmail=${encodeURIComponent(course.createdByEmail)}&courseId=${encodeURIComponent(course.courseId)}`;
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Course';
            deleteButton.addEventListener('click', async () => {
                const confirmed = confirm('Are you sure you want to delete this course?');
                if (confirmed) {
                    try {
                        const response = await fetch(`/courses/delete/${course.courseId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            alert('Course deleted successfully');
                            loadCourses();
                        } else {
                            const result = await response.json();
                            alert(result.message);
                        }
                    } catch (error) {
                        console.error('Error during course deletion:', error);
                        alert('An error occurred. Please try again.');
                    }
                }
            });

            card.appendChild(title);
            card.appendChild(department);
            card.appendChild(teacher);
            card.appendChild(reviewButton);
            card.appendChild(deleteButton);

            courseList.appendChild(card);
        });
    }

    function displayError() {
        courseList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load courses</p>
                <p>Please refresh the page to try again</p>
            </div>
        `;
    }

    // Modal handlers
    addCourseBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        createCourseForm.reset();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            createCourseForm.reset();
        }
    });

    // Form submission
    createCourseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const department = document.getElementById('department').value.trim();
        const courseId = document.getElementById('courseId').value.trim();

        if (!department || !courseId) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/courses/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ department, courseId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create course');
            }

            alert('Course created successfully!');
            createCourseForm.reset();
            modal.style.display = 'none';
            await loadCourses();
        } catch (error) {
            console.error('Error creating course:', error);
            alert(error.message || 'Failed to create course. Please try again.');
        }
    });
});
