// ─────────────────────────────────────────
// OrderSuccessPage.jsx
// ─────────────────────────────────────────
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export function OrderSuccessPage() {
  const { orderId } = useParams()
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-medical-clean">
      <div className="text-center max-w-md mx-auto px-6 py-16">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-display text-primary-900 mb-3">Order Placed!</h1>
        <p className="text-slate-500 mb-2">Thank you for your order.</p>
        <p className="text-sm font-mono bg-primary-50 text-primary-700 px-4 py-2 rounded-xl inline-block mb-8">
          {orderId}
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Our team will process your order shortly. You'll receive a confirmation SMS/email.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary">
            <Package className="w-4 h-4" /> Track Order
          </Link>
          <Link to="/products" className="btn-outline">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// LoginPage.jsx
// ─────────────────────────────────────────
import { useState } from 'react'
import { Eye, EyeOff, Microscope, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store'
import { authService } from '@/services/api'
import { Alert } from '@/components/common/UI'
import toast from 'react-hot-toast'

export function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuthStore()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(form)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      // Demo fallback
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
    <div className="min-h-screen bg-medical-clean flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative text-center text-white px-12">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Microscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-display mb-4">Medithrex Portal</h2>
          <p className="text-primary-200 text-lg leading-relaxed">
            Access Kenya's leading medical equipment marketplace. Serving healthcare professionals since 2018.
          </p>
          <div className="mt-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 text-sm">
            <p className="text-primary-200 mb-1">Demo credentials</p>
            <p>Admin: <span className="text-white font-mono">admin@medithrex.com / admin123</span></p>
            <p className="text-primary-300 mt-1">Or any email + password for customer</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-medical-teal rounded-lg flex items-center justify-center">
              <Microscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl text-primary-900">Medithrex</span>
          </Link>

          <h1 className="text-3xl font-display text-primary-900 mb-2">Sign In</h1>
          <p className="text-slate-400 text-sm mb-8">Welcome back! Enter your credentials to continue.</p>

          {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" required autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input"
                placeholder="you@hospital.co.ke"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input pr-11"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// RegisterPage.jsx
// ─────────────────────────────────────────
export function RegisterPage() {
  const navigate  = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError(null)
    try {
      const data = await authService.register(form)
      login(data.user, data.token)
      toast.success('Account created! Welcome to Medithrex.')
      navigate('/')
    } catch {
      // Demo
      const mockUser = { id: 3, name: form.name, email: form.email, role: 'customer' }
      login(mockUser, 'mock-jwt-new-user')
      toast.success('Account created! Welcome to Medithrex.')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-medical-clean flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-medical-teal rounded-lg flex items-center justify-center">
            <Microscope className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl text-primary-900">Medithrex</span>
        </Link>

        <h1 className="text-3xl font-display text-primary-900 mb-2">Create Account</h1>
        <p className="text-slate-400 text-sm mb-8">Join thousands of healthcare professionals.</p>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input" placeholder="Dr. Jane Doe" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input" placeholder="jane@hospital.co.ke" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="input" placeholder="0712 345 678" />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required minLength={6}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input pr-11" placeholder="Min. 6 characters" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" required value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              className="input" placeholder="Re-enter password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base mt-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
