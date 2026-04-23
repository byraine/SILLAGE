import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import type { Garment, GarmentImpact } from '../../types/fashion'
import { formatLitres, formatCarbon, MICROPLASTIC_LABELS } from '../../utils/calculations'
import { GlowIcon } from './GlowIcon'

interface ShareCardProps {
  garment: Garment
  impact: GarmentImpact
  onClose: () => void
}

/**
 * A downloadable impact summary card.
 * Designed with SOLID backgrounds (no backdrop-filter) so html2canvas
 * captures it pixel-perfectly.
 */
export function ShareCard({ garment, impact, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  async function handleDownload() {
    if (!cardRef.current || downloading) return
    setDownloading(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,         // 2× for retina sharpness
        useCORS: true,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `sillage-${garment.name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2500)
    } catch (err) {
      console.error('Share card export failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  const microLabel = MICROPLASTIC_LABELS[impact.microplasticRisk]
  const ipwGrams = (impact.impactPerWear * 1000).toFixed(1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative flex flex-col items-center gap-5 animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* ── The actual card (captured by html2canvas) ───────────────────── */}
        <div
          ref={cardRef}
          style={{
            width: 360,
            background: '#F5F3EE',
            borderRadius: 2,
            padding: '32px 28px 28px',
            fontFamily: '"IBM Plex Mono", "Courier New", monospace',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #D8D5CE',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {/* Subtle paper texture overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(180,177,170,0.06) 24px)',
              pointerEvents: 'none',
            }}
          />

          {/* Wordmark */}
          <div style={{ marginBottom: 24, position: 'relative' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#A8A5A0',
                margin: 0,
                marginBottom: 4,
              }}
            >
              Impact Report
            </p>
            <p
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                margin: 0,
                fontFamily: '"Poiret One", sans-serif',
                color: '#C41E3A',
              }}
            >
              SILLAGE
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: 'rgba(180, 177, 170, 0.6)',
              marginBottom: 20,
            }}
          />

          {/* Garment name */}
          <p
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: '#1A1916',
              margin: 0,
              marginBottom: 3,
              lineHeight: 1.2,
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              letterSpacing: '0.02em',
            }}
          >
            {garment.name}
          </p>
          <p
            style={{
              fontSize: 10,
              color: '#A8A5A0',
              margin: 0,
              marginBottom: 20,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Made in {garment.countryOfOrigin}
          </p>

          {/* Material pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 22 }}>
            {garment.materials.map(m => (
              <span
                key={m.name}
                style={{
                  fontSize: 9,
                  padding: '3px 9px',
                  borderRadius: 0,
                  border: '1px solid rgba(180,177,170,0.6)',
                  color: '#3D3C39',
                  background: 'rgba(219,218,210,0.5)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                {m.percentage}% {m.name}
              </span>
            ))}
          </div>

          {/* Metrics grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              marginBottom: 18,
            }}
          >
            {[
              { icon: <GlowIcon name="water" size={14} />, label: 'Water', value: formatLitres(impact.waterUsageLiters) },
              { icon: <GlowIcon name="leaf" size={14} />, label: 'Carbon', value: formatCarbon(impact.carbonKg) },
              { icon: <GlowIcon name="hourglass" size={14} />, label: 'Lifespan', value: `~${impact.durabilityWears} wears` },
              { icon: <GlowIcon name="dress" size={14} />, label: 'Per Wear', value: `${ipwGrams} g CO₂e` },
            ].map(m => (
              <div
                key={m.label}
                style={{
                  background: 'rgba(228,225,218,0.6)',
                  border: '1px solid rgba(180,177,170,0.5)',
                  borderRadius: 0,
                  padding: '10px 12px',
                }}
              >
                <div style={{ marginBottom: 4 }}>{m.icon}</div>
                <p style={{ fontSize: 8, color: '#A8A5A0', margin: 0, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {m.label}
                </p>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1916', margin: 0 }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Microplastics note if relevant */}
          {impact.microplasticRisk !== 'none' && (
            <div
              style={{
                background: 'rgba(219,218,210,0.5)',
                border: '1px solid rgba(180,177,170,0.5)',
                borderRadius: 0,
                padding: '7px 11px',
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 9, color: '#726F6A', margin: 0, display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <GlowIcon name="microscope" size={10} /> {microLabel} — {impact.syntheticPercent}% synthetic
              </p>
            </div>
          )}

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: 'rgba(180, 177, 170, 0.5)',
              marginBottom: 14,
            }}
          />

          {/* Footer */}
          <p
            style={{
              fontSize: 8,
              color: '#A8A5A0',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Educational estimate only · sillage.design
          </p>
        </div>

        {/* ── Controls ──────────────────────────────────────────────────── */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary text-sm py-3 px-6"
          >
            {downloading ? 'Exporting…' : downloaded ? '✓ Downloaded' : '↓ Download PNG'}
          </button>
          <button onClick={onClose} className="btn-ghost text-sm py-3 px-6">
            Close
          </button>
        </div>

        <p className="text-faint text-xs text-center max-w-xs">
          Screenshot this card or download as PNG to share.
        </p>
      </div>
    </div>
  )
}
