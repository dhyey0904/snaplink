import re

with open('backend/app/api/image.py', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = """        if mode == 'target' and target_size_kb:
            target_bytes = target_size_kb * 1024
            
            if target_fmt == 'PNG':
                # PNG uses color quantization (2 to 256 colors) for lossy compression
                low, high = 2, 256
                best_val = 256
            else:
                # JPEG/WEBP use quality (10 to 95)
                low, high = 10, 95
                best_val = 80
                
            for _ in range(7):
                mid = (low + high) // 2
                temp_buf = io.BytesIO()
                
                if target_fmt == 'PNG':
                    temp_img = img.convert('P', palette=Image.ADAPTIVE, colors=mid)
                    temp_img.save(temp_buf, format='PNG', optimize=True)
                else:
                    img.save(temp_buf, format=target_fmt, quality=mid, optimize=True)
                
                size = temp_buf.tell()
                if size <= target_bytes:
                    best_buffer = temp_buf
                    best_val = mid
                    # If we are small enough, try going higher (better quality/colors)
                    low = mid + 1
                else:
                    # If we are too big, go lower
                    high = mid - 1
            
            if best_buffer.tell() == 0:
                # If we couldn't get it small enough, just use the lowest possible settings
                if target_fmt == 'PNG':
                    img.convert('P', palette=Image.ADAPTIVE, colors=2).save(best_buffer, format='PNG', optimize=True)
                    best_val = 2
                else:
                    img.save(best_buffer, format=target_fmt, quality=10, optimize=True)
                    best_val = 10
            quality = best_val"""

# Replace the old binary search
c = re.sub(
    r"if mode == 'target' and target_size_kb:.*?quality = best_q",
    replacement,
    c,
    flags=re.DOTALL
)

with open('backend/app/api/image.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated PNG compression logic")
