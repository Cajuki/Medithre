import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import clsx from 'clsx'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
]

const PRICE_RANGES = [
  { label: 'Under KES 5,000', min: 0, max: 5000 },
  { label: 'KES 5,000 - 20,000', min: 5000, max: 20000 },
  { label: 'KES 20,000 - 100,000', min: 20000, max: 100000 },
  { label: 'KES 100,000 - 500,000', min: 100000, max: 500000 },
  { label: 'Above KES 500,000', min: 500000, max: Infinity },
]

export default function ProductFilters({ categories, filters, onChange }) {
  const [expanded, setExpanded] = useState({ categories: true, price: true, stock: true })

  const toggle = (section) => setExpanded((sections) => ({ ...sections, [section]: !sections[section] }))
  const setFilter = (key, value) => onChange({ ...filters, [key]: value, page: 1 })
  const clearAll = () => onChange({ search: filters.search || '', category: null, sort: 'newest', priceRange: null, inStockOnly: null, page: 1 })
  const hasFilters = filters.category || filters.priceRange || filters.inStockOnly

  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary-700" />
          <span className="text-sm font-semibold text-slate-800">Filters</span>
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs font-semibold text-primary-700 transition hover:text-primary-800">
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="card-flat p-4">
        <label className="label">Sort By</label>
        <select value={filters.sort || 'newest'} onChange={(event) => setFilter('sort', event.target.value)} className="input text-sm">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="card-flat overflow-hidden">
        <button onClick={() => toggle('categories')} className="flex w-full items-center justify-between p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
          Categories
          <ChevronDown className={clsx('h-4 w-4 text-slate-400 transition-transform', expanded.categories && 'rotate-180')} />
        </button>
        {expanded.categories && (
          <div className="space-y-1 border-t border-slate-100 px-4 pb-4">
            <button
              onClick={() => setFilter('category', null)}
              className={clsx(
                'mt-3 w-full rounded-xl px-3 py-2 text-left text-sm transition',
                !filters.category ? 'bg-blue-50 font-semibold text-primary-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              All Categories
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter('category', category.slug)}
                className={clsx(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition',
                  filters.category === category.slug
                    ? 'bg-blue-50 font-semibold text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span>{category.name}</span>
                {category.product_count > 0 && <span className="text-xs text-slate-400">{category.product_count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card-flat overflow-hidden">
        <button onClick={() => toggle('price')} className="flex w-full items-center justify-between p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
          Price Range
          <ChevronDown className={clsx('h-4 w-4 text-slate-400 transition-transform', expanded.price && 'rotate-180')} />
        </button>
        {expanded.price && (
          <div className="space-y-1 border-t border-slate-100 px-4 pb-4">
            <button
              onClick={() => setFilter('priceRange', null)}
              className={clsx(
                'mt-3 w-full rounded-xl px-3 py-2 text-left text-sm transition',
                !filters.priceRange ? 'bg-blue-50 font-semibold text-primary-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              Any Price
            </button>
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => setFilter('priceRange', `${range.min}-${range.max}`)}
                className={clsx(
                  'w-full rounded-xl px-3 py-2 text-left text-sm transition',
                  filters.priceRange === `${range.min}-${range.max}`
                    ? 'bg-blue-50 font-semibold text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card-flat overflow-hidden">
        <button onClick={() => toggle('stock')} className="flex w-full items-center justify-between p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
          Availability
          <ChevronDown className={clsx('h-4 w-4 text-slate-400 transition-transform', expanded.stock && 'rotate-180')} />
        </button>
        {expanded.stock && (
          <div className="border-t border-slate-100 px-4 pb-4">
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50">
              <div className={clsx('flex h-5 w-5 items-center justify-center rounded-md border-2 transition', filters.inStockOnly ? 'border-primary-700 bg-primary-700' : 'border-slate-300')}>
                {filters.inStockOnly && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={!!filters.inStockOnly}
                onChange={(event) => setFilter('inStockOnly', event.target.checked || null)}
              />
              <span className="text-sm text-slate-700">In Stock Only</span>
            </label>
          </div>
        )}
      </div>
    </aside>
  )
}
