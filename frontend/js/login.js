document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("loginForm");
	const urlParams = new URLSearchParams(window.location.search);
	const role = urlParams.get("role");

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const email = form.email.value;
		const password = form.password.value;

		try {
			const response = await fetch(`/users/login/${role}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const result = await response.json();
			if (response.ok) {
				alert("Login successful");
				// Redirect or other actions on successful login
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error("Error during login:", error);
			alert("An error occurred. Please try again.");
		}
	});
});
