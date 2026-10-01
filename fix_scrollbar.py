import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    '<style jsx global>{`\n        .hide-scrollbar::-webkit-scrollbar {\n          display: none;\n        }\n        .hide-scrollbar {\n          -ms-overflow-style: none;\n          scrollbar-width: none;\n        }\n      `}</style>',
    '<style jsx global>{`\n        .hide-scrollbar::-webkit-scrollbar {\n          width: 6px;\n        }\n        .hide-scrollbar::-webkit-scrollbar-track {\n          background: transparent;\n        }\n        .hide-scrollbar::-webkit-scrollbar-thumb {\n          background-color: rgba(0,0,0,0.15);\n          border-radius: 10px;\n        }\n        .dark .hide-scrollbar::-webkit-scrollbar-thumb {\n          background-color: rgba(255,255,255,0.2);\n        }\n      `}</style>'
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
