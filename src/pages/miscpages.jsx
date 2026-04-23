import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore, useWishlistStore } from '@/store'
import { EmptyState } from '@/components/common/UI'
import BrandLogo from '@/components/BrandLogo'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&q=80'

function formatPrice(price) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)
}

export function WishlistPage() {
  const { items, toggle } = useWishlistStore()
  const addItem = useCartStore((state) => state.addItem)

  const handleMoveToCart = (product) => {
    addItem(product)
    toggle(product)
    toast.success('Moved to cart')
  }

  return (
    <div className="min-h-screen">
      <div className="container-pad py-10">
        <div className="section-tag">
          <span className="eyebrow-dot" />
          Wishlist
        </div>
        <h1 className="section-title mb-8">Saved products and procurement shortlist</h1>

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save products here so you can revisit them later."
            action={
              <Link to="/products" className="btn-primary">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <div key={product.id} className="card overflow-hidden">
                <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={product.image_url || PLACEHOLDER}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    onError={(event) => { event.target.src = PLACEHOLDER }}
                  />
                </Link>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">{product.category_name}</p>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-800 transition hover:text-primary-700">{product.name}</h3>
                  </Link>
                  <p className="mt-3 font-bold text-primary-800">{formatPrice(product.price)}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleMoveToCart(product)} disabled={product.stock < 1} className="btn-primary flex-1 justify-center py-2 text-xs">
                      Add to Cart
                    </button>
                    <button onClick={() => { toggle(product); toast('Removed from wishlist') }} className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="px-6 text-center">
        <BrandLogo framed className="mb-8 inline-flex" />
        <p className="mb-4 text-8xl font-bold text-slate-200">404</p>
        <h1 className="text-3xl text-slate-950">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">The page you are looking for does not exist or may have been moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/products" className="btn-outline">Browse Products</Link>
        </div>
      </div>
    </div>
  )
}
