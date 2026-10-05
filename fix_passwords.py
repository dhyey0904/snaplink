import re

def fix_inputs(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add mobile-friendly attributes to the password input
    content = content.replace(
        'type="password"',
        'type="password"\n                autoCapitalize="none"\n                autoCorrect="off"\n                spellCheck="false"\n                autoComplete="off"'
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_inputs('frontend/src/app/tools/unlock-pdf/page.tsx')
fix_inputs('frontend/src/app/tools/protect-pdf/page.tsx')

print("Fixed password inputs")
