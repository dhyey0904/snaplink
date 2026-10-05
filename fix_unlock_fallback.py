import re

file_path = 'frontend/src/app/tools/unlock-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

fallback_block = """
      let decryptedBytes: Uint8Array | null = null;
      let backendUrl: string | null = null;
      
      let cryptErr = '';
      try {
        decryptedBytes = await decryptPDF(pdfBytes, password.normalize("NFC"));
      } catch (err: any) {
        cryptErr = err.message || "Unknown cryptpdf error";
        
        // If cryptpdf fails (because it only supports AES-256 Rev 5),
        // fallback to our robust Python backend which supports RC4 and all other specs.
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('password', password.normalize("NFC"));
          
          const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com'}/api`;
          const res = await fetch(`${apiUrl}/tools/unlock-pdf`, {
            method: 'POST',
            body: formData,
          });
          
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            if (res.status === 401 || errData.detail?.includes("Invalid password")) {
               throw new Error("Invalid password");
            }
            throw new Error(errData.detail || "Backend unlock failed");
          }
          
          const backendBlob = await res.blob();
          backendUrl = URL.createObjectURL(backendBlob);
          
        } catch (err2: any) {
          throw new Error(`CRITICAL_FAIL: Local[${cryptErr}] Backend[${err2.message}]`);
        }
      }
      
      let urlToDownload = backendUrl;
      if (decryptedBytes) {
        const blob = new Blob([decryptedBytes as any], { type: 'application/pdf' });
        urlToDownload = URL.createObjectURL(blob);
      }
      
      setDownloadUrl(urlToDownload);
"""

content = re.sub(r'let decryptedBytes: Uint8Array;.*?setDownloadUrl\(url\);', fallback_block.strip(), content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added backend fallback to unlock-pdf")
