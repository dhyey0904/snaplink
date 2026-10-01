import re

file = 'frontend/src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# I will find the aggregateRating block and remove it completely from layout.tsx!
target_block = """                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "124"
                  },
                  "description": "Secure file sharing and 3D digital business card generator platform."
                }
              ])
            }}
          />"""

new_block = """                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": "Secure file sharing and 3D digital business card generator platform."
                }
              ])
            }}
          />"""

c = c.replace(target_block, new_block)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed aggregateRating from layout.tsx")
