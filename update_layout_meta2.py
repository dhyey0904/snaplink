import re

with open("frontend/src/app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace global description
old_desc = '"SnapLink is the ultimate platform for secure file sharing, deep link shortening, and beautifully designed 3D digital business cards and Link-in-Bio pages."'
new_desc = '"SnapLink is the ultimate all-in-one workspace featuring Snap OS, deep link shortening, secure file sharing, Link-in-Bio pages, and free Snap Tools for PDF & web utilities."'
content = content.replace(old_desc, new_desc)

# Replace OpenGraph description
old_og_desc = '"The ultimate platform for secure file sharing, deep link shortening, and beautifully designed 3D digital business cards."'
new_og_desc = '"Experience Snap OS: Your ultimate web workspace for deep link shortening, secure file sharing, Link-in-Bio pages, and free Snap Tools."'
content = content.replace(old_og_desc, new_og_desc)

# Replace keywords
old_keywords = 'keywords: ["URL shortener", "link in bio", "secure file sharing", "ephemeral file transfer", "digital business card", "3D vcard"],'
new_keywords = 'keywords: ["Snap OS", "Snap Tools", "web operating system", "URL shortener", "free PDF tools", "link in bio", "secure file sharing", "ephemeral file transfer", "digital business card", "3D vcard"],'
content = content.replace(old_keywords, new_keywords)

# Replace JSON-LD description
old_json_desc = "description: 'The ultimate platform for secure file sharing, deep link shortening, and beautifully designed 3D digital business cards.',"
new_json_desc = "description: 'Experience Snap OS: Your ultimate web workspace for deep link shortening, secure file sharing, Link-in-Bio pages, and free Snap Tools.',"
content = content.replace(old_json_desc, new_json_desc)

with open("frontend/src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated layout.tsx metadata")
