import { Link } from 'react-router-dom'
import { Microscope, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

const LINKS = {
  Products:  [
    { label: 'Diagnostics',       to: '/products?category=diagnostics' },
    { label: 'Surgical Tools',    to: '/products?category=surgical' },
    { label: 'Lab Equipment',     to: '/products?category=lab' },
    { label: 'Consumables',       to: '/products?category=consumables' },
    { label: 'All Products',      to: '/products' },
  ],
  Company: [
    { label: 'About Medithrex',   to: '/about' },
    { label: 'Our Team',          to: '/about#team' },
    { label: 'Careers',           to: '/careers' },
    { label: 'Blog',              to: '/blog' },
  ],
  Support: [
    { label: 'Help Center',       to: '/help' },
    { label: 'Contact Us',        to: '/contact' },
    { label: 'Returns & Refunds', to: '/returns' },
    { label: 'Shipping Policy',   to: '/shipping' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-slate-400">
      {/* Main */}
      <div className="container-pad py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-medical-teal rounded-xl flex items-center justify-center">
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-display text-xl text-white">Medithrex</span>
                <span className="block text-[9px] font-mono text-medical-teal tracking-widest uppercase">Medical Equipment</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Kenya's trusted supplier of premium medical devices, laboratory instruments, and healthcare consumables. Serving hospitals, clinics, and research institutions since 2018.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-medical-teal flex-shrink-0" />
                <span>Westlands, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-medical-teal flex-shrink-0" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-medical-teal flex-shrink-0" />
                <span>info@medithrex.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.to}>
                    <Link to={link.to}
                      className="text-sm hover:text-primary-300 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-white/10">
        <div className="container-pad py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold">Stay Updated</h4>
              <p className="text-sm mt-0.5">Get the latest products and health industry news.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm outline-none focus:border-primary-400 transition-colors font-sans"
              />
              <button type="submit" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-pad py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© {new Date().getFullYear()} Medithrex Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="flex gap-4 text-xs">
            <Link to="/privacy" className="hover:text-primary-300 transition-colors">Privacy</Link>
            <Link to="/terms"   className="hover:text-primary-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}