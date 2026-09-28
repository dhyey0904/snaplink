import os

for root, _, files in os.walk('frontend/src/app/dashboard'):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'router.push("/login")' in content:
                content = content.replace('router.push("/login")', 'router.replace("/login")')
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Fixed {path}')
