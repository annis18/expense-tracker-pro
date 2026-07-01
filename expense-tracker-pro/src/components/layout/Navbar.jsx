import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, UserCircle, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-6 z-10">

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 w-72">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search transactions..."
          className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <UserCircle size={32} className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-300 leading-tight">{user?.name ?? 'User'}</p>
              <p className="text-xs text-gray-600 leading-tight">{user?.email ?? ''}</p>
            </div>
          </button>

          {menuOpen && (
            <>
              {/* Click-outside overlay */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-12 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-rose-400 hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}