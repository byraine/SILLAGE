interface GlassCardProps {
  children: React.ReactNode
  variant?: 'default' | 'pink' | 'violet'
  className?: string
  onClick?: () => void
}

const variantClasses = {
  default: 'glass',
  pink: 'glass-pink',
  violet: 'glass-violet',
}

/**
 * Reusable glassmorphism card — the core UI surface in SILLAGE.
 */
export function GlassCard({
  children,
  variant = 'default',
  className = '',
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={`rounded ${variantClasses[variant]} ${className} ${
        onClick ? 'cursor-pointer transition-all duration-300 hover:scale-[1.01]' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
