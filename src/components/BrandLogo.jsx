import clsx from 'clsx'

export default function BrandLogo({ className, imageClassName, compact = false, framed = false }) {
  return (
    <div className={clsx('flex items-center', compact ? 'gap-2.5' : 'gap-3', className)}>
      <div
        className={clsx(
          'flex items-center justify-center overflow-hidden',
          compact ? 'h-10 rounded-xl px-2' : 'h-12 rounded-2xl px-3',
          framed ? 'border border-slate-200 bg-white shadow-sm' : ''
        )}
      >
        <img
          src="/medithrex-logo.png"
          alt="Medithrex"
          className={clsx(compact ? 'h-7 w-auto' : 'h-8 w-auto', imageClassName)}
        />
      </div>
    </div>
  )
}
