import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowIcon } from '../components/ui/GlowIcon'
import { MaterialTag } from '../components/ui/MaterialTag'
import { useWardrobe } from '../hooks/useWardrobe'
import { formatLitres, formatCarbon } from '../utils/calculations'
import type { WardrobeItem } from '../types/fashion'

// ── Per-garment derived copy ──────────────────────────────────────────────────

function getGarmentSubtitle(item: WardrobeItem): string {
  const naturalPct = item.garment.materials
    .filter(m => m.fiberType === 'natural')
    .reduce((s, m) => s + m.percentage, 0)
  const syntheticPct = item.impact.syntheticPercent
  const recycledPct = item.garment.materials
    .filter(m => m.fiberType === 'recycled')
    .reduce((s, m) => s + m.percentage, 0)

  if (recycledPct >= 80) return 'Recycled dominant · circular choice'
  if (naturalPct === 100) return 'Fully natural fiber'
  if (syntheticPct === 100) return 'Fully synthetic fiber'
  if (naturalPct >= 60 && syntheticPct > 0) return 'Plant-based dominant · synthetic blend'
  if (syntheticPct >= 60 && naturalPct > 0) return 'Synthetic dominant · natural blend'
  if (recycledPct > 0) return 'Partially recycled · blended fiber'
  return 'Blended fiber composition'
}

function getSillageReads(item: WardrobeItem): string {
  const isHighWater = item.impact.waterUsageLiters > 3000
  const hasSynthetic = item.impact.syntheticPercent > 0
  const isRecycled = item.garment.materials.some(m => m.fiberType === 'recycled')
  const isFullySynthetic = item.impact.syntheticPercent >= 80

  if (isRecycled && !isFullySynthetic) return 'A circular choice. Dramatically lower footprint than starting from scratch.'
  if (isFullySynthetic) return 'Synthetic-dominant. Wears well, sheds plastic. Wash gently and use a filter bag.'
  if (isHighWater && hasSynthetic) return 'Water-sensitive, harder to recycle, best kept in rotation.'
  if (isHighWater && !hasSynthetic) return 'Water cost is already embedded. Wearing it often is the most meaningful thing you can do.'
  if (hasSynthetic && !isHighWater) return 'Moderate water footprint, but synthetic fibers shed plastic in every wash.'
  return 'A balanced profile. Wear often, care gently, and return it well when you\'re done.'
}

function getGarmentKnown(item: WardrobeItem): string {
  const mats = item.garment.materials.map(m =>
    item.garment.materials.length > 1 ? `${m.percentage}% ${m.name}` : m.name
  ).join(' · ')
  return `${mats} · ${item.garment.countryOfOrigin}`
}

function getGarmentUnknown(item: WardrobeItem): string {
  const extras: string[] = []
  if (item.garment.materials.some(m => ['Viscose', 'Modal'].includes(m.name))) extras.push('wood source')
  if (item.garment.materials.some(m => m.name === 'Wool')) extras.push('welfare cert')
  return ['Factory', 'Dye process', 'Worker wages', ...extras].join(' · ')
}

// ── Wardrobe-wide insight ─────────────────────────────────────────────────────

function getWardrobeInsight(wardrobe: WardrobeItem[]) {
  if (wardrobe.length === 0) return null

  const first = wardrobe[0]
  const hasSynthetic = first.impact.syntheticPercent > 0
  const dominantMat = first.garment.materials.reduce((a, b) => a.percentage >= b.percentage ? a : b)
  const isBlended = first.garment.materials.length > 1
  const syntheticMat = first.garment.materials.find(m => m.fiberType === 'synthetic')
  const visiblePressure = first.impact.waterUsageLiters > 3000 ? 'water' : 'carbon'
  const hiddenComplexity = hasSynthetic ? 'circularity' : 'land use'

  let text = ''
  const chips: string[] = []

  if (wardrobe.length === 1) {
    const matDesc = `${dominantMat.name.toLowerCase()}-dominant`
    const blendDesc = isBlended && syntheticMat
      ? ` and blended with ${syntheticMat.name.toLowerCase()}`
      : ''
    text = `Your first saved garment is ${matDesc}${blendDesc}. Its visible pressure is ${visiblePressure}; its hidden complexity is ${hiddenComplexity}.`

    chips.push(first.impact.waterUsageLiters > 3000 ? 'Water-sensitive' : 'Moderate water')
    chips.push(isBlended ? 'Blended fiber' : 'Single fiber')
    chips.push(first.impact.durabilityWears >= 70 ? 'Keep longer' : 'Wear often')
  } else {
    const avgWater = wardrobe.reduce((s, i) => s + i.impact.waterUsageLiters, 0) / wardrobe.length
    const avgSynth = wardrobe.reduce((s, i) => s + i.impact.syntheticPercent, 0) / wardrobe.length
    const hasCotton = wardrobe.some(i => i.garment.materials.some(m => m.name.includes('Cotton')))
    const dominant = hasCotton ? 'cotton' : avgSynth > 50 ? 'synthetic' : 'blended'

    text = `Your wardrobe leans ${dominant}. ${
      avgWater > 4000
        ? 'Water pressure is the shared pattern across your saved pieces.'
        : avgSynth > 40
        ? 'Microplastic shedding is the shared risk across your saved pieces.'
        : 'Impact is spread relatively evenly across your pieces.'
    } Wearing each garment to its full lifespan is the highest-leverage action.`

    if (avgSynth > 30) chips.push('Plastic risk')
    if (avgWater > 4000) chips.push('Water-heavy')
    chips.push(`${wardrobe.length} profiles`)
    chips.push('Keep in rotation')
  }

  return { text, chips }
}

// ── Garment profile card ──────────────────────────────────────────────────────

function GarmentProfileCard({
  item,
  isSelected,
  onCompare,
  onRemove,
}: {
  item: WardrobeItem
  isSelected: boolean
  onCompare: () => void
  onRemove: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <GlassCard className="overflow-hidden">
      {/* Top: name + subtitle + materials */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text">{item.garment.name}</p>
            <p className="text-[10px] text-faint mt-0.5 italic">{getGarmentSubtitle(item)}</p>
          </div>
          <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
            <button
              onClick={onCompare}
              className={`text-[9px] px-3 py-1 rounded-full border transition-all uppercase tracking-[0.1em] ${
                isSelected
                  ? 'border-burgundy/60 bg-burgundy/5 text-accent'
                  : 'border-border text-faint hover:border-burgundy/50 hover:text-muted'
              }`}
            >
              {isSelected ? '✓ Comparing' : 'Compare'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.garment.materials.map(m => <MaterialTag key={m.name} material={m} />)}
        </div>
      </div>

      {/* SILLAGE reads */}
      <div className="px-4 py-3 border-t border-border bg-surface/60">
        <p className="text-[9px] uppercase tracking-[0.25em] text-faint mb-1">SILLAGE reads</p>
        <p className="text-xs text-muted leading-relaxed">{getSillageReads(item)}</p>
      </div>

      {/* Evidence / Known / Unknown rows */}
      <div className="px-4 divide-y divide-border border-t border-border">
        <div className="flex items-center justify-between py-2.5">
          <span className="text-[9px] uppercase tracking-[0.2em] text-faint">Evidence</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Estimated</span>
        </div>
        <div className="flex items-start justify-between gap-3 py-2.5">
          <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-700 flex-shrink-0 mt-0.5">Known</span>
          <span className="text-[10px] text-text text-right leading-snug">{getGarmentKnown(item)}</span>
        </div>
        <div className="flex items-start justify-between gap-3 py-2.5">
          <span className="text-[9px] uppercase tracking-[0.2em] text-faint flex-shrink-0 mt-0.5">Unknown</span>
          <span className="text-[10px] text-faint text-right leading-snug">{getGarmentUnknown(item)}</span>
        </div>
      </div>

      {/* View details (expandable) */}
      <div className="px-4 border-t border-border">
        <button
          onClick={() => setShowDetails(v => !v)}
          className="flex items-center gap-1.5 text-[9px] text-faint hover:text-muted transition-colors py-2.5 uppercase tracking-[0.2em] w-full"
        >
          <span
            className="inline-block transition-transform duration-200"
            style={{ transform: showDetails ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >›</span>
          View details
        </button>

        {showDetails && (
          <div className="flex gap-5 pb-3 text-xs">
            <span className="text-muted flex items-center gap-1">
              <GlowIcon name="water" size={11} />
              <span>{formatLitres(item.impact.waterUsageLiters)}</span>
            </span>
            <span className="text-muted flex items-center gap-1">
              <GlowIcon name="leaf" size={11} />
              <span>{formatCarbon(item.impact.carbonKg)}</span>
            </span>
            <span className="text-muted flex items-center gap-1">
              <GlowIcon name="hourglass" size={11} />
              <span>~{item.impact.durabilityWears} wears</span>
            </span>
          </div>
        )}
      </div>

      {/* Remove */}
      <div className="px-4 pb-3 flex justify-end border-t border-border pt-2">
        <button
          onClick={onRemove}
          className="text-[9px] text-faint hover:text-muted transition-colors uppercase tracking-[0.15em]"
        >
          Remove
        </button>
      </div>
    </GlassCard>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function WardrobeScreen() {
  const { wardrobe, removeItem } = useWardrobe()
  const [compareA, setCompareA] = useState<WardrobeItem | null>(null)
  const [compareB, setCompareB] = useState<WardrobeItem | null>(null)
  const [tab, setTab] = useState<'profiles' | 'compare'>('profiles')

  function toggleCompare(item: WardrobeItem) {
    if (compareA?.id === item.id) { setCompareA(null); return }
    if (compareB?.id === item.id) { setCompareB(null); return }
    if (!compareA) { setCompareA(item); return }
    if (!compareB) { setCompareB(item); return }
    setCompareA(item)
  }

  function isSelected(item: WardrobeItem) {
    return compareA?.id === item.id || compareB?.id === item.id
  }

  const winner =
    compareA && compareB
      ? compareA.impact.carbonKg < compareB.impact.carbonKg ? 'a'
      : compareB.impact.carbonKg < compareA.impact.carbonKg ? 'b'
      : 'tie'
      : null

  // ── Empty state ───────────────────────────────────────────────────────────
  if (wardrobe.length === 0) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="mb-6 animate-float"><GlowIcon name="dress" size={48} /></div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-faint mb-3">Material Memory</p>
        <h1 className="font-display text-2xl font-semibold text-text mb-3">Nothing here yet.</h1>
        <p className="text-muted text-sm max-w-xs leading-relaxed mb-8">
          Scan a garment and save it to start building a picture of what you own and what it cost the world.
        </p>
        <Link to="/scan" className="btn-primary">Start Scanning</Link>
      </div>
    )
  }

  const insight = getWardrobeInsight(wardrobe)
  const profileCount = wardrobe.length

  return (
    <div className="min-h-dvh bg-background pt-16 pb-8 px-4">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-[9px] uppercase tracking-[0.4em] text-faint mb-1">§ Memory</p>
        <h1 className="font-display text-3xl font-semibold text-text leading-tight">Material Memory</h1>
        <p className="text-xs text-muted mt-1">
          {profileCount} material {profileCount === 1 ? 'profile' : 'profiles'} created
        </p>
      </div>

      {/* ── Insight card ────────────────────────────────────────────── */}
      {insight && (
        <GlassCard variant="violet" className="p-4 mb-6">
          <p className="text-[9px] uppercase tracking-[0.3em] text-faint mb-2">What SILLAGE notices</p>
          <p className="text-xs text-muted leading-relaxed mb-3">{insight.text}</p>
          <div className="flex flex-wrap gap-1.5">
            {insight.chips.map(chip => (
              <span
                key={chip}
                className="text-[9px] px-2.5 py-1 rounded-full border border-border bg-surface text-muted uppercase tracking-[0.12em]"
              >
                {chip}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── Tab bar ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-5 glass rounded-full p-1">
        {(['profiles', 'compare'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-full text-[9px] font-medium tracking-[0.1em] uppercase transition-all duration-200 ${
              tab === t ? 'bg-accent/20 text-accent' : 'text-muted hover:text-text'
            }`}
          >
            {t === 'profiles' ? 'Memory' : 'Compare'}
          </button>
        ))}
      </div>

      {/* ── Profiles tab ────────────────────────────────────────────── */}
      {tab === 'profiles' && (
        <div className="space-y-3">
          {wardrobe.map(item => (
            <GarmentProfileCard
              key={item.id}
              item={item}
              isSelected={isSelected(item)}
              onCompare={() => toggleCompare(item)}
              onRemove={() => removeItem(item.id)}
            />
          ))}

          <Link
            to="/scan"
            className="flex items-center justify-center gap-2 w-full rounded-2xl border border-dashed border-border py-4 text-faint text-xs hover:border-burgundy/40 hover:text-muted transition-all uppercase tracking-[0.15em]"
          >
            <span className="text-accent">+</span> Add another garment
          </Link>
        </div>
      )}

      {/* ── Compare tab ─────────────────────────────────────────────── */}
      {tab === 'compare' && (
        <div>
          {(!compareA || !compareB) && (
            <div className="glass rounded-2xl p-5 mb-5 text-center">
              <p className="text-muted text-sm">
                Select{' '}
                <span className="text-text">{!compareA ? 'two' : 'one more'}</span>{' '}
                garment{!compareA ? 's' : ''} below to compare them.
              </p>
            </div>
          )}

          {compareA && compareB && (
            <div className="space-y-4 mb-6">
              {winner !== 'tie' && (
                <GlassCard variant="pink" className="p-4 text-center">
                  <p className="text-[9px] text-muted uppercase tracking-[0.3em] mb-1">Lower impact</p>
                  <p className="gradient-text text-lg font-semibold font-display">
                    {winner === 'a' ? compareA.garment.name : compareB.garment.name}
                  </p>
                  <p className="text-muted text-xs mt-1">
                    {Math.abs(Math.round(
                      ((compareA.impact.carbonKg - compareB.impact.carbonKg) /
                        Math.max(compareA.impact.carbonKg, compareB.impact.carbonKg)) * 100
                    ))}% lower carbon footprint
                  </p>
                </GlassCard>
              )}

              <GlassCard className="overflow-hidden">
                <div className="grid grid-cols-3 bg-surface-2 p-4 border-b border-border">
                  <div />
                  <div className="text-center">
                    <p className={`text-[10px] font-medium truncate px-1 ${winner === 'a' ? 'text-text' : 'text-text/60'}`}>
                      {compareA.garment.name}{winner === 'a' && <span className="ml-1">✓</span>}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] font-medium truncate px-1 ${winner === 'b' ? 'text-text' : 'text-text/60'}`}>
                      {compareB.garment.name}{winner === 'b' && <span className="ml-1">✓</span>}
                    </p>
                  </div>
                </div>

                {([
                  { label: <span className="flex items-center gap-1"><GlowIcon name="water" size={11} /> Water</span>, a: formatLitres(compareA.impact.waterUsageLiters), b: formatLitres(compareB.impact.waterUsageLiters), aNum: compareA.impact.waterUsageLiters, bNum: compareB.impact.waterUsageLiters, lower: true },
                  { label: <span className="flex items-center gap-1"><GlowIcon name="leaf" size={11} /> Carbon</span>, a: formatCarbon(compareA.impact.carbonKg), b: formatCarbon(compareB.impact.carbonKg), aNum: compareA.impact.carbonKg, bNum: compareB.impact.carbonKg, lower: true },
                  { label: <span className="flex items-center gap-1"><GlowIcon name="hourglass" size={11} /> Lifespan</span>, a: `~${compareA.impact.durabilityWears}`, b: `~${compareB.impact.durabilityWears}`, aNum: compareA.impact.durabilityWears, bNum: compareB.impact.durabilityWears, lower: false },
                  { label: <span className="flex items-center gap-1"><GlowIcon name="dress" size={11} /> /Wear</span>, a: `${(compareA.impact.impactPerWear * 1000).toFixed(1)} g`, b: `${(compareB.impact.impactPerWear * 1000).toFixed(1)} g`, aNum: compareA.impact.impactPerWear, bNum: compareB.impact.impactPerWear, lower: true },
                  { label: <span className="flex items-center gap-1"><GlowIcon name="microscope" size={11} /> Plastic</span>, a: compareA.impact.microplasticRisk, b: compareB.impact.microplasticRisk, aNum: ['none','low','medium','high'].indexOf(compareA.impact.microplasticRisk), bNum: ['none','low','medium','high'].indexOf(compareB.impact.microplasticRisk), lower: true },
                ] as const).map((row, i) => {
                  const aBetter = row.lower ? row.aNum < row.bNum : row.aNum > row.bNum
                  const bBetter = row.lower ? row.bNum < row.aNum : row.bNum > row.aNum
                  return (
                    <div key={i} className={`grid grid-cols-3 p-4 border-b border-border last:border-0 ${i % 2 === 1 ? 'bg-surface/30' : ''}`}>
                      <p className="text-muted text-xs self-center">{row.label}</p>
                      <p className={`text-xs text-center self-center ${aBetter ? 'text-text font-semibold' : 'text-text/60'}`}>{row.a}</p>
                      <p className={`text-xs text-center self-center ${bBetter ? 'text-text font-semibold' : 'text-text/60'}`}>{row.b}</p>
                    </div>
                  )
                })}
              </GlassCard>

              <p className="text-center text-[10px] text-faint">Highlighted values indicate lower environmental impact per metric.</p>

              <button
                onClick={() => { setCompareA(null); setCompareB(null) }}
                className="w-full btn-ghost text-sm py-3"
              >
                Clear Comparison
              </button>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[9px] text-faint uppercase tracking-[0.3em] mb-3">Select from wardrobe</p>
            {wardrobe.map(item => (
              <button
                key={item.id}
                onClick={() => toggleCompare(item)}
                className={`w-full text-left rounded-xl p-3 border transition-all text-sm ${
                  isSelected(item)
                    ? 'border-accent/40 bg-accent/5 text-text'
                    : 'border-border text-muted hover:border-burgundy/40 hover:text-text glass'
                }`}
              >
                <span className={`mr-2 text-xs ${isSelected(item) ? 'text-accent' : 'text-faint'}`}>
                  {isSelected(item) ? '✓' : '○'}
                </span>
                {item.garment.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer nav ──────────────────────────────────────────────── */}
      <div className="mt-10 flex justify-center">
        <Link to="/impact" className="btn-primary">
          What Can I Do? →
        </Link>
      </div>

    </div>
  )
}
