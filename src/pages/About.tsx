import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Smile, Tag, MapPin, Phone, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      {/* Hero */}
      <section
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(245,166,35,0.05) 0%, #070707 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #f5a623, transparent 70%)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <p className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            About <span className="text-gradient">Sigma Foods</span>
          </h1>
          <p className="text-[#f5a623] text-xl font-medium mb-6">More Than Food, It's an Experience</p>
          <p className="text-white/50 text-lg leading-relaxed max-w-3xl mx-auto">
            Sigma Foods is a modern food outlet dedicated to serving delicious, hygienic, and freshly prepared vegetarian snacks and fast food at affordable prices. We specialize in a wide range of flavorful dishes, including momos, burgers, pasta, cigar rolls, sandwiches, fries, and refreshing beverages, all made with high-quality ingredients and a passion for great taste.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className="rounded-3xl overflow-hidden flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(255,107,53,0.03) 100%)',
                border: '1px solid rgba(245,166,35,0.1)',
                minHeight: '380px',
              }}
            >
              <div className="text-center p-12">
                <div className="animate-float text-[120px]" style={{ filter: 'drop-shadow(0 20px 40px rgba(245,166,35,0.3))' }}>🍴</div>
                <div className="flex justify-center gap-4 mt-6">
                  {['🥟', '🍔', '🍝', '🌯', '🍟', '🥤'].map((e, i) => (
                    <div key={i} className="animate-float text-3xl" style={{ animationDelay: `${i * 0.3}s` }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest mb-4">Our Mission</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Crafted with Passion,<br />Served with Love</h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>
                  At Sigma Foods, we believe that great food doesn't have to be expensive or complicated. Our mission is simple: serve the most delicious vegetarian food in Rohini at prices everyone can enjoy.
                </p>
                <p>
                  Every dish we prepare is made fresh, using carefully selected ingredients. We take pride in maintaining the highest hygiene standards so our customers always enjoy safe, clean, and delicious food.
                </p>
                <p>
                  From our crispy fried momos to our creamy white sauce pasta and juicy veg burgers, every item on our menu has been crafted with care and a deep love for food.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {['100% Vegetarian', 'Fresh Daily', 'Hygienic Kitchen', 'Affordable Prices', 'Rohini\'s Favorite'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full glass border border-[rgba(245,166,35,0.2)] text-[#f5a623] text-sm font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-[#090909]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: '5.0', label: 'Google Rating', icon: '⭐' },
              { value: '13+', label: 'Google Reviews', icon: '💬' },
              { value: '30+', label: 'Menu Items', icon: '🍽️' },
              { value: '7', label: 'Categories', icon: '📂' },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl p-6 text-center border border-white/6">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-[#f5a623] font-extrabold text-3xl mb-1">{s.value}</p>
                <p className="text-white/40 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest mb-3">Our Values</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">What We Stand For</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: 'Fresh Ingredients', desc: 'We source only the freshest, highest-quality vegetables and ingredients every single day.' },
              { icon: Shield, title: 'Food Safety', desc: 'Our kitchen follows strict hygiene protocols to ensure every meal is safe, clean, and delicious.' },
              { icon: Smile, title: 'Customer First', desc: 'Your satisfaction is our priority. We ensure every visit leaves you smiling.' },
              { icon: Tag, title: 'Honest Pricing', desc: 'Premium quality at prices that respect your wallet. No compromise, no hidden charges.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-6 border border-white/6 hover:border-[rgba(245,166,35,0.2)] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[rgba(245,166,35,0.08)] flex items-center justify-center mb-4 group-hover:bg-[rgba(245,166,35,0.15)] transition-colors">
                  <Icon size={22} className="text-[#f5a623]" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4 bg-[#090909]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest mb-3">Find Us</p>
          <h2 className="text-3xl font-extrabold text-white mb-8">Visit Sigma Foods</h2>
          <div className="glass rounded-2xl p-8 border border-white/6">
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
                  <MapPin size={22} className="text-[#f5a623]" />
                </div>
                <p className="text-white/40 text-xs">Location</p>
                <p className="text-white text-sm text-center">Shop No. 4, Pocket 6-II, Sector 2, Rohini, Delhi</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
                  <Phone size={22} className="text-[#f5a623]" />
                </div>
                <p className="text-white/40 text-xs">Phone</p>
                <a href="tel:+917838853490" className="text-[#f5a623] text-sm hover:underline">+91 7838853490</a>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
                  <Clock size={22} className="text-[#f5a623]" />
                </div>
                <p className="text-white/40 text-xs">Hours</p>
                <div className="text-center">
                  <p className="text-white text-sm">Mon–Sat: 11AM–11PM</p>
                  <p className="text-white text-sm">Sun: 9AM–11PM</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+917838853490" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-semibold btn-shine">
                <Phone size={16} /> Call Now
              </a>
              <Link to="/menu" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass border border-[rgba(245,166,35,0.3)] text-[#f5a623] font-semibold hover:bg-[rgba(245,166,35,0.08)] transition-all">
                Order Online <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
