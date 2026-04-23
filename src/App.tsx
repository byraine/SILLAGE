import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Header } from './components/layout/Header'
import { PageTransition } from './components/ui/PageTransition'
import { LandingScreen } from './screens/LandingScreen'
import { ScanScreen } from './screens/ScanScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { WardrobeScreen } from './screens/WardrobeScreen'
import { ImpactScreen } from './screens/ImpactScreen'
import { useWardrobe } from './hooks/useWardrobe'

// ── Small gray constellation dots — repeating tile, no colored dots ──────────
const grayDotSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
  <circle cx="14"  cy="22"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="72"  cy="9"   r="1"   fill="rgb(120,117,112)"/>
  <circle cx="138" cy="28"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="195" cy="14"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="38"  cy="58"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="108" cy="44"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="172" cy="65"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="215" cy="52"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="58"  cy="98"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="152" cy="88"  r="1"   fill="rgb(120,117,112)"/>
  <circle cx="205" cy="105" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="22"  cy="142" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="88"  cy="128" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="168" cy="145" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="44"  cy="178" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="118" cy="172" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="188" cy="182" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="8"   cy="205" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="78"  cy="215" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="145" cy="208" r="1"   fill="rgb(120,117,112)"/>
  <circle cx="62"  cy="148" r="1.5" fill="rgb(90,88,84)"/>
  <circle cx="152" cy="38"  r="1.5" fill="rgb(90,88,84)"/>
  <circle cx="205" cy="162" r="1.5" fill="rgb(90,88,84)"/>
  <circle cx="185" cy="58"  r="1"   fill="rgb(40,38,35)"/>
  <circle cx="35"  cy="115" r="1"   fill="rgb(40,38,35)"/>
</svg>`

const grayDotPattern = `url("data:image/svg+xml,${encodeURIComponent(grayDotSvg)}")`

// ── Paper grain texture — feTurbulence noise tile ────────────────────────────
const grainSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="180" height="180" filter="url(#grain)" opacity="1"/>
</svg>`

const grainPattern = `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`

function AppLayout() {
  const { wardrobe } = useWardrobe()
  return (
    <>
      <Header wardrobeCount={wardrobe.length} />
      <PageTransition>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/scan" element={<ScanScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/wardrobe" element={<WardrobeScreen />} />
          <Route path="/impact" element={<ImpactScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </>
  )
}

export default function App() {
  const threadRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = threadRef.current
    if (!path) return
    const len = path.getTotalLength()
    path.style.strokeDasharray = String(len)

    const draw = (progress: number) => {
      const startVisible = 0.18
      const visible = startVisible + progress * (1 - startVisible)
      path.style.strokeDashoffset = String(len * (1 - visible))
    }

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll < 50) return // let mouse handle it
      draw(Math.min(window.scrollY / maxScroll, 1))
    }

    const onMouse = (e: MouseEvent) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll >= 50) return // let scroll handle it
      draw(e.clientY / window.innerHeight)
    }

    // initialise
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    if (maxScroll < 50) { draw(0) } else { onScroll() }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  const overlayBase: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    height: '100dvh',
    width: '100%',
    maxWidth: 430,
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  }

  return (
    <BrowserRouter>
      <div className="min-h-dvh flex justify-center" style={{ background: '#E4E1DA' }}>

        {/* ── Phone frame ───────────────────────────────────────────────── */}
        <div
          className="relative w-full max-w-[430px] min-h-dvh bg-background overflow-x-clip"
          style={{
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.07), inset 0 0 180px rgba(0,0,0,0.04), 0 0 40px rgba(0,0,0,0.08)',
          }}
        >
          <AppLayout />

          {/* ── Garment tag notch — V cut at bottom center ─────────────── */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '22px solid transparent',
            borderRight: '22px solid transparent',
            borderBottom: '18px solid #E4E1DA',
            zIndex: 10001,
            pointerEvents: 'none',
          }} />
        </div>

        {/* ── Gray constellation tile — multiply punches through screens ─ */}
        <div
          style={{
            ...overlayBase,
            backgroundImage: grayDotPattern,
            mixBlendMode: 'multiply',
            opacity: 0.55,
            zIndex: 9996,
          }}
        />

        {/* ── Paper grain — multiply at very low opacity ─────────────────  */}
        <div
          style={{
            ...overlayBase,
            backgroundImage: grainPattern,
            mixBlendMode: 'multiply',
            opacity: 0.045,
            zIndex: 9997,
          }}
        />

        {/* ── 7 specific large colored dots — fixed, non-repeating ───────  */}
        <div style={{ ...overlayBase, zIndex: 9998, mixBlendMode: 'multiply', opacity: 0.48 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 430 900"
            preserveAspectRatio="xMidYMin meet"
          >
            <defs>
              {/* Grain filter — no inner shadow (multiply blend washes it out) */}
              <filter id="grain-dot" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="rough"/>
                <feColorMatrix type="saturate" values="0" in="noise" result="mono"/>
                <feBlend in="rough" in2="mono" mode="multiply" result="grained"/>
                <feComposite in="grained" in2="SourceGraphic" operator="in"/>
              </filter>
              {/* Radial gradients — bright off-centre highlight → base colour → deep shadow rim */}
              <radialGradient id="rg-blue"   cx="38%" cy="32%" r="68%">
                <stop offset="0%"   stopColor="rgb(155,198,238)"/>
                <stop offset="55%"  stopColor="rgb(88,128,172)"/>
                <stop offset="100%" stopColor="rgb(18,45,82)"/>
              </radialGradient>
              <radialGradient id="rg-pink"   cx="38%" cy="32%" r="68%">
                <stop offset="0%"   stopColor="rgb(238,118,148)"/>
                <stop offset="55%"  stopColor="rgb(198,68,100)"/>
                <stop offset="100%" stopColor="rgb(78,12,32)"/>
              </radialGradient>
              <radialGradient id="rg-amber"  cx="38%" cy="32%" r="68%">
                <stop offset="0%"   stopColor="rgb(232,188,98)"/>
                <stop offset="55%"  stopColor="rgb(192,130,42)"/>
                <stop offset="100%" stopColor="rgb(72,42,2)"/>
              </radialGradient>
              <radialGradient id="rg-orange" cx="38%" cy="32%" r="68%">
                <stop offset="0%"   stopColor="rgb(242,162,98)"/>
                <stop offset="55%"  stopColor="rgb(208,100,38)"/>
                <stop offset="100%" stopColor="rgb(82,28,4)"/>
              </radialGradient>
              <radialGradient id="rg-crimson" cx="38%" cy="32%" r="68%">
                <stop offset="0%"   stopColor="rgb(215,95,95)"/>
                <stop offset="55%"  stopColor="rgb(162,42,42)"/>
                <stop offset="100%" stopColor="rgb(55,5,5)"/>
              </radialGradient>
              <radialGradient id="rg-sage"   cx="38%" cy="32%" r="68%">
                <stop offset="0%"   stopColor="rgb(118,172,148)"/>
                <stop offset="55%"  stopColor="rgb(72,118,98)"/>
                <stop offset="100%" stopColor="rgb(12,45,30)"/>
              </radialGradient>
              <radialGradient id="rg-violet" cx="38%" cy="32%" r="68%">
                <stop offset="0%"   stopColor="rgb(172,135,208)"/>
                <stop offset="55%"  stopColor="rgb(118,82,148)"/>
                <stop offset="100%" stopColor="rgb(38,12,68)"/>
              </radialGradient>
            </defs>
            {/* Single continuous flowing thread — loops back on itself 3 times */}
            <path
              d="M 385,124
                 C 390,142 400,164 394,175
                 C 386,188 355,182 324,197
                 C 290,214 276,248 288,272
                 C 300,294 332,300 364,288
                 C 396,276 420,250 422,218
                 C 424,190 410,162 394,156
                 C 384,152 383,162 388,175
                 C 394,192 406,228 408,264
                 C 411,282 396,324 378,347
                 C 370,358 362,356 362,351
                 C 368,362 393,372 412,388
                 C 428,406 428,440 412,458
                 C 396,474 366,476 342,464
                 C 318,450 308,422 316,396
                 C 324,370 348,356 368,360
                 C 382,362 390,374 392,390
                 C 396,414 396,444 395,468
                 C 394,492 365,544 300,570
                 C 264,584 240,586 215,588
                 C 192,592 162,598 144,612
                 C 116,630 108,656 126,668
                 C 142,678 168,678 188,662
                 C 206,648 210,622 198,606
                 C 188,592 172,596 162,608
                 C 148,626 118,652 95,672
                 C 90,676 84,718 82,762"
              ref={threadRef}
              fill="none"
              stroke="rgba(38,36,33,0.32)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 9999, strokeDashoffset: 9999 }}
            />
            <circle cx="385" cy="128" r="5.5" fill="url(#rg-blue)"    filter="url(#grain-dot)" />
            <circle cx="408" cy="268" r="5"   fill="url(#rg-pink)"    filter="url(#grain-dot)" />
            <circle cx="362" cy="355" r="5.5" fill="url(#rg-amber)"   filter="url(#grain-dot)" />
            <circle cx="395" cy="468" r="5"   fill="url(#rg-orange)"  filter="url(#grain-dot)" />
            <circle cx="215" cy="588" r="5.5" fill="url(#rg-crimson)" filter="url(#grain-dot)" />
            <circle cx="95"  cy="672" r="5"   fill="url(#rg-sage)"    filter="url(#grain-dot)" />
            <circle cx="82"  cy="762" r="5.5" fill="url(#rg-violet)"  filter="url(#grain-dot)" />
          </svg>
        </div>

        {/* ── Inner vignette — sunken paper edge darkening ───────────────  */}
        <div
          style={{
            ...overlayBase,
            background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.06) 100%)',
            zIndex: 9999,
          }}
        />

      </div>
    </BrowserRouter>
  )
}
