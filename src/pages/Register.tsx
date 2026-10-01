import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ChefHat, ArrowRight, Smartphone, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store';
import { db, type DbUser } from '../services/db';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    const newUser: DbUser = {
      id: `usr_${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Save in persistent database
    await db.saveUser(newUser);

    // Login state
    login({
      name: form.name,
      email: form.email,
      phone: form.phone,
    });

    toast.success('Account created successfully! Welcome to Sigma Foods 🎉');
    navigate('/');
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);

    const googleUser: DbUser = {
      id: `usr_${Date.now()}`,
      name: 'Suraj Kumar',
      email: 'surajkumar1903@gmail.com',
      phone: '+91 7838853490',
      authProvider: 'google',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await db.saveUser(googleUser);

    login({
      name: googleUser.name,
      email: googleUser.email,
      phone: googleUser.phone,
      avatar: googleUser.avatar,
    });

    toast.success('Signed up with Google successfully! 🎉');
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.08) 0%, #070707 70%)',
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center mb-3 shadow-[0_0_35px_rgba(245,166,35,0.4)]">
            <ChefHat size={32} className="text-[#070707]" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
          <p className="text-white/50 text-sm mt-1">Join the Sigma Foods food family</p>
        </div>

        {/* Google 1-Tap Sign Up */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/40 text-xs uppercase tracking-wider font-semibold">Or Register with Details</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-[#0c0c0c]/90 backdrop-blur-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs mb-1 font-medium">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Suraj Kumar"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-1 font-medium">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-1 font-medium">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create strong password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-bold text-sm hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#070707]/30 border-t-[#070707] rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#f5a623] hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
