import type { Garment } from '../types/fashion'

// ─── Preset garments for demo / scan selection ───────────────────────────────
// These are educational mock examples — not brand-affiliated.

export const PRESET_GARMENTS: Garment[] = [
  {
    id: 'g-001',
    name: '100% Cotton T-Shirt',
    category: 't-shirt',
    materials: [{ name: 'Cotton', percentage: 100, fiberType: 'natural' }],
    countryOfOrigin: 'Haiti',
    tags: ['cotton', 'basics', 'everyday'],
  },
  {
    id: 'g-002',
    name: 'Cotton/Poly Hoodie',
    category: 'hoodie',
    materials: [
      { name: 'Cotton', percentage: 80, fiberType: 'natural' },
      { name: 'Polyester', percentage: 20, fiberType: 'synthetic' },
    ],
    countryOfOrigin: 'Vietnam',
    tags: ['blended', 'casual'],
  },
  {
    id: 'g-003',
    name: '100% Polyester Dress',
    category: 'dress',
    materials: [{ name: 'Polyester', percentage: 100, fiberType: 'synthetic' }],
    countryOfOrigin: 'China',
    tags: ['synthetic', 'fast fashion'],
  },
  {
    id: 'g-004',
    name: 'Linen Shirt',
    category: 'shirt',
    materials: [{ name: 'Linen', percentage: 100, fiberType: 'natural' }],
    countryOfOrigin: 'Portugal',
    tags: ['linen', 'sustainable', 'european made'],
  },
  {
    id: 'g-005',
    name: 'Recycled Cotton Denim Jacket',
    category: 'jacket',
    materials: [{ name: 'Recycled Cotton', percentage: 100, fiberType: 'recycled' }],
    countryOfOrigin: 'Turkey',
    tags: ['recycled', 'denim', 'outerwear'],
  },
]

// ─── Country transport context labels ────────────────────────────────────────

export const TRANSPORT_LABELS: Record<string, string> = {
  Haiti: 'Caribbean → US/EU (long-haul)',
  Vietnam: 'Southeast Asia → Global (long-haul)',
  China: 'East Asia → Global (long-haul)',
  Portugal: 'Southern Europe → EU (regional)',
  Turkey: 'Near East → EU (regional)',
  Bangladesh: 'South Asia → Global (long-haul)',
  India: 'South Asia → Global (long-haul)',
  'Sri Lanka': 'South Asia → Global (long-haul)',
  Morocco: 'North Africa → EU (regional)',
  Cambodia: 'Southeast Asia → Global (long-haul)',
}

// ─── Labor & care context per country ────────────────────────────────────────
// Framed as context, not accusation — for storytelling purposes.

export const LABOR_CONTEXT: Record<string, string> = {
  Haiti:
    'Haiti is one of the least regulated garment-producing countries. Workers often earn below $10/day in export processing zones, with limited labor protections.',
  Vietnam:
    'Vietnam is a major global garment exporter. While labor laws exist, enforcement is inconsistent and many workers rely on overtime to meet basic needs.',
  China:
    'China produces roughly 40% of the world\'s textiles. Labor conditions vary significantly by region and factory tier. Overcapacity drives extreme pricing pressure.',
  Portugal:
    'Portugal is one of few EU countries with a significant fashion manufacturing base. Workers benefit from EU labor protections, higher minimum wages, and closer supply chain oversight.',
  Turkey:
    'Turkey has a large, well-established garment industry. EU proximity has driven higher labor standards in some tiers, though informality remains common in lower tiers.',
}
