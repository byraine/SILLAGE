# SILLAGE — Fashion Impact Scanner

> *Sillage (n.) — the scent trail left in the air after someone has passed.*

A concept portfolio demo exploring the invisible environmental and human cost of fashion.
SILLAGE is an AI-assisted garment impact scanner built as an immersive, editorial design demo.

---

## Concept

Every garment carries a hidden story — water consumed, carbon emitted, microplastics released,
and hands that made it. SILLAGE makes that story visible through a speculative "AI scanner"
interface that calculates and contextualises the full lifecycle impact of what we wear.

This is a **design portfolio demo** — built to showcase immersive UI, data storytelling,
and sustainable fashion as a design research area. All impact figures are educational estimates.

---

## Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## Add Your Videos

Place your video files in `/public/videos/`:

| File | Used on |
|------|---------|
| `hero.mp4` | Landing page hero background (autoplay, loop, muted) |
| `garments.mp4` | Scan loading animation background |
| `water.mp4` | Water impact section on Results page |
| `carbo.mp4` | Carbon impact section on Results page |
| `impact.mp4` | Impact / storytelling page hero |

Place your logo in `/public/images/logo.png`.
Place the labour background image at `/public/images/labor.png`.

All videos use a dark gradient overlay for text readability.
If a video fails to load, a CSS gradient fallback is shown automatically.

---

## Feature Overview

### 1. Landing Page (`/`)
- Full-viewport video hero with poetic headline
- Stats on fashion's global environmental footprint
- "How it works" section
- Two CTAs: Start Scan + View Example

### 2. Scan Page (`/scan`)
- Choose from 5 preset garments or upload a photo placeholder
- Animated scan sequence with progress indicator (uses `garments.mp4`)
- Scan-complete confirmation before navigating to results

### 3. Results Page (`/results`)
- Material composition with colour-coded fiber tags
- Core impact metrics: water, carbon, microplastics, durability
- Interactive "impact per wear" slider — shows how wearing more reduces footprint
- Water story section with `water.mp4` background
- Carbon story section with `carbo.mp4` background
- Labour context (country-specific, framed as awareness not accusation)
- "Why it matters" + "How to reduce impact"
- Methodology modal (transparency about how estimates work)
- Save to wardrobe

### 4. Wardrobe Page (`/wardrobe`)
- All saved garments with quick metrics
- Cumulative water + carbon totals
- Side-by-side comparison mode (select any 2 garments)
- Comparison table highlights the lower-impact option per metric
- Wardrobe persists via localStorage

### 5. Impact Page (`/impact`)
- Video hero with `impact.mp4`
- Full wardrobe summary card with contextual equivalences
- Five expandable action prompts
- Closing editorial quote
- Disclaimer

---

## Mock Garments

| Garment | Materials | Origin |
|---------|-----------|--------|
| 100% Cotton T-Shirt | 100% Cotton | Haiti |
| Cotton/Poly Hoodie | 80% Cotton, 20% Polyester | Vietnam |
| 100% Polyester Dress | 100% Polyester | China |
| Linen Shirt | 100% Linen | Portugal |
| Recycled Cotton Denim Jacket | 100% Recycled Cotton | Turkey |

---

## Calculation Logic

All calculations live in `src/utils/calculations.ts` with clearly named, editable coefficients.

### Water Usage
`water = garment_weight_kg × blended_water_coefficient_L/kg`

Water coefficients per fiber (L/kg):
- Cotton: 10,000 — Linen: 6,000 — Polyester: 500 — Recycled Cotton: 500

### Carbon Footprint
`carbon = (blended_fiber_carbon × weight_kg × transport_multiplier) + care_phase`

Transport multiplier reflects shipping distance: Portugal ~1.05, China ~1.65.
A fixed 0.5 kg CO₂e is added for consumer care phase.

### Microplastic Risk
Triggered by polyester, nylon, or acrylic content:
- 0% synthetic → None
- 1–24% → Low
- 25–59% → Medium
- 60%+ → High

### Durability & Impact Per Wear
Estimated wears by category (e.g. t-shirt: 60, jacket: 100).
Natural fibers +10% bonus; mostly-synthetic −15% penalty.
Impact per wear = total carbon ÷ estimated wears.

### Improved Impact Per Wear
`improved = carbon ÷ (estimated_wears + extra_wears)`

Controlled by an interactive slider on the Results page.

---

## Disclaimer

**SILLAGE is a concept portfolio demo.** All impact figures shown are simplified
educational estimates — not scientifically validated for individual garments.
Real-world impact varies significantly across supply chains, factories, dye chemistry,
and consumer behaviour. Do not cite these numbers as research data.

Reference sources consulted for coefficient ranges:
- Mekonnen & Hoekstra (2011) — Water footprint of crop and animal products
- WRAP Clothing in the Modern World Lifecycle Assessment (2017)
- Boucher & Friot (2017) — IUCN Primary Microplastics in the Oceans
- Ellen MacArthur Foundation — A New Textiles Economy (2017)

---

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 3
- React Router 6
- localStorage for wardrobe persistence
- No backend, no API calls, no real AI

---

*Built as a concept demo for a design/master's portfolio.*
