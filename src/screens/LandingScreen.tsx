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
        className="min-h-dvh flex flex-col"
      >
        <div className="flex-1 flex flex-col px-5 pt-16">
          <div className="flex-1" />
          {/* Bottom-anchored hero content */}
          <div className="pb-32">
            <div
              className="flex items-center justify-center gap-2.5 mb-3 opacity-0 animate-fade-in delay-100"
              style={{ animationFillMode: 'forwards' }}
            >
              <img
                src="/images/logo.png"
                alt=""
                className="h-6 w-auto object-contain"
                onError={e => { ;(e.target as HTMLImageElement).style.display = 'none' }}
              />
              <span
                className="font-display text-2xl font-semibold tracking-[0.35em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, #D8ECC8 0%, #8BA870 50%, #C8DFA8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SILLAGE
              </span>
            </div>
            <p
              className="text-[10px] uppercase tracking-[0.4em] text-accent mb-5 text-center opacity-0 animate-fade-in delay-200"
              style={{ animationFillMode: 'forwards' }}
            >
              AI-Assisted Fashion Impact Scanner
            </p>
            <h1
              className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.02em] mb-6 opacity-0 animate-fade-up delay-300"
              style={{ animationFillMode: 'forwards' }}
            >
              <span className="gradient-text block">Every thread</span>
              <span className="text-text/90 block">tells a story.</span>
            </h1>
            <p
              className="text-sm text-muted leading-loose mb-8 max-w-[26ch] opacity-0 animate-fade-up delay-400"
              style={{ animationFillMode: 'forwards' }}
            >
              Scan any garment and discover the water, carbon, and human cost woven into the fabric of what you wear.
            </p>
            <div
              className="flex flex-col gap-3 opacity-0 animate-fade-up delay-500"
              style={{ animationFillMode: 'forwards' }}
            >
              <Link to="/scan" className="btn-primary text-center">
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
        <p className="text-muted text-sm leading-loose mb-10">
          A single cotton T-shirt uses up to 2,700 litres of water — enough for one person to drink for over two years. SILLAGE makes this visible, one garment at a time.
        </p>
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
          <Link to="/scan" className="btn-primary block text-center">Begin Your Scan</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border px-5 py-6">
        <div className="flex flex-col gap-2">
          <span className="gradient-text font-display text-sm font-semibold tracking-[0.4em] uppercase">SILLAGE</span>
          <p className="text-faint text-xs leading-relaxed">
            A concept portfolio demo. All impact figures are educational estimates only.
          </p>
        </div>
      </footer>
    </div>
  )
}
