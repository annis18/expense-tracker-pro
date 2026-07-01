import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  List,
  PieChart,
  Settings,
  Wallet,
  LogOut,
} from 'lucide-react'

const navItems = [
  { to: '/',         label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/add',      label: 'Add Expense', icon: PlusCircle      },
  { to: '/history',  label: 'History',     icon: List            },
  { to: '/reports',  label: 'Reports',     icon: PieChart        },
  { to: '/settings', label: 'Settings',    icon: Settings        },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-20">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="bg-indigo-600 rounded-lg p-2">
          <Wallet size={22} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight">Expense</p>
          <p className="text-indigo-400 font-bold text-base leading-tight">Tracker Pro</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Phase label + Sign out */}
      <div className="px-3 pb-4 border-t border-gray-800 pt-3 flex flex-col gap-1">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-800 hover:text-white transition-all duration-150 w-full text-left"
        >
          <LogOut size={18} />
          Sign Out
        </button>
        <p className="text-gray-700 text-xs px-4 pt-1">Phase 1 Complete ✓</p>
      </div>
    </aside>
  )
}