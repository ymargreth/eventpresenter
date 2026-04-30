// import { QRCodeStyling } from "./index.html";
// import { QRCodeStyling } from "https://unpkg.com/qr-code-styling@1.9.2/lib/qr-code-styling.commmon.js";

const EVENTS_URL = "/feed/events.json";
const SOCIALS_URL = "/feed/socials.json";

let qrOptions;

async function fetchJSON(file) {
	return fetch(`/feed/${file}.json`)
		.then((res) => res.json())
		.catch((err) => {
			console.error(`Failed to load ${file}.json:`, err);
			return [];
		});
}

function displayQR() {
	const text = document.getElementById("qrtext").value;
	if (!text) {
		alert("Please enter text or URL");
		return;
	}
	const canvas = document.getElementById("qrcanvas");
	canvas.innerHTML = "";

	const qrCode = generateQR(text);
	qrCode.append(canvas);
}

function generateQR(query) {
	const options = qrOptions;
	options.data = `https://summitgroovecollective.com/?q=${encodeURIComponent(query)}`;

	return new QRCodeStyling(options);
}

function donwloadQR(query) {
	const qrCode = generateQR(query);
	qrCode.download({ name: `SGC_QR_${query}`, extension: "png" });
}

async function loadQrGenerator() {
	try {
		qrOptions = await fetchJSON("sgc-qr");
		document.title = "QR Code Generator - Event Presenter";
		document.getElementById("title").textContent = "QR Code Generator";
		document.body.querySelector("main").innerHTML = `
					<div class="section-title" style="margin-bottom: 2rem;">GENERATE A QR CODE</div>
					<div style="margin: auto 2rem; display:block">
					<input id="qrtext" type="text" placeholder="Enter text or URL" />
					<button onclick="displayQR()">Generate QR Code</button>
					</div>
					<div id="qrcanvas" class="qr"></div>
				`;
	} catch (err) {
		console.error("Failed to load QR generator:", err);
	}
}

async function loadOverview() {
	try {
		qrOptions = await fetchJSON("sgc-qr");
		const events = await fetchJSON("events");

		const container = document.getElementById("events");
		container.innerHTML = "";

		const now = new Date();

		const upcoming = events
			.map((e) => ({ ...e, dateObj: new Date(e.date) }))
			.filter((e) => e.dateObj >= now)
			.sort((a, b) => a.dateObj - b.dateObj);

		const past = events.filter((e) => !upcoming.includes(e));

		if (upcoming.length === 0) {
			container.innerHTML = "<div class='event'>No upcoming events</div>";
			return;
		}
		document.title = "Overview - Event Presenter";
		document.querySelector(".section-title").textContent = "UPCOMING EVENTS";

		upcoming.forEach((e) => {
			const location = e.location ? ` @ ${e.location}` : "";
			const page = `/?q=${e.date}`;
			const qrCode = generateQR(e.date);
			const el = document.createElement("div");
			el.className = "event-item";

			el.innerHTML = `
									<div class="event link" style="width: 80%" onclick="window.open('${page}', '_blank')">
                  	<div class="event-title">${e.name}</div>
                  	<div class="event-meta">${e.date} ·${location}</div>
									</div>
									<div class="event link" style="margin-left: 0.5rem; width: 5rem; font-size: 0.8rem; text-align: center;" onclick="donwloadQR('${e.date}')">
										Download 
										<br>
										QR
									</div>
               `;

			container.appendChild(el);
		});
	} catch (err) {
		document.getElementById("events").innerHTML =
			"<div class='message'>Failed to load events</div>";
		console.error("Failed to load events:", err);
	}
}

async function loadSocials() {
	try {
		const socials = await fetchJSON("socials");
		console.log("Loaded socials:", socials);

		const container = document.getElementById("socials");
		container.innerHTML = "";

		socials.forEach((s) => {
			const icon =
				s.icon ?
					`<img src="/icons/${s.icon}" alt="${s.title}" style="width:20px; vertical-align:middle; margin-right: 12px; margin-bottom: 2px;">`
				:	"";

			const el = document.createElement("a");
			el.className = "block link glow";
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

async function loadEvent(dateStr) {
	try {
		const event = fetchJSON("events").then((events) =>
			events.find((e) => e.date === dateStr)
		);
		const eventDate = new Date(dateStr);

		if (!event) {
			console.error(`No Event found for date: ${eventDate.toDateString()}`);
			return;
		}

		// populate page
		document.title = `${event.name} - Event Presenter`;

		document.getElementById("title").textContent = event.name;

		document.getElementById("subtitle").textContent =
			eventDate.toLocaleDateString(undefined, {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric"
			});

		document.getElementById("tagline").textContent =
			`${event.location ? `${event.location} · ` : ""}${event.city}`;

		document.getElementById("ticket-link").href = event.links.ticket || "#";

		document.querySelector(".section-title").textContent = "MORE INFOS";

		const container = document.getElementById("links");
		container.innerHTML = "";

		for (const [key, link] of Object.entries(event.links)) {
			if (key !== "ticket") {
				const el = document.createElement("a");
				el.className = "block link";
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
