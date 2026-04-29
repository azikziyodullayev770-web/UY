const https = require('https');

const imageIds = [
  '1512917774080-9991f1c4c750',
  '1600596542815-ffad4c1539a9',
  '1580587771525-78b9dba3b914',
  '1518780664697-5b01f4af85d4',
  '1568605114967-8130f3a36994',
  '1570129477490-2370150b07a5',
  '1600607686527-6fb886090705',
  '1605146768851-bc01201d1c1a',
  '1600566753086-00f18fb6b3ea',
  '1583608205776-bfd35f0d9f83',
  '1564013799919-ab600027ffc6',
  '1572120360610-d971b9d7767c',
  '1576941088061-3920d4023f03',
  '1582268611958-ebfd161ef9cf',
  '1584622650111-993a426fbf0a',
  '1588880331179-aca9b15243fb',
  '1591474200742-8e512e6f98f8',
  '1592595896616-c3716229b441',
  '1598228725457-3f8af0d3b6f0',
  '1599809275671-55e14ecda06e',
  '1600585154340-be6161a56a0c' // known good
];

async function checkUrl(id) {
  return new Promise((resolve) => {
    https.get(`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`, (res) => {
      resolve({ id, status: res.statusCode });
    }).on('error', () => resolve({ id, status: 500 }));
  });
}

async function run() {
  for (const id of imageIds) {
    const result = await checkUrl(id);
    console.log(`${result.id}: ${result.status}`);
  }
}

run();
