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
            background: 'linear-gradient(160deg, #0D110C 0%, #141A12 60%, #0D110C 100%)',
            borderRadius: 24,
            padding: '32px 28px 28px',
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative glow orbs */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,223,168,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: -40,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,168,112,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Wordmark */}
          <div style={{ marginBottom: 24, position: 'relative' }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#8BA870',
                margin: 0,
                marginBottom: 2,
              }}
            >
              Impact Report
            </p>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                margin: 0,
                background: 'linear-gradient(135deg, #D8ECC8 0%, #8BA870 45%, #C8DFA8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SILLAGE
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(139,168,112,0.4), transparent)',
              marginBottom: 20,
            }}
          />

          {/* Garment name */}
          <p
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#F0F2ED',
              margin: 0,
              marginBottom: 4,
              lineHeight: 1.2,
            }}
          >
            {garment.name}
          </p>
          <p
            style={{
              fontSize: 12,
              color: '#7A8E6A',
              margin: 0,
              marginBottom: 24,
            }}
          >
            Made in {garment.countryOfOrigin}
          </p>

          {/* Material pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {garment.materials.map(m => (
              <span
                key={m.name}
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 99,
                  border: `1px solid ${
                    m.fiberType === 'natural'
                      ? 'rgba(16,185,129,0.35)'
                      : m.fiberType === 'recycled'
                      ? 'rgba(200,223,168,0.3)'
                      : 'rgba(239,68,68,0.35)'
                  }`,
                  color:
                    m.fiberType === 'natural'
                      ? '#6EE7B7'
                      : m.fiberType === 'recycled'
                      ? '#C8DFA8'
                      : '#FCA5A5',
                  background:
                    m.fiberType === 'natural'
                      ? 'rgba(16,185,129,0.08)'
                      : m.fiberType === 'recycled'
                      ? 'rgba(200,223,168,0.08)'
                      : 'rgba(239,68,68,0.08)',
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
              gap: 10,
              marginBottom: 20,
            }}
          >
            {[
              { icon: <GlowIcon name="water" size={16} />, label: 'Water', value: formatLitres(impact.waterUsageLiters), color: '#B8CDA0' },
              { icon: <GlowIcon name="leaf" size={16} />, label: 'Carbon', value: formatCarbon(impact.carbonKg), color: '#8BA870' },
              { icon: <GlowIcon name="hourglass" size={16} />, label: 'Lifespan', value: `~${impact.durabilityWears} wears`, color: '#C8DFA8' },
              { icon: <GlowIcon name="dress" size={16} />, label: 'Per Wear', value: `${ipwGrams} g CO₂e`, color: '#D8ECC8' },
            ].map(m => (
              <div
                key={m.label}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(46,61,37,0.7)',
                  borderRadius: 14,
                  padding: '12px 14px',
                }}
              >
                <div style={{ marginBottom: 4 }}>{m.icon}</div>
                <p style={{ fontSize: 10, color: '#7A8E6A', margin: 0, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {m.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: m.color, margin: 0 }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Microplastics note if relevant */}
          {impact.microplasticRisk !== 'none' && (
            <div
              style={{
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10,
                padding: '8px 12px',
                marginBottom: 18,
              }}
            >
              <p style={{ fontSize: 11, color: '#FCA5A5', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                <GlowIcon name="microscope" size={11} /> {microLabel} — {impact.syntheticPercent}% synthetic content
              </p>
            </div>
          )}

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(46,61,37,0.8), transparent)',
              marginBottom: 14,
            }}
          />

          {/* Footer */}
          <p
            style={{
              fontSize: 10,
              color: '#2E3D25',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '0.04em',
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
