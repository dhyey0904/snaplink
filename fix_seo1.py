import re

file = 'frontend/src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove aggregateRating from layout.tsx
c = re.sub(r'aggregateRating:\s*\{\s*\'@type\':\s*\'AggregateRating\',\s*ratingValue:\s*\'4\.8\',\s*ratingCount:\s*\'124\'\s*\},', '', c)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed aggregateRating from layout.tsx")
