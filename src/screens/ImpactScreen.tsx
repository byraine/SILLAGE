import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlowIcon } from '../components/ui/GlowIcon'
import type { IconName } from '../components/ui/GlowIcon'
import { GlassCard } from '../components/ui/GlassCard'
import { WardrobeShareCard } from '../components/ui/WardrobeShareCard'
import { useWardrobe } from '../hooks/useWardrobe'

// ── Action data ───────────────────────────────────────────────────────────────

interface Action {
  icon: IconName
  title: string
  impact: string
  detail: string
  syntheticOnly?: boolean
  naturalOnly?: boolean
}

interface Section {
  id: string
  index: string
  title: string
  subtitle: string
  actions: Action[]
}

const SECTIONS: Section[] = [
  {
    id: 'care',
    index: '§ 01',
    title: 'Care',
    subtitle: 'How you wash and dry determines a garment\'s second, third, and fiftieth life.',
    actions: [
      {
        icon: 'snowflake',
        title: 'Wash cold',
        impact: '~40% lower care-phase carbon',
        detail: 'Washing at 30°C instead of 60°C cuts laundry energy by up to 57%. Cold water is just as effective for everyday wear — and gentler on fibers, which extends lifespan.',
      },
      {
        icon: 'noSign',
        title: 'Skip the tumble dryer',
        impact: '~50% lower laundry emissions',
        detail: 'Air-drying instead of tumble-drying saves around 1 kg CO₂e per cycle. Over a garment\'s life that compounds significantly — and heat is one of the main causes of fabric breakdown.',
      },
      {
        icon: 'bubbles',
        title: 'Use a microplastic filter bag',
        impact: 'Up to 86% fewer shed fibers',
        detail: 'A filter bag (e.g. Guppyfriend, ~€25) captures synthetic fibers before they reach the drain. Essential for any garment with polyester, nylon, or acrylic content. One bag works for your entire wash.',
        syntheticOnly: true,
      },
      {
        icon: 'repeat',
        title: 'Wash less often',
        impact: 'Fewer cycles, less wear on fibers',
        detail: 'Most garments don\'t need washing after every wear. Airing out, spot-cleaning, and rotation keep clothes fresh without the repeated stress of a wash cycle.',
      },
    ],
  },
  {
    id: 'longevity',
    index: '§ 02',
    title: 'Longevity',
    subtitle: 'The longer a garment stays in use, the smaller its footprint per wear becomes.',
    actions: [
      {
        icon: 'repeat',
        title: 'Wear it more',
        impact: 'Up to 50% less impact per wear',
        detail: 'The single most effective thing you can do. Wearing a garment twice as long halves its per-wear footprint — no new production, no new resources, no new emissions.',
      },
      {
        icon: 'thread',
        title: 'Repair before replacing',
        impact: 'Avoids 5–15 kg CO₂e per replacement',
        detail: 'A mended seam or patched knee extends a garment\'s life by years. Most repairs take under 30 minutes and cost almost nothing. Some cities have repair cafés that do it for free.',
      },
      {
        icon: 'chart',
        title: 'Rotate your pieces',
        impact: 'Slows wear on each item',
        detail: 'Rotating between garments gives each piece time to recover — fibers relax, fabrics breathe. Pilling and wear accelerate when the same item is used daily without rest.',
      },
    ],
  },
  {
    id: 'next-life',
    index: '§ 03',
    title: 'Next Life',
    subtitle: 'When you\'re done with it, how it leaves matters as much as how it arrived.',
    actions: [
      {
        icon: 'globe',
        title: 'Donate or resell',
        impact: 'Extends usable life by years',
        detail: 'A garment in good condition has value to someone else. Resale platforms, charity shops, and local swaps give pieces a second life without triggering new production. Every resale displaces a new purchase.',
      },
      {
        icon: 'search',
        title: 'Use brand take-back programs',
        impact: 'Keeps materials in the loop',
        detail: 'Several brands (H&M, Patagonia, Levi\'s, Arket) accept worn garments for recycling or resale. Check the label or brand website. Availability varies by country and program.',
      },
      {
        icon: 'seedling',
        title: 'Compost natural fibers',
        impact: 'Returns cleanly to earth',
        detail: 'Pure cotton, linen, wool, and hemp can be composted under the right conditions. Remove synthetic trims (zips, buttons, labels) first. Industrial composting handles mixed materials better than home composting.',
        naturalOnly: true,
      },
      {
        icon: 'warning',
        title: 'Avoid the bin',
        impact: 'Landfill is permanent',
        detail: 'Less than 1% of textiles are recycled into new fiber. In a landfill, synthetic garments persist for hundreds of years; even natural ones emit methane as they break down. Almost any other end-of-life option is better than the bin.',
      },
    ],
  },
]

// ── Action card ───────────────────────────────────────────────────────────────

function ActionCard({ action }: { action: Action }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(v => !v)}
      className={`w-full text-left rounded-2xl p-4 border transition-all duration-200 ${
        open ? 'glass-pink border-burgundy/40' : 'glass border-border hover:border-burgundy/30'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-2 flex-shrink-0">
          <GlowIcon name={action.icon} size={13} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">{action.title}</p>
          <p className={`text-[10px] mt-0.5 transition-colors ${open ? 'text-burgundy' : 'text-faint'}`}>
            {action.impact}
          </p>
        </div>
        <span
          className="text-faint text-sm flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ↓
        </span>
      </div>
      {open && (
        <p className="text-muted text-xs leading-relaxed mt-4 pt-4 border-t border-border text-left">
          {action.detail}
        </p>
      )}
    </button>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function ImpactScreen() {
  const { wardrobe, totalCarbon, totalWater } = useWardrobe()
  const [showShareCard, setShowShareCard] = useState(false)

  const isEmpty = wardrobe.length === 0
  const hasSynthetic = wardrobe.some(w => w.impact.syntheticPercent > 0)
  const hasNatural = wardrobe.some(w =>
    w.garment.materials.some(m => m.fiberType === 'natural')
  )
  const avgIpw =
    wardrobe.length > 0
      ? wardrobe.reduce((s, w) => s + w.impact.impactPerWear, 0) / wardrobe.length
      : 0

  return (
    <div className="min-h-dvh bg-background pt-16 pb-8 px-4">
      {showShareCard && (
        <WardrobeShareCard
          wardrobe={wardrobe}
          totalCarbon={totalCarbon}
          totalWater={totalWater}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-[9px] uppercase tracking-[0.4em] text-faint mb-1">§ Action</p>
        <h1 className="font-display text-3xl font-semibold text-text leading-tight">What you can do.</h1>
        <p className="text-xs text-muted mt-1">Care, longevity, and next-life guidance for everything you wear.</p>
      </div>

      {/* ── Wardrobe snapshot (only if items saved) ─────────────────── */}
      {!isEmpty && (
        <GlassCard variant="pink" className="p-4 mb-8">
          <p className="text-[9px] uppercase tracking-[0.3em] text-faint mb-3">Your saved garments</p>
          <div>
            <p className="font-display text-2xl font-semibold text-text leading-none">{wardrobe.length}</p>
            <p className="text-[10px] text-muted mt-0.5">piece{wardrobe.length !== 1 ? 's' : ''} saved</p>
          </div>
          {avgIpw > 0 && (
            <p className="text-[10px] text-muted mt-3 pt-3 border-t border-border">
              Average impact per wear across your wardrobe:{' '}
              <span className="text-text font-medium">{(avgIpw * 1000).toFixed(1)} g CO₂e</span>
            </p>
          )}
        </GlassCard>
      )}

      {isEmpty && (
        <GlassCard className="p-5 mb-8 text-center">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Scan a garment and save it to Memory to see your wardrobe snapshot here.
          </p>
          <Link to="/scan" className="btn-primary text-sm">Start Scanning</Link>
        </GlassCard>
      )}

      {/* ── Three action sections ────────────────────────────────────── */}
      <div className="space-y-10">
        {SECTIONS.map(section => {
          const visibleActions = section.actions.filter(a => {
            if (a.syntheticOnly && !hasSynthetic) return false
            if (a.naturalOnly && !hasNatural) return false
            return true
          })

          return (
            <section key={section.id}>
              <div className="mb-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-faint mb-0.5">{section.index}</p>
                <h2 className="font-display text-xl font-semibold text-text">{section.title}</h2>
                <p className="text-[10px] text-faint mt-0.5 italic">{section.subtitle}</p>
              </div>
              <div className="space-y-2">
                {visibleActions.map((action, i) => (
                  <ActionCard key={i} action={action} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* ── Bottom actions ───────────────────────────────────────────── */}
      <div className="mt-10 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/scan" className="flex-1 btn-primary text-sm text-center py-4">
            Scan More Garments
          </Link>
          <Link to="/wardrobe" className="flex-1 btn-ghost text-sm text-center py-4">
            View Memory
          </Link>
        </div>

        {!isEmpty && (
          <button
            onClick={() => setShowShareCard(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-burgundy/40 py-4 text-sm text-burgundy hover:border-burgundy transition-all duration-200"
          >
            <span>↗</span> Share Impact Card
          </button>
        )}

        <p className="text-center text-[10px] text-faint leading-relaxed pb-4 pt-2">
          All figures shown are educational estimates only. SILLAGE is a concept portfolio demo — not a scientifically validated tool. Impact varies significantly by supply chain, factory, and consumer behaviour.
        </p>
      </div>
    </div>
  )
}
