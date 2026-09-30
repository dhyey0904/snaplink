import re

files = ['frontend/src/app/tools/compress-pdf/page.tsx', 'frontend/src/app/tools/image-compressor/page.tsx']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Disable dropzone input
    c = c.replace('<input type="file" ref={fileInputRef}', '<input type="file" disabled={isServerOffline} ref={fileInputRef}')
    
    # Add disabled opacity to the dropzone
    c = c.replace('className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer relative', 'className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer relative ${isServerOffline ? \'opacity-50 pointer-events-none\' : \'\'}')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Disabled dropzones during maintenance")
