import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Package, ShoppingBag, Users, DollarSign,
  ArrowUpRight, ArrowDownRight, Eye, Clock, CheckCircle, Truck
} from 'lucide-react'
import { dashboardService, orderService } from '@/services/api'
import { Skeleton, Badge } from '@/components/common/UI'

const MOCK_STATS = {
  revenue:      { value: 2_840_000, change: 12.5, up: true },
  orders:       { value: 184,       change: 8.2,  up: true },
  products:     { value: 312,       change: 4.1,  up: true },
  customers:    { value: 1248,      change: -2.3, up: false },
}

const MOCK_RECENT_ORDERS = [
  { id: 'ORD-184', customer: 'Kenyatta National Hospital', total: 380000, status: 'pending',   date: '2025-02-06' },
  { id: 'ORD-183', customer: 'Dr. Akinyi Otieno',          total: 85000,  status: 'shipped',   date: '2025-02-05' },
  { id: 'ORD-182', customer: 'Aga Khan University Hospital',total: 245000, status: 'delivered', date: '2025-02-05' },
  { id: 'ORD-181', customer: 'Nairobi West Hospital',       total: 32000,  status: 'processing',date: '2025-02-04' },
  { id: 'ORD-180', customer: 'Lab Tech Solutions Ltd',      total: 67500,  status: 'delivered', date: '2025-02-03' },
]

const MOCK_TOP_PRODUCTS = [
  { id: 1, name: 'Digital Microscope Pro 2000X', sold: 28, revenue: 2380000 },
  { id: 2, name: 'Patient Monitor ECG 12-Lead',  sold: 14, revenue: 2030000 },
  { id: 3, name: 'Centrifuge Machine 6000 RPM',  sold: 22, revenue: 1485000 },
  { id: 4, name: 'IV Cannula Set (Box 100)',      sold: 312,revenue: 998400  },
]

const STATUS_STYLES = {
  pending:    { label: 'Pending',    variant: 'warning' },
  processing: { label: 'Processing', variant: 'primary' },
  shipped:    { label: 'Shipped',    variant: 'teal' },
  delivered:  { label: 'Delivered',  variant: 'success' },
  cancelled:  { label: 'Cancelled',  variant: 'danger' },
}

function StatCard({ label, value, change, up, icon: Icon, prefix = '', loading }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
          {loading
            ? <div className="skeleton h-8 w-24 rounded mt-1" />
            : <p className="text-2xl font-display font-bold text-primary-900 mt-1">{prefix}{typeof value === 'number' && value > 9999 ? (value / 1e6).toFixed(1) + 'M' : value?.toLocaleString()}</p>
          }
        </div>
        <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
        {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        {Math.abs(change)}% vs last month
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState(null)
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          dashboardService.getStats(),
          orderService.getAll({ limit: 5 }),
        ])
        setStats(statsData?.stats || MOCK_STATS)
        setOrders(ordersData?.orders || MOCK_RECENT_ORDERS)
      } catch {
        setStats(MOCK_STATS)
        setOrders(MOCK_RECENT_ORDERS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const s = stats || MOCK_STATS

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening at Medithrex.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue"  value={s.revenue?.value}   change={s.revenue?.change}   up={s.revenue?.up}   icon={DollarSign} prefix="KES " loading={loading} />
        <StatCard label="Orders"         value={s.orders?.value}    change={s.orders?.change}    up={s.orders?.up}    icon={ShoppingBag} loading={loading} />
        <StatCard label="Products"       value={s.products?.value}  change={s.products?.change}  up={s.products?.up}  icon={Package} loading={loading} />
        <StatCard label="Customers"      value={s.customers?.value} change={s.customers?.change} up={s.customers?.up} icon={Users} loading={loading} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View all →</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Order</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Customer</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Amount</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(loading ? MOCK_RECENT_ORDERS : orders).map(order => {
                  const cfg = STATUS_STYLES[order.status] || STATUS_STYLES.pending
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs font-bold text-primary-700">{order.id}</td>
                      <td className="py-3 pr-4 font-medium text-slate-700 max-w-[160px] truncate">{order.customer}</td>
                      <td className="py-3 pr-4 font-bold text-slate-800">
                        {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(order.total)}
                      </td>
                      <td className="py-3">
                        <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800">Top Products</h2>
            <Link to="/admin/products" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">Manage →</Link>
          </div>
          <div className="space-y-4">
            {MOCK_TOP_PRODUCTS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.sold} sold</p>
                </div>
                <p className="text-sm font-bold text-primary-900 flex-shrink-0 text-right">
                  {(p.revenue / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Add New Product',  to: '/admin/products/new', icon: Package,    color: 'from-primary-500 to-primary-600' },
          { label: 'Manage Orders',    to: '/admin/orders',       icon: ShoppingBag,color: 'from-teal-500 to-teal-600' },
          { label: 'View All Users',   to: '/admin/users',        icon: Users,      color: 'from-violet-500 to-violet-600' },
        ].map(({ label, to, icon: Icon, color }) => (
          <Link key={to} to={to}
            className={`flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r ${color} text-white group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
            <Icon className="w-6 h-6" />
            <span className="font-semibold">{label}</span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  )
}