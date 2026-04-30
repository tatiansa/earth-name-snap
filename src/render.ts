import sharp from "sharp";
import { pickAsset } from "./landsat.js";

const WIDTH = 960;
const HEIGHT = 540;
const SIDE_PADDING = 48;
const TILE_GAP = 14;
const MAX_TILE_W = 110;
const TILE_ASPECT = 2.6; // height / width — узкие вертикальные плитки

const imageCache = new Map<string, Buffer>();
const outputCache = new Map<string, Buffer>();

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fallbackTile(letter: string, width: number, height: number): Buffer {
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f766e"/>
        <stop offset="1" stop-color="#172554"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="54%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.floor(height * 0.45)}" font-weight="700" fill="#ffffff">${escapeXml(letter)}</text>
  </svg>`;
  return Buffer.from(svg);
}

async function fetchImage(url: string): Promise<Buffer> {
  const cached = imageCache.get(url);
  if (cached) return cached;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "earth-name-snap/0.1 (+https://farcaster.xyz)"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  imageCache.set(url, buffer);
  return buffer;
}

async function makeTile(letter: string, seed: number, index: number, width: number, height: number): Promise<Buffer> {
  const asset = pickAsset(letter, seed, index);
  if (!asset) return fallbackTile(letter, width, height);

  try {
    const original = await fetchImage(asset.url);
    return sharp(original)
      .resize(width, height, { fit: "cover", position: "center" })
      .png()
      .toBuffer();
  } catch {
    return sharp(fallbackTile(letter, width, height)).png().toBuffer();
  }
}

export async function renderWordImage(word: string, seed: number): Promise<Buffer> {
  const cacheKey = `${word}:${seed}`;
  const cached = outputCache.get(cacheKey);
  if (cached) return cached;

  const chars = word.split("");
  const visibleLetters = chars.filter((char) => /[A-Z]/.test(char));
  const n = Math.max(1, visibleLetters.length);

  // Адаптивный размер плитки: уменьшаем для длинных слов
  const availW = WIDTH - SIDE_PADDING * 2;
  const tileW = Math.floor(Math.min(MAX_TILE_W, (availW - (n - 1) * TILE_GAP) / n));
  const tileH = Math.round(tileW * TILE_ASPECT);

  // Центрируем по горизонтали и вертикали
  const gridW = n * tileW + (n - 1) * TILE_GAP;
  const startX = Math.round((WIDTH - gridW) / 2);
  const startY = Math.round((HEIGHT - tileH) / 2) - 10;

  const baseSvg = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="20%" r="85%">
        <stop offset="0" stop-color="#19324a"/>
        <stop offset="0.5" stop-color="#07111f"/>
        <stop offset="1" stop-color="#02040a"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <text x="${WIDTH - SIDE_PADDING}" y="${HEIGHT - 24}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="14" font-style="italic" fill="#94a3b8" letter-spacing="1">USGS / NASA Landsat</text>
  </svg>`;

  const composites: sharp.OverlayOptions[] = [];
  let visibleIndex = 0;
  for (const char of chars) {
    if (!/[A-Z]/.test(char)) continue;
    const x = startX + visibleIndex * (tileW + TILE_GAP);
    const tile = await makeTile(char, seed, visibleIndex, tileW, tileH);
    composites.push({ input: tile, left: x, top: startY });
    visibleIndex += 1;
  }

  const output = await sharp(Buffer.from(baseSvg))
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toBuffer();

  outputCache.set(cacheKey, output);
  return output;
}
