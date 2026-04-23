import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, Award, Building2, CheckCircle2, ChevronRight, ClipboardCheck, FlaskConical, ShieldCheck, Stethoscope, Syringe, Truck } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/common/UI'
import { productService } from '@/services/api'
import BrandLogo from '@/components/BrandLogo'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Digital Microscope Pro 2000X', price: 85000, original_price: 95000, stock: 12, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.8, review_count: 34, is_featured: true, discount_pct: 10 },
  { id: 2, name: 'Patient Monitor ECG 12-Lead', price: 145000, stock: 5, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.9, review_count: 21, discount_pct: 0 },
  { id: 3, name: 'Surgical Instrument Kit - 24pc', price: 32000, original_price: 38000, stock: 20, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.6, review_count: 57, is_featured: true, discount_pct: 16 },
  { id: 4, name: 'Centrifuge Machine 6000 RPM', price: 67500, stock: 8, category_name: 'Lab Equipment', category_slug: 'lab', avg_rating: 4.7, review_count: 18, discount_pct: 0 },
  { id: 5, name: 'Pulse Oximeter Fingertip', price: 4500, stock: 150, category_name: 'Diagnostics', category_slug: 'diagnostics', avg_rating: 4.5, review_count: 89, discount_pct: 0 },
  { id: 6, name: 'Autoclave Sterilizer 20L', price: 120000, stock: 6, category_name: 'Surgical', category_slug: 'surgical', avg_rating: 4.8, review_count: 29, discount_pct: 0 },
]

const CATEGORIES = [
  { name: 'Diagnostics', icon: Activity, slug: 'diagnostics', desc: 'ECG monitors, vital signs, imaging, patient assessment.' },
  { name: 'Surgical', icon: Syringe, slug: 'surgical', desc: 'Sterile procedure kits, theatre tools, intervention support.' },
  { name: 'Lab Equipment', icon: FlaskConical, slug: 'lab', desc: 'Analyzers, microscopes, centrifuges, sample preparation.' },
  { name: 'Consumables', icon: Stethoscope, slug: 'consumables', desc: 'High-turnover clinical and laboratory supplies.' },
]

const STATS = [
  { value: '2,400+', label: 'Products ready for sourcing' },
  { value: '180+', label: 'Facilities served across the region' },
  { value: '48hr', label: 'Typical quote turnaround' },
  { value: '24/7', label: 'Specialist sales support' },
]

const SERVICES = [
  { icon: ShieldCheck, title: 'Verified sourcing', desc: 'Corporate-grade presentation that communicates trust and compliance.' },
  { icon: Truck, title: 'Reliable fulfilment', desc: 'Structured delivery messaging for institutions and high-value orders.' },
  { icon: ClipboardCheck, title: 'Procurement friendly', desc: 'Designed to help teams move from browsing to quote or purchase faster.' },
  { icon: Award, title: 'Professional brand presence', desc: 'The new identity feels cleaner, sharper, and more mature.' },
]

const TRUST_ITEMS = ['Institution-ready ordering', 'Warranty-backed equipment', 'Dedicated sales guidance']

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
        <div className="hero-glow left-[-5rem] top-[6rem] h-56 w-56 bg-emerald-300/40" />
        <div className="hero-glow right-[-6rem] top-[4rem] h-72 w-72 bg-blue-300/45" />

        <div className="container-pad relative z-10 py-16 md:py-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="section-tag animate-fade-up">
                <span className="eyebrow-dot" />
                Corporate Medical Commerce
              </div>

              <BrandLogo framed className="animate-fade-up animate-delay-100 mb-6 inline-flex" imageClassName="h-10" />

              <h1 className="animate-fade-up animate-delay-200 text-balance text-5xl leading-[0.94] text-slate-950 md:text-6xl xl:text-7xl">
                Modern procurement for
                <span className="block text-primary-700">medical and laboratory equipment.</span>
              </h1>

              <p className="animate-fade-up animate-delay-300 mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                The storefront now carries a stronger corporate tone, giving Medithrex a cleaner, more credible experience for hospitals, clinics, labs, and institutional buyers.
              </p>

              <div className="animate-fade-up animate-delay-400 mt-8 flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary px-7 py-4 text-base">
                  Explore Catalog
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/contact" className="btn-secondary px-7 py-4 text-base">
                  Request Quote
                </Link>
              </div>

              <div className="animate-fade-up mt-10 flex flex-wrap gap-3">
                {TRUST_ITEMS.map((item) => (
                  <div key={item} className="pill">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-up animate-delay-300">
              <div className="card-dark p-8">
                <div className="grid gap-5">
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-6">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/70">Procurement Snapshot</div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {[
                        { icon: Building2, title: 'Hospitals', value: 'Public and private buyers' },
                        { icon: FlaskConical, title: 'Laboratories', value: 'Equipment and consumables' },
                        { icon: ShieldCheck, title: 'Compliance', value: 'Structured trust messaging' },
                        { icon: Truck, title: 'Logistics', value: 'Fast-moving stock support' },
                      ].map(({ icon: Icon, title, value }) => (
                        <div key={title} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                          <Icon className="h-5 w-5 text-emerald-300" />
                          <div className="mt-3 text-lg font-bold">{title}</div>
                          <div className="mt-1 text-sm text-white/70">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { value: '4.9/5', label: 'Client confidence' },
                      { value: 'KES 10k+', label: 'Free shipping threshold' },
                      { value: '2018', label: 'Supplying since' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/8 px-5 py-5">
                        <div className="text-2xl font-bold text-white">{item.value}</div>
                        <div className="mt-1 text-sm text-white/70">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-10">
        <div className="container-pad">
          <div className="grid gap-4 rounded-[2rem] border border-white/80 bg-white/88 p-6 shadow-[0_22px_60px_-34px_rgba(11,76,147,0.32)] backdrop-blur md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50/90 px-5 py-5">
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
                Product Structure
              </div>
              <h2 className="section-title">Clear pathways into every buying category</h2>
            </div>
            <p className="hidden max-w-md text-sm leading-6 text-slate-500 md:block">
              The new look leans into a more organized and boardroom-ready presentation without losing the healthcare context.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {CATEGORIES.map(({ name, icon: Icon, slug, desc }) => (
              <Link key={slug} to={`/products?category=${slug}`} className="card p-6 group">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary-700">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                  Browse category
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="corporate-subtle py-20">
        <div className="container-pad">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="section-tag">
                <span className="eyebrow-dot" />
                Featured Solutions
              </div>
              <h2 className="section-title">High-trust product presentation across the storefront</h2>
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
              Why This Direction Works
            </div>
            <h2 className="section-title">Sharper, cleaner, and more professional across the full buyer journey</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
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
    </div>
  )
}
