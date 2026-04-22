import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Shield, Truck, HeadphonesIcon, Award,
  Microscope, Activity, Stethoscope, FlaskConical, Syringe,
  ChevronRight, Star, CheckCircle
} from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/common/UI'
import { productService, categoryService } from '@/services/api'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Digital Microscope Pro 2000X', price: 85000, original_price: 95000, stock: 12, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.8, review_count: 34, is_featured: true, discount_pct: 10 },
  { id: 2, name: 'Patient Monitor ECG 12-Lead', price: 145000, stock: 5, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.9, review_count: 21, is_featured: false, discount_pct: 0 },
  { id: 3, name: 'Surgical Instrument Kit – 24pc', price: 32000, original_price: 38000, stock: 20, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.6, review_count: 57, is_featured: true, discount_pct: 16 },
  { id: 4, name: 'Centrifuge Machine 6000 RPM', price: 67500, stock: 8, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.7, review_count: 18, is_featured: false, discount_pct: 0 },
  { id: 5, name: 'Pulse Oximeter Fingertip', price: 4500, stock: 150, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.5, review_count: 89, is_featured: false, discount_pct: 0 },
  { id: 6, name: 'Ultrasound Machine Portable', price: 380000, stock: 3, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 5.0, review_count: 12, is_featured: true, discount_pct: 0 },
  { id: 7, name: 'IV Cannula Set (Box 100)', price: 3200, stock: 500, category_name: 'Consumables', category_slug: 'consumables', avg_rating: 4.4, review_count: 203, is_featured: false, discount_pct: 0 },
  { id: 8, name: 'Autoclave Sterilizer 20L', price: 120000, stock: 6, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.8, review_count: 29, is_featured: false, discount_pct: 0 },
]

const CATEGORIES = [
  { name: 'Diagnostics',   icon: Activity,      slug: 'diagnostics',  desc: 'ECG, Ultrasound, Monitors',   color: 'from-blue-500 to-blue-600',   bg: 'bg-blue-50' },
  { name: 'Surgical',      icon: Syringe,        slug: 'surgical',     desc: 'Instruments & Tools',          color: 'from-rose-500 to-rose-600',   bg: 'bg-rose-50' },
  { name: 'Lab Equipment', icon: FlaskConical,   slug: 'lab',          desc: 'Microscopes, Centrifuges',     color: 'from-violet-500 to-violet-600',bg: 'bg-violet-50' },
  { name: 'Consumables',   icon: Stethoscope,    slug: 'consumables',  desc: 'Gloves, Masks, IV Sets',       color: 'from-teal-500 to-teal-600',   bg: 'bg-teal-50' },
]

const STATS = [
  { value: '2,400+', label: 'Products Available' },
  { value: '180+',   label: 'Partner Hospitals' },
  { value: '99.8%',  label: 'Uptime Guarantee' },
  { value: '24/7',   label: 'Support Available' },
]

const FEATURES = [
  { icon: Shield,         title: 'Certified Quality',  desc: 'All products are ISO & CE certified for medical use.' },
  { icon: Truck,          title: 'Fast Delivery',       desc: 'Express delivery within Nairobi and nationwide shipping.' },
  { icon: HeadphonesIcon, title: 'Expert Support',      desc: 'Dedicated technical support from medical equipment specialists.' },
  { icon: Award,          title: 'Trusted Since 2018',  desc: 'Serving 180+ hospitals and clinics across East Africa.' },
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getFeatured()
        setProducts(data?.products || MOCK_PRODUCTS)
      } catch {
        setProducts(MOCK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-hero-gradient min-h-[92vh] flex items-center overflow-hidden">
        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Blobs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-medical-teal/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="container-pad relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-primary-200 text-sm font-medium mb-6 animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-medical-teal animate-pulse" />
                Kenya's #1 Medical Equipment Platform
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-white leading-[0.95] mb-6 animate-fade-up animate-delay-100">
                Precision<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-medical-mint">
                  Healthcare
                </span><br />
                Equipment
              </h1>

              <p className="text-lg text-primary-200 leading-relaxed mb-8 max-w-lg animate-fade-up animate-delay-200">
                Supplying hospitals, clinics, and research labs with certified medical devices, diagnostic instruments, and lab consumables — delivered across East Africa.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up animate-delay-300">
                <Link to="/products" className="btn-primary text-base px-8 py-4 bg-white text-primary-700 hover:bg-primary-50 shadow-glow">
                  Explore Products <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="btn-secondary text-base px-8 py-4 border-white/30 text-white hover:bg-white/10">
                  Request Quote
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap gap-6 mt-10 animate-fade-up animate-delay-400">
                {['ISO Certified', 'CE Marked', 'Free Returns'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-primary-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-medical-teal" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex justify-center relative animate-float">
              <div className="relative w-[460px] h-[460px]">
                {/* Center circle */}
                <div className="absolute inset-10 rounded-full bg-gradient-to-br from-primary-600/30 to-medical-teal/30 border border-white/20 backdrop-blur-sm" />
                <div className="absolute inset-20 rounded-full bg-gradient-to-br from-primary-500/40 to-medical-teal/40 border border-white/30 flex items-center justify-center">
                  <Microscope className="w-24 h-24 text-white/80" />
                </div>

                {/* Orbit dots */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <div key={i}
                    className="absolute w-3 h-3 rounded-full bg-white/40"
                    style={{
                      top: `${50 - 45 * Math.cos(deg * Math.PI / 180)}%`,
                      left: `${50 + 45 * Math.sin(deg * Math.PI / 180)}%`,
                    }}
                  />
                ))}

                {/* Floating cards */}
                <div className="absolute -top-4 -left-8 glass-dark rounded-2xl px-4 py-3 text-white">
                  <p className="text-xs text-primary-300 font-medium">In Stock</p>
                  <p className="text-lg font-bold">2,400+ Items</p>
                </div>
                <div className="absolute -bottom-4 -right-8 glass-dark rounded-2xl px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                  </div>
                  <p className="text-xs text-primary-300 font-medium mt-0.5">4.9 / 5.0 Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 36.7C1200 33.3 1320 26.7 1380 23.3L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <section className="py-12 bg-primary-600">
        <div className="container-pad">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(stat => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-display text-white">{stat.value}</p>
                <p className="text-primary-200 text-sm mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-pad">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Browse by Type</p>
            <h2 className="section-title">Product Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.slug}
                  to={`/products?category=${cat.slug}`}
                  className="group card p-6 text-center hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-primary-700 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-400">{cat.desc}</p>
                  <div className="mt-4 flex items-center justify-center gap-1 text-xs text-primary-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────── */}
      <section className="py-20 bg-medical-clean">
        <div className="container-pad">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Hand-picked</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="btn-outline hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link to="/products" className="btn-primary">View All Products <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-pad">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Why Medithrex</p>
            <h2 className="section-title">Built for Healthcare Professionals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 group-hover:bg-primary-600 flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────── */}
      <section className="py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="container-pad relative text-center">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-4">
            Ready to Equip Your Facility?
          </h2>
          <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">
            Browse our full catalog or contact our team for a custom quote tailored to your hospital or lab.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 text-base px-8 py-4">
              Browse Catalog <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="text-base px-8 py-4 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-all font-semibold">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}