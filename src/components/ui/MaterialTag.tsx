import type { Material } from '../../types/fashion'

interface MaterialTagProps {
  material: Material
}

const fiberColors: Record<string, string> = {
  natural:
    'border-border bg-surface-2 text-text',
  synthetic:
    'border-border-bright bg-surface-2 text-muted',
  recycled:
    'border-border bg-surface-2 text-text',
  'semi-synthetic':
    'border-border bg-surface-2 text-muted',
}

/**
 * Pill tag showing material name, percentage, and fiber type colour coding.
 */
export function MaterialTag({ material }: MaterialTagProps) {
  const colorClass = fiberColors[material.fiberType] ?? fiberColors.natural

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium tracking-wide ${colorClass}`}
    >
      <span>{material.percentage}%</span>
      <span>{material.name}</span>
    </span>
  )
}
