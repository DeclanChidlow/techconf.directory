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
		formatsContainer: document.getElementById("formats-list"),
		list: document.querySelector("ol"),
	};

	if (dom.form) dom.form.style.display = "flex";

	document.addEventListener("click", (e) => {
		document.querySelectorAll("details.custom-select[open]").forEach((detail) => {
			if (!detail.contains(e.target)) {
				detail.removeAttribute("open");
			}
		});
	});

	let conferencesData = [];

	fetch(apiEndpoint)
		.then((res) => res.json())
		.then((json) => {
			conferencesData = json.data;
			populateCheckboxes(conferencesData);
			applyUrlParams();
			renderConferences();
		});

	function applyUrlParams() {
		const params = new URLSearchParams(window.location.search);

		["countries", "tags", "format"].forEach((name) => {
			(params.get(name) || "")
				.split(",")
				.filter(Boolean)
				.forEach((val) => {
					const cb = dom.form.querySelector(`input[name="${name}"][value="${val}"]`);
					if (cb) cb.checked = true;
				});
		});

		["date-start", "date-end", "sort-by", "sort-order"].forEach((id) => {
			const paramVal = params.get(id.replace("date-", ""));
			const input = document.getElementById(id);
			if (paramVal && input) input.value = paramVal;
		});
	}

	function updateUrlParams(filters, sortBy, sortOrder) {
		const params = new URLSearchParams();

		if (filters.countries.length) params.set("countries", filters.countries.join(","));
		if (filters.tags.length) params.set("tags", filters.tags.join(","));
		if (filters.formats.length) params.set("format", filters.formats.join(","));
		if (filters.start) params.set("start", filters.start);
		if (filters.end) params.set("end", filters.end);

		if (sortBy && sortBy !== "date") params.set("sort-by", sortBy);
		if (sortOrder && sortOrder !== "asc") params.set("sort-order", sortOrder);

		const qs = params.toString();
		const newUrl = window.location.pathname + (qs ? `?${qs}` : "");

		window.history.replaceState(null, "", newUrl);
	}

	function populateCheckboxes(data) {
		const countryCounts = {};
		const tagCounts = {};
		const formatCounts = {};

		data.forEach((conf) => {
			(conf.tags || []).forEach((t) => {
				tagCounts[t] = (tagCounts[t] || 0) + 1;
			});
			Object.values(conf.upcoming_events || {}).forEach((e) => {
				if (e.location?.country) {
					const code = e.location.country;
					countryCounts[code] = (countryCounts[code] || 0) + 1;
				}

				if (e.format) {
					const fmt = e.format.toLowerCase();
					formatCounts[fmt] = (formatCounts[fmt] || 0) + 1;
				}
			});
		});

		Object.keys(countryCounts)
			.map((code) => ({ code, name: getCountryName(code), count: countryCounts[code] }))
			.sort((a, b) => a.name.localeCompare(b.name))
			.forEach(({ code, name, count }) => {
				dom.countriesContainer.appendChild(createCheckbox("countries", code, `${name} (${count})`));
			});

		Object.keys(tagCounts)
			.sort()
			.forEach((tag) => {
				dom.tagsContainer.appendChild(createCheckbox("tags", tag, `${tag} (${tagCounts[tag]})`));
			});

		Object.keys(formatCounts)
			.sort()
			.forEach((fmt) => {
				const label = fmt.charAt(0).toUpperCase() + fmt.slice(1);
				dom.formatsContainer.appendChild(createCheckbox("format", fmt, `${label} (${formatCounts[fmt]})`));
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
			start: document.getElementById("date-start")?.value || "",
			end: document.getElementById("date-end")?.value || "",
		};

		const sortBy = document.getElementById("sort-by")?.value || "date";
		const sortOrder = document.getElementById("sort-order")?.value || "asc";

		updateUrlParams(filters, sortBy, sortOrder);

		dom.list.innerHTML = "";
		let filteredResults = [];

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
				filteredResults.push({ conf, validEvents });
			}
		});

		filteredResults.sort((a, b) => {
			let valA, valB;

			if (sortBy === "alphabetical") {
				valA = a.conf.title.toLowerCase();
				valB = b.conf.title.toLowerCase();
			} else {
				valA = a.validEvents.reduce((min, e) => (e.dates.start < min ? e.dates.start : min), a.validEvents[0].dates.start);
				valB = b.validEvents.reduce((min, e) => (e.dates.start < min ? e.dates.start : min), b.validEvents[0].dates.start);
			}

			if (valA < valB) return sortOrder === "asc" ? -1 : 1;
			if (valA > valB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		filteredResults.forEach(({ conf, validEvents }) => {
			const li = document.createElement("li");
			const eventsHtml = validEvents
				.map(
					(evt) => `
					<li>
						${formatDate(evt.dates.start)} ${evt.dates.end ? ` to ${formatDate(evt.dates.end)}` : ""}
						<p>${evt.location ? `${evt.location.city}, ${getCountryName(evt.location.country)}` : "Virtual"}</p>
						${evt.cfp_open ? '<p class="cfp-open">Call for papers open!</p>' : ""}
					</li>
					`,
				)
				.join("");

			li.innerHTML = `<h2><a href="/conferences/${conf.id}">${conf.title}</a></h2><ul>${eventsHtml}</ul>`;
			dom.list.appendChild(li);
		});
	}

	dom.form.addEventListener("change", renderConferences);

	dom.form.addEventListener("reset", () => {
		setTimeout(renderConferences, 0);
	});
});
