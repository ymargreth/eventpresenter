import json
import os
import re
from datetime import datetime

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
   dt = datetime.strptime(date_str, "%Y-%m-%d")
   base = f"{dt.strftime('%Y-%m-%d')}"
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
   name = event.get("name", "event")

   file_name = make_filename(date_str, name)
   file_path = os.path.join(out_dir, file_name)

   html = f"""<!DOCTYPE html>
<html>
<head>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>{name}</title>
   <link rel="stylesheet" href="../style.css">
</head>
<body>

   <h1>{name}</h1>
   <p>{event.get("location", "")} · {date_str}</p>

   <p>{event.get("description", "No description yet.")}</p>

"""

   if "link" in event:
      html += f'<p><a href="{event["link"]}">Ticket Link</a></p>\n'

   html += """
   <a href="../index.html">← Back</a>

</body>
</html>
"""

   with open(file_path, "w") as f:
      f.write(html)

   print("Generated:", file_path)