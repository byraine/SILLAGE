import { GlowIcon } from './GlowIcon'

interface MethodologyModalProps {
  onClose: () => void
}

/**
 * Modal explaining the educational estimation methodology.
 * Transparency is core to SILLAGE's purpose.
 */
export function MethodologyModal({ onClose }: MethodologyModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative glass rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85dvh] overflow-y-auto scrollbar-hide animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-accent uppercase tracking-widest mb-1">Transparency</p>
            <h2 className="text-xl font-semibold text-text">How We Calculate</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-text hover:bg-surface-2 transition-colors text-lg"
          >
            ×
          </button>
        </div>

        {/* Disclaimer */}
        <div className="glass-pink rounded-xl p-4 mb-6">
          <p className="text-xs text-muted leading-relaxed">
            <GlowIcon name="warning" size={12} /> <strong className="text-text">Educational estimates only.</strong> These
            figures are simplified approximations for portfolio demonstration purposes.
            Real garment impacts vary enormously by supply chain, factory, dye chemistry,
            and consumer behaviour. Do not cite these numbers as scientific data.
          </p>
        </div>

        <div className="space-y-5 text-sm text-muted leading-relaxed">
          <section>
            <h3 className="text-text font-medium mb-2 flex items-center gap-2"><GlowIcon name="water" size={16} /> Water Usage</h3>
            <p>
              Estimated by multiplying the garment's weight (by category) by a blended
              water coefficient for each fiber. Cotton requires ~10,000 L/kg; polyester
              ~500 L/kg. Blended fabrics are weighted by material percentage.
            </p>
          </section>

          <hr className="divider-glow" />

          <section>
            <h3 className="text-text font-medium mb-2 flex items-center gap-2"><GlowIcon name="leaf" size={16} /> Carbon Footprint</h3>
            <p>
              Fiber production carbon (kg CO₂e/kg) is blended by composition, then
              multiplied by a transport factor based on country of origin. A fixed
              care-phase estimate (~0.5 kg CO₂e) is added for context.
            </p>
          </section>

          <hr className="divider-glow" />

          <section>
            <h3 className="text-text font-medium mb-2 flex items-center gap-2"><GlowIcon name="microscope" size={16} /> Microplastic Risk</h3>
            <p>
              Triggered by synthetic fiber content (polyester, nylon, acrylic). Every
              wash cycle sheds microfibers — risk level scales with synthetic percentage.
              Natural and recycled natural fibers score zero.
            </p>
          </section>

          <hr className="divider-glow" />

          <section>
            <h3 className="text-text font-medium mb-2 flex items-center gap-2"><GlowIcon name="dress" size={16} /> Impact Per Wear</h3>
            <p>
              Total carbon ÷ estimated durability wears. Wearing a garment more times
              dramatically reduces its per-wear footprint. Durability estimates are based
              on Ellen MacArthur Foundation clothing lifecycle data.
            </p>
          </section>

          <hr className="divider-glow" />

          <section>
            <h3 className="text-text font-medium mb-2 flex items-center gap-2"><GlowIcon name="globe" size={16} /> Transport Factor</h3>
            <p>
              Regional production (Portugal, Turkey) carries a lower transport multiplier
              (~1.05–1.15) than long-haul manufacturing (Vietnam, China) at ~1.60–1.65.
            </p>
          </section>

          <section className="pt-2">
            <p className="text-xs text-faint">
              Reference sources: Mekonnen & Hoekstra (2011); WRAP Clothing Lifecycle
              (2017); Boucher & Friot (2017) IUCN microplastics; Ellen MacArthur
              Foundation (2017) A New Textiles Economy.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
