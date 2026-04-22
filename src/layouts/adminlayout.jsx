import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Users, ShoppingBag,
  BarChart2, Settings, LogOut, Microscope, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store'
import clsx from 'clsx'

const NAV = [
  { icon: LayoutDashboard, label: 'Overview',   to: '/admin' },
  { icon: Package,         label: 'Products',   to: '/admin/products' },
  { icon: Tag,             label: 'Categories', to: '/admin/categories' },
  { icon: ShoppingBag,     label: 'Orders',     to: '/admin/orders' },
  { icon: Users,           label: 'Users',      to: '/admin/users' },
  { icon: BarChart2,       label: 'Analytics',  to: '/admin/analytics' },
  { icon: Settings,        label: 'Settings',   to: '/admin/settings' },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-medical-clean flex">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-primary-950 flex flex-col transition-transform duration-300 md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-medical-teal rounded-lg flex items-center justify-center">
              <Microscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display text-lg text-white">Medithrex</span>
              <span className="block text-[9px] font-mono text-medical-teal tracking-widest uppercase">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4.5 h-4.5 w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-medical-teal flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors md:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
            ← View Store
          </Link>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}