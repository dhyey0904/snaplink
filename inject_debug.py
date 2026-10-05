import re

file_path = 'frontend/src/app/tools/unlock-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """
        let cryptErr = '';
        try {
          decryptedBytes = await decryptPDF(pdfBytes, password.normalize("NFC"));
        } catch (err: any) {
          cryptErr = err.message;
          try {
            const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password.normalize("NFC") } as any);
            decryptedBytes = await pdfDoc.save();
          } catch (err2: any) {
            throw new Error(`CRITICAL_FAIL: cryptpdf[${cryptErr}] pdf-lib[${err2.message}]`);
          }
        }
"""

content = re.sub(r'try \{\s*// Try to decrypt using cryptpdf.*decryptedBytes = await pdfDoc\.save\(\);\s*\}', replacement.strip(), content, flags=re.DOTALL)

# Fix the catch block below
catch_replacement = """
      } catch (err: any) {
        console.error(err);
        if (err.message?.includes("CRITICAL_FAIL")) {
           setErrorMsg(`Tech Error: ${err.message}. If password is correct, your browser cannot decrypt this.`);
        } else if (err.message?.includes("Invalid password") || err.message?.includes("encrypted")) {
           setErrorMsg("Incorrect password. Please enter the correct password to unlock this PDF.");
        } else {
           setErrorMsg(`Error processing PDF: ${err.message}`);
        }
      } finally {
"""

content = re.sub(r'\} catch \(err: any\) \{.*\} finally \{', catch_replacement.strip(), content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected advanced error logging")
