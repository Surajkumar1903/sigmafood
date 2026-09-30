import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChefHat, Shield, User, ArrowRight, Zap } from 'lucide-react';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleLoginSuccess = (userEmail: string) => {
    const isAdmin = userEmail.toLowerCase().includes('admin');
    login({
      name: isAdmin ? 'Sigma Admin' : userEmail.split('@')[0],
      email: userEmail,
      phone: '+91 7838853490',
    });
    toast.success(isAdmin ? 'Welcome to Admin Portal! 👑' : 'Welcome back! 🎉');
    navigate(isAdmin ? '/admin' : '/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    handleLoginSuccess(email);
  };

  const handleQuickAdmin = () => {
    setEmail('admin@sigmafoods.com');
    setPassword('admin123');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleLoginSuccess('admin@sigmafoods.com');
    }, 400);
  };

  const handleQuickCustomer = () => {
    setEmail('customer@sigmafoods.com');
    setPassword('customer123');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleLoginSuccess('customer@sigmafoods.com');
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-24"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.06) 0%, #070707 65%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,166,35,0.35)]">
            <ChefHat size={30} className="text-[#070707]" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-white/45 text-sm mt-1.5">Sign in to your Sigma Foods account</p>
        </div>

        {/* Credentials Info Box */}
        <div className="p-4 mb-6 rounded-2xl bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.25)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#f5a623] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={14} /> Admin Credentials
            </span>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="px-2.5 py-1 rounded-lg bg-[#f5a623] text-[#070707] text-[11px] font-extrabold hover:bg-[#e09618] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Zap size={11} /> 1-Click Login
            </button>
          </div>
          <div className="text-xs space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
            <p className="text-white/70">
              <span className="text-white/40">Email:</span> <span className="font-mono text-white font-bold select-all">admin@sigmafoods.com</span>
            </p>
            <p className="text-white/70">
              <span className="text-white/40">Password:</span> <span className="font-mono text-[#f5a623] font-bold select-all">admin123</span>
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass rounded-3xl p-7 sm:p-8 border border-white/8 shadow-2xl bg-[#0c0c0c]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sigmafoods.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-bold text-sm hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all disabled:opacity-70 btn-shine cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#070707]/30 border-t-[#070707] rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} strokeWidth={2.5} /></>
              )}
            </button>
          </form>

          {/* Quick Customer login */}
          <div className="mt-4 pt-4 border-t border-white/6 flex items-center justify-between">
            <span className="text-white/40 text-xs">Customer login demo:</span>
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="text-[#f5a623] hover:underline text-xs font-semibold"
            >
              Quick Fill Customer
            </button>
          </div>

          <p className="text-center text-white/40 text-xs sm:text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#f5a623] hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
