import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GlowIcon } from '../components/ui/GlowIcon'
import { v4 as uuidv4 } from 'uuid'
import { GlassCard } from '../components/ui/GlassCard'
import { ImpactMetricCard } from '../components/ui/ImpactMetricCard'
import { MaterialTag } from '../components/ui/MaterialTag'
import { MethodologyModal } from '../components/ui/MethodologyModal'
import { ShareCard } from '../components/ui/ShareCard'
import { VideoBackground } from '../components/ui/VideoBackground'
import { useWardrobe } from '../hooks/useWardrobe'
import {
  formatLitres,
  formatCarbon,
  calcImprovedImpactPerWear,
  MICROPLASTIC_LABELS,
  getMaterialDescriptor,
  getWaterLabel,
  getCarbonLabel,
  getDurabilityLabel,
  getEndOfLifeLabel,
  getMicroplasticShortLabel,
  getWhatThisMeans,
  getBestNextStep,
} from '../utils/calculations'
import { LABOR_CONTEXT, TRANSPORT_LABELS } from '../data/garments'
import type { Garment, GarmentImpact } from '../types/fashion'

function StoryCarousel({ items }: { items: React.ReactNode[] }) {
  const [current, setCurrent] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const touchStartX = useRef(0)
  const dragging = useRef(false)
  const total = items.length

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    dragging.current = true
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return
    setDragOffset(e.touches[0].clientX - touchStartX.current)
  }

  function handleTouchEnd() {
    dragging.current = false
    if (dragOffset < -60 && current < total - 1) setCurrent(c => c + 1)
    else if (dragOffset > 60 && current > 0) setCurrent(c => c - 1)
    setDragOffset(0)
  }

  const backIndices = [current + 1, current + 2].filter(i => i < total)

  return (
    <div>
      <div className="relative" style={{ paddingRight: '24px', paddingBottom: '20px' }}>
        {/* Back cards — stacked behind, rendered furthest first */}
        {[...backIndices].reverse().map(idx => {
          const depth = idx - current // 1 = closest, 2 = furthest
          return (
            <div
              key={idx}
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
              style={{
                zIndex: total - depth,
                transform: `translateX(${depth * 12}px) translateY(${depth * 9}px) scale(${1 - depth * 0.035})`,
                opacity: 1 - depth * 0.2,
                filter: `blur(${depth * 2}px) brightness(0.5)`,
              }}
            >
              {items[idx]}
            </div>
          )
        })}

        {/* Front card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            zIndex: total + 1,
            transform: `translateX(${dragOffset}px)`,
            transition: Math.abs(dragOffset) > 3 ? 'none' : 'transform 0.35s cubic-bezier(0.25,0.1,0.25,1)',
            touchAction: 'pan-y',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items[current]}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-1.5 bg-accent'
                : i < current
                ? 'w-1.5 h-1.5 bg-accent/25'
                : 'w-1.5 h-1.5 bg-muted/25'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Results screen — full breakdown of a scanned garment's impact.
 * Reads garment + impact data from sessionStorage (set by ScanScreen).
 */
export function ResultsScreen() {
  const navigate = useNavigate()
  const { addItem, isInWardrobe } = useWardrobe()
  const [showMethodology, setShowMethodology] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const [extraWears, setExtraWears] = useState(20)
  const [activeTab, setActiveTab] = useState<'metrics' | 'stories' | 'reduce'>('metrics')
  const [showFullData, setShowFullData] = useState(false)
  const [tabsSticky, setTabsSticky] = useState(false)
  const tabBarRef = useRef<HTMLDivElement>(null)
  const [clouds, setClouds] = useState<{ id: number; pct: number; size: number; drift: number }[]>([])
  const cloudId = useRef(0)

  const [garment, setGarment] = useState<Garment | null>(null)
  const [impact, setImpact] = useState<GarmentImpact | null>(null)

  // Sticky tab observer
  useEffect(() => {
    const el = tabBarRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setTabsSticky(!entry.isIntersecting),
      { threshold: 1.0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Restore from sessionStorage
  useEffect(() => {
    try {
      const g = sessionStorage.getItem('sillage_current_garment')
      const imp = sessionStorage.getItem('sillage_current_impact')
      if (g && imp) {
        setGarment(JSON.parse(g))
        setImpact(JSON.parse(imp))
      } else {
        navigate('/scan')
      }
    } catch {
      navigate('/scan')
    }
  }, [navigate])

  if (!garment || !impact) return null

  const saved = isInWardrobe(garment.id)
  const laborNote = LABOR_CONTEXT[garment.countryOfOrigin]
  const transportLabel =
    TRANSPORT_LABELS[garment.countryOfOrigin] ?? impact.transportLabel

  const improvedIpw = calcImprovedImpactPerWear(
    impact.carbonKg,
    impact.durabilityWears,
    extraWears
  )
  const ipwSavingPct = Math.round(
    ((impact.impactPerWear - improvedIpw) / impact.impactPerWear) * 100
  )

  function handleSave() {
    if (!garment || !impact || saved) return
    addItem({
      id: uuidv4(),
      garment,
      impact,
      savedAt: new Date().toISOString(),
      wornCount: 0,
    })
  }

  return (
    <div className="min-h-dvh bg-background pb-20">
      {showMethodology && (
        <MethodologyModal onClose={() => setShowMethodology(false)} />
      )}
      {showShareCard && garment && impact && (
        <ShareCard
          garment={garment}
          impact={impact}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {/* ── Hero masthead ────────────────────────────────────────────────── */}
      <div className="relative h-[38dvh] overflow-hidden flex flex-col">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 60% 0%, rgba(219,218,210,0.3) 0%, rgba(245,243,238,0) 60%)',
          }}
        />
        <div className="absolute inset-0 video-overlay" />

        {/* Top eyebrow */}
        <div className="relative z-10 px-5 pt-24 pb-0">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-accent/50 flex-shrink-0" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent">Impact Report</p>
          </div>
        </div>

        {/* Floating garment name — marquee strip */}
        <div className="relative z-10 overflow-hidden mt-4">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'marquee 22s linear infinite' }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="font-display font-semibold tracking-tight text-text/30 select-none px-10"
                style={{ fontSize: '1.75rem' }}
              >
                {garment.name}
              </span>
            ))}
          </div>
        </div>

        {/* Push to bottom */}
        <div className="flex-1" />

        {/* Bottom: made-in + materials only */}
        <div className="relative z-10 px-5 pb-10">
          <p className="text-muted/70 text-xs mb-3 tracking-[0.2em] uppercase">
            Made in {garment.countryOfOrigin}
          </p>
          <div className="flex flex-wrap gap-2">
            {garment.materials.map(m => (
              <MaterialTag key={m.name} material={m} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-6">

        {/* ── Tab bar (inline — becomes invisible placeholder when sticky) ── */}
        <div ref={tabBarRef} className={`flex gap-1 mb-6 glass rounded-full p-1 ${tabsSticky ? 'invisible' : ''}`}>
          {([
            { id: 'metrics', label: 'Impact Metrics' },
            { id: 'stories', label: 'Stories' },
            { id: 'reduce', label: 'Reduce Impact' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-full text-[9px] uppercase tracking-[0.1em] font-medium transition-all duration-200 ${
                activeTab === tab.id ? 'bg-accent/20 text-accent' : 'text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab bar (fixed bottom — appears when inline bar scrolls out) ─ */}
        {tabsSticky && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4 pb-4 pt-2"
            style={{ background: 'linear-gradient(to top, rgba(245,243,238,0.97) 60%, transparent)' }}
          >
            <div className="flex gap-1 glass rounded-full p-1">
              {([
                { id: 'metrics', label: 'Impact Metrics' },
                { id: 'stories', label: 'Stories' },
                { id: 'reduce', label: 'Reduce Impact' },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-full text-[9px] uppercase tracking-[0.1em] font-medium transition-all duration-200 ${
                    activeTab === tab.id ? 'bg-accent/20 text-accent' : 'text-muted hover:text-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Impact Metrics ───────────────────────────────────────── */}
        {activeTab === 'metrics' && (
          <div className="space-y-4">

            {/* 1. Material name + descriptor chips */}
            <div className="flex flex-wrap gap-2">
              {garment.materials.map(m => (
                <div
                  key={m.name}
                  className="glass rounded-full px-3.5 py-1.5 flex items-center gap-1.5"
                >
                  <span className="text-xs font-medium text-text">{m.name}</span>
                  {garment.materials.length > 1 && (
                    <span className="text-[10px] text-faint">{m.percentage}%</span>
                  )}
                  <span className="text-[10px] text-muted">· {getMaterialDescriptor(m)}</span>
                </div>
              ))}
            </div>

            {/* 2. Impact snapshot rows */}
            <GlassCard className="overflow-hidden">
              {(
                [
                  {
                    icon: <GlowIcon name="water" size={16} />,
                    label: getWaterLabel(impact.waterUsageLiters),
                    value: formatLitres(impact.waterUsageLiters),
                    labelColor: impact.waterUsageLiters < 1000 ? 'text-emerald-600' : impact.waterUsageLiters < 4000 ? 'text-amber-600' : 'text-red-500',
                  },
                  {
                    icon: <GlowIcon name="leaf" size={16} />,
                    label: getCarbonLabel(impact.carbonKg),
                    value: formatCarbon(impact.carbonKg),
                    labelColor: impact.carbonKg < 3 ? 'text-emerald-600' : impact.carbonKg < 6 ? 'text-amber-600' : 'text-red-500',
                  },
                  {
                    icon: <GlowIcon name="hourglass" size={16} />,
                    label: getDurabilityLabel(impact.durabilityWears),
                    value: `~${impact.durabilityWears} wears`,
                    labelColor: impact.durabilityWears >= 75 ? 'text-emerald-600' : impact.durabilityWears >= 50 ? 'text-amber-600' : 'text-red-500',
                  },
                  {
                    icon: <GlowIcon name="seedling" size={16} />,
                    label: getEndOfLifeLabel(garment.materials),
                    value: null,
                    labelColor: (() => {
                      const synPct = garment.materials.filter(m => m.fiberType === 'synthetic').reduce((s, m) => s + m.percentage, 0)
                      return synPct === 0 ? 'text-emerald-600' : synPct < 50 ? 'text-amber-600' : 'text-red-500'
                    })(),
                  },
                  ...(impact.microplasticRisk !== 'none'
                    ? [
                        {
                          icon: <GlowIcon name="microscope" size={16} />,
                          label: getMicroplasticShortLabel(impact.microplasticRisk),
                          value: `${impact.syntheticPercent}% synthetic`,
                          labelColor: impact.microplasticRisk === 'low' ? 'text-amber-600' : 'text-red-500',
                        },
                      ]
                    : []),
                ] as { icon: React.ReactNode; label: string; value: string | null; labelColor: string }[]
              ).map((row, i, arr) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-5 py-3.5${i < arr.length - 1 ? ' border-b border-border' : ''}`}
                >
                  <span className="opacity-50 flex-shrink-0">{row.icon}</span>
                  <span className={`text-sm flex-1 leading-snug ${row.labelColor}`}>{row.label}</span>
                  {row.value && (
                    <span className="text-xs text-muted tabular-nums">{row.value}</span>
                  )}
                </div>
              ))}
            </GlassCard>

            {/* Impact Per Wear */}
            <GlassCard variant="pink" className="p-5">
              <p className="text-[10px] text-muted uppercase tracking-[0.4em] mb-3 border-b border-border pb-3">
                Impact Per Wear
              </p>
              <p className="gradient-text text-5xl font-semibold font-display mb-2 leading-none tracking-tight">
                {(impact.impactPerWear * 1000).toFixed(1)}{' '}
                <span className="text-2xl font-normal">g CO₂e</span>
              </p>
              <p className="text-muted text-xs mb-8">The quiet emissions behind making, moving, and wearing this piece.</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">If you wear it {extraWears} more times…</span>
                  <span className="text-accent font-medium">{ipwSavingPct}% less per wear</span>
                </div>

                <div className="relative">
                  {clouds.map(c => (
                    <div
                      key={c.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: `calc(${c.pct}% + ${c.drift}px)`,
                        bottom: '8px',
                        animation: 'cloudRise 1.8s ease-out forwards',
                      }}
                    >
                      <svg
                        width={c.size}
                        height={c.size * 0.6}
                        viewBox="0 0 80 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <ellipse cx="40" cy="38" rx="34" ry="10" fill="rgba(196,30,58,0.50)" />
                        <ellipse cx="26" cy="30" rx="17" ry="14" fill="rgba(196,30,58,0.50)" />
                        <ellipse cx="44" cy="24" rx="19" ry="16" fill="rgba(196,30,58,0.50)" />
                        <ellipse cx="60" cy="30" rx="14" ry="12" fill="rgba(196,30,58,0.50)" />
                      </svg>
                    </div>
                  ))}
                  <input
                    type="range" min={10} max={100} step={10} value={extraWears}
                    onChange={e => {
                      const v = Number(e.target.value)
                      setExtraWears(v)
                      ;(e.target as HTMLInputElement).style.setProperty('--slider-pct', `${((v - 10) / 90) * 100}%`)
                      const pct = ((v - 10) / 90) * 100
                      const id = cloudId.current++
                      const cloud = {
                        id,
                        pct,
                        size: 32 + Math.random() * 24,
                        drift: (Math.random() - 0.5) * 28,
                      }
                      setClouds(prev => [...prev, cloud])
                      setTimeout(() => setClouds(prev => prev.filter(c => c.id !== id)), 1900)
                    }}
                    className="w-full relative z-10"
                    style={{ '--slider-pct': `${((extraWears - 10) / 90) * 100}%` } as React.CSSProperties}
                  />
                </div>

                <div className="flex justify-between text-xs text-faint">
                  <span>+10 wears</span><span>+100 wears</span>
                </div>
                <p className="text-text text-sm pt-1">
                  Improved impact:{' '}
                  <span className="text-text font-medium">{(improvedIpw * 1000).toFixed(1)} g CO₂e / wear</span>
                </p>
              </div>
            </GlassCard>

            {/* 3. What this means */}
            <div className="px-1 py-0.5">
              <p className="text-sm text-muted leading-relaxed italic">
                {getWhatThisMeans(garment, impact)}
              </p>
            </div>

            {/* 5. See full data toggle */}
            <button
              onClick={() => setShowFullData(v => !v)}
              className="flex items-center gap-1.5 text-xs text-faint hover:text-muted transition-colors py-1"
            >
              <span
                className="inline-block transition-transform duration-200"
                style={{ transform: showFullData ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                ›
              </span>
              {showFullData ? 'hide full data' : 'see full data'}
            </button>

            {/* Full data section */}
            {showFullData && (
              <div className="space-y-6 pt-2">
                <GlassCard className="p-5">
                  <p className="text-[10px] text-muted uppercase tracking-[0.4em] mb-5 border-b border-border pb-3">
                    Material Composition
                  </p>
                  <div className="flex flex-wrap gap-8 text-sm">
                    <div>
                      <span className="text-muted text-xs uppercase tracking-wide block mb-1">Origin</span>
                      <p className="text-text">{garment.countryOfOrigin}</p>
                    </div>
                    <div>
                      <span className="text-muted text-xs uppercase tracking-wide block mb-1">Transport</span>
                      <p className="text-text text-xs mt-0.5 max-w-[220px] leading-snug">{transportLabel}</p>
                    </div>
                  </div>
                </GlassCard>

                <div>
                  <p className="text-[10px] text-muted uppercase tracking-[0.4em] mb-4 px-1 border-b border-border pb-3">
                    Core Impact Metrics
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <ImpactMetricCard icon={<GlowIcon name="water" />} label="Water Usage" value={formatLitres(impact.waterUsageLiters)} subtext="Total estimated water footprint from fiber to finished garment" accent="violet" />
                    </div>
                    <ImpactMetricCard icon={<GlowIcon name="leaf" />} label="Carbon Footprint" value={formatCarbon(impact.carbonKg)} subtext="Manufacturing + transport + basic care phase" accent="pink" />
                    <ImpactMetricCard
                      icon={<GlowIcon name="microscope" />}
                      label="Microplastics"
                      value={MICROPLASTIC_LABELS[impact.microplasticRisk]}
                      subtext={impact.microplasticRisk === 'none' ? 'No synthetic fibers — no shedding risk' : `${impact.syntheticPercent}% synthetic content sheds microfibers in each wash`}
                      accent={impact.microplasticRisk === 'none' ? 'emerald' : impact.microplasticRisk === 'low' ? 'orange' : 'red'}
                    />
                    <div className="col-span-2">
                      <ImpactMetricCard icon={<GlowIcon name="hourglass" />} label="Estimated Lifespan" value={`~${impact.durabilityWears} wears`} subtext="Based on garment type and fiber composition" accent="violet" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ── Tab: Stories ──────────────────────────────────────────────── */}
        {activeTab === 'stories' && (
          <StoryCarousel items={[
            <VideoBackground key="water" src="/videos/water.mp4" overlayClass="video-overlay-dark" className="rounded-2xl overflow-hidden min-h-[300px]">
              <div className="p-5 min-h-[300px] flex flex-col justify-end">
                <p className="text-[10px] text-violet uppercase tracking-[0.4em] mb-3">Water Story</p>
                <p className="text-text font-display text-2xl font-semibold mb-3 leading-tight tracking-tight">
                  {formatLitres(impact.waterUsageLiters)} of water.
                </p>
                <p className="text-muted text-sm leading-relaxed">
                  That's enough drinking water for{' '}
                  <span className="text-text">{Math.round(impact.waterUsageLiters / 2).toLocaleString()} days</span>{' '}
                  for one person, hidden inside a single garment.
                </p>
              </div>
            </VideoBackground>,

            <VideoBackground key="carbon" src="/videos/carbon.mp4" overlayClass="video-overlay-dark" className="rounded-2xl overflow-hidden min-h-[300px]">
              <div className="p-5 min-h-[300px] flex flex-col justify-end">
                <p className="text-[10px] text-accent uppercase tracking-[0.4em] mb-3">Carbon Story</p>
                <p className="text-text font-display text-2xl font-semibold mb-3 leading-tight tracking-tight">
                  {formatCarbon(impact.carbonKg)} emitted.
                </p>
                <p className="text-muted text-sm leading-relaxed">
                  Equivalent to driving approximately{' '}
                  <span className="text-text">{Math.round(impact.carbonKg * 6)} km</span>{' '}
                  in an average petrol car. Spread across every wear — it adds up.
                </p>
              </div>
            </VideoBackground>,

            ...(laborNote ? [
              <GlassCard key="labour" className="p-5 min-h-[300px] relative overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-0 opacity-[0.04] bg-center bg-cover" style={{ backgroundImage: 'url(/images/labor.png)' }} aria-hidden="true" />
                <div className="relative z-10">
                  <p className="text-[10px] text-muted uppercase tracking-[0.4em] mb-5 border-b border-border pb-3">Labour Context</p>
                  <p className="text-xs text-accent mb-3">{garment.countryOfOrigin}</p>
                  <p className="text-muted text-sm leading-relaxed">{laborNote}</p>
                  <p className="text-faint text-xs mt-4">Context provided for awareness, not judgement. Supply chain conditions vary significantly across factories and tiers.</p>
                </div>
              </GlassCard>,
            ] : []),

            <GlassCard key="why" variant="violet" className="p-5 min-h-[300px]">
              <p className="text-[10px] text-muted uppercase tracking-[0.4em] mb-5 border-b border-border pb-3">Why This Matters</p>
              <ul className="space-y-5 text-sm text-muted">
                {[
                  impact.waterUsageLiters > 5000 && `The fashion industry consumes 79 billion cubic metres of water per year. Your ${garment.name} represents a fragment of that.`,
                  impact.syntheticPercent > 0 && `Synthetic fabrics shed an estimated 500,000 tonnes of microfibers into oceans annually during washing. Each cycle releases plastic.`,
                  impact.carbonKg > 5 && `The fashion sector emits 4 billion tonnes of CO₂ per year — more than aviation and shipping combined.`,
                  `By wearing this garment to its full lifespan (${impact.durabilityWears} times), you reduce its per-wear footprint to just ${(impact.impactPerWear * 1000).toFixed(1)} g CO₂e.`,
                ].filter(Boolean).map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                    <span>{point as string}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>,
          ]} />
        )}

        {/* ── Tab: Reduce Impact ────────────────────────────────────────── */}
        {activeTab === 'reduce' && (
          <GlassCard className="p-5">
            <p className="text-[10px] text-muted uppercase tracking-[0.4em] mb-5 border-b border-border pb-3">
              How to Reduce Impact
            </p>
            <ul className="space-y-4 text-sm">
              {[
                { icon: <GlowIcon name="repeat" />, text: 'Wear it more — each extra wear dilutes the total footprint' },
                { icon: <GlowIcon name="snowflake" />, text: 'Wash cold (30°C) to reduce care-phase carbon by ~40%' },
                { icon: <GlowIcon name="thread" />, text: 'Repair before replacing — extends lifespan and avoids new production' },
                { icon: <GlowIcon name="noSign" />, text: 'Skip the tumble dryer — air-drying halves laundry emissions' },
                impact.syntheticPercent > 0
                  ? { icon: <GlowIcon name="bubbles" />, text: 'Use a microplastic filter bag when washing synthetic items' }
                  : { icon: <GlowIcon name="seedling" />, text: 'Favour natural and recycled fibers when replacing this garment' },
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span>{tip.icon}</span>
                  <span className="text-muted">{tip.text}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        {/* ── Always visible: actions ───────────────────────────────────── */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-row justify-center gap-6">
            <button
              onClick={handleSave}
              disabled={saved}
              className={`btn-hero flex flex-col items-center justify-center text-[9px] tracking-widest uppercase font-sans ${saved ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{
                width: 80, height: 80,
                borderRadius: '9999px',
                border: '1px solid rgba(220,218,212,0.35)',
                color: 'rgba(0,0,0,0.85)',
                background: 'rgba(160,158,152,0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 0 16px rgba(200,200,195,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <span className="text-lg mb-0.5">{saved ? '✓' : '+'}</span>
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
            <Link
              to="/wardrobe"
              className="btn-hero flex flex-col items-center justify-center text-[9px] tracking-widest uppercase font-sans no-underline"
              style={{
                width: 80, height: 80,
                borderRadius: '9999px',
                border: '1px solid rgba(220,218,212,0.35)',
                color: 'rgba(0,0,0,0.85)',
                background: 'rgba(160,158,152,0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 0 16px rgba(200,200,195,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <span className="text-lg mb-0.5">↗</span>
              <span>Wardrobe</span>
            </Link>
          </div>
          <button
            onClick={() => setShowShareCard(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-burgundy/40 py-4 text-sm text-burgundy hover:border-burgundy transition-all duration-200 tracking-wide"
          >
            <span>↗</span> Share Impact Card
          </button>
          <Link to="/scan" className="block text-center text-xs text-muted hover:text-text transition-colors py-2">
            ← Scan another garment
          </Link>
          <button
            onClick={() => setShowMethodology(true)}
            className="w-full text-center text-xs text-faint hover:text-muted transition-colors py-1"
          >
            How are these estimates calculated? →
          </button>
        </div>
      </div>
    </div>
  )
}
