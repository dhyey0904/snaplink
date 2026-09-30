import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# We have:
# {/* Tool Category 1 */} (PDF Utilities)
# {/* Tool Category 2 */} (Image Converters)
# {/* Tool Category 3 */} (File Security)

# I will use split to get the exact blocks, then swap them.
parts = c.split('{/* Tool Category 2 */}')
if len(parts) == 2:
    part1 = parts[0]
    part2_and_rest = parts[1]
    
    # In part1, let's find {/* Tool Category 1 */}
    cat1_split = part1.split('{/* Tool Category 1 */}')
    if len(cat1_split) == 2:
        before_cat1 = cat1_split[0]
        cat1_block = cat1_split[1]
        
        # In part2_and_rest, let's find {/* Tool Category 3 */}
        cat3_split = part2_and_rest.split('{/* Tool Category 3 */}')
        if len(cat3_split) == 2:
            cat2_block = cat3_split[0]
            after_cat2 = '{/* Tool Category 3 */}' + cat3_split[1]
            
            # Now reconstruct with Tool Category 2 before Tool Category 1
            # But let's rename the comments so they are correct!
            new_cat1_block = cat2_block.strip() + '\n                '
            new_cat2_block = cat1_block.strip() + '\n                '
            
            new_c = before_cat1 + '{/* Tool Category 1 */}\n                ' + new_cat1_block + '\n                {/* Tool Category 2 */}\n                ' + new_cat2_block + '\n                ' + after_cat2
            
            with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
                f.write(new_c)
            print("Successfully swapped")
        else:
            print("Could not find Tool Category 3")
    else:
        print("Could not find Tool Category 1")
else:
    print("Could not find Tool Category 2")

