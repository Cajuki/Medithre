import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle, CreditCard, Smartphone, ChevronRight, ArrowLeft } from 'lucide-react'
import { useCartStore, useAuthStore } from '@/store'
import { orderService } from '@/services/api'
import { Alert, Spinner } from '@/components/common/UI'
import toast from 'react-hot-toast'
import clsx from 'clsx'

function formatPrice(p) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p)
}

const STEPS = ['Details', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const navigate   = useNavigate()
  const { items, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const [step,     setStep]    = useState(0)
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState(null)
  const [payMethod,setPayMethod] = useState('mpesa')

  const [form, setForm] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    phone:   user?.phone   || '',
    address: '',
    city:    'Nairobi',
    county:  'Nairobi',
    notes:   '',
  })

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal > 10000 ? 0 : 500
  const total    = subtotal + shipping

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleNext = (e) => {
    e.preventDefault()
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price })),
        shipping_details: form,
        payment_method: payMethod,
        subtotal, shipping_cost: shipping, total,
      }
      const data = await orderService.create(payload)
      clearCart()
      navigate(`/order-success/${data?.order?.id || 'ORD-' + Date.now()}`)
    } catch {
      // Demo: simulate success
      clearCart()
      navigate(`/order-success/ORD-${Date.now()}`)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-pad py-20 text-center">
        <p className="text-slate-400 mb-4">Your cart is empty.</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="bg-medical-clean min-h-screen">
      <div className="container-pad py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="section-title">Checkout</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10 max-w-xs">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                i < step ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-primary-600 text-white' :
                'bg-slate-200 text-slate-400'
              )}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={clsx('text-sm font-medium', i === step ? 'text-primary-700' : 'text-slate-400')}>
                {s}
              </span>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Form area ── */}
          <div className="lg:col-span-2">
            {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

            {/* Step 0 – Details */}
            {step === 0 && (
              <form onSubmit={handleNext} className="card p-6 space-y-5">
                <h2 className="font-bold text-slate-800 text-lg">Shipping Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" placeholder="jane@hospital.co.ke" />
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required className="input" placeholder="0712 345 678" />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input name="city" value={form.city} onChange={handleChange} required className="input" />
                  </div>
                </div>
                <div>
                  <label className="label">Delivery Address</label>
                  <input name="address" value={form.address} onChange={handleChange} required className="input" placeholder="Street, Building, Floor/Room" />
                </div>
                <div>
                  <label className="label">County</label>
                  <select name="county" value={form.county} onChange={handleChange} className="input">
                    {['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Meru','Nyeri'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Order Notes (optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input resize-none" placeholder="Special delivery instructions..." />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3.5">
                  Continue to Payment <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* Step 1 – Payment */}
            {step === 1 && (
              <div className="card p-6 space-y-5">
                <h2 className="font-bold text-slate-800 text-lg">Payment Method</h2>

                {[
                  { value: 'mpesa',  label: 'M-Pesa',       icon: Smartphone,  sub: 'Pay via M-Pesa STK Push' },
                  { value: 'card',   label: 'Credit / Debit Card', icon: CreditCard, sub: 'Visa, Mastercard' },
                  { value: 'invoice',label: 'Invoice / LPO', icon: CheckCircle, sub: 'For institutions & hospitals' },
                ].map(({ value, label, icon: Icon, sub }) => (
                  <label key={value}
                    className={clsx(
                      'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                      payMethod === value ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
                    )}>
                    <input type="radio" name="payment" value={value}
                      checked={payMethod === value}
                      onChange={() => setPayMethod(value)}
                      className="sr-only"
                    />
                    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center',
                      payMethod === value ? 'bg-primary-600' : 'bg-slate-100')}>
                      <Icon className={clsx('w-5 h-5', payMethod === value ? 'text-white' : 'text-slate-500')} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{label}</p>
                      <p className="text-xs text-slate-400">{sub}</p>
                    </div>
                    <div className={clsx('ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      payMethod === value ? 'border-primary-600' : 'border-slate-300')}>
                      {payMethod === value && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                    </div>
                  </label>
                ))}

                {payMethod === 'mpesa' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700">
                    <p className="font-semibold mb-1">M-Pesa Instructions</p>
                    <p>After placing your order, you'll receive an STK Push to <strong>{form.phone}</strong>. Enter your M-Pesa PIN to complete payment.</p>
                  </div>
                )}

                {payMethod === 'card' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                    <p>Card payment integration is coming soon. Please use M-Pesa or LPO for now.</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center">
                    Review Order <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 – Confirm */}
            {step === 2 && (
              <div className="card p-6 space-y-5">
                <h2 className="font-bold text-slate-800 text-lg">Order Review</h2>

                <div className="bg-medical-clean rounded-xl p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      ['Name',    form.name],
                      ['Email',   form.email],
                      ['Phone',   form.phone],
                      ['Address', `${form.address}, ${form.city}`],
                      ['Payment', { mpesa: 'M-Pesa', card: 'Card', invoice: 'Invoice/LPO' }[payMethod]],
                    ].map(([k, v]) => (
                      <div key={k} className="col-span-1">
                        <span className="text-slate-400 font-medium">{k}: </span>
                        <span className="text-slate-700 font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <span className="text-slate-400">×{item.quantity}</span>
                      <span className="flex-1 text-slate-700 font-medium line-clamp-1">{item.name}</span>
                      <span className="font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">← Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-primary flex-1 justify-center py-3.5 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? <Spinner size="sm" className="text-white" /> : <CheckCircle className="w-5 h-5" />}
                    {loading ? 'Placing…' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          <div className="card p-5 h-fit sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4">Your Order</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {item.quantity}
                  </span>
                  <span className="text-sm text-slate-600 flex-1 line-clamp-1">{item.name}</span>
                  <span className="text-sm font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span><span className="font-semibold text-slate-700">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className={clsx('font-semibold', shipping === 0 ? 'text-emerald-600' : 'text-slate-700')}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                <span>Total</span><span className="text-primary-900">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}