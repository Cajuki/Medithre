import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingCart, Heart, Star, CheckCircle, AlertCircle,
  Truck, Shield, ArrowLeft, Minus, Plus, Share2, Package
} from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import { productService } from '@/services/api'
import { PageLoader, Badge, Spinner } from '@/components/common/UI'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const MOCK_PRODUCT = {
  id: 1, name: 'Digital Microscope Pro 2000X', price: 85000, original_price: 95000,
  stock: 12, category_name: 'Lab Equipment', category_slug: 'lab',
  avg_rating: 4.8, review_count: 34, is_featured: true, discount_pct: 10,
  description: `The Digital Microscope Pro 2000X is a professional-grade laboratory microscope designed for clinical diagnostics, research, and educational use. Featuring advanced optics with 2000x magnification and a built-in 16MP digital camera, it delivers crisp, high-resolution imagery for detailed specimen analysis.\n\nIdeal for haematology, microbiology, histopathology, and general laboratory use. Compatible with standard glass slides and fitted with 4 objective lenses (4x, 10x, 40x, 100x oil immersion).`,
  specs: [
    { label: 'Magnification',    value: '40x – 2000x' },
    { label: 'Camera',           value: '16MP Digital' },
    { label: 'Light Source',     value: 'LED (6W, adjustable)' },
    { label: 'Objectives',       value: '4x, 10x, 40x, 100x (oil)' },
    { label: 'Stage',            value: 'Mechanical XY stage, 75×50mm' },
    { label: 'Power',            value: '110-240V AC / 50-60Hz' },
    { label: 'Certification',    value: 'CE, ISO 9001' },
    { label: 'Warranty',         value: '2 Years' },
  ],
  reviews: [
    { id: 1, user: 'Dr. Akinyi M.', rating: 5, comment: 'Excellent optics, very clear at 1000x. Our lab team is very satisfied.', date: '2024-12-10' },
    { id: 2, user: 'Lab Tech, KNH', rating: 5, comment: 'Great value. Fast delivery and packaging was excellent.', date: '2024-11-28' },
    { id: 3, user: 'Prof. Odhiambo', rating: 4, comment: 'Good build quality. Camera connectivity could be improved.', date: '2024-10-15' },
  ],
}

function formatPrice(p) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p)
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product,  setProduct]  = useState(null)
  const [related,  setRelated]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [qty,      setQty]      = useState(1)
  const [tab,      setTab]      = useState('description')
  const [imgIdx,   setImgIdx]   = useState(0)
  const [adding,   setAdding]   = useState(false)

  const addItem    = useCartStore(s => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await productService.getById(id)
        setProduct(data?.product || MOCK_PRODUCT)
        const rel = await productService.getAll({ category: data?.product?.category_slug, limit: 4 })
        setRelated(rel?.products?.filter(p => p.id !== Number(id)) || [])
      } catch {
        setProduct(MOCK_PRODUCT)
      } finally {
        setLoading(false)
      }
    }
    load()
    window.scrollTo({ top: 0 })
  }, [id])

  const handleAddToCart = async () => {
    if (!product || product.stock < 1) return
    setAdding(true)
    await new Promise(r => setTimeout(r, 400))
    addItem(product, qty)
    toast.success(`${product.name} added to cart!`)
    setAdding(false)
  }

  const handleWishlist = () => {
    const added = toggle(product)
    toast(added ? '❤️ Added to wishlist' : 'Removed from wishlist')
  }

  if (loading) return <PageLoader />
  if (!product) return <div className="container-pad py-20 text-center text-slate-400">Product not found.</div>

  const inStock = product.stock > 0
  const images  = product.images?.length ? product.images : [
    `https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80`,
    `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80`,
    `https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80`,
  ]
  const wishlisted = isWishlisted(product.id)

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-medical-clean">
        <div className="container-pad py-3 flex items-center gap-2 text-sm text-slate-400">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="container-pad py-10">
        {/* Back */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* ── Images ── */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-medical-ice border border-slate-100">
              <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              {product.discount_pct > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="warning">-{product.discount_pct}%</Badge>
                </div>
              )}
              <button onClick={handleWishlist}
                className={clsx(
                  'absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all',
                  wishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 hover:text-rose-500'
                )}>
                <Heart className={clsx('w-5 h-5', wishlisted && 'fill-current')} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={clsx(
                      'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                      i === imgIdx ? 'border-primary-500' : 'border-transparent hover:border-slate-300'
                    )}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div>
            {product.category_name && (
              <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{product.category_name}</span>
            )}
            <h1 className="text-3xl font-display text-primary-900 mt-2 mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            {product.avg_rating > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={clsx('w-4 h-4', s <= Math.round(product.avg_rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200')} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">{product.avg_rating}</span>
                <span className="text-sm text-slate-400">({product.review_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-display font-bold text-primary-900">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-slate-400 line-through pb-1">{formatPrice(product.original_price)}</span>
              )}
            </div>

            {/* Stock */}
            <div className={clsx(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6',
              inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            )}>
              {inStock
                ? <><CheckCircle className="w-4 h-4" /> In Stock ({product.stock} units)</>
                : <><AlertCircle className="w-4 h-4" /> Out of Stock</>
              }
            </div>

            {/* Short description */}
            <p className="text-slate-600 leading-relaxed text-sm mb-8">{product.description?.split('\n')[0]}</p>

            {/* Qty + Add */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-3 text-slate-500 hover:bg-slate-50 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 text-sm font-bold text-slate-800 border-x border-slate-200 min-w-[48px] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-3 text-slate-500 hover:bg-slate-50 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock || adding}
                className={clsx(
                  'flex-1 btn-primary justify-center text-base py-3',
                  (!inStock || adding) && 'opacity-60 cursor-not-allowed'
                )}
              >
                {adding ? <Spinner size="sm" className="text-white" /> : <ShoppingCart className="w-5 h-5" />}
                {adding ? 'Adding…' : inStock ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>

            <button onClick={handleWishlist} className="btn-outline w-full justify-center mb-8">
              <Heart className={clsx('w-4 h-4', wishlisted && 'fill-rose-500 text-rose-500')} />
              {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-medical-clean rounded-2xl">
              {[
                { icon: Truck,   label: 'Free Delivery', sub: 'Orders over KES 10k' },
                { icon: Shield,  label: 'Certified',     sub: 'ISO & CE Marked' },
                { icon: Package, label: 'Easy Returns',  sub: '30-day policy' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-[10px] text-slate-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-16">
          <div className="flex border-b border-slate-200 gap-8">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs',       label: 'Specifications' },
              { key: 'reviews',     label: `Reviews (${product.review_count || 0})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={clsx(
                  'pb-3 text-sm font-semibold transition-all border-b-2 -mb-px',
                  tab === t.key
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                )}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {tab === 'description' && (
              <div className="prose prose-slate max-w-3xl">
                {product.description?.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed mb-4">{para}</p>
                ))}
              </div>
            )}

            {tab === 'specs' && (
              <div className="max-w-2xl">
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
                  {(product.specs || MOCK_PRODUCT.specs).map(({ label, value }) => (
                    <div key={label} className="flex py-3.5 px-5 hover:bg-medical-clean transition-colors">
                      <span className="text-sm font-semibold text-slate-500 w-44 flex-shrink-0">{label}</span>
                      <span className="text-sm text-slate-800 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="max-w-2xl space-y-4">
                {(product.reviews || MOCK_PRODUCT.reviews).map(review => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-medical-teal flex items-center justify-center text-white text-sm font-bold">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{review.user}</p>
                          <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={clsx('w-3.5 h-3.5', s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200')} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
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