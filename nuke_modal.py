import re

file = 'frontend/src/components/MaintenanceModal.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the whole body overflow logic in useEffect with a clean return
# We don't need maintenance modal anymore, it's over!
# Let's just make the entire component return null and remove the useEffect completely.

new_content = '''"use client";
import React from 'react';

export default function MaintenanceModal() {
  return null;
}
'''

with open(file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Nuked MaintenanceModal")
