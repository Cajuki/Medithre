import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle, ChevronRight, Clock, Heart, Package, Truck, User } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore, useWishlistStore } from '@/store'
import { orderService } from '@/services/api'
import { Badge, PageLoader } from '@/components/common/UI'

const MOCK_ORDERS = [
  { id: 'ORD-001', created_at: '2025-01-15', status: 'delivered', total: 85000, items_count: 1, items: [{ name: 'Digital Microscope Pro 2000X' }] },
  { id: 'ORD-002', created_at: '2025-01-20', status: 'shipped', total: 32000, items_count: 2, items: [{ name: 'Surgical Instrument Kit' }] },
  { id: 'ORD-003', created_at: '2025-02-01', status: 'pending', total: 4500, items_count: 1, items: [{ name: 'Pulse Oximeter Fingertip' }] },
]

const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  processing: { label: 'Processing', variant: 'primary', icon: Package },
  shipped: { label: 'Shipped', variant: 'teal', icon: Truck },
  delivered: { label: 'Delivered', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'danger', icon: AlertCircle },
}

const TABS = [
  { key: 'orders', label: 'My Orders', icon: Package },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'profile', label: 'Profile', icon: User },
]

function formatPrice(price) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)
}

export default function DashboardPage() {
  const { user, updateUser } = useAuthStore()
  const wishlistItems = useWishlistStore((state) => state.items)
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
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
    <div className="min-h-screen">
      <div className="container-pad py-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-primary-700 text-2xl font-bold text-white shadow-soft">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div className="section-tag mb-2">
              <span className="eyebrow-dot" />
              Buyer Dashboard
            </div>
            <h1 className="text-3xl text-slate-950">{user?.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Total Orders', value: orders.length },
            { label: 'Wishlist Items', value: wishlistItems.length },
            { label: 'Completed Orders', value: orders.filter((order) => order.status === 'delivered').length },
          ].map((item) => (
            <div key={item.label} className="card p-5 text-center">
              <p className="text-3xl font-bold text-primary-800">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <nav className="card p-3 space-y-1">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    tab === key ? 'bg-primary-700 text-white' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="lg:col-span-3">
            {tab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="card p-10 text-center text-slate-500">
                    <Package className="mx-auto mb-3 h-12 w-12 opacity-30" />
                    <p>No orders yet.</p>
                    <Link to="/products" className="btn-primary mt-4 inline-flex">Start Shopping</Link>
                  </div>
                ) : orders.map((order) => {
                  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                  const StatusIcon = config.icon
                  return (
                    <div key={order.id} className="card p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{order.id}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <Badge variant={config.variant} className="flex items-center gap-1.5 text-xs">
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="mb-4 text-sm text-slate-600">
                        {order.items?.map((item) => item.name).join(', ')} {order.items_count > 1 && `+${order.items_count - 1} more`}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-800">{formatPrice(order.total)}</span>
                        <button className="btn-outline px-3 py-2 text-xs">
                          View Details
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {tab === 'wishlist' && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-slate-900">Wishlist ({wishlistItems.length})</h2>
                {wishlistItems.length === 0 ? (
                  <div className="card p-10 text-center text-slate-500">
                    <Heart className="mx-auto mb-3 h-12 w-12 opacity-30" />
                    <p>Your wishlist is empty.</p>
                    <Link to="/products" className="btn-primary mt-4 inline-flex">Browse Products</Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {wishlistItems.map((product) => (
                      <Link key={product.id} to={`/products/${product.id}`} className="card p-4">
                        <p className="text-sm font-semibold text-slate-800">{product.name}</p>
                        <p className="mt-2 text-sm font-bold text-primary-800">
                          {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(product.price)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'profile' && (
              <div className="card p-6">
                <h2 className="mb-6 text-xl font-bold text-slate-900">Profile Settings</h2>
                <form onSubmit={(event) => { event.preventDefault(); updateUser(profileForm) }} className="max-w-md space-y-5">
                  <div>
                    <label className="label">Full Name</label>
                    <input value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} className="input" />
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
