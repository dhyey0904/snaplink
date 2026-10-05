import re

file_path = 'frontend/src/app/tools/unlock-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

correct_block = """
      let decryptedBytes: Uint8Array;
      
      let cryptErr = '';
      try {
        decryptedBytes = await decryptPDF(pdfBytes, password.normalize("NFC"));
      } catch (err: any) {
        cryptErr = err.message || "Unknown cryptpdf error";
        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password.normalize("NFC") } as any);
          decryptedBytes = await pdfDoc.save();
        } catch (err2: any) {
          throw new Error(`CRITICAL_FAIL: cryptpdf[${cryptErr}] pdf-lib[${err2.message}]`);
        }
      }
      
      const blob = new Blob([decryptedBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("CRITICAL_FAIL")) {
         setErrorMsg(`Tech Error: ${err.message}`);
      } else if (err.message?.includes("Invalid password") || err.message?.includes("encrypted")) {
         setErrorMsg("Incorrect password. Please enter the correct password to unlock this PDF.");
      } else {
         setErrorMsg(`Error processing PDF: ${err.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };
"""

content = re.sub(r'let decryptedBytes: Uint8Array;.*?\}\s*;\s*return\s*\(', correct_block.strip() + '\n\n  return (', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored handleProcess block")
