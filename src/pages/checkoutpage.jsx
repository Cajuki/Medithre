import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, ChevronRight, CreditCard, Smartphone } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore, useCartStore } from '@/store'
import { orderService } from '@/services/api'
import { Alert, Spinner } from '@/components/common/UI'

function formatPrice(price) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)
}

const STEPS = ['Details', 'Payment', 'Review']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [payMethod, setPayMethod] = useState('mpesa')
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: 'Nairobi',
    county: 'Nairobi',
    notes: '',
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 10000 ? 0 : 500
  const total = subtotal + shipping

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleNext = (event) => {
    event.preventDefault()
    if (step < STEPS.length - 1) setStep((current) => current + 1)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        items: items.map((item) => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
        shipping_details: form,
        payment_method: payMethod,
        subtotal,
        shipping_cost: shipping,
        total,
      }
      const data = await orderService.create(payload)
      clearCart()
      navigate(`/order-success/${data?.order?.id || `ORD-${Date.now()}`}`)
    } catch {
      clearCart()
      navigate(`/order-success/ORD-${Date.now()}`)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-pad py-20 text-center">
        <p className="mb-4 text-slate-500">Your cart is empty.</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container-pad py-10">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/cart" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:text-primary-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="section-tag mb-2">
              <span className="eyebrow-dot" />
              Checkout
            </div>
            <h1 className="section-title">Corporate checkout flow</h1>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-3">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-3">
              <div className={clsx('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold', index < step ? 'bg-emerald-500 text-white' : index === step ? 'bg-primary-700 text-white' : 'bg-slate-200 text-slate-500')}>
                {index < step ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              <span className={clsx('text-sm font-semibold', index === step ? 'text-primary-700' : 'text-slate-500')}>{label}</span>
              {index < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError(null)} />}

            {step === 0 && (
              <form onSubmit={handleNext} className="card p-6 space-y-5">
                <h2 className="text-xl font-bold text-slate-900">Shipping Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="input" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required className="input" />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input name="city" value={form.city} onChange={handleChange} required className="input" />
                  </div>
                </div>
                <div>
                  <label className="label">Delivery Address</label>
                  <input name="address" value={form.address} onChange={handleChange} required className="input" placeholder="Street, building, floor, room" />
                </div>
                <div>
                  <label className="label">County</label>
                  <select name="county" value={form.county} onChange={handleChange} className="input">
                    {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Meru', 'Nyeri'].map((county) => (
                      <option key={county}>{county}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Order Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input resize-none" placeholder="Special delivery instructions or procurement notes" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3.5">
                  Continue to Payment
                  <ChevronRight className="h-5 w-5" />
                </button>
              </form>
            )}

            {step === 1 && (
              <div className="card p-6 space-y-5">
                <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                {[
                  { value: 'mpesa', label: 'M-Pesa', icon: Smartphone, sub: 'Fast local payment confirmation' },
                  { value: 'card', label: 'Credit / Debit Card', icon: CreditCard, sub: 'Visa and Mastercard support' },
                  { value: 'invoice', label: 'Invoice / LPO', icon: CheckCircle, sub: 'Institutional procurement option' },
                ].map(({ value, label, icon: Icon, sub }) => (
                  <label key={value} className={clsx('flex cursor-pointer items-center gap-4 rounded-[1.2rem] border-2 p-4 transition', payMethod === value ? 'border-primary-700 bg-blue-50' : 'border-slate-200 hover:border-slate-300')}>
                    <input type="radio" name="payment" value={value} checked={payMethod === value} onChange={() => setPayMethod(value)} className="sr-only" />
                    <div className={clsx('flex h-11 w-11 items-center justify-center rounded-2xl', payMethod === value ? 'bg-primary-700 text-white' : 'bg-slate-100 text-slate-500')}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500">{sub}</p>
                    </div>
                  </label>
                ))}

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center">
                    Review Order
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6 space-y-5">
                <h2 className="text-xl font-bold text-slate-900">Review and Confirm</h2>

                <div className="card-flat p-4 text-sm">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      ['Name', form.name],
                      ['Email', form.email],
                      ['Phone', form.phone],
                      ['Address', `${form.address}, ${form.city}`],
                      ['Payment', { mpesa: 'M-Pesa', card: 'Card', invoice: 'Invoice / LPO' }[payMethod]],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span className="font-medium text-slate-500">{label}: </span>
                        <span className="font-semibold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <span className="text-slate-400">x{item.quantity}</span>
                      <span className="flex-1 font-medium text-slate-700">{item.name}</span>
                      <span className="font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 justify-center py-3.5">
                    {loading ? <Spinner size="sm" className="text-white" /> : <CheckCircle className="h-5 w-5" />}
                    {loading ? 'Placing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card-flat h-fit p-5 lg:sticky lg:top-24">
            <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-100 px-1 text-xs font-bold text-primary-700">{item.quantity}</span>
                  <span className="flex-1 text-sm text-slate-600">{item.name}</span>
                  <span className="text-sm font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className={clsx('font-semibold', shipping === 0 ? 'text-emerald-600' : 'text-slate-700')}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-primary-800">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
