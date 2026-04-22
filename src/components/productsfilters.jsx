import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc','label': 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
  { value: 'popular',   label: 'Most Popular' },
]

const PRICE_RANGES = [
  { label: 'Under KES 5,000',           min: 0,     max: 5000 },
  { label: 'KES 5,000 – 20,000',        min: 5000,  max: 20000 },
  { label: 'KES 20,000 – 100,000',      min: 20000, max: 100000 },
  { label: 'KES 100,000 – 500,000',     min: 100000,max: 500000 },
  { label: 'Above KES 500,000',         min: 500000,max: Infinity },
]

export default function ProductFilters({ categories, filters, onChange }) {
  const [expanded, setExpanded] = useState({ categories: true, price: true, stock: true })

  const toggle = (section) => setExpanded(e => ({ ...e, [section]: !e[section] }))

  const setFilter = (key, value) => onChange({ ...filters, [key]: value, page: 1 })

  const clearAll = () => onChange({ sort: 'newest', page: 1 })

  const hasFilters = filters.category || filters.priceRange || filters.inStockOnly

  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary-600" />
          <span className="font-semibold text-slate-800 text-sm">Filters</span>
        </div>
        {hasFilters && (
          <button onClick={clearAll}
            className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="card p-4">
        <label className="label">Sort By</label>
        <select
          value={filters.sort || 'newest'}
          onChange={e => setFilter('sort', e.target.value)}
          className="input text-sm"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="card overflow-hidden">
        <button
          onClick={() => toggle('categories')}
          className="w-full flex items-center justify-between p-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          Categories
          <ChevronDown className={clsx('w-4 h-4 text-slate-400 transition-transform', expanded.categories && 'rotate-180')} />
        </button>
        {expanded.categories && (
          <div className="px-4 pb-4 space-y-1 border-t border-slate-50">
            <button
              onClick={() => setFilter('category', null)}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                !filters.category ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              All Categories
            </button>
            {categories?.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter('category', cat.slug)}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                  filters.category === cat.slug
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span>{cat.name}</span>
                {cat.product_count > 0 && (
                  <span className="text-xs text-slate-400 font-medium">{cat.product_count}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="card overflow-hidden">
        <button
          onClick={() => toggle('price')}
          className="w-full flex items-center justify-between p-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          Price Range
          <ChevronDown className={clsx('w-4 h-4 text-slate-400 transition-transform', expanded.price && 'rotate-180')} />
        </button>
        {expanded.price && (
          <div className="px-4 pb-4 space-y-1 border-t border-slate-50">
            <button
              onClick={() => setFilter('priceRange', null)}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                !filters.priceRange ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              Any Price
            </button>
            {PRICE_RANGES.map((range, i) => (
              <button
                key={i}
                onClick={() => setFilter('priceRange', `${range.min}-${range.max}`)}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  filters.priceRange === `${range.min}-${range.max}`
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stock */}
      <div className="card overflow-hidden">
        <button
          onClick={() => toggle('stock')}
          className="w-full flex items-center justify-between p-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          Availability
          <ChevronDown className={clsx('w-4 h-4 text-slate-400 transition-transform', expanded.stock && 'rotate-180')} />
        </button>
        {expanded.stock && (
          <div className="px-4 pb-4 border-t border-slate-50">
            <label className="flex items-center gap-3 py-2 cursor-pointer group">
              <div className={clsx(
                'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                filters.inStockOnly ? 'bg-primary-600 border-primary-600' : 'border-slate-300 group-hover:border-primary-400'
              )}>
                {filters.inStockOnly && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input type="checkbox" className="sr-only"
                checked={!!filters.inStockOnly}
                onChange={e => setFilter('inStockOnly', e.target.checked || null)}
              />
              <span className="text-sm text-slate-700">In Stock Only</span>
            </label>
          </div>
        )}
      </div>
    </aside>
  )
}