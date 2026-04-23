import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BarChart2, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Tag, Users, X } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store'
import BrandLogo from '@/components/BrandLogo'

const NAV = [
  { icon: LayoutDashboard, label: 'Overview', to: '/admin' },
  { icon: Package, label: 'Products', to: '/admin/products' },
  { icon: Tag, label: 'Categories', to: '/admin/categories' },
  { icon: ShoppingBag, label: 'Orders', to: '/admin/orders' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: BarChart2, label: 'Analytics', to: '/admin/analytics' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
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
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 transition-transform duration-300 md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="border-b border-white/10 p-5">
          <Link to="/" className="flex items-center justify-between gap-3">
            <BrandLogo framed compact imageClassName="h-7" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {NAV.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive ? 'bg-primary-700 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-2 flex items-center gap-3 rounded-2xl px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-sm font-bold text-white">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:ml-72">
        <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-slate-200 bg-white/92 px-6 py-4 backdrop-blur">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 md:hidden">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1" />
          <Link to="/" className="text-sm font-medium text-primary-700 transition hover:text-primary-800">
            View Store
          </Link>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
