// WishlistPage.jsx
import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Trash2 } from 'lucide-react'
import { useWishlistStore, useCartStore } from '@/store'
import { EmptyState } from '@/components/common/UI'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&q=80'

function formatPrice(p) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p)
}

export function WishlistPage() {
  const { items, toggle } = useWishlistStore()
  const addItem = useCartStore(s => s.addItem)

  const handleMoveToCart = (product) => {
    addItem(product)
    toggle(product)
    toast.success('Moved to cart!')
  }

  return (
    <div className="bg-medical-clean min-h-screen">
      <div className="container-pad py-8">
        <h1 className="section-title mb-8">
          My Wishlist <span className="text-xl text-slate-400 font-sans font-normal">({items.length})</span>
        </h1>

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save products you love to come back to them later."
            action={
              <Link to="/products" className="btn-primary">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map(product => (
              <div key={product.id} className="card overflow-hidden group">
                <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-medical-ice">
                  <img
                    src={product.image_url || PLACEHOLDER}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = PLACEHOLDER }}
                  />
                </Link>
                <div className="p-4">
                  <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">{product.category_name}</p>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2 hover:text-primary-700 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="font-bold text-primary-900 mb-3">{formatPrice(product.price)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock < 1}
                      className="flex-1 btn-primary text-xs py-2 justify-center"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => { toggle(product); toast('Removed from wishlist') }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
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

// NotFoundPage.jsx
export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-medical-clean">
      <div className="text-center px-6">
        <p className="text-8xl font-display text-primary-200 mb-4">404</p>
        <h1 className="text-3xl font-display text-primary-900 mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/products" className="btn-outline">Browse Products</Link>
        </div>
      </div>
    </div>
  )
}
