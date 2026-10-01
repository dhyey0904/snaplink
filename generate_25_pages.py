import json

base = {
  "title": "The Earth Handbook",
  "subtitle": "A Comprehensive Guide to Our Planet",
  "author": "SnapLinks Editor",
  "edition": "2026 Edition",
  "description": "Discover the incredible interconnected systems that make life on Earth possible. A 25-page journey through the deep oceans, vast forests, and dynamic climate.",
  "category": "Earth",
  "readingTime": "25 min",
  "difficulty": "Beginner",
  "tags": ["Nature", "Environment", "Science"],
  "coverImage": "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
  "coverColor": "#1a4b3c",
  "chapters": []
}

content_pieces = [
  "# Welcome to Earth\n\nEarth is the third planet from the Sun and the only astronomical object known to harbor life. This is made possible by its unique combination of liquid water, a protective atmosphere, and a dynamic geological system.",
  "Our planet sits in a perfectly situated orbit, often called the Goldilocks Zone. It is not too hot and not too cold, allowing liquid water to pool on its surface.",
  "Earth's atmosphere consists primarily of nitrogen (78%) and oxygen (21%). This delicate balance protects us from harmful solar radiation while keeping the planet warm enough to sustain life.",
  "Interestingly, Earth is not a perfect sphere. As it spins, gravity points toward the center of our planet, and a centrifugal force pushes outward, creating a slight equatorial bulge.",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop||Earth as seen from orbit.",
  "# The Hydrosphere\n\nAbout 71% of Earth's surface is covered by water, mostly by its oceans. These massive bodies of water act as the planet's thermostat, absorbing and distributing solar heat across the globe.",
  "Despite our technological advancements, only 5% of the ocean has been explored by humans. The deep sea remains one of the last frontiers on our planet, hiding countless undiscovered species.",
  "The Mariana Trench is the deepest oceanic trench on Earth. If you placed Mount Everest at the bottom, its peak would still be over a mile underwater.",
  "Oceans also produce over half of the world's oxygen, primarily through marine plants and phytoplankton. They absorb massive amounts of carbon dioxide, buffering the impacts of climate change.",
  "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1000&auto=format&fit=crop||The deep blue ocean currents.",
  "# The Green Canopy\n\nForests cover nearly a third of all land on Earth, providing vital organic infrastructure for some of the planet's densest, most diverse collections of life.",
  "They support countless species, including many that are still undiscovered by science. Forests act as massive carbon sinks, pulling carbon out of the atmosphere and storing it in wood and soil.",
  "The Amazon Rainforest alone produces approximately 20% of the world's oxygen. It spans over 2 million square miles and plays a critical role in regulating the global climate.",
  "Beneath the forest floor lies the 'Wood Wide Web'. Fungi connect the roots of trees, allowing them to communicate and share nutrients across vast distances.",
  "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop||Ancient dense forests breathing life into the planet.",
  "# The Dynamic Core\n\nEarth is composed of four main layers: the crust, the mantle, the outer core, and the inner core. The crust we walk on is paper-thin compared to the rest of the planet.",
  "The mantle makes up 84% of Earth's volume, consisting of solid rock that behaves like a viscous fluid over geological time, driving the movement of tectonic plates.",
  "At the very center lies the inner core, a solid sphere of iron and nickel with temperatures exceeding 5,400°C (9,800°F)—as hot as the surface of the Sun.",
  "The rotation of the liquid outer core generates Earth's magnetic field, which shields our atmosphere from being stripped away by fierce solar winds.",
  "# Climate Systems\n\nEarth's climate is driven by the unequal heating of its surface by the Sun. The equator receives more direct sunlight than the poles, creating immense atmospheric circulation patterns.",
  "These circulation patterns distribute heat and moisture around the globe, creating distinct biomes such as deserts, rainforests, and tundras.",
  "Ocean currents play a massive role in this system. The Gulf Stream, for instance, transports warm water from the equator up to the North Atlantic, keeping Europe unusually warm for its latitude.",
  "# The Biosphere\n\nThe biosphere is the global sum of all ecosystems. It can also be termed the zone of life on Earth, a closed system (apart from solar and cosmic radiation) and largely self-regulating.",
  "Life has fundamentally altered Earth's atmosphere. Billions of years ago, cyanobacteria began producing oxygen through photosynthesis, causing the Great Oxidation Event.",
  "Today, millions of species interact in complex webs of life, each playing a role in maintaining the delicate balance of the ecosystems they inhabit.",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop||Snow capped mountains touching the atmosphere.",
  "# Human Impact\n\nHumans have become the dominant force of change on Earth. Our agricultural, industrial, and technological advancements have transformed the planet's surface.",
  "While human ingenuity has led to incredible achievements, it has also resulted in significant environmental challenges, including habitat destruction and climate change.",
  "The future of Earth relies on our ability to transition toward sustainable practices. Conservation efforts, renewable energy, and global cooperation are essential.",
  "# Conclusion\n\nEarth is a resilient, breathtakingly complex world. It has survived asteroid impacts, ice ages, and massive volcanic eruptions over its 4.5 billion-year history.",
  "As the only known home for life in the universe, it is our responsibility to understand, protect, and cherish the delicate systems that sustain us."
]

chapters = [
  {"title": "Introduction to the Blue Planet", "pages": []},
  {"title": "The Vast Oceans", "pages": []},
  {"title": "Forests and Lungs", "pages": []},
  {"title": "The Dynamic Core", "pages": []},
  {"title": "Climate Systems", "pages": []},
  {"title": "The Biosphere", "pages": []},
  {"title": "Human Impact", "pages": []},
  {"title": "Conclusion", "pages": []}
]

chap_idx = 0
for text in content_pieces:
    if text.startswith("# ") and chapters[chap_idx]["pages"]:
        chap_idx += 1
    
    if "||" in text:
        url, cap = text.split("||")
        chapters[chap_idx]["pages"].append({"type": "image", "content": url, "caption": cap})
    else:
        chapters[chap_idx]["pages"].append({"type": "text", "content": text})

base["chapters"] = chapters

with open('frontend/src/content/books/earth.json', 'w', encoding='utf-8') as f:
    json.dump(base, f, indent=2)

print("Generated {} pages".format(sum(len(c['pages']) for c in chapters)))
