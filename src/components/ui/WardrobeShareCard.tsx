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

          {/* Header */}
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8A5A0', margin: 0, marginBottom: 4 }}>
              Wardrobe Impact
            </p>
            <p style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0, color: '#C41E3A', fontFamily: '"Poiret One", sans-serif' }}>
              SILLAGE
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(180, 177, 170, 0.6)', marginBottom: 22 }} />

          {/* Headline stat */}
          <p style={{ fontSize: 9, color: '#A8A5A0', margin: 0, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            {wardrobe.length} garment{wardrobe.length !== 1 ? 's' : ''} scanned
          </p>

          {/* Key numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'Total Water', value: formatLitres(totalWater) },
              { label: 'Total Carbon', value: formatCarbon(totalCarbon) },
              { label: 'Avg / Wear', value: `${(avgIpw * 1000).toFixed(1)}g` },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(228,225,218,0.6)', border: '1px solid rgba(180,177,170,0.5)', borderRadius: 0, padding: '9px 10px' }}>
                <p style={{ fontSize: 8, color: '#A8A5A0', margin: 0, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#1A1916', margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Garment list — top 4 */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 8, color: '#A8A5A0', margin: 0, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Items
            </p>
            {wardrobe.slice(0, 4).map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, borderBottom: '1px solid rgba(180,177,170,0.25)', paddingBottom: 7 }}>
                <p style={{ fontSize: 11, color: '#3D3C39', margin: 0, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', paddingRight: 8 }}>
                  {item.garment.name}
                </p>
                <p style={{ fontSize: 10, color: '#A8A5A0', margin: 0, flexShrink: 0, letterSpacing: '0.04em' }}>
                  {formatCarbon(item.impact.carbonKg)}
                </p>
              </div>
            ))}
            {wardrobe.length > 4 && (
              <p style={{ fontSize: 9, color: '#A8A5A0', margin: 0, marginTop: 4, letterSpacing: '0.08em' }}>
                +{wardrobe.length - 4} more
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(180, 177, 170, 0.5)', marginBottom: 14 }} />

          {/* Footer */}
          <p style={{ fontSize: 8, color: '#A8A5A0', margin: 0, textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
