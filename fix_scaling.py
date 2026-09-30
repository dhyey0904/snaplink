import re

with open('backend/app/api/image.py', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = """        if mode == 'target' and target_size_kb:
            target_bytes = target_size_kb * 1024
            
            # Start with full scale
            scale_factor = 1.0
            best_val = 80
            
            if target_fmt == 'PNG':
                low, high = 16, 256 # Don't go below 16 colors to prevent terrible look
                best_val = 256
            else:
                low, high = 10, 95
                best_val = 80
                
            for _ in range(7):
                mid = (low + high) // 2
                temp_buf = io.BytesIO()
                
                # If target is very small and we are struggling, we might need to reduce scale
                current_img = img
                if scale_factor < 1.0:
                    new_w = int(img.width * scale_factor)
                    new_h = int(img.height * scale_factor)
                    current_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

                if target_fmt == 'PNG':
                    # Use better quantization method
                    temp_img = current_img.quantize(colors=mid, method=Image.Quantize.FASTOCTREE)
                    temp_img.save(temp_buf, format='PNG', optimize=True)
                else:
                    current_img.save(temp_buf, format=target_fmt, quality=mid, optimize=True)
                
                size = temp_buf.tell()
                if size <= target_bytes:
                    best_buffer = temp_buf
                    best_val = mid
                    low = mid + 1
                    # We hit the target, we can slightly increase scale if we dropped it too much
                else:
                    high = mid - 1
                    # If we are failing even at low bounds, drop the scale
                    if (target_fmt == 'PNG' and mid <= 64) or (target_fmt != 'PNG' and mid <= 30):
                        scale_factor *= 0.8
            
            if best_buffer.tell() == 0:
                # Still failed? Just force it extremely low with max scale down
                if target_fmt == 'PNG':
                    img.resize((int(img.width * 0.5), int(img.height * 0.5))).quantize(colors=16).save(best_buffer, format='PNG', optimize=True)
                    best_val = 16
                else:
                    img.resize((int(img.width * 0.5), int(img.height * 0.5))).save(best_buffer, format=target_fmt, quality=10, optimize=True)
                    best_val = 10
            quality = best_val"""

c = re.sub(
    r"        if mode == 'target' and target_size_kb:.*?quality = best_val",
    replacement,
    c,
    flags=re.DOTALL
)

with open('backend/app/api/image.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated target size logic with dynamic scaling")
