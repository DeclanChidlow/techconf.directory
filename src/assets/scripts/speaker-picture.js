document.addEventListener("DOMContentLoaded", async () => {
	const blueskyLink = document.querySelector(".socials a.bluesky");
	if (!blueskyLink) return;

	const did = blueskyLink.href.match(/did:[^/]+/);
	if (!did) return;

	try {
		const res = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did[0])}`);

		const data = await res.json();

		if (!data.avatar) return;

		const img = document.createElement("img");
		img.src = data.avatar;
		img.alt = "Bluesky Profile Picture";
		img.className = "bluesky-pfp";

		const header = document.querySelector("article header");
		if (header) {
			header.prepend(img);
		}
	} catch (err) {
		console.error("Failed to load Bluesky avatar:", err);
	}
});
