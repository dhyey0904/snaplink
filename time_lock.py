import re

files = ['frontend/src/app/tools/compress-pdf/page.tsx', 'frontend/src/app/tools/image-compressor/page.tsx']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Replace the hardcoded string
    pattern = r'  const isServerOffline = true; // Hardcoded to true for now\. Change to false in the morning\.'
    
    replacement = """  const [isServerOffline, setIsServerOffline] = useState(true);

  useEffect(() => {
    // Render resets the free tier at exactly Midnight UTC on the 1st of the month.
    // That is October 1, 2026 at 00:00:00 UTC (5:30 AM IST).
    const renderResetTimeUTC = new Date('2026-10-01T00:00:00Z').getTime();
    
    // Automatically unlock the frontend without any network pings if the current time is past the reset time!
    if (Date.now() >= renderResetTimeUTC) {
      setIsServerOffline(false);
    }
  }, []);"""
    
    c = re.sub(pattern, replacement, c)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Implemented automatic time-lock release")
