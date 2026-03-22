import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Home', icon: '◎' },
  { path: '/scan', label: 'Scan', icon: '◈' },
  { path: '/wardrobe', label: 'Wardrobe', icon: '◉' },
  { path: '/impact', label: 'Impact', icon: '◎' },
]

export function BottomNav() {
  const location = useLocation()
  return (
    <nav className="fixed bottom-0 z-40 w-full max-w-[430px] left-1/2 -translate-x-1/2 px-4 pb-4">
      <div className="glass rounded-full px-2 py-1.5 flex items-center gap-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex-1 flex flex-col items-center py-2 rounded-full transition-all duration-200 no-underline gap-0.5
                ${isActive ? 'bg-accent/20 text-accent' : 'text-muted hover:text-text'}
              `}
            >
              <span className="text-sm leading-none">{item.icon}</span>
              <span className="text-[9px] uppercase tracking-[0.12em] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
