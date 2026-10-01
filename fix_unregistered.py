import os

terms = 'frontend/src/app/terms/page.tsx'
if os.path.exists(terms):
    with open(terms, 'r', encoding='utf-8') as f:
        c = f.read()
    if '1. Agreement to Terms' in c and 'unregistered' not in c:
        c = c.replace('1. Agreement to Terms</h2>', '1. Agreement to Terms</h2>\n          <p><strong>Entity Status:</strong> SnapLinks is currently an independent, unregistered startup project. By using our services, you acknowledge that you are interacting with an independent software project rather than a registered corporate entity.</p>')
    with open(terms, 'w', encoding='utf-8') as f:
        f.write(c)

privacy = 'frontend/src/app/privacy/page.tsx'
if os.path.exists(privacy):
    with open(privacy, 'r', encoding='utf-8') as f:
        c = f.read()
    if '1. What Information Do We Collect?' in c and 'unregistered' not in c:
        c = c.replace('1. What Information Do We Collect?</h2>', '1. What Information Do We Collect?</h2>\n          <p><strong>Entity Status:</strong> SnapLinks is an independent, unregistered startup project. We collect information solely for the purpose of operating and improving our platform.</p>')
    with open(privacy, 'w', encoding='utf-8') as f:
        f.write(c)

print("Injected unregistered status")
