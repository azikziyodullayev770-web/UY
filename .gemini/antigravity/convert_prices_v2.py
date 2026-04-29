import re
import random

def convert_price(match, index):
    price_str = match.group(1)
    
    # Specific logic requested by user
    if index == 0:
        mln_price = 120
    elif index == 1:
        mln_price = 110
    else:
        # Others in 300-400 or 500-600 range
        if random.random() > 0.5:
            mln_price = random.randint(300, 450)
        else:
            mln_price = random.randint(500, 650)
    
    formatted = f"{mln_price} mln so'm"
    return f'"price": "{formatted}"'

file_path = r"c:\Users\USER\Downloads\UY JOY SOTISH VA SOTIB OLISH\src\app\context\qashqadaryoData.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Match anything in price quotes
matches = list(re.finditer(r'"price":\s*"([^"]+)"', content))
new_content = content
offset = 0

for i, match in enumerate(matches):
    replacement = convert_price(match, i)
    start = match.start() + offset
    end = match.end() + offset
    new_content = new_content[:start] + replacement + new_content[end:]
    offset += len(replacement) - (end - start)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Conversion complete.")
