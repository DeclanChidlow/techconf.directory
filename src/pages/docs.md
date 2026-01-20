---
title: API Documentation
description: Documentation of TechConf.Directory's full API containing information about conferences and speakers. Contains much relevant metadata. Fully open and available for general usage.
og_description: Full documentation of TechConf.Directory's open API
canonical: /docs
stylesheet: "pages/docs.css"
---

<div class="readable">

<h1>API Documentation</h1>

Looking for a source of information pertaining to technology conferences? Look no further, because TechConf.Directory has a fully open read-only API to suit your needs.

No authentication is necessary, but please be respectful and employ best practices.

Endpoint: `https://techconf.directory/api`

All returned as `application/json`.

OpenAPI specification coming soon.

</div>

<details>
<summary><span class="get">GET</span> <h2>/index.json</h2> <em>API info</em></summary>

**techconf.directory**
string

Version of the API (eg, '1.0.0').

---

**website**
string

URL of the TechConf.Directory website.

---

**api_docs**
string

URL of the API documentation.

---

**last_updated**
string

ISO timestamp of the last site change.

---

**build.timestamp**
integer

Unix timestamp (milliseconds) when the build was created.

---

**build.git_version**
string

Git commit hash (short version) used for this build.

</details>

<details>
<summary><span class="get">GET</span> <h2>/conferences.json</h2> <em>List of all conferences</em></summary>

**id**
string
(query)

Unique identifier of the conference.

---

**title**
string
(query)

Name of the conference.

---

**tags**
array<string>
(query)

Comma-separated list of tech tags (eg, 'front-end, web development').

---

**upcoming_events.year**
integer
(query)

Year of the upcoming event (eg, 2026).

---

**upcoming_events.dates.start**
string
(query)

Start date of the event in YYYY-MM-DD format.

---

**upcoming_events.dates.end**
string
(query)

End date of the event in YYYY-MM-DD format. Optional if the event is one day.

---

**upcoming_events.format**
string
(query)

Event format. Available values: in-person, online, hybrid.

---

**upcoming_events.location.country**
string
(query)

Country code of the event location (eg, 'NL', 'GB').

---

**upcoming_events.location.city**
string
(query)

City of the event location (eg, 'Amsterdam', 'London').

</details>

<details>
<summary><span class="get">GET</span> <h2>/conferences/{id}.json</h2> <em>Details of a given conference</em></summary>

**title**
string
(query)

Name of the conference (eg, 'Beyond Tellerrand Düsseldorf').

---

**website**
string
(query)

URL or domain of the conference website (eg, 'beyondtellerrand.com').

---

**socials.bluesky**
string
(query)

Bluesky profile or link of the conference.

---

**socials.fediverse**
string
(query)

Fediverse/Mastodon profile link of the conference.

---

**socials.youtube**
string
(query)

YouTube username or channel ID.

---

**socials.linkedin**
string
(query)

LinkedIn page slug.

---

**tags**
array<string>
(query)

Comma-separated list of tech tags (eg, 'front-end, web development').

---

**events.year**
integer
(query)

Year of the conference event (eg, 2025, 2026).

---

**events.dates.start**
string
(query)

Start date of the event in YYYY-MM-DD format.

---

**events.dates.end**
string
(query)

End date of the event in YYYY-MM-DD format. Optional if the event is one day.

---

**events.format**
string
(query)

Event format. Available values: in-person, online, hybrid.

---

**events.location.country**
string
(query)

Country code of the event location (eg, 'DE').

---

**events.location.city**
string
(query)

City of the event location (eg, 'Düsseldorf').

</details>

<details>
<summary><span class="get">GET</span> <h2>/speakers.json</h2> <em>List of all speakers</em></summary>

**id**
string
(query)

Unique identifier for the speaker (eg, 'declan-chidlow').

---

**name**
string
(query)

Full name of the speaker (eg, 'Declan Chidlow').

---

**website**
string
(query)

URL of the speaker’s personal or professional website (eg, '[https://vale.rocks](https://vale.rocks)').

---

**socials.bluesky**
string
(query)

Bluesky handle of the speaker (eg, '@vale.rocks').

---

**socials.fediverse**
string
(query)

Fediverse/Mastodon profile of the speaker (eg, 'fedi.vale.rocks/vale').

---

**socials.youtube**
string
(query)

YouTube username or channel handle (eg, '@outervale').

---

**socials.linkedin**
string
(query)

LinkedIn page slug (eg, 'declan-chidlow').

</details>
