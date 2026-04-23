import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, CheckCircle, Heart, Minus, Package, Plus, Shield, ShoppingCart, Star, Truck } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useCartStore, useWishlistStore } from '@/store'
import { productService } from '@/services/api'
import { Badge, PageLoader, Spinner } from '@/components/common/UI'

const MOCK_PRODUCT = {
  id: 1,
  name: 'Digital Microscope Pro 2000X',
  price: 85000,
  original_price: 95000,
  stock: 12,
  category_name: 'Lab Equipment',
  category_slug: 'lab',
  avg_rating: 4.8,
  review_count: 34,
  is_featured: true,
  discount_pct: 10,
  description: `The Digital Microscope Pro 2000X is a professional-grade laboratory microscope designed for clinical diagnostics, research, and educational use. Featuring advanced optics with 2000x magnification and a built-in 16MP digital camera, it delivers crisp, high-resolution imagery for detailed specimen analysis.\n\nIdeal for haematology, microbiology, histopathology, and general laboratory use. Compatible with standard glass slides and fitted with 4 objective lenses (4x, 10x, 40x, 100x oil immersion).`,
  specs: [
    { label: 'Magnification', value: '40x - 2000x' },
    { label: 'Camera', value: '16MP Digital' },
    { label: 'Light Source', value: 'LED (6W, adjustable)' },
    { label: 'Objectives', value: '4x, 10x, 40x, 100x (oil)' },
    { label: 'Stage', value: 'Mechanical XY stage, 75x50mm' },
    { label: 'Power', value: '110-240V AC / 50-60Hz' },
    { label: 'Certification', value: 'CE, ISO 9001' },
    { label: 'Warranty', value: '2 Years' },
  ],
  reviews: [
    { id: 1, user: 'Dr. Akinyi M.', rating: 5, comment: 'Excellent optics, very clear at 1000x. Our lab team is very satisfied.', date: '2024-12-10' },
    { id: 2, user: 'Lab Tech, KNH', rating: 5, comment: 'Great value. Fast delivery and packaging was excellent.', date: '2024-11-28' },
    { id: 3, user: 'Prof. Odhiambo', rating: 4, comment: 'Good build quality. Camera connectivity could be improved.', date: '2024-10-15' },
  ],
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const [imgIdx, setImgIdx] = useState(0)
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await productService.getById(id)
        setProduct(data?.product || MOCK_PRODUCT)
      } catch {
        setProduct(MOCK_PRODUCT)
      } finally {
        setLoading(false)
      }
    }

    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const handleAddToCart = async () => {
    if (!product || product.stock < 1) return
    setAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 350))
    addItem(product, qty)
    toast.success(`${product.name} added to cart`)
    setAdding(false)
  }

  const handleWishlist = () => {
    const added = toggle(product)
    toast(added ? 'Added to wishlist' : 'Removed from wishlist')
  }

  if (loading) return <PageLoader />
  if (!product) return <div className="container-pad py-20 text-center text-slate-500">Product not found.</div>

  const inStock = product.stock > 0
  const images = product.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1000&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1000&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1000&q=80',
  ]
  const wishlisted = isWishlisted(product.id)

  return (
    <div className="min-h-screen">
      <section className="corporate-subtle border-b border-slate-200/70">
        <div className="container-pad py-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Link to="/" className="transition hover:text-primary-700">Home</Link>
            <span>/</span>
            <Link to="/products" className="transition hover:text-primary-700">Products</Link>
            <span>/</span>
            <span className="truncate font-medium text-slate-700">{product.name}</span>
          </div>
        </div>
      </section>

      <div className="container-pad py-10">
        <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] xl:gap-16">
          <div className="space-y-4">
            <div className="card overflow-hidden p-4">
              <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-[linear-gradient(135deg,#edf5fb_0%,#f9fbfd_100%)]">
                <img src={images[imgIdx]} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {product.discount_pct > 0 && <Badge variant="warning">-{product.discount_pct}%</Badge>}
                  {product.is_featured && <Badge variant="primary">Featured</Badge>}
                </div>
                <button
                  onClick={handleWishlist}
                  className={clsx(
                    'absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition',
                    wishlisted ? 'border-rose-500 bg-rose-500 text-white' : 'border-white/80 bg-white/90 text-slate-500 hover:text-rose-500'
                  )}
                >
                  <Heart className={clsx('h-5 w-5', wishlisted && 'fill-current')} />
                </button>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setImgIdx(index)}
                    className={clsx(
                      'overflow-hidden rounded-2xl border-2 bg-white p-1 transition',
                      index === imgIdx ? 'border-primary-700' : 'border-transparent hover:border-slate-300'
                    )}
                  >
                    <img src={image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.category_name && (
              <div className="section-tag mb-3">
                <span className="eyebrow-dot" />
                {product.category_name}
              </div>
            )}

            <h1 className="text-4xl leading-tight text-slate-950 md:text-5xl">{product.name}</h1>

            {product.avg_rating > 0 && (
              <div className="mt-5 flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={clsx('h-4 w-4', star <= Math.round(product.avg_rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">{product.avg_rating}</span>
                <span className="text-sm text-slate-500">({product.review_count} reviews)</span>
              </div>
            )}

            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-bold text-primary-800">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="pb-1 text-lg text-slate-400 line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>

            <div className={clsx('mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold', inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
              {inStock ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {inStock ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </div>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">{product.description?.split('\n')[0]}</p>

            <div className="mt-8 card-flat p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center overflow-hidden rounded-full border border-slate-200 bg-white">
                  <button onClick={() => setQty((current) => Math.max(1, current - 1))} className="px-4 py-3 text-slate-500 transition hover:bg-slate-50">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[54px] border-x border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800">{qty}</span>
                  <button onClick={() => setQty((current) => Math.min(product.stock, current + 1))} className="px-4 py-3 text-slate-500 transition hover:bg-slate-50">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button onClick={handleAddToCart} disabled={!inStock || adding} className="btn-primary flex-1 py-3.5 text-base">
                  {adding ? <Spinner size="sm" className="text-white" /> : <ShoppingCart className="h-5 w-5" />}
                  {adding ? 'Adding...' : inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>

              <button onClick={handleWishlist} className="btn-outline mt-4 w-full justify-center">
                <Heart className={clsx('h-4 w-4', wishlisted && 'fill-rose-500 text-rose-500')} />
                {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, label: 'Delivery', sub: 'Nationwide logistics support' },
                { icon: Shield, label: 'Compliance', sub: 'Quality-backed sourcing' },
                { icon: Package, label: 'Support', sub: 'Sales and aftercare guidance' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="card-flat p-4 text-center">
                  <Icon className="mx-auto h-5 w-5 text-primary-700" />
                  <p className="mt-2 text-sm font-semibold text-slate-800">{label}</p>
                  <p className="mt-1 text-xs text-slate-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-4">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specifications' },
              { key: 'reviews', label: `Reviews (${product.review_count || 0})` },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={clsx(
                  'rounded-full px-5 py-2.5 text-sm font-semibold transition',
                  tab === item.key ? 'bg-primary-700 text-white' : 'bg-white text-slate-600 shadow-soft hover:text-primary-700'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-8">
            {tab === 'description' && (
              <div className="card-flat max-w-4xl p-6">
                {product.description?.split('\n').filter(Boolean).map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-8 text-slate-600 last:mb-0">{paragraph}</p>
                ))}
              </div>
            )}

            {tab === 'specs' && (
              <div className="card-flat max-w-3xl overflow-hidden">
                {(product.specs || MOCK_PRODUCT.specs).map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:flex-row">
                    <span className="w-44 flex-shrink-0 text-sm font-semibold text-slate-500">{label}</span>
                    <span className="text-sm font-medium text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'reviews' && (
              <div className="max-w-3xl space-y-4">
                {(product.reviews || MOCK_PRODUCT.reviews).map((review) => (
                  <div key={review.id} className="card-flat p-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{review.user}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(review.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={clsx('h-3.5 w-3.5', star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
