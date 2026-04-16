import json
import os
import re
from datetime import date, datetime

with open("events.json", "r") as f:
   events = json.load(f)

out_dir = "events"
os.makedirs(out_dir, exist_ok=True)

used_names = set()

def slugify(text):
   text = text.lower()
   text = re.sub(r"[^a-z0-9]+", "-", text)
   return text.strip("-")

def make_filename(date_str):
   base = date_str
   filename = base + ".html"

   # collision handling
   counter = 2
   while filename in used_names or os.path.exists(os.path.join(out_dir, filename)):
      filename = f"{base}-{counter}.html"
      counter += 1

   used_names.add(filename)
   return filename

for event in events:
   date_str = event.get("date", "1970-01-01")
   event_date = date.fromisoformat(date_str)
   date_loc = event_date.strftime("%a, %d %b %Y")
   name = event.get("name", "EVENT")
   links = event.get("links", {})

   file_name = make_filename(date_str)
   file_path = os.path.join(out_dir, file_name)

   html = f"""<!DOCTYPE html>
<html>
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>{name}</title>
   <link rel="stylesheet" href="/style.css">
</head>
<body>
   <div class="container">
			<div class="logo">{name}</div>
			<div class="accent"></div>
			<div class="tagline">{event.get("location", "")} · {date_loc}</div>

			<div class="section-title">GET YOUR TICKET NOW!</div>
			<a class="link" href="{links.get("ticket", "#")}">Ticket Shop</a>

         <div class="section-title">MORE INFOS</div>
"""
   for key, link in links.items():
      if key != "ticket":
         if key == "map":
            html += f'<a class="link" href="{link}">Open Location in Maps</a>\n'
         else:
            html += f'<a class="link" href="{link}">{key.capitalize()}</a>\n'

   html += """
			<div class="section-title">FOLLOW US!</div>
			<div id="socials"></div>

			<div class="footer">© Summit Groove Collective</div>
	</div>

   <h1>{name}</h1>
   <p>{event.get("location", "")} · {date_loc}</p>

   <p>{event.get("description", "No description yet.")}</p>

   <a href="../index.html">← Back</a>

   <script type="module">
      import { loadSocials } from "/utils.js";

      loadSocials();
   </script>
</body>
</html>
"""

   with open(file_path, "w") as f:
      f.write(html)

   print("Generated:", file_path)