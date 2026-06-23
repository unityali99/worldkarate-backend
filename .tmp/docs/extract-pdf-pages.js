const fs = require('fs');
const path = require('path');

const input = process.argv[2];
const output = process.argv[3];
fs.mkdirSync(output, { recursive: true });
const data = fs.readFileSync(input);
let offset = 0;
let page = 0;

while (true) {
  const marker = data.indexOf(Buffer.from('/Filter /DCTDecode'), offset);
  if (marker < 0) break;
  const stream = data.indexOf(Buffer.from('stream\n'), marker) + 7;
  const end = data.indexOf(Buffer.from('\nendstream'), stream);
  if (stream < 7 || end < 0) throw new Error('Malformed image stream');
  page += 1;
  fs.writeFileSync(path.join(output, `page-${String(page).padStart(2, '0')}.jpg`), data.subarray(stream, end));
  offset = end + 10;
}

console.log(`Extracted ${page} pages`);
