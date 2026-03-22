import React from 'react'

interface ImpactMetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  subtext?: string
  accent?: 'pink' | 'violet' | 'emerald' | 'orange' | 'red'
  className?: string
}

const accentStyles: Record<string, { border: string; glow: string; valueColor: string }> = {
  pink: {
    border: 'border-accent/20',
    glow: 'shadow-[0_0_30px_rgba(139,168,112,0.12)]',
    valueColor: 'text-accent',
  },
  violet: {
    border: 'border-violet/20',
    glow: 'shadow-[0_0_30px_rgba(200,223,168,0.1)]',
    valueColor: 'text-violet',
  },
  emerald: {
    border: 'border-emerald-500/20',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.1)]',
    valueColor: 'text-emerald-400',
  },
  orange: {
    border: 'border-orange-500/20',
    glow: 'shadow-[0_0_30px_rgba(249,115,22,0.1)]',
    valueColor: 'text-orange-400',
  },
  red: {
    border: 'border-red-500/20',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.1)]',
    valueColor: 'text-red-400',
  },
}

/**
 * A single impact metric card: icon + label + value + optional subtext.
 */
export function ImpactMetricCard({
  icon,
  label,
  value,
  subtext,
  accent = 'pink',
  className = '',
}: ImpactMetricCardProps) {
  const style = accentStyles[accent]

  return (
    <div
      className={`
        glass rounded-3xl p-5 flex flex-col gap-3
        border ${style.border} ${style.glow}
        transition-all duration-300 hover:scale-[1.02]
        ${className}
      `}
    >
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs text-muted uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xl font-semibold ${style.valueColor}`}>{value}</p>
        {subtext && (
          <p className="text-xs text-muted mt-1 leading-relaxed">{subtext}</p>
        )}
      </div>
    </div>
  )
}
