import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Heart, User, Clock, CheckCircle, Truck, AlertCircle, ChevronRight } from 'lucide-react'
import { useAuthStore, useWishlistStore } from '@/store'
import { orderService } from '@/services/api'
import { Badge, PageLoader } from '@/components/common/UI'
import clsx from 'clsx'

const MOCK_ORDERS = [
  { id: 'ORD-001', created_at: '2025-01-15', status: 'delivered', total: 85000, items_count: 1, items: [{ name: 'Digital Microscope Pro 2000X' }] },
  { id: 'ORD-002', created_at: '2025-01-20', status: 'shipped',   total: 32000, items_count: 2, items: [{ name: 'Surgical Instrument Kit' }] },
  { id: 'ORD-003', created_at: '2025-02-01', status: 'pending',   total: 4500,  items_count: 1, items: [{ name: 'Pulse Oximeter Fingertip' }] },
]

function formatPrice(p) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p)
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   variant: 'warning', icon: Clock },
  processing:{ label: 'Processing',variant: 'primary', icon: Package },
  shipped:   { label: 'Shipped',   variant: 'teal',    icon: Truck },
  delivered: { label: 'Delivered', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'danger',  icon: AlertCircle },
}

const TABS = [
  { key: 'orders',   label: 'My Orders',  icon: Package },
  { key: 'wishlist', label: 'Wishlist',   icon: Heart },
  { key: 'profile',  label: 'Profile',    icon: User },
]

export default function DashboardPage() {
  const { user, updateUser } = useAuthStore()
  const wishlistItems = useWishlistStore(s => s.items)
  const [tab,     setTab]    = useState('orders')
  const [orders,  setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })

  useEffect(() => {
    const load = async () => {
      try {
        const data = await orderService.getMyOrders()
        setOrders(data?.orders || MOCK_ORDERS)
      } catch {
        setOrders(MOCK_ORDERS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="bg-medical-clean min-h-screen">
      <div className="container-pad py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-teal flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-display text-primary-900">{user?.name}</h1>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Orders',    value: orders.length },
            { label: 'Wishlist Items',  value: wishlistItems.length },
            { label: 'Completed',       value: orders.filter(o => o.status === 'delivered').length },
          ].map(s => (
            <div key={s.label} className="card p-5 text-center">
              <p className="text-3xl font-display text-primary-900">{s.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <aside className="lg:col-span-1">
            <nav className="card p-3 space-y-1">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                    tab === key ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                  )}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Orders tab */}
            {tab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-bold text-slate-800 text-lg">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="card p-10 text-center text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No orders yet.</p>
                    <Link to="/products" className="btn-primary mt-4 inline-flex">Start Shopping</Link>
                  </div>
                ) : orders.map(order => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                  const StatusIcon = cfg.icon
                  return (
                    <div key={order.id} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-mono text-sm font-bold text-slate-700">{order.id}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <Badge variant={cfg.variant} className="flex items-center gap-1.5 text-xs">
                          <StatusIcon className="w-3 h-3" /> {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-1">
                        {order.items?.map(i => i.name).join(', ')} {order.items_count > 1 && `+${order.items_count - 1} more`}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary-900 text-lg">{formatPrice(order.total)}</span>
                        <button className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1">
                          View Details <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Wishlist tab */}
            {tab === 'wishlist' && (
              <div>
                <h2 className="font-bold text-slate-800 text-lg mb-4">Wishlist ({wishlistItems.length})</h2>
                {wishlistItems.length === 0 ? (
                  <div className="card p-10 text-center text-slate-400">
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Your wishlist is empty.</p>
                    <Link to="/products" className="btn-primary mt-4 inline-flex">Browse Products</Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {wishlistItems.map(p => (
                      <Link key={p.id} to={`/products/${p.id}`} className="card p-4 flex items-center gap-3 hover:border-primary-200 transition-all">
                        <div className="w-14 h-14 rounded-xl bg-medical-ice flex-shrink-0 overflow-hidden">
                          <img src={p.image_url || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=100&q=60'} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                          <p className="text-primary-600 font-bold text-sm mt-0.5">
                            {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile tab */}
            {tab === 'profile' && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-800 text-lg mb-6">Profile Settings</h2>
                <form onSubmit={e => { e.preventDefault(); updateUser(profileForm); }} className="space-y-5 max-w-md">
                  <div>
                    <label className="label">Full Name</label>
                    <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="0712 345 678" />
                  </div>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}