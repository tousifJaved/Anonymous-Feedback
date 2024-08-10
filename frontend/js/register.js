document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("registerForm");
	const urlParams = new URLSearchParams(window.location.search);
	const role = urlParams.get("role");

	if (role === "teacher") {
		document.getElementById("rollField").style.display = "none";
	} else {
		document.getElementById("departmentField").style.display = "none";
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const name = form.name.value;
		const email = form.email.value;
		const password = form.password.value;
		const department = role === "teacher" ? form.department.value : "";
		const roll = role === "student" ? form.roll.value : "";

		try {
			const response = await fetch(`/users/register/${role}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password, department, roll }),
			});

			const result = await response.json();
			if (response.ok) {
				alert("Registration successful");
				window.location.href = "/";

			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error("Error during registration:", error);
			alert("An error occurred. Please try again.");
		}
	});
});
