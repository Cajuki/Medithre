import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  HeadphonesIcon,
  Microscope,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Truck,
} from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/common/UI'
import { productService } from '@/services/api'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Digital Microscope Pro 2000X', price: 85000, original_price: 95000, stock: 12, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.8, review_count: 34, is_featured: true, discount_pct: 10 },
  { id: 2, name: 'Patient Monitor ECG 12-Lead', price: 145000, stock: 5, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.9, review_count: 21, is_featured: false, discount_pct: 0 },
  { id: 3, name: 'Surgical Instrument Kit - 24pc', price: 32000, original_price: 38000, stock: 20, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.6, review_count: 57, is_featured: true, discount_pct: 16 },
  { id: 4, name: 'Centrifuge Machine 6000 RPM', price: 67500, stock: 8, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.7, review_count: 18, is_featured: false, discount_pct: 0 },
  { id: 5, name: 'Pulse Oximeter Fingertip', price: 4500, stock: 150, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.5, review_count: 89, is_featured: false, discount_pct: 0 },
  { id: 6, name: 'Autoclave Sterilizer 20L', price: 120000, stock: 6, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.8, review_count: 29, is_featured: true, discount_pct: 0 },
]

const CATEGORIES = [
  { name: 'Diagnostics', icon: Activity, slug: 'diagnostics', desc: 'Monitors, ECG, imaging, rapid assessment' },
  { name: 'Surgical', icon: Syringe, slug: 'surgical', desc: 'Procedure kits, sterile tools, theatre support' },
  { name: 'Lab Equipment', icon: FlaskConical, slug: 'lab', desc: 'Microscopes, centrifuges, analyzers, prep tools' },
  { name: 'Consumables', icon: Stethoscope, slug: 'consumables', desc: 'Daily-use clinical and laboratory supplies' },
]

const STATS = [
  { value: '2,400+', label: 'SKUs Ready for Procurement' },
  { value: '180+', label: 'Hospitals and Labs Served' },
  { value: '48hr', label: 'Fast-Track Quote Turnaround' },
  { value: '24/7', label: 'Technical Support Access' },
]

const FEATURES = [
  { icon: ShieldCheck, title: 'Certified Sourcing', desc: 'Procurement-ready equipment with traceable quality and compliant documentation.' },
  { icon: Truck, title: 'Reliable Fulfilment', desc: 'Fast dispatch for fast-moving essentials and coordinated delivery for major installs.' },
  { icon: HeadphonesIcon, title: 'Clinical Guidance', desc: 'Talk to specialists who understand wards, theatres, diagnostic units, and labs.' },
  { icon: Award, title: 'Built for Institutions', desc: 'A storefront designed for clinics, hospitals, research centers, and distributors.' },
]

const TRUST_POINTS = ['ISO-focused sourcing', 'Warranty-backed equipment', 'Bulk order support']

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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
      <section className="hero-shell min-h-[92vh]">
        <div className="hero-grid absolute inset-0 opacity-50" />
        <div className="mesh-orb left-[-6rem] top-[8rem] h-56 w-56 bg-emerald-300/40" />
        <div className="mesh-orb right-[-4rem] top-[5rem] h-72 w-72 bg-sky-300/45" />

        <div className="container-pad relative z-10 py-16 md:py-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="animate-fade-up section-tag">
                <span className="eyebrow-dot" />
                Modern Medical Commerce
              </div>

              <h1 className="animate-fade-up animate-delay-100 text-balance text-5xl leading-[0.92] text-slate-950 md:text-6xl xl:text-7xl">
                Precision equipment for
                <span className="block text-primary-700">hospitals, clinics, and labs.</span>
              </h1>

              <p className="animate-fade-up animate-delay-200 mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Medithrex now feels like a premium procurement platform: clean, trustworthy, and built to help buyers move quickly from discovery to quote or checkout.
              </p>

              <div className="animate-fade-up animate-delay-300 mt-8 flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary px-7 py-4 text-base">
                  Shop Equipment
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/products?sort=popular" className="btn-secondary px-7 py-4 text-base">
                  Browse Best Sellers
                </Link>
              </div>

              <div className="animate-fade-up animate-delay-400 mt-10 flex flex-wrap gap-3">
                {TRUST_POINTS.map((point) => (
                  <div key={point} className="pill">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {point}
                  </div>
                ))}
              </div>

              <div className="animate-fade-up animate-delay-500 mt-12 grid gap-4 sm:grid-cols-3">
                {[
                  { value: '4.9/5', label: 'Buyer satisfaction' },
                  { value: 'KES 10k+', label: 'Free delivery threshold' },
                  { value: '2018', label: 'Supplying since' },
                ].map((item) => (
                  <div key={item.label} className="glass-panel px-5 py-4">
                    <div className="text-2xl font-bold text-slate-950">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="card-raised relative overflow-hidden p-7 md:p-8">
                <div className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div className="relative h-[28rem]">
                  <div className="clinical-ring inset-4" />
                  <div className="clinical-ring inset-12" />
                  <div className="clinical-ring inset-24" />

                  <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl">
                    <Microscope className="h-16 w-16 text-white" />
                  </div>

                  <div className="absolute left-0 top-5 max-w-[13rem] rounded-3xl bg-white/12 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.2em] text-sky-100">Procurement</div>
                    <div className="mt-2 text-2xl font-bold">2,400+</div>
                    <p className="mt-1 text-sm text-sky-100/80">Devices, instruments, consumables, and clinical essentials.</p>
                  </div>

                  <div className="absolute bottom-8 right-0 max-w-[14rem] rounded-3xl bg-white/12 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.2em] text-emerald-100">Trusted Stock</div>
                    <div className="mt-2 text-2xl font-bold">Ready to ship</div>
                    <p className="mt-1 text-sm text-white/75">Fast-moving SKUs curated for daily facility operations.</p>
                  </div>

                  <div className="absolute bottom-28 left-8 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.2em] text-sky-100">Support</div>
                    <div className="mt-1 text-lg font-semibold">Clinical sales team</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 pb-6">
        <div className="container-pad">
          <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-[0_22px_60px_-34px_rgba(15,76,129,0.35)] backdrop-blur md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50/80 px-5 py-5">
                <div className="text-3xl font-bold text-slate-950">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-pad">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <div className="section-tag">
                <span className="eyebrow-dot" />
                Structured Catalog
              </div>
              <h2 className="section-title">Shop by clinical department</h2>
            </div>
            <p className="hidden max-w-md text-sm leading-6 text-slate-500 md:block">
              Built to feel organized and procurement-friendly so buyers can jump straight into the relevant equipment category.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {CATEGORIES.map(({ name, icon: Icon, slug, desc }) => (
              <Link key={slug} to={`/products?category=${slug}`} className="card group p-6">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-100 text-primary-700">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                  Explore category
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-pad">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="section-tag">
                <span className="eyebrow-dot" />
                Featured Range
              </div>
              <h2 className="section-title">Premium products with a cleaner buying experience</h2>
            </div>
            <Link to="/products" className="btn-outline">
              View full catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : products.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-pad">
          <div className="mb-10 text-center">
            <div className="section-tag justify-center">
              <span className="eyebrow-dot" />
              Why Medithrex
            </div>
            <h2 className="section-title">A more confident storefront for serious healthcare buyers</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-pad">
          <div className="card-raised px-8 py-10 md:px-12 md:py-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="section-tag text-white/80">
                  <span className="eyebrow-dot" />
                  Ready to Equip Your Facility
                </div>
                <h2 className="max-w-2xl text-4xl leading-tight text-white md:text-5xl">
                  Modernize the buying experience for every ward, lab bench, and diagnostic room.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
                  The storefront now feels cleaner, more premium, and better suited for medical and laboratory equipment ecommerce.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-secondary bg-white px-6 py-3 text-base">
                  Browse products
                </Link>
                <Link to="/cart" className="btn-ghost border border-white/20 px-6 py-3 text-base text-white">
                  View cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
