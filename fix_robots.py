import re

with open('frontend/src/app/robots.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("'/link-in-bio',", "'/linktree-alternative',\n        '/bridge',")

# Ensure /b/ is disallowed because SnapBridge rooms shouldn't be indexed by search engines!
# Snapbridge rooms are highly private self-destructing links.
c = c.replace("'/f/' // Short links redirect tracking", "'/f/', // Short links redirect tracking\n        '/b/' // SnapBridge private transfer rooms")

with open('frontend/src/app/robots.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated robots.ts")
