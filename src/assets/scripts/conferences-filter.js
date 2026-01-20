document.addEventListener("DOMContentLoaded", () => {
	const apiEndpoint = "/api/conferences.json";
	const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

	const getCountryName = (code) => {
		try {
			return regionNames.of(code.toUpperCase());
		} catch (e) {
			return code;
		}
	};

	const dom = {
		form: document.getElementById("filter-form"),
		countriesContainer: document.getElementById("countries-list"),
		tagsContainer: document.getElementById("tags-list"),
		list: document.querySelector("ol"),
	};

	dom.form.style.display = "flex";

	let conferencesData = [];

	fetch(apiEndpoint)
		.then((res) => res.json())
		.then((json) => {
			conferencesData = json.data;
			populateCheckboxes(conferencesData);
			renderConferences();
		});

	function populateCheckboxes(data) {
		const countryCodes = new Set();
		const tags = new Set();

		data.forEach((conf) => {
			(conf.tags || []).forEach((t) => tags.add(t));
			Object.values(conf.upcoming_events || {}).forEach((e) => {
				if (e.location?.country) countryCodes.add(e.location.country);
			});
		});

		Array.from(countryCodes)
			.map((code) => ({ code, name: getCountryName(code) }))
			.sort((a, b) => a.name.localeCompare(b.name))
			.forEach(({ code, name }) => {
				dom.countriesContainer.appendChild(createCheckbox("countries", code, name));
			});

		Array.from(tags)
			.sort()
			.forEach((tag) => {
				dom.tagsContainer.appendChild(createCheckbox("tags", tag, tag));
			});
	}

	function createCheckbox(name, value, labelText) {
		const label = document.createElement("label");
		label.innerHTML = `<input type="checkbox" name="${name}" value="${value}"> ${labelText}`;
		return label;
	}

	function getFilterValues(name) {
		return Array.from(dom.form.querySelectorAll(`input[name="${name}"]:checked`)).map((cb) => cb.value);
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = date.getUTCDate();
		const suffix = ((d) => d + (["th", "st", "nd", "rd"][((d % 100) - 20) % 10] || ["th", "st", "nd", "rd"][d % 100] || "th"))(day);
		const month = date.toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
		return `${month} ${suffix}, ${date.getUTCFullYear()}`;
	};

	function renderConferences() {
		const filters = {
			countries: getFilterValues("countries"),
			tags: getFilterValues("tags"),
			formats: getFilterValues("format"),
			start: document.getElementById("date-start").value,
			end: document.getElementById("date-end").value,
		};

		dom.list.innerHTML = "";

		conferencesData.forEach((conf) => {
			if (filters.tags.length > 0 && !filters.tags.some((t) => (conf.tags || []).includes(t))) return;

			const validEvents = Object.values(conf.upcoming_events || {}).filter((event) => {
				if (filters.countries.length > 0 && !filters.countries.includes(event.location?.country)) return false;
				if (filters.formats.length > 0 && !filters.formats.includes(event.format?.toLowerCase())) return false;
				if (filters.start && (event.dates?.end || "") < filters.start) return false;
				if (filters.end && (event.dates?.start || "") > filters.end) return false;
				return true;
			});

			if (validEvents.length > 0) {
				const li = document.createElement("li");
				const eventsHtml = validEvents
					.map(
						(evt) => `
					<li>${formatDate(evt.dates.start)} ${evt.dates.end ? ` to ${formatDate(evt.dates.end)}` : ""}
                    <p>${evt.location ? `${evt.location.city}, ${getCountryName(evt.location.country)}` : "Online"}</p></li>
                `,
					)
					.join("");

				li.innerHTML = `<h2><a href="/conferences/${conf.id}">${conf.title}</a></h2><ul>${eventsHtml}</ul>`;
				dom.list.appendChild(li);
			}
		});
	}

	dom.form.addEventListener("change", renderConferences);
	dom.form.addEventListener("reset", () => setTimeout(renderConferences, 0));
});
