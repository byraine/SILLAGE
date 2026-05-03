import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GlowIcon } from '../components/ui/GlowIcon'
import type { IconName } from '../components/ui/GlowIcon'
import { v4 as uuidv4 } from 'uuid'
import { GlassCard } from '../components/ui/GlassCard'
import { MaterialTag } from '../components/ui/MaterialTag'
import { MethodologyModal } from '../components/ui/MethodologyModal'
import { ShareCard } from '../components/ui/ShareCard'
import { VideoBackground } from '../components/ui/VideoBackground'
import { useWardrobe } from '../hooks/useWardrobe'
import {
  formatLitres,
  formatCarbon,
  calcImprovedImpactPerWear,
  getMaterialDescriptor,
  getBestNextStep,
} from '../utils/calculations'
import { LABOR_CONTEXT, TRANSPORT_LABELS } from '../data/garments'
import type { Garment, GarmentImpact } from '../types/fashion'

// ── Types ─────────────────────────────────────────────────────────────────────

type Severity = 'high' | 'medium' | 'low' | 'benefit' | 'unknown'

interface Hotspot {
  id: string
  icon: IconName
  title: string
  microcopy: string
  value: string
  severityLabel: string
  severity: Severity
  detail: string
}

// ── Severity pill styles ──────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<Severity, string> = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-emerald-50 text-emerald-700',
  benefit: 'bg-emerald-50 text-emerald-700',
  unknown: 'bg-surface-2 text-faint',
}

// ── Material hotspot logic ────────────────────────────────────────────────────

function getMaterialHotspots(garment: Garment, impact: GarmentImpact): Hotspot[] {
  const seen = new Set<string>()
  const hotspots: Hotspot[] = []

  const add = (h: Hotspot) => {
    if (!seen.has(h.id)) { seen.add(h.id); hotspots.push(h) }
  }

  for (const mat of garment.materials) {
    if (mat.percentage < 15) continue
    const { name } = mat

    if (name === 'Cotton') {
      add({
        id: 'water', icon: 'water', title: 'Water',
        microcopy: 'One of the thirstiest crops in fashion. Most of this water is drawn from rivers and aquifers — and it doesn\'t return.',
        value: formatLitres(impact.waterUsageLiters),
        severityLabel: impact.waterUsageLiters > 5000 ? 'Major hotspot' : 'Notable',
        severity: impact.waterUsageLiters > 5000 ? 'high' : 'medium',
        detail: `Cotton farming accounts for ~69% of a cotton garment's water footprint (Mekonnen & Hoekstra, 2011). Irrigation-heavy regions like India and Pakistan are particularly impacted. This estimate covers fiber production only — dyeing and finishing add more. For scale: ${formatLitres(impact.waterUsageLiters)} is roughly ${Math.round(impact.waterUsageLiters / 2).toLocaleString()} days of drinking water for one person.`,
      })
      add({
        id: 'soil-land', icon: 'seedling', title: 'Soil & Land',
        microcopy: 'Cotton takes up 2.5% of global farmland but accounts for 16% of all insecticide use. Long-term monoculture quietly depletes the land.',
        value: 'Land-intensive',
        severityLabel: 'Systemic',
        severity: 'medium',
        detail: `Conventional cotton monocultures exhaust soil nutrients over seasons, creating dependency on synthetic fertilisers. Without certification (e.g. organic or regenerative), sourcing is impossible to verify from a label. Recycled cotton bypasses the land problem almost entirely.`,
      })
    }

    if (name === 'Organic Cotton') {
      add({
        id: 'water', icon: 'water', title: 'Water',
        microcopy: 'Organic cotton skips synthetic chemicals — but growing cotton still draws heavily on freshwater, organic or not.',
        value: formatLitres(impact.waterUsageLiters),
        severityLabel: 'Notable',
        severity: 'medium',
        detail: `Organic cotton uses roughly 40% less water than conventional cotton and avoids synthetic pesticides. It still remains one of the most water-intensive crops globally, and certification doesn't guarantee sourcing from water-secure regions.`,
      })
      add({
        id: 'soil-land', icon: 'seedling', title: 'Soil & Land',
        microcopy: 'No synthetic pesticides means healthier soil over time. This is one of organic cotton\'s clearest benefits.',
        value: 'Reduced pressure',
        severityLabel: 'Better',
        severity: 'low',
        detail: `Organic farming builds soil health rather than depleting it, supports biodiversity, and reduces chemical runoff into waterways. The trade-off is typically lower yield per hectare, meaning more land may be needed for the same output.`,
      })
    }

    if (name === 'Recycled Cotton') {
      add({
        id: 'circularity', icon: 'repeat', title: 'Circularity',
        microcopy: 'Recycled cotton reuses fiber that already exists. Up to 98% less water than starting from a seed.',
        value: '~98% less water',
        severityLabel: 'Better choice',
        severity: 'benefit',
        detail: `Recycled cotton is mechanically processed from post-consumer garments or industrial cutting waste — no new crops, no irrigation, drastically reduced chemical inputs. Fiber length may be shorter, affecting texture and durability, but the environmental case strongly favours recycled over virgin cotton.`,
      })
    }

    if (name === 'Polyester') {
      add({
        id: 'fossil-fuels', icon: 'leaf', title: 'Fossil Fuels',
        microcopy: 'Polyester is petroleum, shaped into thread. Every gram of this fabric started life underground, millions of years ago.',
        value: formatCarbon(parseFloat((impact.carbonKg * mat.percentage / 100).toFixed(1))),
        severityLabel: 'Major hotspot',
        severity: 'high',
        detail: `Virgin polyester emits ~9.5 kg CO₂e per kg of fiber — roughly 3× more than cotton, 5× more than linen. It's synthesised from crude oil derivatives. This estimate reflects the manufacturing phase; transport and care add to the total.`,
      })
      add({
        id: 'microplastics', icon: 'microscope', title: 'Microplastics',
        microcopy: 'Each wash releases thousands of plastic fibers — invisible, and too small for most water treatment plants to filter.',
        value: impact.microplasticRisk === 'high' ? '~700K fibers/wash' : '~300K fibers/wash',
        severityLabel: impact.microplasticRisk === 'high' ? 'Major hotspot' : 'Notable',
        severity: impact.microplasticRisk === 'high' ? 'high' : 'medium',
        detail: `Synthetic textiles are estimated to account for 35% of all primary microplastics in the ocean (IUCN, 2017). These fibers absorb toxins and enter food chains. A microplastic filter bag (e.g. Guppyfriend) can capture up to 86% of shed fibers before they reach the drain.`,
      })
      add({
        id: 'end-of-life', icon: 'hourglass', title: 'End of Life',
        microcopy: 'This piece won\'t biodegrade. In a landfill, it will outlast every person who ever wears it.',
        value: '200–500 yr persist',
        severityLabel: 'Permanent',
        severity: 'high',
        detail: `Polyester does not break down under landfill conditions. Current global textile recycling handles less than 1% of all clothing. Without closed-loop mechanical or chemical recycling, synthetic garments are effectively permanent waste.`,
      })
    }

    if (name === 'Recycled Polyester') {
      add({
        id: 'fossil-fuels', icon: 'leaf', title: 'Fossil Fuels',
        microcopy: 'Recycled polyester starts from PET plastic, not crude oil — a real reduction, but still energy-intensive to produce.',
        value: formatCarbon(parseFloat((impact.carbonKg * mat.percentage / 100).toFixed(1))),
        severityLabel: 'Reduced',
        severity: 'medium',
        detail: `Recycled polyester cuts carbon by ~65% versus virgin polyester (from ~9.5 to ~3.2 kg CO₂e/kg). It's made from PET bottles or recycled polyester fabrics. However, it still sheds microplastics when washed — that behaviour doesn't change with the fiber's origin.`,
      })
      add({
        id: 'microplastics', icon: 'microscope', title: 'Microplastics',
        microcopy: 'Recycled or not — synthetic fibers shed plastic with every wash. The shedding behaviour is the same regardless of origin.',
        value: '~300K fibers/wash',
        severityLabel: 'Notable',
        severity: 'medium',
        detail: `Recycled polyester has the same shedding behaviour as virgin polyester. A microplastic filter bag or washing machine filter significantly reduces the amount entering waterways per cycle.`,
      })
    }

    if (name === 'Wool') {
      add({
        id: 'methane', icon: 'warning', title: 'Methane',
        microcopy: 'Sheep produce methane — a greenhouse gas 80× more potent than CO₂ over 20 years. It\'s the biggest single factor in wool\'s carbon cost.',
        value: formatCarbon(impact.carbonKg),
        severityLabel: 'Major hotspot',
        severity: 'high',
        detail: `Wool carries one of the highest carbon footprints in textiles at ~36 kg CO₂e/kg — driven primarily by enteric fermentation (livestock digestion releasing methane). Land clearing for pasture adds further. Some regenerative wool farms sequester carbon through soil management — but this isn't verifiable from a label.`,
      })
      add({
        id: 'land-use', icon: 'globe', title: 'Land Use',
        microcopy: 'Sheep need a lot of space. Wool is one of the most land-intensive fibers, measured per kilogram of usable output.',
        value: 'High land pressure',
        severityLabel: 'Systemic',
        severity: 'medium',
        detail: `Livestock-based textiles require significantly more land per kg of fiber than plant alternatives. Overgrazing contributes to soil erosion and biodiversity loss. Regenerative grazing can reverse this — but requires third-party certification to verify.`,
      })
      add({
        id: 'animal-welfare', icon: 'thread', title: 'Animal Welfare',
        microcopy: 'Conditions vary enormously across sheep farms. Without certification, there\'s no way to know which end of that spectrum this garment sits at.',
        value: 'Unverifiable',
        severityLabel: 'Unknown',
        severity: 'unknown',
        detail: `Welfare standards range from exemplary (RWS — Responsible Wool Standard, or ZQ Merino certified) to deeply problematic. Mulesing — a painful anti-flystrike procedure — remains common in Australia, the world's largest wool producer, without certification. Country of origin is not a reliable welfare proxy.`,
      })
    }

    if (name === 'Viscose' || name === 'Modal') {
      add({
        id: 'forest-mgmt', icon: 'seedling', title: 'Forest Management',
        microcopy: `${name} is made from wood pulp. The impact depends entirely on which forests were cleared — and whether they were managed, certified, or ancient.`,
        value: 'Source uncertain',
        severityLabel: 'Watch',
        severity: 'medium',
        detail: `An estimated 30% of viscose fiber comes from ancient or endangered forests (Canopy Planet, 2018). FSC certification or a CanopyStyle commitment from the manufacturer indicates more responsible sourcing. Without labeling, provenance is effectively unknown. Modal (beech wood) has a narrower source base and is generally considered lower risk than standard viscose.`,
      })
      add({
        id: 'chemicals', icon: 'microscope', title: 'Chemical Processing',
        microcopy: `${name} is wood dissolved in chemistry. The fiber feels natural — but getting there is process-intensive.`,
        value: 'Process-heavy',
        severityLabel: 'Notable',
        severity: 'medium',
        detail: `Viscose production uses carbon disulfide, sodium hydroxide, and sulfuric acid in a wet-spinning process. These chemicals are toxic if released into waterways. Closed-loop mills recover and reuse solvents; open-loop mills do not. Without supply chain traceability, the two are indistinguishable from a garment label.`,
      })
    }

    if (name === 'Lyocell') {
      add({
        id: 'closed-loop', icon: 'seedling', title: 'Closed-Loop Processing',
        microcopy: 'Lyocell (often sold as Tencel) uses a closed-loop process that recovers nearly all of its solvents. One of the cleaner semi-synthetics.',
        value: '~99% solvent recovery',
        severityLabel: 'Better choice',
        severity: 'benefit',
        detail: `Lyocell is produced from wood pulp (usually FSC-certified eucalyptus) using a closed-loop solvent process where ~99% of NMMO solvent is recovered and reused. It biodegrades under industrial composting conditions. It's considered one of the most responsible semi-synthetic fibers currently available.`,
      })
    }

    if (name === 'Linen' || name === 'Hemp') {
      add({
        id: 'low-input', icon: 'seedling', title: 'Low-Input Farming',
        microcopy: `${name} grows without heavy irrigation or pesticides. Among natural fibers, it sits toward the cleaner end.`,
        value: 'Lower impact',
        severityLabel: 'Better choice',
        severity: 'benefit',
        detail: `${name} is considered one of the most environmentally sound textile fibers. It requires minimal irrigation (relying mostly on rainfall), grows quickly without synthetic pesticides, and enriches the soil it grows in. Retting — the water processing stage — can be intensive but is improving with dew-retting methods.`,
      })
    }

    if (name === 'Nylon' || name === 'Acrylic') {
      add({
        id: 'fossil-fuels', icon: 'leaf', title: 'Fossil Fuels',
        microcopy: `${name} is a synthetic polymer — derived from petroleum feedstocks, one step removed from oil.`,
        value: formatCarbon(parseFloat((impact.carbonKg * mat.percentage / 100).toFixed(1))),
        severityLabel: 'High',
        severity: 'high',
        detail: `${name === 'Nylon' ? 'Nylon (polyamide)' : 'Acrylic'} is synthesised from petrochemical derivatives. Production is energy-intensive and non-biodegradable. Like polyester, it sheds microplastics during washing.`,
      })
      add({
        id: 'microplastics', icon: 'microscope', title: 'Microplastics',
        microcopy: 'Synthetic fibers shed plastic particles with every wash — smaller than a grain of sand, invisible to the eye.',
        value: '~300K+ fibers/wash',
        severityLabel: 'Notable',
        severity: 'medium',
        detail: `Synthetic fibers are a leading source of microplastic pollution in marine environments. A microplastic filter bag significantly reduces the amount entering waterways per wash cycle.`,
      })
    }
  }

  if (hotspots.length === 0) {
    hotspots.push(
      {
        id: 'carbon', icon: 'leaf', title: 'Carbon Footprint',
        microcopy: 'Total emissions from making and moving this garment, from fiber to finished product.',
        value: formatCarbon(impact.carbonKg),
        severityLabel: impact.carbonKg > 6 ? 'High' : impact.carbonKg > 3 ? 'Moderate' : 'Lower',
        severity: impact.carbonKg > 6 ? 'high' : impact.carbonKg > 3 ? 'medium' : 'low',
        detail: `Carbon estimates cover fiber production, fabric manufacturing, and transport. Care-phase emissions (washing, drying) add ~0.5 kg CO₂e over the garment's lifetime.`,
      },
      {
        id: 'water', icon: 'water', title: 'Water Use',
        microcopy: 'Water consumed from fiber production through dyeing and finishing.',
        value: formatLitres(impact.waterUsageLiters),
        severityLabel: impact.waterUsageLiters > 4000 ? 'High' : 'Moderate',
        severity: impact.waterUsageLiters > 4000 ? 'high' : 'medium',
        detail: `Water figures are averages from published lifecycle assessment data. Actual usage varies by farming region, dye process, and factory water management.`,
      }
    )
  }

  return hotspots.slice(0, 4)
}

// ── Data confidence ───────────────────────────────────────────────────────────

function getDataConfidence(garment: Garment, impact: GarmentImpact) {
  return {
    known: [
      garment.materials.map(m => `${m.percentage}% ${m.name}`).join(', '),
      `Made in ${garment.countryOfOrigin}`,
      `Garment type: ${garment.category}`,
      impact.syntheticPercent > 0 ? 'Synthetic fibers present' : 'No synthetic fibers',
    ],
    estimated: [
      `${formatLitres(impact.waterUsageLiters)} water footprint`,
      `${formatCarbon(impact.carbonKg)} carbon`,
      `~${impact.durabilityWears} wears lifespan`,
      `Transport: ${TRANSPORT_LABELS[garment.countryOfOrigin] ?? impact.transportLabel}`,
    ],
    unknown: [
      'Which specific factory',
      'Dye chemistry & wastewater',
      'Worker wages & conditions',
      'Actual transport route',
      ...(garment.materials.some(m => ['Viscose', 'Modal'].includes(m.name)) ? ['Wood pulp source forest'] : []),
      ...(garment.materials.some(m => m.name === 'Wool') ? ['Animal welfare standard'] : []),
    ],
  }
}

// ── Hotspot row ───────────────────────────────────────────────────────────────

function HotspotRow({ hotspot }: { hotspot: Hotspot }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <button onClick={() => setExpanded(v => !v)} className="w-full text-left">
        <div className="flex items-start gap-3.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-2 flex-shrink-0 mt-0.5">
            <GlowIcon name={hotspot.icon} size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[10px] font-medium text-text uppercase tracking-[0.15em]">{hotspot.title}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${SEVERITY_STYLES[hotspot.severity]}`}>
                {hotspot.severityLabel}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">{hotspot.microcopy}</p>
          </div>
        </div>
        <div className="mt-2.5 ml-[2.625rem] flex items-baseline justify-between">
          <span className="font-display text-lg font-semibold text-text">{hotspot.value}</span>
          <span className="text-[9px] text-faint flex items-center gap-0.5">
            {expanded ? 'less' : 'more'}
            <span
              className="inline-block transition-transform duration-200"
              style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >›</span>
          </span>
        </div>
      </button>
      {expanded && (
        <div className="mt-3 ml-[2.625rem] p-3 rounded bg-surface border border-border text-[10px] text-muted leading-relaxed">
          {hotspot.detail}
        </div>
      )}
    </div>
  )
}

// ── Story carousel ────────────────────────────────────────────────────────────

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
        {[...backIndices].reverse().map(idx => {
          const depth = idx - current
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
      <div className="flex justify-center items-center gap-2 mt-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-5 h-1.5 bg-accent' : i < current ? 'w-1.5 h-1.5 bg-accent/25' : 'w-1.5 h-1.5 bg-muted/25'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ index, title, subtitle }: { index: string; title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <p className="text-[9px] uppercase tracking-[0.4em] text-faint mb-0.5">{index}</p>
      <h2 className="font-display text-xl font-semibold text-text leading-snug">{title}</h2>
      <p className="text-[10px] text-faint mt-0.5 italic">{subtitle}</p>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function ResultsScreen() {
  const navigate = useNavigate()
  const { addItem, isInWardrobe } = useWardrobe()
  const [showMethodology, setShowMethodology] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const [extraWears, setExtraWears] = useState(20)
  const [showStories, setShowStories] = useState(false)
  const [showOriginDetail, setShowOriginDetail] = useState(false)
  const [clouds, setClouds] = useState<{ id: number; pct: number; size: number; drift: number }[]>([])
  const cloudId = useRef(0)
  const [garment, setGarment] = useState<Garment | null>(null)
  const [impact, setImpact] = useState<GarmentImpact | null>(null)

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
  const transportLabel = TRANSPORT_LABELS[garment.countryOfOrigin] ?? impact.transportLabel
  const improvedIpw = calcImprovedImpactPerWear(impact.carbonKg, impact.durabilityWears, extraWears)
  const ipwSavingPct = Math.round(((impact.impactPerWear - improvedIpw) / impact.impactPerWear) * 100)
  const hotspots = getMaterialHotspots(garment, impact)
  const { known, estimated, unknown } = getDataConfidence(garment, impact)
  const nextStep = getBestNextStep(garment, impact)

  function handleSave() {
    if (!garment || !impact || saved) return
    addItem({ id: uuidv4(), garment, impact, savedAt: new Date().toISOString(), wornCount: 0 })
  }

  const circleBtn = {
    width: 80, height: 80, borderRadius: '9999px',
    border: '1px solid rgba(220,218,212,0.35)',
    color: 'rgba(0,0,0,0.85)',
    background: 'rgba(160,158,152,0.35)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 0 16px rgba(200,200,195,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
  }

  return (
    <div className="min-h-dvh bg-background pb-24">
      {showMethodology && <MethodologyModal onClose={() => setShowMethodology(false)} />}
      {showShareCard && <ShareCard garment={garment} impact={impact} onClose={() => setShowShareCard(false)} />}

      {/* ── Hero masthead ───────────────────────────────────────────── */}
      <div className="relative h-[38dvh] overflow-hidden flex flex-col">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 60% 0%, rgba(219,218,210,0.3) 0%, rgba(245,243,238,0) 60%)' }}
        />
        <div className="absolute inset-0 video-overlay" />

        <div className="relative z-10 px-5 pt-24 pb-0">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-accent/50 flex-shrink-0" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent">Material Passport</p>
          </div>
        </div>

        <div className="relative z-10 overflow-hidden mt-4">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 22s linear infinite' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="font-display font-semibold tracking-tight text-text/30 select-none px-10" style={{ fontSize: '1.75rem' }}>
                {garment.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div className="relative z-10 px-5 pb-10">
          <p className="text-muted/70 text-xs mb-3 tracking-[0.2em] uppercase">Made in {garment.countryOfOrigin}</p>
          <div className="flex flex-wrap gap-2">
            {garment.materials.map(m => <MaterialTag key={m.name} material={m} />)}
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-10">

        {/* ── § 01 Material Identity ──────────────────────────────── */}
        <section>
          <SectionHeader index="§ 01" title="Material Identity" subtitle="What this garment is made of, and what that means." />

          <GlassCard className="overflow-hidden">
            {garment.materials.map((m, i) => (
              <div key={m.name} className={`px-5 py-4 ${i < garment.materials.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-text">{m.name}</span>
                      {garment.materials.length > 1 && (
                        <span className="text-[10px] text-faint">{m.percentage}%</span>
                      )}
                    </div>
                    <p className="text-xs text-muted leading-snug">{getMaterialDescriptor(m)}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border flex-shrink-0 ${
                    m.fiberType === 'synthetic'      ? 'border-amber-200 text-amber-700 bg-amber-50' :
                    m.fiberType === 'recycled'       ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                    m.fiberType === 'semi-synthetic' ? 'border-border text-faint bg-surface' :
                                                       'border-border text-muted bg-surface'
                  }`}>
                    {m.fiberType}
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowOriginDetail(v => !v)}
              className="w-full flex items-center justify-between px-5 py-3.5 border-t border-border text-[10px] text-faint hover:text-muted transition-colors"
            >
              <span className="uppercase tracking-[0.15em]">Origin & transport</span>
              <span
                className="inline-block transition-transform duration-200"
                style={{ transform: showOriginDetail ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >›</span>
            </button>

            {showOriginDetail && (
              <div className="px-5 pb-5 pt-3 space-y-4 border-t border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-faint mb-1">Country</p>
                    <p className="text-xs text-text">{garment.countryOfOrigin}</p>
                  </div>
                  <div className="text-right max-w-[55%]">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-faint mb-1">Transport</p>
                    <p className="text-xs text-muted leading-snug">{transportLabel}</p>
                  </div>
                </div>
                {laborNote && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-faint mb-2">Labour context</p>
                    <p className="text-xs text-muted leading-relaxed">{laborNote}</p>
                    <p className="text-[10px] text-faint mt-2 italic">Context for awareness. Conditions vary significantly across factories and tiers.</p>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </section>

        {/* ── § 02 Impact Hotspots ────────────────────────────────── */}
        <section>
          <SectionHeader index="§ 02" title="Impact Hotspots" subtitle="Where this material leaves its mark." />

          <GlassCard className="px-5">
            {hotspots.map(h => <HotspotRow key={h.id} hotspot={h} />)}
          </GlassCard>
        </section>

        {/* ── § 03 Data Confidence ────────────────────────────────── */}
        <section>
          <SectionHeader index="§ 03" title="Data Confidence" subtitle="What we know. What we've estimated. What we can't see." />

          <GlassCard className="p-5">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <p className="text-[9px] uppercase tracking-[0.25em] text-emerald-700">Known</p>
                </div>
                <ul className="space-y-2">
                  {known.map((item, i) => (
                    <li key={i} className="text-[10px] text-text leading-snug">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <p className="text-[9px] uppercase tracking-[0.25em] text-amber-700">Estimated</p>
                </div>
                <ul className="space-y-2">
                  {estimated.map((item, i) => (
                    <li key={i} className="text-[10px] text-muted leading-snug">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-faint flex-shrink-0" />
                  <p className="text-[9px] uppercase tracking-[0.25em] text-faint">Unknown</p>
                </div>
                <ul className="space-y-2">
                  {unknown.map((item, i) => (
                    <li key={i} className="text-[10px] text-faint leading-snug">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[9px] text-faint mt-5 pt-3 border-t border-border leading-relaxed">
              Estimates modelled from published LCA literature — Mekonnen & Hoekstra 2011, WRAP 2017, IUCN 2017. Real-world impact varies by factory, region, and dye chemistry.
            </p>
          </GlassCard>
        </section>

        {/* ── § 04 Per-Wear Impact ─────────────────────────────────── */}
        <section>
          <SectionHeader index="§ 04" title="Per-Wear Impact" subtitle="The longer you keep it, the lighter it gets." />

          <GlassCard variant="pink" className="p-5">
            <p className="gradient-text text-5xl font-semibold font-display mb-1 leading-none tracking-tight">
              {(impact.impactPerWear * 1000).toFixed(1)}{' '}
              <span className="text-2xl font-normal">g CO₂e</span>
            </p>
            <p className="text-muted text-xs mb-6">
              per wear, right now. Every time you reach for this piece, that number falls.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Wear it {extraWears} more times…</span>
                <span className="text-accent font-medium">{ipwSavingPct}% less per wear</span>
              </div>

              <div className="relative">
                {clouds.map(c => (
                  <div
                    key={c.id}
                    className="absolute pointer-events-none"
                    style={{ left: `calc(${c.pct}% + ${c.drift}px)`, bottom: '8px', animation: 'cloudRise 1.8s ease-out forwards' }}
                  >
                    <svg width={c.size} height={c.size * 0.6} viewBox="0 0 80 48" fill="none">
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
                    setClouds(prev => [...prev, { id, pct, size: 32 + Math.random() * 24, drift: (Math.random() - 0.5) * 28 }])
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
                Down to{' '}
                <span className="font-medium">{(improvedIpw * 1000).toFixed(1)} g CO₂e / wear</span>
              </p>
            </div>
          </GlassCard>
        </section>

        {/* ── § 05 Next Best Action ────────────────────────────────── */}
        <section>
          <SectionHeader index="§ 05" title="Next Best Action" subtitle="The most meaningful thing you can do right now." />

          <GlassCard variant="violet" className="p-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center flex-shrink-0 mt-0.5 bg-surface">
                <GlowIcon
                  name={impact.microplasticRisk !== 'none' ? 'bubbles' : impact.waterUsageLiters > 5000 ? 'repeat' : 'seedling'}
                  size={14}
                />
              </div>
              <div>
                <p className="text-sm text-text leading-relaxed">{nextStep}</p>
                {impact.microplasticRisk !== 'none' && (
                  <p className="text-[10px] text-muted mt-2 leading-relaxed">
                    A microplastic filter bag (e.g. Guppyfriend, ~€25) can reduce fiber shedding by up to 86% across all your synthetic washes.
                  </p>
                )}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ── Context stories (collapsible) ───────────────────────── */}
        <section>
          <button
            onClick={() => setShowStories(v => !v)}
            className="flex items-center gap-2 text-[10px] text-faint hover:text-muted transition-colors w-full py-1 uppercase tracking-[0.2em]"
          >
            <span
              className="inline-block transition-transform duration-200"
              style={{ transform: showStories ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >›</span>
            {showStories ? 'hide stories' : 'stories & wider context'}
          </button>

          {showStories && (
            <div className="mt-4">
              <StoryCarousel items={[
                <VideoBackground key="water" src="/videos/water.mp4" overlayClass="video-overlay-dark" className="rounded-2xl overflow-hidden min-h-[300px]">
                  <div className="p-5 min-h-[300px] flex flex-col justify-end">
                    <p className="text-[10px] text-violet uppercase tracking-[0.4em] mb-3">Water Story</p>
                    <p className="text-text font-display text-2xl font-semibold mb-3 leading-tight tracking-tight">
                      {formatLitres(impact.waterUsageLiters)} of water.
                    </p>
                    <p className="text-muted text-sm leading-relaxed">
                      Enough drinking water for{' '}
                      <span className="text-text">{Math.round(impact.waterUsageLiters / 2).toLocaleString()} days</span>{' '}
                      for one person, embedded in a single garment.
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
                      Equivalent to driving roughly{' '}
                      <span className="text-text">{Math.round(impact.carbonKg * 6)} km</span>{' '}
                      in a petrol car. Spread across every wear — it adds up.
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
                      <p className="text-faint text-xs mt-4">Context for awareness, not judgement. Conditions vary significantly across factories and tiers.</p>
                    </div>
                  </GlassCard>,
                ] : []),

                <GlassCard key="why" variant="violet" className="p-5 min-h-[300px]">
                  <p className="text-[10px] text-muted uppercase tracking-[0.4em] mb-5 border-b border-border pb-3">Why This Matters</p>
                  <ul className="space-y-5 text-sm text-muted">
                    {[
                      impact.waterUsageLiters > 5000 && `The fashion industry consumes 79 billion cubic metres of water per year. Your ${garment.name} is a fragment of that.`,
                      impact.syntheticPercent > 0 && `Synthetic fabrics shed an estimated 500,000 tonnes of microfibers into oceans annually. Each wash cycle releases plastic.`,
                      impact.carbonKg > 5 && `The fashion sector emits 4 billion tonnes of CO₂ per year — more than aviation and shipping combined.`,
                      `Worn to its full lifespan (~${impact.durabilityWears} times), this garment's per-wear footprint drops to just ${(impact.impactPerWear * 1000).toFixed(1)} g CO₂e.`,
                    ].filter(Boolean).map((point, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                        <span>{point as string}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>,
              ]} />
            </div>
          )}
        </section>

        {/* ── Actions ──────────────────────────────────────────────── */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-row justify-center gap-6">
            <button
              onClick={handleSave}
              disabled={saved}
              className={`btn-hero flex flex-col items-center justify-center text-[9px] tracking-widest uppercase font-sans ${saved ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={circleBtn}
            >
              <span className="text-lg mb-0.5">{saved ? '✓' : '+'}</span>
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
            <Link
              to="/wardrobe"
              className="btn-hero flex flex-col items-center justify-center text-[9px] tracking-widest uppercase font-sans no-underline"
              style={circleBtn}
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
