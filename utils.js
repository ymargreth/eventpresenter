// 👉 Replace this URL with your actual JSON endpoint (GitHub raw, API, etc.)
const EVENTS_URL = "events.json";
const SOCIALS_URL = "socials.json";

export async function loadEvents() {
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

		upcoming.forEach((e) => {
			const location = e.location ? ` @ ${e.location}` : "";
			const el = document.createElement("div");
			el.className = "event";

			el.innerHTML = `
                  <div class="event-title">${e.name + location}</div>
                  <div class="event-meta">${e.date} · ${e.city}</div>
               `;

			if (e.links.tickets) {
				el.style.cursor = "pointer";
				el.onclick = () => window.open(e.links.tickets, "_blank");
			}

			container.appendChild(el);
		});
	} catch (err) {
		document.getElementById("events").innerHTML =
			"<div class='event'>Failed to load events</div>";
		console.error(err);
	}
}

export async function loadSocials() {
	try {
		const res = await fetch(SOCIALS_URL);
		const socials = await res.json();

		const container = document.getElementById("socials");
		container.innerHTML = "";

		socials.forEach((s) => {
			const icon =
				s.icon ?
					`<img src="icons/${s.icon}" alt="${s.title}" style="width:20px; vertical-align:middle; margin-right: 12px; margin-bottom: 2px;">`
				:	"";
			const el = document.createElement("a");
			el.className = "link";
			el.href = s.link;
			el.target = "_blank";
			el.innerHTML = `${icon}${s.title}`;
			container.appendChild(el);
		});
	} catch (err) {
		document.getElementById("socials").innerHTML =
			"<div class='event'>Failed to load social links</div>";
		console.error(err);
	}
}

export async function loadEventLinks() {
	// Implementation for loading event links
}

