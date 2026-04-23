import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Eye, Heart, ShoppingCart, Star } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useCartStore, useWishlistStore } from '@/store'
import { Badge } from '@/components/common/UI'

const PLACEHOLDER_IMAGES = {
  diagnostics: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  surgical: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80',
  lab: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80',
  consumables: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=400&q=80',
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  const wishlisted = isWishlisted(product.id)
  const inStock = product.stock > 0
  const imageSource = imgErr
    ? PLACEHOLDER_IMAGES[product.category_slug] || PLACEHOLDER_IMAGES.default
    : product.image_url || PLACEHOLDER_IMAGES[product.category_slug] || PLACEHOLDER_IMAGES.default

  const handleAddToCart = (event) => {
    event.preventDefault()
    if (!inStock) return

    addItem(product)
    setAdded(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = (event) => {
    event.preventDefault()
    const wasAdded = toggle(product)
    toast(wasAdded ? 'Added to wishlist' : 'Removed from wishlist')
  }

  return (
    <Link to={`/products/${product.id}`} className="card group block overflow-hidden">
      <div className="relative aspect-[1/0.92] overflow-hidden bg-[linear-gradient(135deg,#eef7ff_0%,#f8fcff_100%)]">
        <img
          src={imageSource}
          alt={product.name}
          onError={() => setImgErr(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/12 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.is_featured && <Badge variant="primary">Featured</Badge>}
          {product.discount_pct > 0 && <Badge variant="warning">-{product.discount_pct}%</Badge>}
          {!inStock && <Badge variant="danger">Out of stock</Badge>}
        </div>

        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition duration-200 group-hover:opacity-100">
          <button
            onClick={handleWishlist}
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition',
              wishlisted
                ? 'border-rose-500 bg-rose-500 text-white'
                : 'border-white/80 bg-white/90 text-slate-500 hover:text-rose-500'
            )}
          >
            <Heart className={clsx('h-4 w-4', wishlisted && 'fill-current')} />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-500 shadow-sm backdrop-blur transition hover:text-primary-700">
            <Eye className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="p-5">
        {product.category_name && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
            {product.category_name}
          </p>
        )}

        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-7 text-slate-950 transition group-hover:text-primary-700">
          {product.name}
        </h3>

        {product.avg_rating > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={clsx(
                    'h-4 w-4',
                    star <= Math.round(product.avg_rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-500">({product.review_count || 0})</span>
          </div>
        )}

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-slate-950">{formatPrice(product.price)}</p>
            {product.original_price && product.original_price > product.price && (
              <p className="mt-1 text-sm text-slate-400 line-through">{formatPrice(product.original_price)}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || added}
            className={clsx(
              'inline-flex min-w-[7.25rem] items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition',
              added
                ? 'bg-emerald-500 text-white'
                : inStock
                  ? 'bg-slate-950 text-white hover:bg-primary-700'
                  : 'bg-slate-100 text-slate-400'
            )}
          >
            {added ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {inStock ? 'Add' : 'N/A'}
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}
