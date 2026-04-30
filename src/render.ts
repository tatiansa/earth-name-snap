import sharp from "sharp";
import { pickAsset } from "./landsat.js";

const WIDTH = 960;
const HEIGHT = 540;

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

    <text
      x="50%"
      y="54%"
      text-anchor="middle"
      font-family="sans-serif"
      font-size="${Math.floor(height * 0.45)}"
      font-weight="700"
      fill="#ffffff"
    >
      ${escapeXml(letter)}
    </text>
  </svg>`;

  return Buffer.from(svg);
}

async function fetchImage(url: string): Promise<Buffer> {
  const cached = imageCache.get(url);
  if (cached) return cached;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "earth-name-snap/0.1 (+https://farcaster.xyz)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  imageCache.set(url, buffer);
  return buffer;
}

async function makeTile(
  letter: string,
  seed: number,
  index: number,
  width: number,
  height: number
): Promise<Buffer> {
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

  const rows = visibleLetters.length > 6 ? 2 : 1;
  const cols = Math.min(6, Math.max(1, visibleLetters.length));

  const gap = 10;
  const tileW = rows === 1 ? 126 : 112;
  const tileH = rows === 1 ? 318 : 204;
  const rowGap = rows === 1 ? 0 : 18;

  const totalGridH = rows * tileH + (rows - 1) * rowGap;

  const baseSvg = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="18%" r="80%">
        <stop offset="0" stop-color="#19324a"/>
        <stop offset="0.45" stop-color="#07111f"/>
        <stop offset="1" stop-color="#02040a"/>
      </radialGradient>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg)"/>
  </svg>`;

  const composites: sharp.OverlayOptions[] = [];

  let visibleIndex = 0;

  for (const char of chars) {
    if (!/[A-Z]/.test(char)) continue;

    const row = Math.floor(visibleIndex / 6);
    const col = visibleIndex % 6;

    const rowCount =
      row === rows - 1
        ? visibleLetters.length - row * 6
        : cols;

    const rowW = rowCount * tileW + (rowCount - 1) * gap;
    const x = Math.round((WIDTH - rowW) / 2 + col * (tileW + gap));
    const y = Math.round((HEIGHT - totalGridH) / 2 + row * (tileH + rowGap));

    const tile = await makeTile(char, seed, visibleIndex, tileW, tileH);
    composites.push({ input: tile, left: x, top: y });

    visibleIndex += 1;
  }

  const output = await sharp(Buffer.from(baseSvg))
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toBuffer();

  outputCache.set(cacheKey, output);
  return output;
}
