import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '@/store'
import { EmptyState } from '@/components/common/UI'
import clsx from 'clsx'

function formatPrice(p) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p)
}

const PLACEHOLDER = {
  lab:          'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&q=80',
  diagnostics:  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&q=80',
  surgical:     'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=80',
  consumables:  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&q=80',
  default:      'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=200&q=80',
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping  = subtotal > 10000 ? 0 : 500
  const total     = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="bg-medical-clean min-h-[70vh]">
        <div className="container-pad py-8">
          <h1 className="section-title mb-8">Shopping Cart</h1>
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add medical equipment to your cart to proceed with checkout."
            action={
              <Link to="/products" className="btn-primary">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-medical-clean min-h-screen">
      <div className="container-pad py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">Shopping Cart <span className="text-xl text-slate-400 font-sans font-normal">({items.length} items)</span></h1>
          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors">
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="card p-5 flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-medical-ice flex-shrink-0">
                  <img
                    src={item.image_url || PLACEHOLDER[item.category_slug] || PLACEHOLDER.default}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = PLACEHOLDER.default }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-0.5">
                        {item.category_name}
                      </p>
                      <Link to={`/products/${item.id}`}
                        className="font-semibold text-slate-800 hover:text-primary-700 transition-colors line-clamp-2 text-sm leading-snug">
                        {item.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-50 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-bold text-slate-800 border-x border-slate-200 min-w-[36px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-primary-900 text-base">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-slate-400">{formatPrice(item.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold mt-2 transition-colors">
              ← Continue Shopping
            </Link>
          </div>

          {/* ── Summary ── */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="card p-5">
              <label className="label">Promo Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" placeholder="Enter code" className="input pl-9 text-sm" />
                </div>
                <button className="btn-outline px-4 text-sm">Apply</button>
              </div>
            </div>

            {/* Order summary */}
            <div className="card p-5">
              <h2 className="font-bold text-slate-800 text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className={clsx('font-semibold', shipping === 0 ? 'text-emerald-600' : 'text-slate-800')}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-primary-500 bg-primary-50 rounded-lg px-3 py-2">
                    Add {formatPrice(10000 - subtotal)} more for free shipping!
                  </p>
                )}
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-bold text-xl text-primary-900">{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full justify-center text-base py-3.5">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                <span>🔒 Secure checkout</span>
                <span>·</span>
                <span>M-Pesa & Card</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}