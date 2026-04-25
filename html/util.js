// 👉 Replace this URL with your actual JSON endpoint (GitHub raw, API, etc.)
const EVENTS_URL = "/feed/events.json";
const SOCIALS_URL = "/feed/socials.json";

export async function loadOverview() {
	try {
		const res = await fetch(EVENTS_URL);
		const events = await res.json();

		const container = document.getElementById("events");
		container.innerHTML = "";

		const now = new Date();

		const upcoming = events
			.map((e) => ({ ...e, dateObj: new Date(e.date) }))
			.filter((e) => e.dateObj >= now)
			.sort((a, b) => a.dateObj - b.dateObj);

		if (upcoming.length === 0) {
			container.innerHTML = "<div class='event'>No upcoming events</div>";
			return;
		}

		document.querySelector(".section-title").textContent = "UPCOMING EVENTS";

		upcoming.forEach((e) => {
			const location = e.location ? ` @ ${e.location}` : "";
			const page = `/?q=${e.date}`;
			const el = document.createElement("div");
			el.className = "event";

			el.innerHTML = `
                  <div class="event-title">${e.name + location}</div>
                  <div class="event-meta">${e.date} · ${e.city}</div>
               `;

			el.style.cursor = "pointer";
			el.onclick = () => window.open(page, "_blank");

			container.appendChild(el);
		});
	} catch (err) {
		document.getElementById("events").innerHTML =
			"<div class='message'>Failed to load events</div>";
		console.error("Failed to load events:", err);
	}
}

export async function loadSocials() {
	try {
		const res = await fetch(SOCIALS_URL);
		const socials = await res.json();
		console.log("Loaded socials:", socials);
		const container = document.getElementById("socials");
		container.innerHTML = "";

		socials.forEach((s) => {
			const icon =
				s.icon ?
					`<img src="/icons/${s.icon}" alt="${s.title}" style="width:20px; vertical-align:middle; margin-right: 12px; margin-bottom: 2px;">`
				:	"";
			const el = document.createElement("a");
			el.className = "link glow";
			el.href = s.link;
			el.target = "_blank";
			el.innerHTML = `${icon}${s.title}`;
			container.appendChild(el);
		});
	} catch (err) {
		document.getElementById("socials").innerHTML =
			"<div class='message'>Failed to load social links</div>";
		console.error("Failed to load social links:", err);
	}
}

export async function loadEvent(dateStr) {
	try {
		const res = await fetch(EVENTS_URL);
		const events = await res.json();

		const event = events.find((e) => e.date === dateStr);
		const eventDate = new Date(dateStr);

		if (!event) {
			console.error(`No Event found for date: ${eventDate.toDateString()}`);
			return;
		}

		// populate page
		document.title = `${event.name} - Summit Groove Collective`;
		document.querySelector(".title").textContent = event.name;
		document.querySelector(".subtitle").textContent =
			eventDate.toLocaleDateString(undefined, {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric"
			});
		document.querySelector(".tagline").textContent =
			`${event.location ? `${event.location} · ` : ""}${event.city}`;
		document.getElementById("ticket-link").href = event.links.ticket || "#";
		document.querySelector(".section-title").textContent = "MORE INFOS";

		const container = document.getElementById("links");
		container.innerHTML = "";

		for (const [key, link] of Object.entries(event.links)) {
			if (key !== "ticket") {
				const el = document.createElement("a");
				el.className = "link";
				el.href = link;
				el.target = "_blank";
				el.innerHTML =
					key === "map" ?
						"Open Location in Maps"
					:	key.charAt(0).toUpperCase() + key.slice(1);
				container.appendChild(el);
			}
		}
	} catch (err) {
		document.getElementById("links").innerHTML =
			`<div class='message'>No Event found for date: ${dateStr}</div>`;
		console.error("Failed to load event links:", err);
	}
}
