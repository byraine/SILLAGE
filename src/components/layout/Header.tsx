import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/scan', label: 'Scan' },
  { path: '/wardrobe', label: 'Memory' },
  { path: '/impact', label: 'Action' },
]

interface HeaderProps {
  wardrobeCount?: number
}

export function Header({ wardrobeCount: _wardrobeCount = 0 }: HeaderProps) {
  const location = useLocation()
  return (
    <header className="fixed top-0 z-40 w-full max-w-[430px] left-1/2 -translate-x-1/2">
      <div className="flex items-center justify-center px-5 pt-4 pb-3">
        <nav className="flex items-center gap-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.12em] font-typewriter no-underline transition-all duration-200
                  ${isActive ? 'bg-accent/20 text-accent' : 'text-muted hover:text-text'}
                `}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
