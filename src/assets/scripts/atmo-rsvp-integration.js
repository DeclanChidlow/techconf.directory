document.addEventListener("DOMContentLoaded", () => {
	const rsvpContainer = document.querySelector(".atmo-rsvp");
	const rsvpLink = rsvpContainer?.querySelector("a");

	if (rsvpContainer && rsvpLink) {
		const apiUrl = `${rsvpLink.href}/data.json`;

		fetch(apiUrl)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				const going = data.rsvpsGoingCount || 0;
				const interested = data.rsvpsInterestedCount || 0;

				const statsDiv = document.createElement("small");
				statsDiv.className = "rsvp-stats";
				statsDiv.innerHTML = ` (${going} going, ${interested} interested)`;

				rsvpContainer.appendChild(statsDiv);
			})
			.catch((error) => {
				console.error("Failed to fetch atmo.rsvp data:", error);
			});
	}
});
