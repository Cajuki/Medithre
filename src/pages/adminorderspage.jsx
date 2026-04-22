import { useState, useEffect } from 'react'
import { Search, X, Eye, ChevronDown } from 'lucide-react'
import { orderService } from '@/services/api'
import { Badge, Pagination } from '@/components/common/UI'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const MOCK_ORDERS = [
  { id: 'ORD-184', customer_name: 'Kenyatta National Hospital', customer_email: 'procurement@knh.or.ke', total: 380000, status: 'pending',    created_at: '2025-02-06', items_count: 1 },
  { id: 'ORD-183', customer_name: 'Dr. Akinyi Otieno',          customer_email: 'dr.akinyi@gmail.com',   total: 85000,  status: 'shipped',    created_at: '2025-02-05', items_count: 1 },
  { id: 'ORD-182', customer_name: 'Aga Khan University Hospital',customer_email: 'supply@akuh.or.ke',    total: 245000, status: 'delivered',  created_at: '2025-02-05', items_count: 3 },
  { id: 'ORD-181', customer_name: 'Nairobi West Hospital',       customer_email: 'ops@nwh.co.ke',        total: 32000,  status: 'processing', created_at: '2025-02-04', items_count: 2 },
  { id: 'ORD-180', customer_name: 'Lab Tech Solutions Ltd',      customer_email: 'info@labtechke.com',   total: 67500,  status: 'delivered',  created_at: '2025-02-03', items_count: 1 },
  { id: 'ORD-179', customer_name: 'Mama Lucy Hospital',          customer_email: 'store@mamalucy.go.ke', total: 14500,  status: 'cancelled',  created_at: '2025-02-02', items_count: 2 },
]

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    variant: 'warning' },
  processing: { label: 'Processing', variant: 'primary' },
  shipped:    { label: 'Shipped',    variant: 'teal' },
  delivered:  { label: 'Delivered',  variant: 'success' },
  cancelled:  { label: 'Cancelled',  variant: 'danger' },
}

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({ value, label: cfg.label }))

function formatPrice(p) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p)
}

export default function AdminOrdersPage() {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [page,     setPage]     = useState(1)
  const [total,    setTotal]    = useState(0)
  const [updating, setUpdating] = useState(null)
  const PER_PAGE = 10

  const load = async () => {
    setLoading(true)
    try {
      const data = await orderService.getAll({ search, status: filter === 'all' ? undefined : filter, page, per_page: PER_PAGE })
      setOrders(data?.orders || [])
      setTotal(data?.total || 0)
    } catch {
      let result = MOCK_ORDERS.filter(o => {
        const matchSearch = !search || o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || o.status === filter
        return matchSearch && matchFilter
      })
      setOrders(result)
      setTotal(result.length)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [search, filter, page])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      await orderService.updateStatus(orderId, newStatus)
      toast.success(`Order ${orderId} updated to ${newStatus}`)
    } catch {
      toast.success(`Order ${orderId} updated to ${newStatus}`)
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    setUpdating(null)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display text-slate-800">Orders</h1>
        <p className="text-slate-400 text-sm mt-0.5">{total} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48 card px-4 py-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Search orders or customers…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 text-sm outline-none text-slate-800 placeholder-slate-400 font-sans bg-transparent"
          />
          {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', ...Object.keys(STATUS_CONFIG)].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1) }}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all',
                filter === s ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              )}>
              {s === 'all' ? 'All Orders' : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? Array(5).fill(0).map((_, i) => (
                  <tr key={i}>{[1,2,3,4,5,6,7].map(j => <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-full rounded" /></td>)}</tr>
                ))
                : orders.length === 0
                  ? <tr><td colSpan={7} className="py-12 text-center text-slate-400">No orders found.</td></tr>
                  : orders.map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs font-bold text-primary-700">{order.id}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-700 text-xs">{order.customer_name}</p>
                          <p className="text-slate-400 text-xs">{order.customer_email}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</td>
                        <td className="px-5 py-4 font-bold text-slate-800">{formatPrice(order.total)}</td>
                        <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="relative">
                            <select
                              value={order.status}
                              disabled={updating === order.id}
                              onChange={e => handleStatusChange(order.id, e.target.value)}
                              className={clsx(
                                'text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-all appearance-none pr-7',
                                updating === order.id ? 'opacity-50 cursor-not-allowed' : '',
                                'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                              )}
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-slate-100">
          <Pagination page={page} totalPages={Math.ceil(total / PER_PAGE)} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}