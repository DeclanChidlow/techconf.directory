export default function categoriseEvents(events) {
	const categorised = { upcoming: {}, past: {} };
	const now = Date.now();

	for (const year in events) {
		const event = events[year];
		if (Date.parse(event.dates.start) >= now) {
			categorised.upcoming[year] = event;
		} else {
			categorised.past[year] = event;
		}
	}

	return categorised;
}
