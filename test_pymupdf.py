import pymupdf
doc = pymupdf.open()
doc.new_page()
kwargs = {"garbage": 4, "deflate": True, "deflate_images": True, "clean": True, "linear": True}
doc.save("test.pdf", **kwargs)
print("saved successfully")
