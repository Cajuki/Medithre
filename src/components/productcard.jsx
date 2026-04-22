import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Eye, CheckCircle } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import { Badge } from '@/components/common/UI'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const PLACEHOLDER_IMAGES = {
  diagnostics:  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  surgical:     'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80',
  lab:          'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80',
  consumables:  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80',
  default:      'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=400&q=80',
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)
}

export default function ProductCard({ product }) {
  const [added,   setAdded]   = useState(false)
  const [imgErr,  setImgErr]  = useState(false)
  const addItem   = useCartStore(s => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  const wishlisted = isWishlisted(product.id)
  const inStock    = product.stock > 0
  const imgSrc     = imgErr
    ? PLACEHOLDER_IMAGES[product.category_slug] || PLACEHOLDER_IMAGES.default
    : product.image_url || PLACEHOLDER_IMAGES[product.category_slug] || PLACEHOLDER_IMAGES.default

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!inStock) return
    addItem(product)
    setAdded(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    const wasAdded = toggle(product)
    toast(wasAdded ? '❤️ Added to wishlist' : 'Removed from wishlist')
  }

  return (
    <Link to={`/products/${product.id}`}
      className="card group block overflow-hidden hover:-translate-y-0.5 transition-transform duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-medical-ice">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <Badge variant="primary" className="text-[10px]">Featured</Badge>
          )}
          {!inStock && (
            <Badge variant="danger" className="text-[10px]">Out of Stock</Badge>
          )}
          {product.discount_pct > 0 && (
            <Badge variant="warning" className="text-[10px]">-{product.discount_pct}%</Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={handleWishlist}
            className={clsx(
              'w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200',
              wishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 hover:text-rose-500'
            )}>
            <Heart className={clsx('w-4 h-4', wishlisted && 'fill-current')} />
          </button>
          <Link to={`/products/${product.id}`}
            className="w-8 h-8 rounded-lg bg-white text-slate-400 hover:text-primary-600 flex items-center justify-center shadow-sm transition-all duration-200"
            onClick={e => e.stopPropagation()}>
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {product.category_name && (
          <p className="text-[11px] font-semibold text-primary-500 uppercase tracking-wider mb-1.5">
            {product.category_name}
          </p>
        )}

        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s}
                  className={clsx('w-3 h-3', s <= Math.round(product.avg_rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200')} />
              ))}
            </div>
            <span className="text-[11px] text-slate-400">({product.review_count || 0})</span>
          </div>
        )}

        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-base font-bold text-primary-900">{formatPrice(product.price)}</p>
            {product.original_price && product.original_price > product.price && (
              <p className="text-xs text-slate-400 line-through">{formatPrice(product.original_price)}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || added}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0',
              added
                ? 'bg-emerald-500 text-white'
                : inStock
                  ? 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            )}
          >
            {added ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Added</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> {inStock ? 'Add' : 'N/A'}</>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}