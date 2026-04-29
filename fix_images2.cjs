const fs = require('fs');
const path = './src/app/context/qashqadaryoData.ts';
let content = fs.readFileSync(path, 'utf8');

const validImages = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  'https://images.unsplash.com/photo-1600607686527-6fb886090705',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
  'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
];

let index = 0;
// Replace 'image': ...
content = content.replace(/"image":\s*"https:\/\/images\.unsplash\.com\/photo-[^"]+"/g, () => {
  const img = validImages[index % validImages.length] + '?auto=format&fit=crop&w=800&q=80';
  index++;
  return '"image": "' + img + '"';
});

index = 0;
// Replace 'images': [...]
content = content.replace(/"images":\s*\["https:\/\/images\.unsplash\.com\/photo-[^"]+"\]/g, () => {
  const img = validImages[index % validImages.length] + '?auto=format&fit=crop&w=800&q=80';
  index++;
  return '"images": ["' + img + '"]';
});

fs.writeFileSync(path, content);
console.log('Fixed broken Unsplash images successfully!');
