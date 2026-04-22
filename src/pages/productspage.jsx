import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid3X3, List, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import ProductFilters from '@/components/product/ProductFilters'
import { ProductCardSkeleton, Pagination, EmptyState, Alert } from '@/components/common/UI'
import { productService, categoryService } from '@/services/api'
import { useDebounce } from '@/hooks'
import clsx from 'clsx'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Digital Microscope Pro 2000X', price: 85000, original_price: 95000, stock: 12, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.8, review_count: 34, is_featured: true, discount_pct: 10 },
  { id: 2, name: 'Patient Monitor ECG 12-Lead', price: 145000, stock: 5, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.9, review_count: 21, discount_pct: 0 },
  { id: 3, name: 'Surgical Instrument Kit – 24pc', price: 32000, original_price: 38000, stock: 20, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.6, review_count: 57, is_featured: true, discount_pct: 16 },
  { id: 4, name: 'Centrifuge Machine 6000 RPM', price: 67500, stock: 8, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.7, review_count: 18, discount_pct: 0 },
  { id: 5, name: 'Pulse Oximeter Fingertip', price: 4500, stock: 150, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.5, review_count: 89, discount_pct: 0 },
  { id: 6, name: 'Ultrasound Machine Portable', price: 380000, stock: 3, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 5.0, review_count: 12, is_featured: true, discount_pct: 0 },
  { id: 7, name: 'IV Cannula Set (Box 100)', price: 3200, stock: 500, category_name: 'Consumables', category_slug: 'consumables', avg_rating: 4.4, review_count: 203, discount_pct: 0 },
  { id: 8, name: 'Autoclave Sterilizer 20L', price: 120000, stock: 6, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.8, review_count: 29, discount_pct: 0 },
  { id: 9, name: 'Blood Glucose Meter Kit', price: 6800, stock: 80, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.6, review_count: 112, discount_pct: 0 },
  { id: 10, name: 'Surgical Gloves (Box 50)', price: 950, stock: 1000, category_name: 'Consumables', category_slug: 'consumables', avg_rating: 4.3, review_count: 302, discount_pct: 0 },
  { id: 11, name: 'Hematology Analyzer 3-Part', price: 210000, stock: 2, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.9, review_count: 8, discount_pct: 0 },
  { id: 12, name: 'Digital Sphygmomanometer', price: 12500, stock: 35, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.7, review_count: 64, discount_pct: 0 },
]

const MOCK_CATEGORIES = [
  { id: 1, name: 'Diagnostics',   slug: 'diagnostics',  product_count: 4 },
  { id: 2, name: 'Surgical',      slug: 'surgical',     product_count: 2 },
  { id: 3, name: 'Lab Equipment', slug: 'lab',          product_count: 3 },
  { id: 4, name: 'Consumables',   slug: 'consumables',  product_count: 3 },
]

const PER_PAGE = 12

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [viewMode,   setViewMode]   = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search:      searchParams.get('search')   || '',
    category:    searchParams.get('category') || null,
    sort:        searchParams.get('sort')     || 'newest',
    priceRange:  searchParams.get('price')    || null,
    inStockOnly: null,
    page: 1,
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  // sync URL ↔ filters
  useEffect(() => {
    const params = {}
    if (filters.search)     params.search   = filters.search
    if (filters.category)   params.category = filters.category
    if (filters.sort !== 'newest') params.sort = filters.sort
    if (filters.priceRange) params.price    = filters.priceRange
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        search:    debouncedSearch || undefined,
        category:  filters.category || undefined,
        sort:      filters.sort,
        price:     filters.priceRange || undefined,
        in_stock:  filters.inStockOnly ? 1 : undefined,
        page:      filters.page,
        per_page:  PER_PAGE,
      }
      const data = await productService.getAll(params)
      setProducts(data?.products || [])
      setTotal(data?.total     || 0)
    } catch {
      // Fall back to mock filtered data
      let result = [...MOCK_PRODUCTS]
      if (debouncedSearch) result = result.filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
      if (filters.category)   result = result.filter(p => p.category_slug === filters.category)
      if (filters.inStockOnly) result = result.filter(p => p.stock > 0)
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number)
        result = result.filter(p => p.price >= min && (max === Infinity || p.price <= max))
      }
      if (filters.sort === 'price_asc')  result.sort((a, b) => a.price - b.price)
      if (filters.sort === 'price_desc') result.sort((a, b) => b.price - a.price)
      if (filters.sort === 'rating')     result.sort((a, b) => b.avg_rating - a.avg_rating)
      setTotal(result.length)
      const start = (filters.page - 1) * PER_PAGE
      setProducts(result.slice(start, start + PER_PAGE))
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filters.category, filters.sort, filters.priceRange, filters.inStockOnly, filters.page])

  useEffect(() => { loadProducts() }, [loadProducts])

  useEffect(() => {
    categoryService.getAll()
      .then(data => setCategories(data?.categories || MOCK_CATEGORIES))
      .catch(() => setCategories(MOCK_CATEGORIES))
  }, [])

  const handleFiltersChange = (newFilters) => setFilters(f => ({ ...f, ...newFilters }))
  const totalPages = Math.ceil(total / PER_PAGE)

  const activeFilterCount = [filters.category, filters.priceRange, filters.inStockOnly].filter(Boolean).length

  return (
    <div className="bg-medical-clean min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="container-pad py-8">
          <h1 className="section-title mb-1">All Products</h1>
          <p className="text-slate-400 text-sm">{total > 0 ? `${total} products available` : 'Browse our full catalog'}</p>

          {/* Search bar */}
          <div className="mt-5 flex gap-3">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search medical equipment..."
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                className="input pr-10"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters(f => ({ ...f, search: '', page: 1 }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 btn-outline lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx('p-2.5 transition-colors', viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-600')}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx('p-2.5 transition-colors', viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-600')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-pad py-8">
        <div className="flex gap-8">
          {/* Sidebar filters – desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters categories={categories} filters={filters} onChange={handleFiltersChange} />
          </div>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 inset-y-0 w-80 bg-white overflow-y-auto p-6 animate-slide-right">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">Filters</h3>
                  <button onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <ProductFilters categories={categories} filters={filters} onChange={(f) => { handleFiltersChange(f); setShowFilters(false) }} />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError(null)} />}

            {loading ? (
              <div className={clsx('grid gap-5', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
                {Array(PER_PAGE).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={SlidersHorizontal}
                title="No products found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={
                  <button onClick={() => setFilters({ search: '', category: null, sort: 'newest', priceRange: null, inStockOnly: null, page: 1 })}
                    className="btn-primary">
                    Clear All Filters
                  </button>
                }
              />
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-5">
                  Showing {((filters.page - 1) * PER_PAGE) + 1}–{Math.min(filters.page * PER_PAGE, total)} of {total} results
                </p>
                <div className={clsx(
                  'grid gap-5',
                  viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                )}>
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      page={filters.page}
                      totalPages={totalPages}
                      onPageChange={(p) => {
                        setFilters(f => ({ ...f, page: p }))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}