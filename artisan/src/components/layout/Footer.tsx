// artisan/src/components/layout/Footer.tsx
import Link from 'next/link';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Featured', href: '/products?featured=true' },
    { label: 'New Arrivals', href: '/products?sort=-createdAt' },
    { label: 'Best Sellers', href: '/products?sort=-sales.count' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Contact Us', href: '/contact' },
  ],
  sellOnKalaKriti: [
    { label: 'Become a Seller', href: '/register' },
    { label: 'Seller Dashboard', href: '/seller/dashboard' },
    { label: 'Seller Guide', href: '/seller-guide' },
    { label: 'Success Stories', href: '/stories' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refunds' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: '#', icon: 'X' },
  { name: 'Instagram', href: '#', icon: 'IG' },
  { name: 'Facebook', href: '#', icon: 'FB' },
  { name: 'Pinterest', href: '#', icon: 'PT' },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1" style={{ background: 'var(--gradient-primary)' }} />

      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #daa520 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>K</span>
              </div>
              <span className="font-bold text-2xl text-white" style={{ fontFamily: 'var(--font-display)' }}>KalaKriti</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Discover unique handcrafted products from talented artisans. Every purchase supports independent creators and sustainable craftsmanship.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:hello@artisan.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#daa520] transition-colors">
                <Mail className="w-4 h-4" />
                <span>hello@artisan.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#daa520] transition-colors">
                <Phone className="w-4 h-4" />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[#c2703e] hover:to-[#daa520] flex items-center justify-center text-xs font-medium text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 border border-white/5 hover:border-transparent"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[#daa520] transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[#daa520] transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Sell</h3>
            <ul className="space-y-3">
              {footerLinks.sellOnKalaKriti.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[#daa520] transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[#daa520] transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} KalaKriti. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-500">
              Made with <Heart className="w-4 h-4 text-[#c2703e] fill-[#c2703e] animate-pulse" /> for artisans worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}