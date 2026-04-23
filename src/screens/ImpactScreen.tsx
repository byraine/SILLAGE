import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlowIcon } from '../components/ui/GlowIcon'
import { VideoBackground } from '../components/ui/VideoBackground'
import { GlassCard } from '../components/ui/GlassCard'
import { WardrobeShareCard } from '../components/ui/WardrobeShareCard'
import { useWardrobe } from '../hooks/useWardrobe'
import { formatLitres, formatCarbon } from '../utils/calculations'

const ACTIONS = [
  {
    icon: <GlowIcon name="repeat" size={24} />,
    title: 'Wear 30 more times',
    desc: 'The single most effective thing you can do. Wearing a garment twice as long halves its per-wear footprint.',
    impact: 'Up to 50% less impact per wear',
  },
  {
    icon: <GlowIcon name="snowflake" size={24} />,
    title: 'Wash cold',
    desc: 'Washing at 30°C instead of 60°C cuts laundry energy use by up to 57%. Cold water is just as effective for most garments.',
    impact: '~40% lower care-phase carbon',
  },
  {
    icon: <GlowIcon name="thread" size={24} />,
    title: 'Repair before replacing',
    desc: "A mended seam or patched knee extends a garment's life by years — and avoids the carbon cost of producing a replacement.",
    impact: 'Avoids 5–15 kg CO₂e per replacement',
  },
  {
    icon: <GlowIcon name="noSign" size={24} />,
    title: 'Avoid tumble drying',
    desc: "Air-drying instead of tumble-drying saves around 1 kg CO\u2082e per cycle. Over a garment's life, that compounds significantly.",
    impact: '~50% lower laundry emissions',
  },
  {
    icon: <GlowIcon name="seedling" size={24} />,
    title: 'Prefer lower-impact fibers',
    desc: 'When replacing a garment, choose recycled or natural fibers. Recycled polyester uses ~65% less energy than virgin polyester.',
    impact: 'Saves 1–8 kg CO₂e at production',
  },
]

/**
 * Final impact / storytelling screen.
 * Wardrobe summary + action prompts + video background.
 */
export function ImpactScreen() {
  const { wardrobe, totalCarbon, totalWater } = useWardrobe()
  const [activeAction, setActiveAction] = useState<number | null>(null)
  const [showShareCard, setShowShareCard] = useState(false)
  const [activeTab, setActiveTab] = useState<'trace' | 'action'>('trace')

  const isEmpty = wardrobe.length === 0

  // Cumulative impact per wear across all saved items
  const avgImpactPerWear =
    wardrobe.length > 0
      ? wardrobe.reduce((sum, w) => sum + w.impact.impactPerWear, 0) / wardrobe.length
      : 0

  const syntheticItems = wardrobe.filter(w => w.impact.syntheticPercent > 0)
  const highImpactItems = wardrobe.filter(w => w.impact.carbonKg > 8)

  return (
    <div className="min-h-dvh bg-background pb-6">
      {showShareCard && (
        <WardrobeShareCard
          wardrobe={wardrobe}
          totalCarbon={totalCarbon}
          totalWater={totalWater}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {/* ── Video hero ───────────────────────────────────────────────────── */}
      <VideoBackground
        src="/videos/impact.mp4"
        overlayClass="video-overlay"
        className="flex flex-col justify-start"
      >
        <div className="px-5 pb-10 pt-24 text-center w-full">
          <h1
            className="text-sm uppercase tracking-[0.3em] text-accent opacity-0 animate-fade-up delay-200"
            style={{ animationFillMode: 'forwards' }}
          >
            The trace you leave behind.
          </h1>
          {/* ── Tabs ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-center gap-1 mt-6">
            {(['trace', 'action'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-sans transition-all duration-200"
                style={{
                  color: activeTab === tab ? 'rgba(139,26,43,1)' : 'rgba(139,26,43,0.7)',
                  background: activeTab === tab ? 'rgba(139,26,43,0.30)' : 'transparent',
                }}
              >
                {tab === 'trace' ? 'Trace' : 'Action Plan'}
              </button>
            ))}
          </div>
        </div>
      </VideoBackground>

      <div className="px-4 pt-2 space-y-6">

      {activeTab === 'trace' && <>
        {/* ── Summary card ──────────────────────────────────────────────── */}
        {isEmpty ? (
          <GlassCard variant="pink" className="p-6 text-center">
            <p className="text-muted text-sm mb-4 leading-relaxed">
              Your wardrobe is empty. Scan some garments and save them to see your
              full cumulative impact here.
            </p>
            <Link to="/scan" className="btn-primary text-sm">Start Scanning</Link>
          </GlassCard>
        ) : (
          <GlassCard variant="pink" className="p-6">
            <p className="text-xs text-muted uppercase tracking-widest mb-5">Your Wardrobe Summary</p>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-muted mb-1">Total garments</p>
                <p className="gradient-text text-3xl font-semibold font-display">
                  {wardrobe.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Avg impact / wear</p>
                <p className="gradient-text text-3xl font-semibold font-display">
                  {(avgImpactPerWear * 1000).toFixed(1)}<span className="text-base font-normal ml-1">g</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Estimated water</p>
                <p className="text-text text-xl font-semibold">{formatLitres(totalWater)}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Estimated carbon</p>
                <p className="text-text text-xl font-semibold">{formatCarbon(totalCarbon)}</p>
              </div>
            </div>

            {syntheticItems.length > 0 && (
              <div className="rounded-xl bg-surface-3/60 p-3 text-xs text-muted mb-3 flex items-start gap-2">
                <GlowIcon name="microscope" size={14} /> {syntheticItems.length} garment{syntheticItems.length > 1 ? 's' : ''} in
                your wardrobe contain synthetic fibers and shed microplastics when washed.
              </div>
            )}

            {highImpactItems.length > 0 && (
              <div className="rounded-xl bg-surface-3/60 p-3 text-xs text-muted flex items-start gap-2">
                <GlowIcon name="warning" size={14} /> {highImpactItems.length} garment{highImpactItems.length > 1 ? 's have' : ' has'} a
                carbon footprint above 8 kg CO₂e. Wearing {highImpactItems.length > 1 ? 'them' : 'it'} more
                would significantly reduce {highImpactItems.length > 1 ? 'their' : 'its'} per-wear impact.
              </div>
            )}
          </GlassCard>
        )}

        {/* ── Context ───────────────────────────────────────────────────── */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-xs text-muted uppercase tracking-widest mb-3">To Put This in Perspective</p>
          </div>
          {[
            {
              label: totalCarbon > 0 ? formatCarbon(totalCarbon) : 'Your wardrobe',
              context: totalCarbon > 0
                ? `in estimated CO₂e — equivalent to driving ~${Math.round(totalCarbon * 6)} km`
                : 'will show your full carbon story once garments are scanned',
            },
            {
              label: totalWater > 0 ? formatLitres(totalWater) : '—',
              context: totalWater > 0
                ? `of water — enough for ${Math.round(totalWater / 2 / 365)} years of drinking water for one person`
                : 'Water estimate will appear after scanning',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`px-5 py-4 border-t border-border ${i % 2 === 1 ? 'bg-surface/30' : ''}`}
            >
              <p className="gradient-text text-2xl font-semibold font-display">{stat.label}</p>
              <p className="text-muted text-xs mt-1">{stat.context}</p>
            </div>
          ))}
        </div>

      </>}

      {activeTab === 'action' && <>
        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-4 px-1">
            Five Things You Can Do Right Now
          </p>
          <div className="space-y-3">
            {ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => setActiveAction(activeAction === i ? null : i)}
                className={`w-full text-left rounded-2xl p-5 border transition-all duration-300 ${
                  activeAction === i
                    ? 'glass-pink border-burgundy/40 shadow-metric'
                    : 'glass border-burgundy/25 hover:border-burgundy/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{action.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-text font-medium text-sm">{action.title}</p>
                    <p className={`text-xs mt-0.5 transition-colors ${activeAction === i ? 'text-accent' : 'text-muted'}`}>
                      {action.impact}
                    </p>
                  </div>
                  <span
                    className={`text-muted transition-transform duration-200 ${
                      activeAction === i ? 'rotate-180 text-accent' : ''
                    }`}
                  >
                    ↓
                  </span>
                </div>

                {/* Expanded detail */}
                {activeAction === i && (
                  <p className="text-muted text-sm leading-relaxed mt-4 border-t border-border-bright pt-4">
                    {action.desc}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

      </>}

{/* ── Navigation ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/scan" className="flex-1 btn-primary text-sm text-center py-4">
            Scan More Garments
          </Link>
          <Link to="/wardrobe" className="flex-1 btn-ghost text-sm text-center py-4">
            View Wardrobe
          </Link>
        </div>

        {/* Share wardrobe card — only if wardrobe has items */}
        {!isEmpty && (
          <button
            onClick={() => setShowShareCard(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-burgundy/40 py-4 text-sm text-burgundy hover:border-burgundy transition-all duration-200"
          >
            <span>↗</span> Share Wardrobe Impact Card
          </button>
        )}

        {/* Disclaimer */}
        <p className="text-center text-xs text-faint leading-relaxed pb-4">
          All figures shown are educational estimates only. SILLAGE is a concept
          portfolio demo — not a scientifically validated tool. Impact varies
          significantly by supply chain, factory, and consumer behaviour.
        </p>
      </div>
    </div>
  )
}
