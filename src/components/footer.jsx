import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Microscope, Phone, Twitter } from 'lucide-react'

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
    { label: 'Clinical Partners', to: '/about#partners' },
    { label: 'Procurement Support', to: '/contact' },
    { label: 'Careers', to: '/careers' },
  ],
  Support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Shipping Policy', to: '/shipping' },
    { label: 'Returns', to: '/returns' },
    { label: 'Terms', to: '/terms' },
  ],
}

const SOCIALS = [Facebook, Twitter, Linkedin, Instagram]

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="container-pad py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,0.7fr)]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-700 to-teal-500 text-white">
                <Microscope className="h-5 w-5" />
              </div>
              <div className="leading-none">
                <div className="font-display text-2xl font-bold text-white">Medithrex</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Medical Equipment</div>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              A cleaner, more modern ecommerce experience for sourcing medical devices, laboratory instruments, and healthcare consumables with confidence.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-teal-400" />
                Westlands, Nairobi, Kenya
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-teal-400" />
                +254 700 000 000
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-teal-400" />
                info@medithrex.com
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {SOCIALS.map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:border-teal-400/40 hover:bg-white/10 hover:text-white"
                >
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
