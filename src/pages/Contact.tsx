import { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Send, Star, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) { toast.error('Please fill required fields'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll get back to you soon. 🎉');
    setForm({ name: '', email: '', phone: '', message: '' });
    setSending(false);
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, rgba(245,166,35,0.04) 0%, #070707 100%)' }}>
        <p className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
        <p className="text-white/45 max-w-xl mx-auto">
          Have a question or want to place a bulk order? We'd love to hear from you!
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left – Contact Info */}
          <div className="space-y-6">
            {/* Info Cards */}
            <div className="glass rounded-2xl p-6 border border-white/6">
              <h2 className="text-white font-bold text-lg mb-6">Visit or Call Us</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-[#f5a623]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Address</p>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Shop No. 4, Pocket 6-II, Sector 2,<br />
                      Rohini, Delhi, Delhi, 110085
                    </p>
                    <a
                      href="https://maps.app.goo.gl/sigma-foods-rohini"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#f5a623] text-xs mt-2 hover:underline"
                    >
                      Open in Google Maps <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-[#f5a623]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Phone</p>
                    <a href="tel:+917838853490" className="text-[#f5a623] hover:underline">+91 7838853490</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-[#f5a623]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Business Hours</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-sm">Monday – Saturday</span>
                        <span className="text-white text-sm font-medium">11:00 AM – 11:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-sm">Sunday</span>
                        <span className="text-white text-sm font-medium">9:00 AM – 11:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="glass rounded-2xl p-6 border border-[rgba(245,166,35,0.15)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">G</div>
                <div>
                  <p className="text-white font-semibold">Google Business</p>
                  <p className="text-white/40 text-sm">Sigma Foods</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-[#f5a623]" fill="#f5a623" />)}
                </div>
                <span className="text-white font-bold text-xl">5.0</span>
              </div>
              <p className="text-white/40 text-sm mb-4">Based on 13+ Google reviews</p>
              <a
                href="https://g.co/kgs/sigma-foods"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#f5a623] text-sm font-semibold hover:underline"
              >
                Read Reviews on Google <ExternalLink size={13} />
              </a>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <a
                href="tel:+917838853490"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-semibold btn-shine hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] transition-all"
              >
                <Phone size={16} /> Call Now
              </a>
              <a
                href="https://maps.app.goo.gl/sigma-foods-rohini"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl glass border border-[rgba(245,166,35,0.3)] text-[#f5a623] font-semibold hover:bg-[rgba(245,166,35,0.08)] transition-all"
              >
                <MapPin size={16} /> Directions
              </a>
            </div>
          </div>

          {/* Right – Contact Form */}
          <div className="glass rounded-2xl p-6 border border-white/6">
            <h2 className="text-white font-bold text-lg mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-xs mb-1.5">Your Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-xs mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-xs mb-1.5">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us how we can help you, or share your feedback..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.35)] hover:scale-[1.02] transition-all disabled:opacity-70 btn-shine"
              >
                {sending ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><Send size={17} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Style Embed Placeholder */}
        <div className="mt-10 rounded-3xl overflow-hidden border border-white/6" style={{ minHeight: '200px', background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0e0a 100%)' }}>
          <div className="relative min-h-48 flex items-center justify-center">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'linear-gradient(rgba(245,166,35,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <div className="relative z-10 text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,166,35,0.3)] animate-pulse-glow">
                <MapPin size={26} className="text-white" />
              </div>
              <p className="text-white font-bold mb-1">Sigma Foods</p>
              <p className="text-white/40 text-sm mb-1">Shop No. 4, Pocket 6-II</p>
              <p className="text-white/40 text-sm mb-4">Sector 2, Rohini, Delhi – 110085</p>
              <a
                href="https://maps.google.com/?q=Sector+2+Rohini+Delhi+110085"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#f5a623] text-sm font-semibold hover:underline"
              >
                Open in Google Maps <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
