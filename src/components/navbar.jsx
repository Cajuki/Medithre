import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Microscope,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore, useCartStore, useWishlistStore } from '@/store'

const NAV_LINKS = [
  { label: 'Products', to: '/products' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore()
  const cartCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0))
  const wishlistCount = useWishlistStore((state) => state.items.length)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()

    if (!searchQuery.trim()) return

    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const handleLogout = () => {
    logout()
    setUserMenu(false)
    navigate('/')
  }

  return (
    <>
      <div className="border-b border-slate-200/70 bg-slate-950 text-slate-200">
        <div className="container-pad flex min-h-10 flex-wrap items-center justify-between gap-2 py-2 text-[11px] font-medium uppercase tracking-[0.18em]">
          <span>Trusted medical and laboratory procurement</span>
          <span className="text-slate-400">Nairobi | +254 700 000 000 | info@medithrex.com</span>
        </div>
      </div>

      <header
        className={clsx(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/60 bg-white/78 shadow-[0_20px_50px_-38px_rgba(15,76,129,0.45)] backdrop-blur-xl'
            : 'border-b border-slate-200/70 bg-white/92 backdrop-blur'
        )}
      >
        <div className="container-pad">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-700 to-teal-500 text-white shadow-[0_16px_32px_-18px_rgba(15,76,129,0.8)]">
                <Microscope className="h-5 w-5" />
              </div>
              <div className="leading-none">
                <div className="font-display text-2xl font-bold tracking-tight text-slate-950">Medithrex</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Clinical Supply Store</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    clsx(
                      'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-sky-50 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-primary-700 md:inline-flex"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                to="/wishlist"
                className="relative inline-flex rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-rose-500"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative inline-flex rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-primary-700"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenu((open) => !open)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-slate-300"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-700 to-teal-500 text-sm font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[7rem] truncate pr-1 text-sm font-semibold text-slate-700">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={clsx('h-4 w-4 text-slate-400 transition-transform', userMenu && 'rotate-180')} />
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-38px_rgba(15,76,129,0.42)]">
                      <div className="border-b border-slate-100 px-5 py-4">
                        <div className="text-sm font-semibold text-slate-950">{user?.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{user?.email}</div>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-primary-700"
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>

                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-primary-700"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-5 py-3 text-sm text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link to="/login" className="btn-ghost text-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary px-5 py-3 text-sm">
                    Create Account
                  </Link>
                </div>
              )}

              {!isAuthenticated && (
                <Link to="/login" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:text-primary-700 sm:hidden">
                  <User className="h-5 w-5" />
                </Link>
              )}

              <button
                onClick={() => setMobileOpen((open) => !open)}
                className="inline-flex rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-primary-700 lg:hidden"
                aria-label="Open menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="container-pad space-y-2 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'block rounded-2xl px-4 py-3 text-sm font-semibold transition',
                      isActive ? 'bg-sky-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setSearchOpen(true)
                  setMobileOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <Search className="h-4 w-4" />
                Search products
              </button>
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/45 px-4 pt-24 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/50 bg-white shadow-[0_40px_120px_-42px_rgba(15,76,129,0.55)]" onClick={(event) => event.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 md:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-primary-700">
                <Search className="h-5 w-5" />
              </div>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search analyzers, monitors, microscopes, consumables..."
                className="flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 md:text-lg"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </form>
            <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
              Press <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">Enter</span> to search the catalog.
            </div>
          </div>
        </div>
      )}

      {userMenu && <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />}
    </>
  )
}
