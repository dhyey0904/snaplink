import re
with open("frontend/src/app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

json_ld = '''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SnapLink',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'The ultimate platform for secure file sharing, deep link shortening, and beautifully designed 3D digital business cards.',
    url: 'https://www.snaplinks.in',
  };

  return ('''

content = content.replace("  return (", json_ld, 1)

script_tag = '''        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}'''

content = content.replace("        {children}", script_tag)

with open("frontend/src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added JSON-LD")
