import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'

const LINKS = {
  Products: [
    { label: 'Diagnostics', to: '/products?category=diagnostics' },
    { label: 'Surgical Tools', to: '/products?category=surgical' },
    { label: 'Lab Equipment', to: '/products?category=lab' },
    { label: 'Consumables', to: '/products?category=consumables' },
    { label: 'All Products', to: '/products' },
  ],
  Company: [
    { label: 'About Medithrex', to: '/about' },
    { label: 'Industry Partners', to: '/about#partners' },
    { label: 'Request a Quote', to: '/contact' },
    { label: 'Careers', to: '/careers' },
  ],
  Support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Returns', to: '/returns' },
    { label: 'Shipping', to: '/shipping' },
    { label: 'Terms', to: '/terms' },
  ],
}

const SOCIALS = [Facebook, Twitter, Linkedin, Instagram]

export default function Footer() {
  return (
    <footer className="mt-12 bg-slate-950 text-slate-300">
      <div className="container-pad py-16">
        <div className="mb-10 grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <div className="section-tag text-white/75">
              <span className="eyebrow-dot" />
              Corporate Procurement
            </div>
            <h2 className="max-w-2xl text-3xl text-white md:text-4xl">
              Built for hospitals, laboratories, procurement teams, and distributors.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to="/products" className="btn-secondary px-6 py-3 text-sm">Browse Catalog</Link>
            <Link to="/contact" className="btn-ghost border border-white/15 px-6 py-3 text-sm text-white">Contact Sales</Link>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,0.7fr)]">
          <div>
            <BrandLogo framed className="inline-flex" imageClassName="h-9" />
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Medithrex is presented with a more modern corporate identity, giving the catalog a cleaner and more procurement-ready experience for medical and laboratory equipment buyers.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Westlands, Nairobi, Kenya
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                +254 700 000 000
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                info@medithrex.com
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {SOCIALS.map((Icon, index) => (
                <a key={index} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/25 hover:bg-white/10 hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">{title}</h3>
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <Link key={item.to} to={item.to} className="block text-sm text-slate-400 transition hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-pad flex flex-col items-start justify-between gap-4 py-5 text-sm text-slate-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Medithrex Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition hover:text-white">Terms</Link>
            <Link to="/shipping" className="transition hover:text-white">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
