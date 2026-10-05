import requests

url = "https://snaplink-x8i6.onrender.com/api/tools/compress-pdf"
# Create a dummy tiny PDF
pdf_content = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"

files = {'file': ('test.pdf', pdf_content, 'application/pdf')}
data = {'level': 'recommended'}

try:
    print("Testing compress-pdf API...")
    r = requests.post(url, files=files, data=data)
    print("Status:", r.status_code)
    if r.status_code != 200:
        print("Response:", r.text)
    else:
        print("Success! Size:", len(r.content))
except Exception as e:
    print("Error:", e)
