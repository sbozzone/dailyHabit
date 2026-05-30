import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('./pwa/icons', { recursive: true });

// SVG: cream background, gold ✦ centered
function makeSvg(size) {
  const fontSize = Math.round(size * 0.48);
  const radius = Math.round(size * 0.22);
  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${radius}" fill="#FAF8F5"/>
      <text
        x="50%"
        y="52%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="${fontSize}"
        fill="#A07830"
      >✦</text>
    </svg>
  `);
}

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
];

for (const { name, size } of sizes) {
  await sharp(makeSvg(size))
    .png()
    .toFile(`./pwa/icons/${name}`);
  console.log(`✓ pwa/icons/${name}`);
}

console.log('Icons generated.');
