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
			<div class="title">{name}</div>
			<div class="accent"></div>
			<div class="subtitle">{event.get("location", "")} · {date_loc}</div>

			<a class="link" href="{links.get("ticket", "#")}">Get Your Ticket Now!</a>

         <div class="section-title">MORE INFOS</div>
         <div id="links"></div>

			<div class="section-title">STAY IN TOUCH!</div>
			<div id="socials"></div>

			<div class="footer">©2026 Summit Groove Collective</div>
	</div>

   <script type="module">
      """
   html += 'import { loadSocials, loadEventLinks } from "/utils.js";\n'
   html += f"""

      loadEventLinks("{date_str}");
      loadSocials();
   </script>
</body>
</html>
"""

   with open(file_path, "w") as f:
      f.write(html)

   print("Generated:", file_path)