// ─── Core garment types ───────────────────────────────────────────────────────

export type FiberType = 'natural' | 'synthetic' | 'recycled' | 'semi-synthetic'

export interface Material {
  name: string           // e.g. "Cotton", "Polyester"
  percentage: number     // 0–100
  fiberType: FiberType
}

export type GarmentCategory =
  | 't-shirt'
  | 'hoodie'
  | 'dress'
  | 'shirt'
  | 'jacket'
  | 'jeans'
  | 'skirt'
  | 'pants'
  | 'other'

export type MicroplasticRisk = 'none' | 'low' | 'medium' | 'high'

export interface Garment {
  id: string
  name: string
  category: GarmentCategory
  materials: Material[]
  countryOfOrigin: string
  imageUrl?: string           // optional product image
  estimatedRetailPrice?: number  // USD, optional
  tags?: string[]             // e.g. ['fast fashion', 'certified organic']
}

// ─── Impact calculations ──────────────────────────────────────────────────────

export interface GarmentImpact {
  garmentId: string
  waterUsageLiters: number     // total water footprint
  carbonKg: number             // total CO₂e in kg
  microplasticRisk: MicroplasticRisk
  durabilityWears: number      // estimated full life wears
  impactPerWear: number        // carbon kg / durabilityWears
  transportLabel: string       // e.g. "Long-haul (Asia → EU/US)"
  durabilityScore: number      // 1–10 visual score
  syntheticPercent: number     // % of synthetic fibers
}

// ─── Wardrobe ─────────────────────────────────────────────────────────────────

export interface WardrobeItem {
  id: string
  garment: Garment
  impact: GarmentImpact
  savedAt: string   // ISO date string
  wornCount: number
}

// ─── Comparison ───────────────────────────────────────────────────────────────

export interface ComparisonResult {
  itemA: WardrobeItem
  itemB: WardrobeItem
  winner: 'a' | 'b' | 'tie'
  waterDiffPercent: number
  carbonDiffPercent: number
}
