import clsx from 'clsx'
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Info, Loader2, X } from 'lucide-react'

export function Skeleton({ className }) {
  return <div className={clsx('skeleton', className)} />
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton className="aspect-[1/0.92] w-full rounded-[1.2rem]" />
      <Skeleton className="h-3 w-1/3 rounded" />
      <Skeleton className="h-5 w-4/5 rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>
  )
}

const ALERT_STYLES = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
}

const ALERT_ICONS = {
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
}

export function Alert({ type = 'info', title, message, onClose, className }) {
  if (!message) return null

  return (
    <div className={clsx('flex items-start gap-3 rounded-2xl border p-4 text-sm', ALERT_STYLES[type], className)}>
      {ALERT_ICONS[type]}
      <div className="flex-1">
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        <p>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 opacity-60 transition hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return <Loader2 className={clsx('animate-spin text-primary-700', sizes[size], className)} />
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-primary-700 text-white shadow-[0_24px_48px_-28px_rgba(11,76,147,0.75)]">
        <Spinner size="md" className="text-white" />
      </div>
      <p className="text-sm font-medium text-slate-500">Loading...</p>
    </div>
  )
}

const BADGE_STYLES = {
  default: 'bg-slate-100 text-slate-600',
  primary: 'bg-blue-100 text-primary-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-600',
  teal: 'bg-emerald-100 text-emerald-700',
}

export function Badge({ variant = 'default', children, className }) {
  return <span className={clsx('badge', BADGE_STYLES[variant], className)}>{children}</span>
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const range = 2

  for (let index = Math.max(1, page - range); index <= Math.min(totalPages, page + range); index += 1) {
    pages.push(index)
  }

  return (
    <nav className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-primary-700">1</button>
          {pages[0] > 2 && <span className="px-1 text-slate-400">...</span>}
        </>
      )}

      {pages.map((current) => (
        <button
          key={current}
          onClick={() => onPageChange(current)}
          className={clsx(
            'rounded-full border px-4 py-2 text-sm font-semibold transition',
            current === page
              ? 'border-primary-700 bg-primary-700 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-primary-700'
          )}
        >
          {current}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-primary-700">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-blue-50">
        {Icon && <Icon className="h-9 w-9 text-primary-300" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="mb-6 max-w-xs text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}
