import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import type { WardrobeItem } from '../../types/fashion'
import { formatLitres, formatCarbon } from '../../utils/calculations'

interface WardrobeShareCardProps {
  wardrobe: WardrobeItem[]
  totalCarbon: number
  totalWater: number
  onClose: () => void
}

/**
 * Downloadable wardrobe summary card — shown from the Impact screen.
 * Solid backgrounds only (no backdrop-filter) for html2canvas compatibility.
 */
export function WardrobeShareCard({
  wardrobe,
  totalCarbon,
  totalWater,
  onClose,
}: WardrobeShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  async function handleDownload() {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = 'sillage-wardrobe-impact.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2500)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  const avgIpw =
    wardrobe.length > 0
      ? wardrobe.reduce((s, w) => s + w.impact.impactPerWear, 0) / wardrobe.length
      : 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative flex flex-col items-center gap-5 animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Card ────────────────────────────────────────────────────────── */}
        <div
          ref={cardRef}
          style={{
            width: 360,
            background: 'linear-gradient(160deg, #0D110C 0%, #141A12 55%, #0D110C 100%)',
            borderRadius: 24,
            padding: '32px 28px 28px',
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow orbs */}
          <div style={{ position: 'absolute', top: -80, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,168,112,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,223,168,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8BA870', margin: 0, marginBottom: 2 }}>
              Wardrobe Impact
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, background: 'linear-gradient(135deg, #D8ECC8 0%, #8BA870 45%, #C8DFA8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              SILLAGE
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(139,168,112,0.4), transparent)', marginBottom: 22 }} />

          {/* Headline stat */}
          <p style={{ fontSize: 13, color: '#7A8E6A', margin: 0, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {wardrobe.length} garment{wardrobe.length !== 1 ? 's' : ''} scanned
          </p>

          {/* Key numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
            {[
              { label: 'Total Water', value: formatLitres(totalWater), color: '#B8CDA0' },
              { label: 'Total Carbon', value: formatCarbon(totalCarbon), color: '#8BA870' },
              { label: 'Avg / Wear', value: `${(avgIpw * 1000).toFixed(1)}g`, color: '#D8ECC8' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(46,61,37,0.7)', borderRadius: 12, padding: '10px 10px' }}>
                <p style={{ fontSize: 9, color: '#7A8E6A', margin: 0, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: s.color, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Garment list — top 4 */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, color: '#2E3D25', margin: 0, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Items
            </p>
            {wardrobe.slice(0, 4).map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <p style={{ fontSize: 12, color: '#B8CDA0', margin: 0, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', paddingRight: 8 }}>
                  {item.garment.name}
                </p>
                <p style={{ fontSize: 11, color: '#7A8E6A', margin: 0, flexShrink: 0 }}>
                  {formatCarbon(item.impact.carbonKg)}
                </p>
              </div>
            ))}
            {wardrobe.length > 4 && (
              <p style={{ fontSize: 11, color: '#2E3D25', margin: 0, marginTop: 4 }}>
                +{wardrobe.length - 4} more
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(46,61,37,0.8), transparent)', marginBottom: 14 }} />

          {/* Footer */}
          <p style={{ fontSize: 10, color: '#2E3D25', margin: 0, textAlign: 'center', letterSpacing: '0.04em' }}>
            Educational estimate only · sillage.design
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button onClick={handleDownload} disabled={downloading} className="btn-primary text-sm py-3 px-6">
            {downloading ? 'Exporting…' : downloaded ? '✓ Downloaded' : '↓ Download PNG'}
          </button>
          <button onClick={onClose} className="btn-ghost text-sm py-3 px-6">Close</button>
        </div>
        <p className="text-faint text-xs text-center max-w-xs">Screenshot or download as PNG to share.</p>
      </div>
    </div>
  )
}
