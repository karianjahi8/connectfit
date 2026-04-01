

# Plan: Generate FitConnect Logo

## Overview
Use the AI image generation skill to create a logo matching the "Athletic Futurism" brand identity — deep navy/black base with Electric Lime and Cyan accents, combining fitness and blockchain visual elements.

## Steps

1. **Generate the logo** using `google/gemini-3-pro-image-preview` (higher quality model) with a detailed prompt incorporating:
   - Dumbbell/fitness iconography fused with blockchain node/chain motifs
   - Color palette: Deep navy (#0A0E1A), Electric Lime (#BFFF00), Cyan (#00E5FF)
   - Clean, modern, minimal style suitable for app header and PWA icon
   - Transparent-friendly design on dark background

2. **QA the output** — inspect the generated image for quality, legibility, and brand alignment.

3. **Integrate into the project**:
   - Save to `public/` directory
   - Update `index.html` favicon reference
   - Update the Header component logo area to use the generated image
   - Update PWA manifest icons (`pwa-192.svg`, `pwa-512.svg`)

## Technical Details
- Uses Lovable AI Gateway's image generation endpoint via the `lovable_ai.py` script
- Output saved to `/mnt/documents/fitconnect-logo.png` for review, then copied into the project

