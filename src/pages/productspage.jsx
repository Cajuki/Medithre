import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid3X3, List, Search, SlidersHorizontal, X } from 'lucide-react'
import clsx from 'clsx'
import ProductCard from '@/components/product/ProductCard'
import ProductFilters from '@/components/product/ProductFilters'
import { Alert, EmptyState, Pagination, ProductCardSkeleton } from '@/components/common/UI'
import { productService, categoryService } from '@/services/api'
import { useDebounce } from '@/hooks'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Digital Microscope Pro 2000X', price: 85000, original_price: 95000, stock: 12, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.8, review_count: 34, is_featured: true, discount_pct: 10 },
  { id: 2, name: 'Patient Monitor ECG 12-Lead', price: 145000, stock: 5, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.9, review_count: 21, discount_pct: 0 },
  { id: 3, name: 'Surgical Instrument Kit - 24pc', price: 32000, original_price: 38000, stock: 20, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.6, review_count: 57, is_featured: true, discount_pct: 16 },
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
  { id: 1, name: 'Diagnostics', slug: 'diagnostics', product_count: 4 },
  { id: 2, name: 'Surgical', slug: 'surgical', product_count: 2 },
  { id: 3, name: 'Lab Equipment', slug: 'lab', product_count: 3 },
  { id: 4, name: 'Consumables', slug: 'consumables', product_count: 3 },
]

const PER_PAGE = 12

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || null,
    sort: searchParams.get('sort') || 'newest',
    priceRange: searchParams.get('price') || null,
    inStockOnly: null,
    page: 1,
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  useEffect(() => {
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.category) params.category = filters.category
    if (filters.sort !== 'newest') params.sort = filters.sort
    if (filters.priceRange) params.price = filters.priceRange
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        search: debouncedSearch || undefined,
        category: filters.category || undefined,
        sort: filters.sort,
        price: filters.priceRange || undefined,
        in_stock: filters.inStockOnly ? 1 : undefined,
        page: filters.page,
        per_page: PER_PAGE,
      }

      const data = await productService.getAll(params)
      setProducts(data?.products || [])
      setTotal(data?.total || 0)
    } catch {
      let result = [...MOCK_PRODUCTS]
      if (debouncedSearch) result = result.filter((product) => product.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
      if (filters.category) result = result.filter((product) => product.category_slug === filters.category)
      if (filters.inStockOnly) result = result.filter((product) => product.stock > 0)
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number)
        result = result.filter((product) => product.price >= min && (max === Infinity || product.price <= max))
      }
      if (filters.sort === 'price_asc') result.sort((a, b) => a.price - b.price)
      if (filters.sort === 'price_desc') result.sort((a, b) => b.price - a.price)
      if (filters.sort === 'rating') result.sort((a, b) => b.avg_rating - a.avg_rating)
      setTotal(result.length)
      const start = (filters.page - 1) * PER_PAGE
      setProducts(result.slice(start, start + PER_PAGE))
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filters.category, filters.inStockOnly, filters.page, filters.priceRange, filters.sort])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    categoryService.getAll()
      .then((data) => setCategories(data?.categories || MOCK_CATEGORIES))
      .catch(() => setCategories(MOCK_CATEGORIES))
  }, [])

  const handleFiltersChange = (nextFilters) => setFilters((current) => ({ ...current, ...nextFilters }))
  const totalPages = Math.ceil(total / PER_PAGE)
  const activeFilterCount = [filters.category, filters.priceRange, filters.inStockOnly].filter(Boolean).length

  return (
    <div className="min-h-screen">
      <section className="corporate-subtle border-b border-slate-200/70">
        <div className="container-pad py-10">
          <div className="section-tag">
            <span className="eyebrow-dot" />
            Catalog
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="section-title">Medical and laboratory equipment catalog</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                A more modern corporate catalog experience with stronger hierarchy, cleaner controls, and clearer product discovery.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-blue-100 bg-white px-5 py-4 text-sm text-slate-600 shadow-soft">
              {total > 0 ? `${total} products available across core buying categories.` : 'Browse our structured product range.'}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-2xl flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search analyzers, monitors, lab tools, consumables..."
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))}
                className="input pl-11 pr-10"
              />
              {filters.search && (
                <button onClick={() => setFilters((current) => ({ ...current, search: '', page: 1 }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)} className="btn-outline lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="hidden overflow-hidden rounded-full border border-slate-200 bg-white sm:flex">
                <button onClick={() => setViewMode('grid')} className={clsx('p-3 transition', viewMode === 'grid' ? 'bg-primary-700 text-white' : 'text-slate-500 hover:text-primary-700')}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={clsx('p-3 transition', viewMode === 'list' ? 'bg-primary-700 text-white' : 'text-slate-500 hover:text-primary-700')}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-pad py-8">
        <div className="flex gap-8">
          <div className="hidden w-72 flex-shrink-0 lg:block">
            <ProductFilters categories={categories} filters={filters} onChange={handleFiltersChange} />
          </div>

          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-slate-950/40" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 inset-y-0 w-80 overflow-y-auto bg-white p-6 animate-slide-right">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-slate-400 transition hover:text-slate-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ProductFilters categories={categories} filters={filters} onChange={(nextFilters) => { handleFiltersChange(nextFilters); setShowFilters(false) }} />
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError(null)} />}

            {loading ? (
              <div className={clsx('grid gap-5', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
                {Array.from({ length: PER_PAGE }).map((_, index) => <ProductCardSkeleton key={index} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={SlidersHorizontal}
                title="No products found"
                description="Try adjusting your search terms or filter settings to find the right product."
                action={
                  <button
                    onClick={() => setFilters({ search: '', category: null, sort: 'newest', priceRange: null, inStockOnly: null, page: 1 })}
                    className="btn-primary"
                  >
                    Clear All Filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                  <p>
                    Showing {((filters.page - 1) * PER_PAGE) + 1}-{Math.min(filters.page * PER_PAGE, total)} of {total} results
                  </p>
                  <div className="rounded-full bg-white px-4 py-2 shadow-soft">
                    View: <span className="font-semibold text-slate-700">{viewMode === 'grid' ? 'Grid' : 'List'}</span>
                  </div>
                </div>

                <div className={clsx('grid gap-5', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
                  {products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      page={filters.page}
                      totalPages={totalPages}
                      onPageChange={(nextPage) => {
                        setFilters((current) => ({ ...current, page: nextPage }))
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
