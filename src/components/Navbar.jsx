import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBasket, ScanLine, ShoppingCart, UtensilsCrossed } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/pantry', label: 'Pantry', icon: ShoppingBasket },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/shopping', label: 'Shopping', icon: ShoppingCart },
  { to: '/meals', label: 'Meals', icon: UtensilsCrossed },
]

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around items-center h-16 z-50">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs px-3 py-2 transition-colors ${
              isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
