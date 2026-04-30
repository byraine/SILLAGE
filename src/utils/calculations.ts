import type { Garment, GarmentImpact, Material, MicroplasticRisk } from '../types/fashion'

// ─────────────────────────────────────────────────────────────────────────────
// SILLAGE Impact Calculation Engine — Educational Estimates Only
//
// All values are simplified educational approximations derived from publicly
// available lifecycle assessment (LCA) literature. They are NOT scientifically
// validated for individual garments. Real-world impact varies significantly by
// factory, supply chain, dye chemistry, and consumer behaviour.
//
// Sources consulted (for reference, not precision):
//   • Water: Mekonnen & Hoekstra (2011) water footprint research
//   • Carbon: WRAP Clothing Lifecycle (2012, updated 2017)
//   • Microplastics: Boucher & Friot (2017), IUCN report
// ─────────────────────────────────────────────────────────────────────────────

// ── Coefficients (editable) ──────────────────────────────────────────────────

/**
 * Water footprint in litres per kg of fiber.
 * Cotton is notoriously high; polyester is petrochemical (less water, more energy).
 */
export const WATER_LITERS_PER_KG: Record<string, number> = {
  Cotton: 10_000,
  'Organic Cotton': 6_000,
  'Recycled Cotton': 500,
  Polyester: 500,
  'Recycled Polyester': 125,
  Linen: 6_000,
  Wool: 8_000,
  Silk: 7_000,
  Nylon: 700,
  Acrylic: 600,
  Viscose: 3_500,
  Lyocell: 2_000,
  Modal: 2_500,
  Hemp: 2_700,
}

/**
 * Carbon footprint in kg CO₂e per kg of fiber (cradle to gate).
 */
export const CARBON_KG_PER_KG: Record<string, number> = {
  Cotton: 5.9,
  'Organic Cotton': 3.8,
  'Recycled Cotton': 1.8,
  Polyester: 9.5,
  'Recycled Polyester': 3.2,
  Linen: 1.7,
  Wool: 36.0,
  Silk: 35.0,
  Nylon: 7.2,
  Acrylic: 7.5,
  Viscose: 4.2,
  Lyocell: 2.3,
  Modal: 3.6,
  Hemp: 2.1,
}

/**
 * Estimated garment weight in kg (average, unwashed).
 */
export const GARMENT_WEIGHT_KG: Record<string, number> = {
  't-shirt': 0.18,
  hoodie: 0.55,
  dress: 0.32,
  shirt: 0.22,
  jacket: 0.85,
  jeans: 0.72,
  skirt: 0.25,
  pants: 0.45,
  other: 0.30,
}

/**
 * Transport carbon multiplier by country of origin.
 * Represents additional CO₂e burden from shipping to EU/US market.
 * Closer = lower multiplier.
 */
export const TRANSPORT_MULTIPLIER: Record<string, number> = {
  Haiti: 1.45,
  Vietnam: 1.60,
  China: 1.65,
  Portugal: 1.05,
  Turkey: 1.15,
  Bangladesh: 1.60,
  India: 1.55,
  'Sri Lanka': 1.58,
  Morocco: 1.12,
  Cambodia: 1.62,
}

/**
 * Estimated typical wears before disposal by category.
 * Based on Ellen MacArthur Foundation estimates.
 */
export const BASE_DURABILITY_WEARS: Record<string, number> = {
  't-shirt': 60,
  hoodie: 70,
  dress: 45,
  shirt: 65,
  jacket: 100,
  jeans: 90,
  skirt: 50,
  pants: 80,
  other: 55,
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Get the water coefficient for a material name, with a safe fallback. */
function waterCoeff(name: string): number {
  return WATER_LITERS_PER_KG[name] ?? 4_000  // fallback: average-ish blended
}

/** Get the carbon coefficient for a material name, with a safe fallback. */
function carbonCoeff(name: string): number {
  return CARBON_KG_PER_KG[name] ?? 5.0
}

/** Get the transport multiplier for a country, defaulting to mid-range. */
function transportMultiplier(country: string): number {
  return TRANSPORT_MULTIPLIER[country] ?? 1.45
}

// ── Core calculations ─────────────────────────────────────────────────────────

/**
 * Calculate the blended water usage in litres for the garment.
 * Accounts for material blend proportions and garment weight.
 */
export function calcWaterUsage(
  materials: Material[],
  category: string
): number {
  const weightKg = GARMENT_WEIGHT_KG[category] ?? 0.30
  const blendedCoeff = materials.reduce((sum, m) => {
    return sum + (m.percentage / 100) * waterCoeff(m.name)
  }, 0)
  return Math.round(blendedCoeff * weightKg)
}

/**
 * Calculate total estimated carbon footprint in kg CO₂e.
 * Includes manufacturing phase (fiber + fabric production) + transport.
 * A constant for consumer care (washing × durability) is added.
 */
export function calcCarbonFootprint(
  materials: Material[],
  category: string,
  countryOfOrigin: string
): number {
  const weightKg = GARMENT_WEIGHT_KG[category] ?? 0.30
  const blendedCoeff = materials.reduce((sum, m) => {
    return sum + (m.percentage / 100) * carbonCoeff(m.name)
  }, 0)

  const manufacturingCarbon = blendedCoeff * weightKg
  const transport = transportMultiplier(countryOfOrigin)
  // Simplified care carbon: ~0.5 kg CO₂e per year assuming average washing
  const careCarbon = 0.5

  return parseFloat((manufacturingCarbon * transport + careCarbon).toFixed(2))
}

/**
 * Determine microplastic shedding risk.
 * Triggered by any polyester, nylon, or acrylic content.
 */
export function calcMicroplasticRisk(materials: Material[]): MicroplasticRisk {
  const syntheticNames = ['Polyester', 'Nylon', 'Acrylic']
  const syntheticPct = materials
    .filter(m => syntheticNames.includes(m.name))
    .reduce((sum, m) => sum + m.percentage, 0)

  if (syntheticPct === 0) return 'none'
  if (syntheticPct < 25) return 'low'
  if (syntheticPct < 60) return 'medium'
  return 'high'
}

/** Calculate total % of synthetic fibers in the blend. */
export function calcSyntheticPercent(materials: Material[]): number {
  return materials
    .filter(m => m.fiberType === 'synthetic')
    .reduce((sum, m) => sum + m.percentage, 0)
}

/**
 * Calculate estimated durability in wears.
 * Natural fibers and recycled fibers get a slight bonus;
 * 100% synthetic gets a penalty due to pilling/quality.
 */
export function calcDurabilityWears(
  materials: Material[],
  category: string
): number {
  const base = BASE_DURABILITY_WEARS[category] ?? 55
  const syntheticPct = calcSyntheticPercent(materials)

  let multiplier = 1.0
  if (syntheticPct === 0) multiplier = 1.1        // all natural: slight bonus
  else if (syntheticPct >= 80) multiplier = 0.85  // mostly synthetic: penalty

  return Math.round(base * multiplier)
}

/**
 * Simple 1–10 durability score for display.
 */
export function calcDurabilityScore(wears: number): number {
  const max = 120
  return Math.min(10, Math.max(1, Math.round((wears / max) * 10)))
}

/**
 * Impact per wear = total carbon / estimated wears.
 */
export function calcImpactPerWear(carbonKg: number, wears: number): number {
  return parseFloat((carbonKg / wears).toFixed(4))
}

/**
 * Improved impact per wear if garment is worn `extraWears` more times.
 */
export function calcImprovedImpactPerWear(
  carbonKg: number,
  currentWears: number,
  extraWears: number
): number {
  return parseFloat((carbonKg / (currentWears + extraWears)).toFixed(4))
}

// ── Main entry point ──────────────────────────────────────────────────────────

/** Run all calculations for a garment and return a complete GarmentImpact object. */
export function calculateImpact(garment: Garment): GarmentImpact {
  const water = calcWaterUsage(garment.materials, garment.category)
  const carbon = calcCarbonFootprint(garment.materials, garment.category, garment.countryOfOrigin)
  const microplasticRisk = calcMicroplasticRisk(garment.materials)
  const syntheticPercent = calcSyntheticPercent(garment.materials)
  const durabilityWears = calcDurabilityWears(garment.materials, garment.category)
  const durabilityScore = calcDurabilityScore(durabilityWears)
  const impactPerWear = calcImpactPerWear(carbon, durabilityWears)
  const transportLabel = getTransportLabel(garment.countryOfOrigin)

  return {
    garmentId: garment.id,
    waterUsageLiters: water,
    carbonKg: carbon,
    microplasticRisk,
    durabilityWears,
    impactPerWear,
    transportLabel,
    durabilityScore,
    syntheticPercent,
  }
}

/** Human-readable transport label. */
export function getTransportLabel(country: string): string {
  const regional = ['Portugal', 'Turkey', 'Morocco']
  if (regional.includes(country)) return `Regional (${country} → EU)`
  return `Long-haul (${country} → EU/US)`
}

/** Format litres with K suffix for large numbers. */
export function formatLitres(l: number): string {
  if (l >= 1000) return `${(l / 1000).toFixed(1)}K L`
  return `${l} L`
}

/** Format carbon with one decimal. */
export function formatCarbon(kg: number): string {
  return `${kg.toFixed(1)} kg CO₂e`
}

/** Microplastic risk label for display. */
export const MICROPLASTIC_LABELS: Record<string, string> = {
  none: 'No synthetic fibers',
  low: 'Low shedding risk',
  medium: 'Moderate shedding risk',
  high: 'High shedding risk',
}

export const MICROPLASTIC_COLORS: Record<string, string> = {
  none: 'text-emerald-400',
  low: 'text-yellow-400',
  medium: 'text-orange-400',
  high: 'text-red-400',
}

// ── Human-friendly storytelling helpers ──────────────────────────────────────

const MATERIAL_DESCRIPTORS: Record<string, string> = {
  Cotton: 'water-heavy production',
  'Organic Cotton': 'lower impact cotton',
  'Recycled Cotton': 'built for circularity',
  Polyester: 'sheds plastic fibers',
  'Recycled Polyester': 'lower impact synthetic',
  Linen: 'lower impact choice',
  Wool: 'high carbon cost',
  Silk: 'high carbon cost',
  Nylon: 'sheds plastic fibers',
  Acrylic: 'sheds plastic fibers',
  Viscose: 'semi-synthetic',
  Lyocell: 'gentler semi-synthetic',
  Modal: 'semi-synthetic blend',
  Hemp: 'lower impact choice',
}

export function getMaterialDescriptor(material: Material): string {
  return MATERIAL_DESCRIPTORS[material.name] ?? material.fiberType
}

export function getWaterLabel(liters: number): string {
  if (liters < 1000) return 'water-efficient'
  if (liters < 4000) return 'moderate water use'
  if (liters < 8000) return 'water-heavy production'
  return 'very thirsty to make'
}

export function getCarbonLabel(kg: number): string {
  if (kg < 3) return 'low carbon'
  if (kg < 6) return 'moderate footprint'
  if (kg < 12) return 'carbon-heavy'
  return 'high carbon cost'
}

export function getDurabilityLabel(wears: number): string {
  if (wears < 50) return 'wears out faster'
  if (wears < 70) return 'average lifespan'
  if (wears < 90) return 'built to last'
  return 'made to endure'
}

export function getEndOfLifeLabel(materials: Material[]): string {
  const syntheticPct = materials
    .filter(m => m.fiberType === 'synthetic')
    .reduce((sum, m) => sum + m.percentage, 0)
  if (syntheticPct === 0) return 'easier to return to earth'
  if (syntheticPct < 50) return 'limited end-of-life options'
  return 'less biodegradable'
}

export function getMicroplasticShortLabel(risk: MicroplasticRisk): string {
  if (risk === 'none') return ''
  if (risk === 'low') return 'light plastic shedding'
  if (risk === 'medium') return 'sheds plastic fibers'
  return 'heavy plastic shedding'
}

export function getWhatThisMeans(garment: Garment, impact: GarmentImpact): string {
  const isFullySynthetic = impact.syntheticPercent >= 80
  const isFullyNatural = impact.syntheticPercent === 0
  const isHighWater = impact.waterUsageLiters > 5000
  const isHighCarbon = impact.carbonKg > 8
  const isRecycled = garment.materials.some(m => m.fiberType === 'recycled')

  if (isRecycled && !isFullySynthetic) {
    return `Recycled fiber dramatically cuts the production footprint compared to virgin materials. This is one of the more responsible choices available.`
  }
  if (isFullySynthetic && isHighCarbon) {
    return `Fully synthetic and shipped a long way — the production cost is real. Wearing it consistently to its full lifespan is the most meaningful thing you can do.`
  }
  if (isFullySynthetic) {
    return `Synthetic fibers are energy-intensive to make and shed microplastics with every wash. Wearing it often and washing gently makes a meaningful difference.`
  }
  if (isHighWater && isFullyNatural && !isHighCarbon) {
    return `Natural fiber means no plastic shedding and clean biodegradation — but growing it uses a significant amount of water. Wearing it often is the best way to make that cost count.`
  }
  if (!isHighWater && isFullyNatural) {
    return `A genuinely lower-impact choice: natural fiber, relatively efficient to produce, and easy to return to the earth when you're done with it.`
  }
  if (isHighWater && isHighCarbon) {
    return `High water and carbon costs in production — the best thing you can do is wear it as many times as possible before it needs replacing.`
  }
  return `A balanced profile — moderate impact across the board. Wearing it consistently and caring for it gently is the most effective thing you can do.`
}

export function getBestNextStep(_garment: Garment, impact: GarmentImpact): string {
  if (impact.microplasticRisk !== 'none') {
    return `Use a microplastic filter bag every time you wash it — it catches plastic fibers before they reach the ocean.`
  }
  if (impact.waterUsageLiters > 5000) {
    return `Wear it as many times as possible before washing — the water cost is already spent, so more wears is the best thing you can do.`
  }
  if (impact.carbonKg > 8) {
    return `Every extra wear cuts the per-wear footprint. Aim to wear it at least ${impact.durabilityWears} times over its life.`
  }
  return `When you're done with it, donate, resell, or compost — natural fibers can return to the earth cleanly.`
}
