import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, Search, Menu, X, User, ChevronDown,
  LogOut, Package, LayoutDashboard, Microscope
} from 'lucide-react'
import { useAuthStore, useCartStore, useWishlistStore } from '@/store'
import clsx from 'clsx'

const NAV_LINKS = [
  { label: 'Products',    to: '/products' },
  { label: 'Categories',  to: '/categories' },
  { label: 'About',       to: '/about' },
  { label: 'Contact',     to: '/contact' },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [userMenu,     setUserMenu]     = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const navigate   = useNavigate()
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore()
  const cartCount     = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0))
  const wishlistCount = useWishlistStore(s => s.items.length)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    setUserMenu(false)
    navigate('/')
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-950 text-primary-200 text-xs py-2 hidden md:block">
        <div className="container-pad flex justify-between items-center">
          <span>🇰🇪 Nairobi, Kenya  |  +254 700 000 000  |  info@medithrex.com</span>
          <span>Free delivery on orders above KES 10,000</span>
        </div>
      </div>

      {/* Main navbar */}
      <header className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-card border-b border-white/60' : 'bg-white border-b border-slate-100'
      )}>
        <div className="container-pad">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-medical-teal rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow duration-300">
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-display text-xl text-primary-900 tracking-tight">Medithrex</span>
                <span className="block text-[9px] font-mono text-medical-teal tracking-widest uppercase">Medical Equipment</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-primary-300 transition-all duration-200 bg-white"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-medical-teal flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden sm:block max-w-[80px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={clsx('w-4 h-4 text-slate-400 transition-transform', userMenu && 'rotate-180')} />
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-card-lg py-2 animate-fade-in z-50">
                      <div className="px-4 py-2 border-b border-slate-50">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      {isAdmin() && (
                        <Link to="/admin" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 px-3 py-2 transition-colors hidden sm:block">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2 hidden sm:flex">
                    Get Started
                  </Link>
                  <Link to="/login" className="p-2 text-slate-500 hover:text-primary-600 sm:hidden">
                    <User className="w-5 h-5" />
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 md:hidden"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in">
            <div className="container-pad py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <NavLink key={link.to} to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => clsx(
                    'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-fade-in"
          onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up"
            onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4">
              <Search className="w-5 h-5 text-primary-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search medical equipment, lab tools..."
                className="flex-1 text-lg font-sans text-slate-800 placeholder-slate-300 outline-none bg-transparent"
              />
              <button type="button" onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="px-4 pb-4 text-xs text-slate-400 font-medium">
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">Enter</kbd> to search
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for user menu */}
      {userMenu && <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />}
    </>
  )
}