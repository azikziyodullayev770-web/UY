import re

def convert_price(match):
    price_str = match.group(1).replace('$', '').replace(',', '')
    price_val = float(price_str)
    # Rate: 1 USD = 12,800 UZS
    # Price in mln UZS = (Price in USD * 12800) / 1,000,000
    mln_price = (price_val * 12800) / 1000000
    
    # Format to look like "1 536 mln so'm" or "640 mln so'm"
    if mln_price == int(mln_price):
        formatted = f"{int(mln_price):,} mln so'm".replace(',', ' ')
    else:
        formatted = f"{mln_price:,.1f} mln so'm".replace(',', ' ')
    
    return f'"price": "{formatted}"'

file_path = r"c:\Users\USER\Downloads\UY JOY SOTISH VA SOTIB OLISH\src\app\context\qashqadaryoData.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace prices
new_content = re.sub(r'"price":\s*"(\$[^"]+)"', convert_price, content)

# Replace currency
new_content = new_content.replace('"currency": "USD"', '"currency": "UZS"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Conversion complete.")
