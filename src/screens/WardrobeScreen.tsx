import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowIcon } from '../components/ui/GlowIcon'
import { MaterialTag } from '../components/ui/MaterialTag'
import { ImpactMetricCard } from '../components/ui/ImpactMetricCard'
import { useWardrobe } from '../hooks/useWardrobe'
import { formatLitres, formatCarbon } from '../utils/calculations'
import type { WardrobeItem } from '../types/fashion'

/**
 * Wardrobe screen — saved garments, cumulative stats, and side-by-side comparison.
 */
export function WardrobeScreen() {
  const { wardrobe, removeItem, totalCarbon, totalWater } = useWardrobe()
  const [compareA, setCompareA] = useState<WardrobeItem | null>(null)
  const [compareB, setCompareB] = useState<WardrobeItem | null>(null)
  const [tab, setTab] = useState<'wardrobe' | 'compare'>('wardrobe')

  function toggleCompare(item: WardrobeItem) {
    if (compareA?.id === item.id) { setCompareA(null); return }
    if (compareB?.id === item.id) { setCompareB(null); return }
    if (!compareA) { setCompareA(item); return }
    if (!compareB) { setCompareB(item); return }
    // Replace A if both slots full
    setCompareA(item)
  }

  function isSelected(item: WardrobeItem) {
    return compareA?.id === item.id || compareB?.id === item.id
  }

  // Determine comparison winner
  const winner =
    compareA && compareB
      ? compareA.impact.carbonKg < compareB.impact.carbonKg
        ? 'a'
        : compareB.impact.carbonKg < compareA.impact.carbonKg
        ? 'b'
        : 'tie'
      : null

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (wardrobe.length === 0) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="mb-6 animate-float"><GlowIcon name="dress" size={48} /></div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Your Wardrobe</p>
        <h1 className="font-display text-2xl font-semibold text-text mb-3">
          No garments yet.
        </h1>
        <p className="text-muted text-sm max-w-xs leading-relaxed mb-8">
          Scan a garment and save it here to build your impact wardrobe and compare pieces.
        </p>
        <Link to="/scan" className="btn-primary">Start Scanning</Link>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pt-16 pb-6 px-4">
      <div>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Your Wardrobe</p>
          <h1 className="font-display text-3xl font-semibold text-text">
            {wardrobe.length} {wardrobe.length === 1 ? 'garment' : 'garments'} saved
          </h1>
        </div>

        {/* Cumulative stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <ImpactMetricCard
            icon={<GlowIcon name="water" />}
            label="Total Water (estimated)"
            value={formatLitres(totalWater)}
            accent="violet"
          />
          <ImpactMetricCard
            icon={<GlowIcon name="leaf" />}
            label="Total Carbon (estimated)"
            value={formatCarbon(totalCarbon)}
            accent="pink"
          />
        </div>

        {/* Tab toggle */}
        <div className="flex gap-2 mb-6 glass rounded-full p-1">
          {(['wardrobe', 'compare'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
                tab === t
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'text-muted hover:text-text'
              }`}
            >
              {t === 'wardrobe' ? 'All Garments' : 'Compare'}
            </button>
          ))}
        </div>

        {/* ── Wardrobe tab ──────────────────────────────────────────────── */}
        {tab === 'wardrobe' && (
          <div className="space-y-3">
            {wardrobe.map(item => (
              <GlassCard
                key={item.id}
                className="p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-text font-medium text-sm">{item.garment.name}</p>
                    <p className="text-muted text-xs mt-0.5 mb-2">
                      Made in {item.garment.countryOfOrigin}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.garment.materials.map(m => (
                        <MaterialTag key={m.name} material={m} />
                      ))}
                    </div>
                    {/* Quick metrics */}
                    <div className="flex gap-4 text-xs">
                      <span className="text-muted flex items-center gap-1">
                        <GlowIcon name="water" size={12} /> <span className="text-lilac">{formatLitres(item.impact.waterUsageLiters)}</span>
                      </span>
                      <span className="text-muted flex items-center gap-1">
                        <GlowIcon name="leaf" size={12} /> <span className="text-accent">{formatCarbon(item.impact.carbonKg)}</span>
                      </span>
                      <span className="text-muted flex items-center gap-1">
                        <GlowIcon name="dress" size={12} /> <span className="text-text">~{item.impact.durabilityWears} wears</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <button
                      onClick={() => toggleCompare(item)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        isSelected(item)
                          ? 'border-accent/50 bg-accent/10 text-accent'
                          : 'border-border text-muted hover:border-border-bright hover:text-text'
                      }`}
                    >
                      {isSelected(item) ? '✓ Comparing' : 'Compare'}
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-faint hover:text-red-400 transition-colors px-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}

            {/* Add more */}
            <Link
              to="/scan"
              className="flex items-center justify-center gap-2 w-full rounded-2xl border border-dashed border-border py-4 text-muted text-sm hover:border-accent/30 hover:text-text transition-all"
            >
              <span className="text-accent">+</span> Scan another garment
            </Link>
          </div>
        )}

        {/* ── Compare tab ───────────────────────────────────────────────── */}
        {tab === 'compare' && (
          <div>
            {(!compareA || !compareB) && (
              <div className="glass rounded-2xl p-5 mb-5 text-center">
                <p className="text-muted text-sm">
                  Select{' '}
                  <span className="text-text">{!compareA ? 'two' : 'one more'}</span>{' '}
                  garment{!compareA ? 's' : ''} from the All Garments tab to compare them.
                </p>
              </div>
            )}

            {compareA && compareB && (
              <div className="space-y-4">
                {/* Winner banner */}
                {winner !== 'tie' && (
                  <GlassCard variant="pink" className="p-4 text-center">
                    <p className="text-xs text-muted uppercase tracking-widest mb-1">Lower impact</p>
                    <p className="gradient-text text-lg font-semibold font-display">
                      {winner === 'a' ? compareA.garment.name : compareB.garment.name}
                    </p>
                    <p className="text-muted text-xs mt-1">
                      {Math.abs(
                        Math.round(
                          ((compareA.impact.carbonKg - compareB.impact.carbonKg) /
                            Math.max(compareA.impact.carbonKg, compareB.impact.carbonKg)) *
                            100
                        )
                      )}
                      % lower carbon footprint
                    </p>
                  </GlassCard>
                )}

                {/* Side-by-side table */}
                <GlassCard className="overflow-hidden">
                  {/* Headers */}
                  <div className="grid grid-cols-3 bg-surface-2 p-4 border-b border-border">
                    <div />
                    <div className="text-center">
                      <p className={`text-xs font-medium truncate px-1 ${winner === 'a' ? 'text-emerald-400' : 'text-text/80'}`}>
                        {compareA.garment.name}
                        {winner === 'a' && <span className="ml-1">✓</span>}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium truncate px-1 ${winner === 'b' ? 'text-emerald-400' : 'text-text/80'}`}>
                        {compareB.garment.name}
                        {winner === 'b' && <span className="ml-1">✓</span>}
                      </p>
                    </div>
                  </div>

                  {/* Rows */}
                  {[
                    {
                      label: <span className="flex items-center gap-1"><GlowIcon name="water" size={12} /> Water</span>,
                      a: formatLitres(compareA.impact.waterUsageLiters),
                      b: formatLitres(compareB.impact.waterUsageLiters),
                      lowerIsBetter: true,
                      aNum: compareA.impact.waterUsageLiters,
                      bNum: compareB.impact.waterUsageLiters,
                    },
                    {
                      label: <span className="flex items-center gap-1"><GlowIcon name="leaf" size={12} /> Carbon</span>,
                      a: formatCarbon(compareA.impact.carbonKg),
                      b: formatCarbon(compareB.impact.carbonKg),
                      lowerIsBetter: true,
                      aNum: compareA.impact.carbonKg,
                      bNum: compareB.impact.carbonKg,
                    },
                    {
                      label: <span className="flex items-center gap-1"><GlowIcon name="hourglass" size={12} /> Lifespan</span>,
                      a: `~${compareA.impact.durabilityWears}`,
                      b: `~${compareB.impact.durabilityWears}`,
                      lowerIsBetter: false,
                      aNum: compareA.impact.durabilityWears,
                      bNum: compareB.impact.durabilityWears,
                    },
                    {
                      label: <span className="flex items-center gap-1"><GlowIcon name="dress" size={12} /> Impact/Wear</span>,
                      a: `${(compareA.impact.impactPerWear * 1000).toFixed(1)} g`,
                      b: `${(compareB.impact.impactPerWear * 1000).toFixed(1)} g`,
                      lowerIsBetter: true,
                      aNum: compareA.impact.impactPerWear,
                      bNum: compareB.impact.impactPerWear,
                    },
                    {
                      label: <span className="flex items-center gap-1"><GlowIcon name="microscope" size={12} /> Microplastics</span>,
                      a: compareA.impact.microplasticRisk,
                      b: compareB.impact.microplasticRisk,
                      lowerIsBetter: true,
                      aNum: ['none', 'low', 'medium', 'high'].indexOf(compareA.impact.microplasticRisk),
                      bNum: ['none', 'low', 'medium', 'high'].indexOf(compareB.impact.microplasticRisk),
                    },
                  ].map((row, i) => {
                    const aBetter = row.lowerIsBetter ? row.aNum < row.bNum : row.aNum > row.bNum
                    const bBetter = row.lowerIsBetter ? row.bNum < row.aNum : row.bNum > row.aNum
                    return (
                      <div
                        key={i}
                        className={`grid grid-cols-3 p-4 border-b border-border last:border-0 ${
                          i % 2 === 1 ? 'bg-surface/30' : ''
                        }`}
                      >
                        <p className="text-muted text-xs self-center">{row.label}</p>
                        <p className={`text-xs text-center self-center font-medium ${aBetter ? 'text-emerald-400' : 'text-text/70'}`}>
                          {row.a}
                        </p>
                        <p className={`text-xs text-center self-center font-medium ${bBetter ? 'text-emerald-400' : 'text-text/70'}`}>
                          {row.b}
                        </p>
                      </div>
                    )
                  })}
                </GlassCard>

                <p className="text-center text-xs text-faint">
                  Highlighted values indicate lower environmental impact per metric.
                </p>

                {/* Clear comparison */}
                <button
                  onClick={() => { setCompareA(null); setCompareB(null) }}
                  className="w-full btn-ghost text-sm py-3"
                >
                  Clear Comparison
                </button>
              </div>
            )}

            {/* Quick select list if compare mode active */}
            <div className="mt-5 space-y-2">
              <p className="text-xs text-muted uppercase tracking-widest mb-3">
                Select from wardrobe
              </p>
              {wardrobe.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCompare(item)}
                  className={`w-full text-left rounded-xl p-3 border transition-all text-sm ${
                    isSelected(item)
                      ? 'border-accent/40 bg-accent/8 text-text'
                      : 'border-border text-muted hover:border-border-bright hover:text-text glass'
                  }`}
                >
                  <span className={isSelected(item) ? 'text-accent mr-2' : 'text-faint mr-2'}>
                    {isSelected(item) ? '✓' : '○'}
                  </span>
                  {item.garment.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex justify-center">
          <Link to="/impact" className="btn-primary">
            See My Full Impact Story →
          </Link>
        </div>
      </div>
    </div>
  )
}
