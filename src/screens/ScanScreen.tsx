import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GlowIcon } from '../components/ui/GlowIcon'
import { GlassCard } from '../components/ui/GlassCard'
import { MaterialTag } from '../components/ui/MaterialTag'
import { PRESET_GARMENTS } from '../data/garments'
import { calculateImpact } from '../utils/calculations'
import type { Garment } from '../types/fashion'

// Country → [svgX, svgY] on 200×100 world map viewBox
const COUNTRY_DOT: Record<string, [number, number]> = {
  Haiti:    [59.8,  39.5],
  Vietnam:  [160.2, 42.2],
  China:    [158.3, 30.6],
  Portugal: [95.6,  28.1],
  Turkey:   [119.4, 28.3],
  Bangladesh:[130.8, 46.1],
  India:    [145.0, 43.9],
  Morocco:  [94.4,  36.1],
  Cambodia: [157.2, 44.4],
}

function GlobeOrb({ country }: { country: string }) {
  const dot = COUNTRY_DOT[country] ?? [100, 40]
  return (
    <svg
      viewBox="0 0 200 100"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Continent outlines — thin white strokes, no fill */}
      {/* North America */}
      <path
        d="M 8,17 L 22,19 L 31,22 L 28,33 L 33,39 L 50,44 L 56,36 L 69,24 L 61,11 L 33,11 L 8,17 Z"
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeLinejoin="round"
      />
      {/* South America */}
      <path
        d="M 56,44 L 67,46 L 72,53 L 75,58 L 72,69 L 67,81 L 61,81 L 58,75 L 58,61 L 56,53 Z"
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeLinejoin="round"
      />
      {/* Europe */}
      <path
        d="M 94,31 L 94,17 L 106,11 L 117,11 L 122,19 L 119,28 L 111,31 L 100,29 Z"
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeLinejoin="round"
      />
      {/* Africa */}
      <path
        d="M 92,31 L 100,29 L 111,31 L 122,43 L 128,44 L 124,53 L 119,61 L 111,69 L 108,69 L 106,61 L 97,53 L 92,47 L 92,31 Z"
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeLinejoin="round"
      />
      {/* Asia */}
      <path
        d="M 122,28 L 125,11 L 139,11 L 178,11 L 181,25 L 181,31 L 172,44 L 161,50 L 153,47 L 144,44 L 136,46 L 128,43 L 122,28 Z"
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeLinejoin="round"
      />
      {/* Australia */}
      <path
        d="M 163,62 L 164,69 L 172,68 L 178,71 L 183,71 L 186,67 L 186,62 L 182,60 L 176,57 L 172,58 L 167,60 Z"
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeLinejoin="round"
      />
      {/* Country dot — outer ring + solid core */}
      <circle cx={dot[0]} cy={dot[1]} r="4" fill="rgba(139,168,112,0.25)" />
      <circle cx={dot[0]} cy={dot[1]} r="2" fill="#8BA870" />
    </svg>
  )
}

type ScanPhase = 'select' | 'scanning' | 'complete'

const SCAN_STEPS = [
  'Initialising image analysis…',
  'Reading fiber composition…',
  'Identifying country of origin…',
  'Calculating water footprint…',
  'Estimating carbon emissions…',
  'Assessing microplastic risk…',
  'Generating impact report…',
]

/**
 * Scan screen — choose a preset garment or upload a placeholder image,
 * then simulate a scan loading sequence before navigating to results.
 */
export function ScanScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [phase, setPhase] = useState<ScanPhase>('select')
  const [selected, setSelected] = useState<Garment | null>(null)
  const [uploadedName, setUploadedName] = useState<string | null>(null)
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null)
  const [scanStep, setScanStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // Auto-select first garment if ?example=true
  useEffect(() => {
    if (searchParams.get('example') === 'true' && !selected) {
      setSelected(PRESET_GARMENTS[0])
    }
  }, [searchParams, selected])

  // Scan animation sequence
  useEffect(() => {
    if (phase !== 'scanning') return

    videoRef.current?.play().catch(() => {})

    let step = 0
    const stepInterval = setInterval(() => {
      step++
      setScanStep(step)
      setProgress(Math.round((step / SCAN_STEPS.length) * 100))

      if (step >= SCAN_STEPS.length) {
        clearInterval(stepInterval)
        setTimeout(() => {
          setPhase('complete')
        }, 600)
      }
    }, 500)

    return () => clearInterval(stepInterval)
  }, [phase])

  function handleSelectGarment(garment: Garment) {
    setSelected(garment)
    setUploadedPreview(null)
    setUploadedName(null)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedName(file.name)
    const url = URL.createObjectURL(file)
    setUploadedPreview(url)
    // Map to a random preset for demo purposes
    const randomGarment = PRESET_GARMENTS[Math.floor(Math.random() * PRESET_GARMENTS.length)]
    setSelected({ ...randomGarment, id: `upload-${Date.now()}` })
  }

  function handleStartScan() {
    if (!selected) return
    setPhase('scanning')
    setScanStep(0)
    setProgress(0)
  }

  function handleViewResults() {
    if (!selected) return
    const impact = calculateImpact(selected)
    sessionStorage.setItem('sillage_current_garment', JSON.stringify(selected))
    sessionStorage.setItem('sillage_current_impact', JSON.stringify(impact))
    navigate('/results')
  }

  // ── SELECT phase ────────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="min-h-dvh bg-background pt-16 pb-6 px-4">
        <div className="max-w-none">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-accent/50 flex-shrink-0" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent">Impact Scanner</p>
            </div>
            <h1 className="font-display text-4xl font-semibold text-text leading-tight tracking-tight mb-4">
              Select a<br />Garment
            </h1>
            <p className="text-muted text-sm leading-loose max-w-[22ch]">
              Choose a preset garment or upload an image to simulate scanning.
            </p>
          </div>

          <div className="space-y-5">
            {/* Upload area */}
            <GlassCard
              variant="violet"
              className="p-6 cursor-pointer hover:border-violet/40 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex items-center gap-5">
                {uploadedPreview ? (
                  <img
                    src={uploadedPreview}
                    alt="Uploaded"
                    className="w-20 h-20 rounded-2xl object-cover border border-border-bright flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-surface-3 border border-border-bright flex items-center justify-center text-2xl flex-shrink-0">
                    <GlowIcon name="camera" size={32} />
                  </div>
                )}
                <div>
                  <p className="text-text font-medium text-sm">
                    {uploadedName ?? 'Upload a garment photo'}
                  </p>
                  <p className="text-muted text-xs mt-0.5">
                    {uploadedName
                      ? 'Image ready — mapped to demo data'
                      : 'JPEG, PNG or WEBP — for demo only'}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <hr className="divider-glow flex-1" />
              <span className="text-muted text-xs">or choose preset</span>
              <hr className="divider-glow flex-1" />
            </div>

            {/* Preset garments — swipeable square cards */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
              {PRESET_GARMENTS.map((garment, idx) => {
                const isSelected = selected?.id === garment.id
                return (
                  <button
                    key={garment.id}
                    onClick={() => handleSelectGarment(garment)}
                    className={`
                      flex-shrink-0 w-40 h-40 rounded-2xl p-4 flex flex-col justify-between text-left transition-all duration-200 border
                      ${
                        isSelected
                          ? 'glass-pink border-accent/40 shadow-[0_0_24px_rgba(139,168,112,0.15)]'
                          : 'glass border-border hover:border-border-bright'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-display text-lg font-semibold text-faint/50 leading-none select-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {isSelected && (
                        <span className="text-accent text-sm leading-none">✓</span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium text-sm leading-snug mb-1 ${isSelected ? 'text-text' : 'text-text/80'}`}>
                        {garment.name}
                      </p>
                      <p className="text-muted text-[10px] mb-2">Made in {garment.countryOfOrigin}</p>
                      <div className="flex flex-wrap gap-1">
                        {garment.materials.map(m => (
                          <MaterialTag key={m.name} material={m} />
                        ))}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* CTA */}
            <div className="pt-5 border-t border-border">
              <button
                onClick={handleStartScan}
                disabled={!selected}
                className={`w-full btn-primary py-5 rounded-xl text-sm tracking-wide ${
                  !selected ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                {selected ? `Scan "${selected.name}"` : 'Select a garment to continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── SCANNING phase ──────────────────────────────────────────────────────────
  if (phase === 'scanning') {
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        {/* Video background */}
        <div className="relative flex-1 overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/garments.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            aria-hidden="true"
          />
          {/* Gradient fallback */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(200,223,168,0.18) 0%, rgba(8,10,7,0) 65%), radial-gradient(ellipse at 80% 80%, rgba(139,168,112,0.14) 0%, rgba(8,10,7,0) 55%)',
            }}
          />
          <div className="video-overlay-dark absolute inset-0" />

          {/* Scan UI */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-dvh px-6 py-20 pb-6 text-center">
            {/* Corner-bracketed scan frame */}
            <div className="relative mb-12">
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-accent/50" />
              <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-accent/50" />
              <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-accent/50" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-accent/50" />
              <div className="scan-frame w-64 h-64 rounded-[2.5rem] border border-accent/20 mb-0 flex items-center justify-center bg-surface/20 overflow-hidden">
                <div className="scan-line" />
                {(
                  selected?.category === 't-shirt' ? <GlowIcon name="tshirt" size={72} /> :
                  selected?.category === 'hoodie' ? <GlowIcon name="jacket" size={72} /> :
                  selected?.category === 'dress' ? <GlowIcon name="dress" size={72} /> :
                  selected?.category === 'shirt' ? <GlowIcon name="shirt" size={72} /> :
                  selected?.category === 'jacket' ? <GlowIcon name="jacket" size={72} /> :
                  <GlowIcon name="tshirt" size={72} />
                )}
              </div>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text mb-10 tracking-tight">
              {selected?.name}
            </h2>

            {/* Large progress number */}
            <p className="font-display text-8xl font-semibold gradient-text leading-none mb-3">
              {progress}<span className="text-3xl">%</span>
            </p>
            <p className="text-accent text-[10px] uppercase tracking-[0.4em] mb-8">Analysing</p>

            {/* Thin progress line */}
            <div className="w-full max-w-sm bg-surface rounded-full h-px mb-5 overflow-hidden">
              <div
                className="shimmer-bar h-px rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-muted text-sm min-h-[1.5em] transition-all duration-300">
              {SCAN_STEPS[scanStep] ?? ''}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── COMPLETE phase ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-background flex flex-col justify-end px-5 pb-6">
      <div className="max-w-sm">
        {/* Glow orb — globe with country marker */}
        <div
          className="w-32 h-32 rounded-full mb-10 overflow-hidden relative animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(139,168,112,0.25) 0%, transparent 70%)',
            boxShadow: '0 0 60px rgba(139,168,112,0.35)',
          }}
        >
          <GlobeOrb country={selected?.countryOfOrigin ?? ''} />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-accent/50 flex-shrink-0" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent">Scan Complete</p>
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-semibold text-text leading-none tracking-tight mb-4">
          Analysis<br />Ready
        </h1>
        <p className="text-muted text-sm mb-12 max-w-[28ch] leading-loose">
          Your garment's impact has been calculated. Ready to see the full report?
        </p>

        <div className="flex flex-row gap-6">
          <button onClick={handleViewResults} className="btn-primary">
            View Full Report →
          </button>
          <button
            onClick={() => {
              setPhase('select')
              setSelected(null)
            }}
            className="btn-ghost"
          >
            Scan Another
          </button>
        </div>
      </div>
    </div>
  )
}
