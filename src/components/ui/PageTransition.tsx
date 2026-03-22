import { useLocation } from 'react-router-dom'

/**
 * Wraps the route outlet in a keyed div so React unmounts/remounts
 * on every navigation, triggering the CSS page-enter animation.
 *
 * Uses a spring-eased fade-up (cubic-bezier(0.22,1,0.36,1)) for
 * an organic, editorial feel rather than a mechanical linear slide.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div
      key={location.key}
      className="animate-page-enter"
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  )
}
