export default (dateString) => {
	const date = new Date(dateString);
	const day = date.getUTCDate();
	const suffix = ((d) => d + (["th", "st", "nd", "rd"][((d % 100) - 20) % 10] || ["th", "st", "nd", "rd"][d % 100] || "th"))(day);
	const month = date.toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
	return `${month} ${suffix}, ${date.getUTCFullYear()}`;
};
