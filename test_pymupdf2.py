import pymupdf
doc = pymupdf.open()
doc.new_page()
kwargs = {"garbage": 4, "deflate": True, "deflate_images": True, "deflate_fonts": True}
doc.save("test.pdf", **kwargs)
print("saved successfully")
