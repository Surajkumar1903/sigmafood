import { Link } from 'react-router-dom';
import { ChefHat, Share2, Users, Play, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/8 py-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center shadow-md">
              <ChefHat size={18} className="text-[#070707]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-extrabold text-base leading-tight">
                Sigma <span className="text-[#f5a623]">Foods</span>
              </p>
              <p className="text-[10px] text-white/40 leading-tight">
                More Than Food, It's an Experience
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm">
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Menu', href: '/menu' },
              { label: 'Reviews', href: '/#reviews' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="text-white/60 hover:text-[#f5a623] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              {[
                { icon: Share2, label: 'Instagram', href: '#' },
                { icon: Users, label: 'Facebook', href: '#' },
                { icon: Globe, label: 'X', href: '#' },
                { icon: Play, label: 'YouTube', href: '#' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/50 hover:text-[#f5a623] hover:border-[rgba(245,166,35,0.3)] transition-all"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
            <p className="text-white/30 text-[11px] sm:text-xs">
              © 2026 Sigma Foods. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
