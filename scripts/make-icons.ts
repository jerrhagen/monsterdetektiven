// Makes the home-screen icons (public/*.png) from Nora's pixel sprite.
// Run with: node scripts/make-icons.ts
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { nora } from "../src/sprites/nora.ts";

const BACKGROUND = [0x23, 0x17, 0x36];

function hex(c: string): number[] {
  const n = Number.parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Buffer): number {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** An RGB PNG of the given size: Nora standing in the middle of a dark purple square. */
function icon(size: number): Buffer {
  const frame = nora.frames[0];
  const w = frame[0].length;
  const h = frame.length;
  const scale = Math.floor((size * 0.78) / h);
  const left = Math.floor((size - w * scale) / 2);
  const top = Math.floor((size - h * scale) / 2);
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0; // no filter
    for (let x = 0; x < size; x++) {
      const sx = Math.floor((x - left) / scale);
      const sy = Math.floor((y - top) / scale);
      const ch = sx >= 0 && sx < w && sy >= 0 && sy < h ? frame[sy][sx] : ".";
      const colour = nora.palette[ch];
      const [r, g, b] = colour ? hex(colour) : BACKGROUND;
      const i = y * (size * 3 + 1) + 1 + x * 3;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]] as const) {
  writeFileSync(new URL(`../public/${name}`, import.meta.url), icon(size));
  console.log(`public/${name}`);
}
