# Earth Name Snap

A Farcaster Snap MVP inspired by NASA's **Your Name in Landsat** interactive.

Flow:

1. User opens the Snap in Farcaster.
2. User types a name or handle.
3. The server returns a generated 16:9 PNG spelling the word with real Landsat letter images.
4. User can regenerate, share a cast, start over, or open the original NASA tool.

This is an unofficial experiment. Do not use NASA logos or imply NASA endorsement. Keep the attribution: `Imagery source: USGS/NASA Landsat`.

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Local URL:

```txt
http://localhost:3003
```

For a real Farcaster preview, the Snap URL should be public and HTTPS. Deploy to Vercel or use a tunnel such as ngrok/cloudflared while testing.

## Test JSON response

```bash
curl -sS -H 'Accept: application/vnd.farcaster.snap+json' http://localhost:3003/
```

## Test generated image

```bash
open 'http://localhost:3003/image?word=TATIANA&seed=1'
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Add environment variable:

```txt
SNAP_PUBLIC_BASE_URL=https://your-vercel-project.vercel.app
```

No trailing slash.

4. Deploy.
5. Test:

```bash
curl -sS -H 'Accept: application/vnd.farcaster.snap+json' https://your-vercel-project.vercel.app/
```

6. Open the Farcaster Snap emulator and load the deployed URL:

```txt
https://farcaster.xyz/~/developers/snaps
```

## Files

- `src/index.ts` - Snap UI and routes
- `src/render.ts` - PNG renderer using `sharp`
- `src/landsat.ts` - Landsat letter assets and word normalization

## Notes

- Current MVP supports A-Z and spaces, max 12 characters.
- The image route caches generated PNGs in memory for warm server instances.
- If a remote asset cannot be fetched, the renderer falls back to a simple letter tile.
