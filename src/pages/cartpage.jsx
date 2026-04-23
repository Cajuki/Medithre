import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShoppingCart, Tag, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { useCartStore } from '@/store'
import { EmptyState } from '@/components/common/UI'

function formatPrice(price) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)
}

const PLACEHOLDER = {
  lab: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&q=80',
  diagnostics: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&q=80',
  surgical: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=80',
  consumables: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&q=80',
  default: 'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=200&q=80',
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 10000 ? 0 : 500
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh]">
        <div className="container-pad py-10">
          <div className="section-tag">
            <span className="eyebrow-dot" />
            Cart
          </div>
          <h1 className="section-title mb-8">Your procurement cart</h1>
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add products to start building your next order."
            action={
              <Link to="/products" className="btn-primary">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container-pad py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="section-tag">
              <span className="eyebrow-dot" />
              Cart
            </div>
            <h1 className="section-title">Order review and quantity planning</h1>
          </div>
          <button onClick={clearCart} className="text-sm font-semibold text-rose-600 transition hover:text-rose-700">
            Clear Cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="card p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={item.image_url || PLACEHOLDER[item.category_slug] || PLACEHOLDER.default}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(event) => { event.target.src = PLACEHOLDER.default }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">{item.category_name}</p>
                        <Link to={`/products/${item.id}`} className="mt-2 block text-lg font-bold text-slate-900 transition hover:text-primary-700">
                          {item.name}
                        </Link>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="rounded-full p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center overflow-hidden rounded-full border border-slate-200 bg-white">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 text-slate-500 transition hover:bg-slate-50">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[42px] border-x border-slate-200 px-3 py-2 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="px-3 py-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-800">{formatPrice(item.price * item.quantity)}</p>
                        {item.quantity > 1 && <p className="mt-1 text-xs text-slate-400">{formatPrice(item.price)} each</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-800">
              Continue Shopping
            </Link>
          </div>

          <div className="space-y-4">
            <div className="card-flat p-5">
              <label className="label">Promo Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                  <input type="text" placeholder="Enter code" className="input pl-9 text-sm" />
                </div>
                <button className="btn-outline px-4 text-sm">Apply</button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({items.reduce((count, item) => count + item.quantity, 0)} items)</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={clsx('font-semibold', shipping === 0 ? 'text-emerald-600' : 'text-slate-800')}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="rounded-2xl bg-blue-50 px-4 py-3 text-xs font-medium text-primary-700">
                    Add {formatPrice(10000 - subtotal)} more to unlock free shipping.
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-100 pt-4">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-primary-800">{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary mt-6 w-full justify-center py-3.5 text-base">
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
