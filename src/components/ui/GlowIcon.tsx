
interface GlowIconProps {
  name: IconName
  size?: number
  className?: string
}

export type IconName =
  | 'water'
  | 'leaf'
  | 'microscope'
  | 'hourglass'
  | 'camera'
  | 'repeat'
  | 'snowflake'
  | 'thread'
  | 'noSign'
  | 'bubbles'
  | 'seedling'
  | 'search'
  | 'chart'
  | 'tshirt'
  | 'jacket'
  | 'dress'
  | 'shirt'
  | 'globe'
  | 'warning'

const GLOW_FILTER = 'drop-shadow(0 0 5px rgba(255,128,64,0.9)) drop-shadow(0 0 12px rgba(255,128,64,0.4))'

function IconSVG({ name, size }: { name: IconName; size: number }) {
  const shared = {
    fill: 'none' as const,
    stroke: '#FF8040',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    style: { filter: GLOW_FILTER },
  }

  switch (name) {
    case 'water':
      return (
        <svg {...shared}>
          <path d="M12 2.5C12 2.5 5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5z" />
        </svg>
      )
    case 'leaf':
      return (
        <svg {...shared}>
          <path d="M2 22l10-10" />
          <path d="M12 12C12 12 20 11 20 4c0 0-8-1-11 7 0 0-2 5 3 11" />
        </svg>
      )
    case 'microscope':
      return (
        <svg {...shared}>
          <path d="M6 18h4" />
          <path d="M10 22v-4" />
          <circle cx="10" cy="14" r="4" />
          <path d="M14 14h4a2 2 0 0 0 0-4h-1" />
          <path d="M14 10V6" />
          <rect x="12" y="4" width="4" height="2" rx="1" />
        </svg>
      )
    case 'hourglass':
      return (
        <svg {...shared}>
          <path d="M5 2h14" />
          <path d="M5 22h14" />
          <path d="M5 2l7 9 7-9" />
          <path d="M5 22l7-9 7 9" />
        </svg>
      )
    case 'camera':
      return (
        <svg {...shared}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      )
    case 'repeat':
      return (
        <svg {...shared}>
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      )
    case 'snowflake':
      return (
        <svg {...shared}>
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="5.64" y1="5.64" x2="18.36" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="5.64" y2="18.36" />
          <line x1="12" y1="6" x2="10" y2="4" />
          <line x1="12" y1="6" x2="14" y2="4" />
          <line x1="12" y1="18" x2="10" y2="20" />
          <line x1="12" y1="18" x2="14" y2="20" />
        </svg>
      )
    case 'thread':
      return (
        <svg {...shared}>
          <ellipse cx="12" cy="12" rx="3" ry="9" />
          <path d="M5 6.5C5 6.5 8 8 12 8s7-1.5 7-1.5" />
          <path d="M5 17.5C5 17.5 8 16 12 16s7 1.5 7 1.5" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      )
    case 'noSign':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      )
    case 'bubbles':
      return (
        <svg {...shared}>
          <circle cx="7" cy="15" r="3" />
          <circle cx="15" cy="9" r="4" />
          <circle cx="19" cy="18" r="2" />
        </svg>
      )
    case 'seedling':
      return (
        <svg {...shared}>
          <path d="M12 22V13" />
          <path d="M12 13C10 13 5 10 5 5c3-1 8 2 7 8z" />
          <path d="M12 13C14 13 19 10 19 5c-3-1-8 2-7 8z" />
        </svg>
      )
    case 'search':
      return (
        <svg {...shared}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...shared}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      )
    case 'tshirt':
      return (
        <svg {...shared}>
          <path d="M3 6L8 3L12 5L16 3L21 6L18 9V21H6V9L3 6Z" />
          <line x1="8" y1="3" x2="8" y2="9" />
          <line x1="16" y1="3" x2="16" y2="9" />
        </svg>
      )
    case 'jacket':
      return (
        <svg {...shared}>
          <path d="M4 21V9L8 3L12 5L16 3L20 9V21H4Z" />
          <line x1="8" y1="3" x2="8" y2="13" />
          <line x1="16" y1="3" x2="16" y2="13" />
          <line x1="4" y1="13" x2="8" y2="13" />
          <line x1="16" y1="13" x2="20" y2="13" />
        </svg>
      )
    case 'dress':
      return (
        <svg {...shared}>
          <path d="M8 2H16L14 11L18 22H6L10 11Z" />
        </svg>
      )
    case 'shirt':
      return (
        <svg {...shared}>
          <path d="M3 6L8 3L12 5L16 3L21 6L18 9V21H6V9L3 6Z" />
          <path d="M10 5L12 22L14 5" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'warning':
      return (
        <svg {...shared}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    default:
      return null
  }
}

export function GlowIcon({ name, size = 20, className }: GlowIconProps) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconSVG name={name} size={size} />
    </span>
  )
}
