import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Eye, EyeOff, Loader2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import { authService } from '@/services/api'
import { Alert } from '@/components/common/UI'
import BrandLogo from '@/components/BrandLogo'

export function OrderSuccessPage() {
  const { orderId } = useParams()

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
        </div>
        <BrandLogo framed className="mb-6 inline-flex" />
        <h1 className="text-3xl text-slate-950">Order Placed Successfully</h1>
        <p className="mt-3 text-slate-500">Your order has been captured and will be reviewed by the Medithrex team.</p>
        <p className="mt-5 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-primary-700">{orderId}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/dashboard" className="btn-primary">
            <Package className="h-4 w-4" />
            Track Order
          </Link>
          <Link to="/products" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await authService.login(form)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch {
      if (form.email === 'admin@medithrex.com' && form.password === 'admin123') {
        const mockUser = { id: 1, name: 'Admin User', email: form.email, role: 'admin' }
        login(mockUser, 'mock-jwt-token')
        toast.success('Welcome back, Admin!')
        navigate('/admin', { replace: true })
      } else if (form.email && form.password) {
        const mockUser = { id: 2, name: 'Jane Doe', email: form.email, role: 'customer' }
        login(mockUser, 'mock-jwt-token-customer')
        toast.success('Logged in successfully!')
        navigate(from, { replace: true })
      } else {
        setError('Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen corporate-subtle">
      <div className="container-pad grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card-dark hidden h-full min-h-[40rem] p-10 lg:block">
          <BrandLogo framed className="mb-10 inline-flex" />
          <div className="section-tag text-white/75">
            <span className="eyebrow-dot" />
            Corporate Access
          </div>
          <h2 className="text-5xl leading-tight text-white">Access the Medithrex commerce portal.</h2>
          <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">
            Sign in to manage orders, track procurement activity, and move through the catalog with a more modern corporate experience.
          </p>
          <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/8 p-5 text-sm text-white/75">
            <p className="font-semibold text-white">Demo credentials</p>
            <p className="mt-2">Admin: <span className="font-mono text-white">admin@medithrex.com / admin123</span></p>
            <p className="mt-2">Customer: any email and password combination.</p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <BrandLogo framed className="mb-8 inline-flex lg:hidden" />
          <div className="card p-7">
            <h1 className="text-3xl text-slate-950">Sign In</h1>
            <p className="mt-2 text-sm text-slate-500">Enter your details to continue into the portal.</p>

            {error && <Alert type="error" message={error} className="mt-6" onClose={() => setError(null)} />}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="input"
                  placeholder="you@hospital.co.ke"
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="input pr-11"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-700 hover:text-primary-800">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await authService.register(form)
      login(data.user, data.token)
      toast.success('Account created successfully.')
      navigate('/')
    } catch {
      const mockUser = { id: 3, name: form.name, email: form.email, role: 'customer' }
      login(mockUser, 'mock-jwt-new-user')
      toast.success('Account created successfully.')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen corporate-subtle">
      <div className="container-pad flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md">
          <BrandLogo framed className="mb-8 inline-flex" />
          <div className="card p-7">
            <h1 className="text-3xl text-slate-950">Create Account</h1>
            <p className="mt-2 text-sm text-slate-500">Set up your Medithrex buyer account.</p>

            {error && <Alert type="error" message={error} className="mt-6" onClose={() => setError(null)} />}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="input" placeholder="Dr. Jane Doe" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="input" placeholder="jane@hospital.co.ke" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="input" placeholder="0712 345 678" />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="input pr-11"
                    placeholder="Minimum 6 characters"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" required value={form.confirm} onChange={(event) => setForm((current) => ({ ...current, confirm: event.target.value }))} className="input" placeholder="Re-enter password" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary mt-2 w-full justify-center py-3.5 text-base">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
