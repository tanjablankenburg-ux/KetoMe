// Erstellt PNG-Icons aus SVG mit reinem Node.js (kein sharp nötig)
import { createCanvas } from 'canvas';
import fs from 'fs';

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size / 512;

  // Hintergrund
  ctx.fillStyle = '#0a0a0a';
  roundRect(ctx, 0, 0, size, size, 80 * s);
  ctx.fill();

  // Grüner Kreis (Glow)
  ctx.fillStyle = 'rgba(34,197,94,0.12)';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 200 * s, 0, Math.PI * 2);
  ctx.fill();

  // Avocado Außen
  ctx.fillStyle = '#22c55e';
  ellipse(ctx, size/2, 230*s, 90*s, 120*s);
  ctx.fill();

  // Avocado Innen
  ctx.fillStyle = '#166534';
  ellipse(ctx, size/2, 255*s, 55*s, 75*s);
  ctx.fill();

  // Kern
  ctx.fillStyle = '#0a1a0a';
  ellipse(ctx, size/2, 268*s, 30*s, 40*s);
  ctx.fill();

  // Text
  ctx.fillStyle = '#22c55e';
  ctx.font = `900 ${58*s}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KM', size/2, 420*s);

  return canvas.toBuffer('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function ellipse(ctx, cx, cy, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.closePath();
}

fs.writeFileSync('public/icon-192.png', drawIcon(192));
fs.writeFileSync('public/icon-512.png', drawIcon(512));
console.log('Icons erstellt!');
