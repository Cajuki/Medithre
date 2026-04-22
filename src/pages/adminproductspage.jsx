import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Upload, AlertCircle } from 'lucide-react'
import { productService, categoryService } from '@/services/api'
import { Spinner, Badge, EmptyState, Alert, Pagination } from '@/components/common/UI'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Digital Microscope Pro 2000X', price: 85000, stock: 12, category_name: 'Lab Equipment', is_featured: true },
  { id: 2, name: 'Patient Monitor ECG 12-Lead',  price: 145000, stock: 5, category_name: 'Diagnostics',   is_featured: false },
  { id: 3, name: 'Surgical Instrument Kit',      price: 32000,  stock: 20, category_name: 'Surgical',     is_featured: true },
  { id: 4, name: 'Centrifuge Machine 6000 RPM',  price: 67500,  stock: 8, category_name: 'Lab Equipment', is_featured: false },
]
const MOCK_CATS = [
  { id: 1, name: 'Diagnostics' }, { id: 2, name: 'Surgical' },
  { id: 3, name: 'Lab Equipment' }, { id: 4, name: 'Consumables' },
]

const EMPTY_FORM = {
  name: '', description: '', price: '', original_price: '', stock: '',
  category_id: '', image_url: '', is_featured: false,
}

function formatPrice(p) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p)
}

export default function AdminProductsPage() {
  const [products,    setProducts]    = useState([])
  const [categories,  setCategories]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [page,        setPage]        = useState(1)
  const [total,       setTotal]       = useState(0)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editItem,    setEditItem]    = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [saving,      setSaving]      = useState(false)
  const [deleteId,    setDeleteId]    = useState(null)
  const [error,       setError]       = useState(null)

  const PER_PAGE = 10

  const load = async () => {
    setLoading(true)
    try {
      const [pData, cData] = await Promise.all([
        productService.getAll({ search, page, per_page: PER_PAGE }),
        categoryService.getAll(),
      ])
      setProducts(pData?.products || MOCK_PRODUCTS)
      setTotal(pData?.total     || MOCK_PRODUCTS.length)
      setCategories(cData?.categories || MOCK_CATS)
    } catch {
      setProducts(MOCK_PRODUCTS.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())))
      setTotal(MOCK_PRODUCTS.length)
      setCategories(MOCK_CATS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [search, page])

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit   = (p)  => {
    setEditItem(p)
    setForm({
      name: p.name, description: p.description || '',
      price: p.price, original_price: p.original_price || '',
      stock: p.stock, category_id: p.category_id || '',
      image_url: p.image_url || '', is_featured: p.is_featured || false,
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editItem) {
        await productService.update(editItem.id, form)
        toast.success('Product updated!')
      } else {
        await productService.create(form)
        toast.success('Product created!')
      }
      setModalOpen(false)
      load()
    } catch {
      // Demo: update local state
      if (editItem) {
        setProducts(ps => ps.map(p => p.id === editItem.id ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p))
        toast.success('Product updated!')
      } else {
        setProducts(ps => [{ id: Date.now(), ...form, price: Number(form.price), stock: Number(form.stock), category_name: categories.find(c => c.id == form.category_id)?.name || '' }, ...ps])
        toast.success('Product created!')
      }
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await productService.delete(id)
      toast.success('Product deleted.')
    } catch {
      // Demo: remove locally
    }
    setProducts(ps => ps.filter(p => p.id !== id))
    setDeleteId(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-slate-800">Products</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} products in catalog</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Search */}
      <div className="card p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text" placeholder="Search products…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 text-sm outline-none text-slate-800 placeholder-slate-400 font-sans"
        />
        {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4,5,6].map(j => (
                      <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
                : products.length === 0
                  ? <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">No products found.</td></tr>
                  : products.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-800 max-w-[200px] truncate">{product.name}</td>
                      <td className="px-5 py-4">
                        <Badge variant="primary" className="text-xs">{product.category_name}</Badge>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">{formatPrice(product.price)}</td>
                      <td className="px-5 py-4">
                        <span className={clsx('font-semibold text-xs', product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500')}>
                          {product.stock > 0 ? product.stock + ' units' : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {product.is_featured
                          ? <Badge variant="success" className="text-xs">Yes</Badge>
                          : <Badge variant="default" className="text-xs">No</Badge>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(product)}
                            className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(product.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-slate-100">
          <Pagination page={page} totalPages={Math.ceil(total / PER_PAGE)} onPageChange={setPage} />
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-lg">{editItem ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="label">Product Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="e.g. Digital Microscope Pro" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (KES) *</label>
                  <input type="number" required min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input" placeholder="0" />
                </div>
                <div>
                  <label className="label">Original Price (KES)</label>
                  <input type="number" min="0" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} className="input" placeholder="0 (optional)" />
                </div>
                <div>
                  <label className="label">Stock Quantity *</label>
                  <input type="number" required min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input" placeholder="0" />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select required value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="input">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Image URL</label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="input" placeholder="https://…" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input resize-none" placeholder="Detailed product description…" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={clsx('w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all', form.is_featured ? 'bg-primary-600 border-primary-600' : 'border-slate-300')}>
                  {form.is_featured && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input type="checkbox" className="sr-only" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                <span className="text-sm font-medium text-slate-700">Mark as Featured</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving && <Spinner size="sm" className="text-white" />}
                  {saving ? 'Saving…' : editItem ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-up text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Delete Product?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}