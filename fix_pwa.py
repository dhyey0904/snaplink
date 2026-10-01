import re

file = 'frontend/src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Add Script to imports
if 'import Script from' not in c:
    c = c.replace("import { Inter } from 'next/font/google';", "import { Inter } from 'next/font/google';\nimport Script from 'next/script';")

# Inject SW registration script before closing </body>
sw_script = """
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) { console.log('ServiceWorker registration successful'); },
                  function(err) { console.log('ServiceWorker registration failed: ', err); }
                );
              });
            }
          `}
        </Script>
      </body>
"""

c = c.replace('</body>', sw_script)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Injected service worker into layout.tsx")
