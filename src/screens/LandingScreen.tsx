import { Link } from 'react-router-dom'
import { VideoBackground } from '../components/ui/VideoBackground'
import { GlowIcon } from '../components/ui/GlowIcon'

export function LandingScreen() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Hero */}
      <VideoBackground
        src="/videos/hero.mp4"
        overlayClass="video-overlay"
        className="flex flex-col"
      >
        <div className="flex flex-col px-5 pt-20 pb-10">
          {/* Bottom-anchored hero content */}
          <div className="pb-8">
            <div
              className="flex items-center justify-center gap-2.5 mb-3 opacity-0 animate-fade-in delay-100"
              style={{ animationFillMode: 'forwards' }}
            >
              <img
                src="/images/logo.png"
                alt=""
                className="h-10 w-auto object-contain"
                onError={e => { ;(e.target as HTMLImageElement).style.display = 'none' }}
              />
              <span
                className="font-poiret text-2xl tracking-[0.35em] uppercase"
                style={{
                  color: 'rgba(0,0,0,0.5)',
                  WebkitTextFillColor: 'rgba(0,0,0,0.5)',
                }}
              >
                SILLAGE
              </span>
            </div>
            <p
              className="text-[10px] uppercase tracking-[0.4em] mb-5 text-center opacity-0 animate-fade-in delay-200"
              style={{ color: 'rgba(0,0,0,0.5)', animationFillMode: 'forwards' }}
            >
              AI-Assisted Fashion Impact Scanner
            </p>
            <h1
              className="font-sans text-2xl leading-tight tracking-[0.05em] uppercase mb-6 opacity-0 animate-fade-up delay-300"
              style={{ animationFillMode: 'forwards' }}
            >
              <span className="block text-text">Every thread</span>
              <span className="block text-text">tells a story.</span>
            </h1>
            <p
              className="font-sans text-sm text-text leading-loose mb-8 max-w-[26ch] opacity-0 animate-fade-up delay-400"
              style={{ animationFillMode: 'forwards' }}
            >
              Scan any garment and discover the unseen cost of fashion.
            </p>
            <div
              className="flex flex-col gap-3 opacity-0 animate-fade-up delay-500"
              style={{ animationFillMode: 'forwards' }}
            >
              <Link
                to="/scan"
                className="btn-hero text-center inline-flex items-center justify-center px-8 py-4 text-xs tracking-widest uppercase font-sans no-underline"
                style={{
                  borderRadius: '9999px',
                  border: '1px solid rgba(220,218,212,0.35)',
                  color: 'rgba(180,177,170,0.95)',
                  background: 'rgba(160,158,152,0.35)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 0 16px rgba(200,200,195,0.15), 0 0 40px rgba(200,200,195,0.08), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                Start Scan →
              </Link>
            </div>
          </div>
        </div>
      </VideoBackground>

      {/* The Reality */}
      <section className="bg-background px-5 py-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-accent/50 flex-shrink-0" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent">The Reality</p>
        </div>
        <h2 className="font-display text-3xl font-semibold text-text mb-4 leading-tight tracking-tight">
          Fashion is the world's second-largest industrial water consumer.
        </h2>
        {/* 2x2 stat grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { num: '92M', label: 'tonnes of textile waste per year' },
            { num: '10%', label: 'of global carbon emissions from fashion' },
            { num: '20%', label: 'of industrial wastewater from textile dyeing' },
            { num: '35%', label: 'of ocean microplastics from synthetic fabrics' },
          ].map(stat => (
            <div key={stat.num} className="bg-surface rounded-[2rem] p-5">
              <p className="gradient-text text-4xl font-semibold font-display mb-2 leading-none">{stat.num}</p>
              <p className="text-faint text-[11px] leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface px-5 py-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-accent/50 flex-shrink-0" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent">How It Works</p>
        </div>
        <h2 className="font-display text-3xl font-semibold text-text mb-10 tracking-tight leading-tight">
          Three steps to clarity.
        </h2>
        <div className="space-y-4">
          {[
            { step: '01', icon: <GlowIcon name="search" size={24} />, title: 'Scan', desc: 'Upload a photo or choose from preset garments. The scanner reads material composition and origin.' },
            { step: '02', icon: <GlowIcon name="chart" size={24} />, title: 'Analyse', desc: 'Water, carbon, microplastic risk, and labor context — all calculated from transparent formulas.' },
            { step: '03', icon: <GlowIcon name="leaf" size={24} />, title: 'Act', desc: 'Compare garments, build a wardrobe, and see exactly how to reduce your fashion footprint.' },
          ].map(item => (
            <div key={item.step} className="bg-background rounded-[2rem] p-6">
              <div className="flex items-start gap-4">
                <p className="font-display text-3xl font-semibold text-faint leading-none flex-shrink-0 mt-1">{item.step}</p>
                <div>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="text-text font-semibold text-base mb-1">{item.title}</h3>
                  <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/scan"
            className="btn-hero block text-center inline-flex items-center justify-center w-full px-8 py-4 text-xs tracking-widest uppercase font-sans no-underline"
            style={{
              borderRadius: '9999px',
              border: '1px solid rgba(220,218,212,0.35)',
              color: 'rgba(180,177,170,0.95)',
              background: 'rgba(160,158,152,0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 0 16px rgba(200,200,195,0.15), 0 0 40px rgba(200,200,195,0.08), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >Begin Your Scan</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border px-5 py-6">
        <div className="flex flex-col gap-2">
          <span className="font-poiret text-sm tracking-[0.4em] uppercase" style={{ color: '#C41E3A' }}>SILLAGE</span>
          <p className="text-faint text-xs leading-relaxed">
            A concept portfolio demo. All impact figures are educational estimates only.
          </p>
        </div>
      </footer>
    </div>
  )
}
