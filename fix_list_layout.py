import re

file = 'frontend/src/app/security/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the messy flex lists
c = c.replace(
    '<li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> <strong>Google OAuth:</strong> Sign in securely without needing a password.</li>',
    '<li className="flex gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-2"></div> <span><strong>Google OAuth:</strong> Sign in securely without needing a password.</span></li>'
)
c = c.replace(
    '<li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> <strong>Hashed Passwords:</strong> We never store plain-text passwords.</li>',
    '<li className="flex gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-2"></div> <span><strong>Hashed Passwords:</strong> We never store plain-text passwords.</span></li>'
)
c = c.replace(
    '<li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> <strong>Session Limits:</strong> Expiring JWT tokens prevent indefinite access.</li>',
    '<li className="flex gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-2"></div> <span><strong>Session Limits:</strong> Expiring JWT tokens prevent indefinite access.</span></li>'
)

# Fix Data Privacy list
c = c.replace(
    '<li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></div> <strong>No Data Selling:</strong> We do not sell your personal information.</li>',
    '<li className="flex gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-2"></div> <span><strong>No Data Selling:</strong> We do not sell your personal information.</span></li>'
)
c = c.replace(
    '<li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></div> <strong>Transparency:</strong> Real, honest statements about our capabilities.</li>',
    '<li className="flex gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-2"></div> <span><strong>Transparency:</strong> Real, honest statements about our capabilities.</span></li>'
)
c = c.replace(
    '<li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></div> <strong>Right to Delete:</strong> You can request full account deletion at any time.</li>',
    '<li className="flex gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-2"></div> <span><strong>Right to Delete:</strong> You can request full account deletion at any time.</span></li>'
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed flex layouts in lists")
