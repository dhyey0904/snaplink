import re
import sys

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the block after social icons
pattern = re.compile(r'(\{\(twitterUrl \|\| instagramUrl \|\| githubUrl \|\| linkedinUrl\) && \((.*?)\n\s*\)\}\n\s*</div>)(.*?)\n\s*\)\}\n\s*</main>', re.DOTALL)
match = pattern.search(text)
if match:
    new_end = r'\1\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>'
    new_text = pattern.sub(new_end, text)
    with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Replaced divs successfully!')
else:
    print('Not found')
