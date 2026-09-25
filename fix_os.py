import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add fetchAPI import
if 'from "@/utils/api"' not in content:
    content = content.replace('import React, { useEffect, useState } from "react";', 'import React, { useEffect, useState } from "react";\nimport { fetchAPI } from "@/utils/api";')

# 2. Fix fetchRealData
pattern_real_data = r'''const fetchRealData = async \(\) => \{
\s*const token = localStorage\.getItem\("token"\);
\s*if \(!token\) return;
\s*try \{
\s*const res = await fetch\("http://127\.0\.0\.1:8000/api/os/data", \{
\s*headers: \{ Authorization: `Bearer \$\{token\}` \}
\s*\}\);
\s*if \(res\.ok\) \{
\s*const data = await res\.json\(\);
\s*setRealData\(data\);
\s*\}
\s*\} catch \(err\) \{
\s*console\.error\("Failed to fetch real data", err\);
\s*\}
\s*\};'''

replacement_real_data = '''const fetchRealData = async () => {
      try {
        const data = await fetchAPI("/os/data");
        setRealData(data);
      } catch (err) {
        console.error("Failed to fetch real data", err);
      }
    };'''
content = re.sub(pattern_real_data, replacement_real_data, content, flags=re.MULTILINE)

# 3. Fix handleConnectGoogle
pattern_google = r'''const handleConnectGoogle = async \(\) => \{
\s*setIsConnecting\(true\);
\s*try \{
\s*const token = localStorage\.getItem\("token"\);
\s*const res = await fetch\("http://127\.0\.0\.1:8000/api/integrations/google/url", \{
\s*headers: \{ Authorization: `Bearer \$\{token\}` \}
\s*\}\);
\s*if \(res\.ok\) \{
\s*const data = await res\.json\(\);
\s*window\.location\.href = data\.url;
\s*\} else \{
\s*alert\("Failed to get Google Auth URL\. Ensure you are logged in\."\);
\s*setIsConnecting\(false\);
\s*\}
\s*\} catch \(err\) \{
\s*console\.error\("Google connect error", err\);
\s*setIsConnecting\(false\);
\s*\}
\s*\};'''

replacement_google = '''const handleConnectGoogle = async () => {
    setIsConnecting(true);
    try {
      const data = await fetchAPI("/integrations/google/url");
      window.location.href = data.url;
    } catch (err) {
      alert("Failed to get Google Auth URL.");
      setIsConnecting(false);
    }
  };'''

content = re.sub(pattern_google, replacement_google, content, flags=re.MULTILINE)

# 4. Force default layout if they have fewer widgets saved than DEFAULT_LAYOUT
pattern_layout = r'''const saved = localStorage\.getItem\("snap_os_layout"\);
\s*if \(saved\) \{
\s*setLayout\(JSON\.parse\(saved\)\);
\s*\} else \{
\s*setLayout\(DEFAULT_LAYOUT\);
\s*\}'''

replacement_layout = '''const saved = localStorage.getItem("snap_os_layout");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Force sync with manifest if they are missing core widgets from an old save
      if (parsed.length < WIDGET_MANIFEST.length) {
        setLayout(DEFAULT_LAYOUT);
        localStorage.setItem("snap_os_layout", JSON.stringify(DEFAULT_LAYOUT));
      } else {
        setLayout(parsed);
      }
    } else {
      setLayout(DEFAULT_LAYOUT);
    }'''

content = re.sub(pattern_layout, replacement_layout, content, flags=re.MULTILINE)

# Make widgets clickable by wrapping the whole widget in a clickable link if applicable, or changing UI
# Actually, the user asked "modify the ui and everything is clickable".
# We can make the widget body act as a button by using onClick logic based on widget ID.

pattern_widget_body = r'''<div className="flex-1 overflow-hidden">
\s*\{renderWidgetContent\(widget\.id, widget\.size\)\}
\s*</div>'''

replacement_widget_body = '''<div 
                    className="flex-1 overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) return;
                      if (widget.id === 'links') window.location.href = '/dashboard/links';
                      if (widget.id === 'files') window.location.href = '/dashboard/files';
                      if (widget.id === 'gmail' && isGoogleConnected) window.location.href = 'https://mail.google.com';
                      if (widget.id === 'calendar' && isGoogleConnected) window.location.href = 'https://calendar.google.com';
                    }}
                  >
                    {renderWidgetContent(widget.id, widget.size)}
                  </div>'''

# wait, isGoogleConnected isn't defined at that scope. I'll just check realData?.google
replacement_widget_body = '''<div 
                    className="flex-1 overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) return;
                      if (widget.id === 'links') window.location.href = '/dashboard/links';
                      if (widget.id === 'files') window.location.href = '/dashboard/files';
                      if (widget.id === 'gmail' && realData?.google) window.location.href = 'https://mail.google.com';
                      if (widget.id === 'calendar' && realData?.google) window.location.href = 'https://calendar.google.com';
                    }}
                  >
                    {renderWidgetContent(widget.id, widget.size)}
                  </div>'''

content = re.sub(pattern_widget_body, replacement_widget_body, content)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
