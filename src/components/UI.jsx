import clsx from 'clsx'
import { AlertCircle, CheckCircle, Info, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

// ─── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={clsx('skeleton', className)} />
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-3 w-1/3 rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <div className="flex justify-between items-center pt-1">
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

// ─── Alert ────────────────────────────────────────────────────
const ALERT_STYLES = {
  error:   'bg-red-50 border-red-200 text-red-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
}

const ALERT_ICONS = {
  error:   <AlertCircle className="w-5 h-5 text-red-500" />,
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  info:    <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
}

export function Alert({ type = 'info', title, message, onClose }) {
  if (!message) return null
  return (
    <div className={clsx('flex items-start gap-3 p-4 rounded-xl border text-sm', ALERT_STYLES[type])}>
      {ALERT_ICONS[type]}
      <div className="flex-1">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <p>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <Loader2 className={clsx('animate-spin text-primary-600', sizes[size], className)} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-medical-teal flex items-center justify-center animate-pulse-slow">
        <Spinner size="md" className="text-white" />
      </div>
      <p className="text-slate-400 text-sm font-medium">Loading…</p>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────
const BADGE_STYLES = {
  default:  'bg-slate-100 text-slate-600',
  primary:  'bg-primary-100 text-primary-700',
  success:  'bg-emerald-100 text-emerald-700',
  warning:  'bg-amber-100 text-amber-700',
  danger:   'bg-red-100 text-red-600',
  teal:     'bg-teal-100 text-teal-700',
}

export function Badge({ variant = 'default', children, className }) {
  return (
    <span className={clsx('badge', BADGE_STYLES[variant], className)}>
      {children}
    </span>
  )
}

// ─── Pagination ───────────────────────────────────────────────
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const range = 2
  for (let i = Math.max(1, page - range); i <= Math.min(totalPages, page + range); i++) {
    pages.push(i)
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 hover:border-primary-300 hover:text-primary-600 transition-all">1</button>
          {pages[0] > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}

      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
            p === page
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
          )}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 hover:border-primary-300 hover:text-primary-600 transition-all">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}

// ─── Empty State ──────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        {Icon && <Icon className="w-9 h-9 text-primary-300" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      {description && <p className="text-slate-400 text-sm mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}