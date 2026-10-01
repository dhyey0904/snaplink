import os
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c += """      `}</style>
    </div>
  );
}
"""

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
