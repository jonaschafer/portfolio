# Figma export and image quality

How to export from Figma and use images so they stay sharp on the site (e.g. portfolio work, homepage carousel).

## Export from Figma

1. **Resolution**
   - Export at **2x** for retina. In Figma: select frame/asset → Export → set scale to **2x** (or 1.5x–2x depending on max display size).
   - For full-bleed hero/carousel images that fill the viewport, export at **2x** and at a width that matches your largest breakpoint (e.g. 1920px or 2400px wide at 2x = 3840px or 4800px). Next.js will resize down; having a sharp 2x source avoids blur.

2. **Format**
   - **PNG** for UI, screens, and anything with type or sharp edges. Use PNG-24 (no palette).
   - **JPG** only for photos or very soft imagery; use quality 85–90 in Figma (Export settings) to limit blur from compression.
   - **WebP** is ideal for the web; you can export as PNG from Figma then convert to WebP with a script or tool (see below).

3. **Export settings in Figma**
   - Scale: **2x**
   - Format: **PNG** (or JPG at 85–90 for photos)
   - Name files consistently (e.g. `project-1.png`, `project-2.png`).

## Compressing without losing sharpness

- **Next.js** already optimizes images (resize + compression). The app uses `quality={90}` for portfolio images so they stay sharp; default is 75.
- **Before adding to the repo**: run exports through a compressor that keeps detail:
  - **Squoosh** (squoosh.app): Open PNG/JPG → choose WebP or “Resize” to cap width → adjust “Quality” (e.g. 85–90). Good balance of size vs sharpness.
  - **Sharp (CLI)** for batch:
    ```bash
    npx sharp-cli -i public/images/**/*.png -o public/images -f webp -q 90
    ```
  - Or keep PNG and rely on Next.js: put high-res PNGs in `public/images/...` and use the Next `<Image>` component with `quality={90}` and `sizes="100vw"` (or appropriate sizes). Next will serve WebP/AVIF when the browser supports it.

## In this project

- Work images live under `public/images/<project-folder>/`.
- **Next.js Image** is used with `quality={90}` on the homepage carousel and can be set the same elsewhere.
- GIFs are used as-is with `unoptimized` so animation is preserved.
- For new work: export from Figma at **2x**, PNG (or JPG 85–90 for photos), then add to the right folder. Update the main Work page data and the homepage carousel list in `components/HomeCarousel.js` (HOME_MEDIA) if the piece appears there.

## Quick checklist

- [ ] Export at **2x** in Figma.
- [ ] Use **PNG** for UI/screens, **JPG 85–90** only for photos.
- [ ] Optionally compress with Squoosh (WebP, quality 85–90) before or rely on Next.js.
- [ ] Use `<Image quality={90} … />` (and sensible `sizes`) so the optimized output stays sharp.
