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
    border: 'border-border',
    glow: '',
    valueColor: 'text-text',
  },
  violet: {
    border: 'border-border',
    glow: '',
    valueColor: 'text-accent-dim',
  },
  emerald: {
    border: 'border-border',
    glow: '',
    valueColor: 'text-text',
  },
  orange: {
    border: 'border-border',
    glow: '',
    valueColor: 'text-muted',
  },
  red: {
    border: 'border-border',
    glow: '',
    valueColor: 'text-muted',
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
