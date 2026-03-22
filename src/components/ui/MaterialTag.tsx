import type { Material } from '../../types/fashion'

interface MaterialTagProps {
  material: Material
}

const fiberColors: Record<string, string> = {
  natural:
    'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
  synthetic:
    'border-red-500/30 bg-red-950/40 text-red-300',
  recycled:
    'border-green-600/30 bg-green-950/40 text-green-300',
  'semi-synthetic':
    'border-yellow-500/30 bg-yellow-950/40 text-yellow-300',
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
