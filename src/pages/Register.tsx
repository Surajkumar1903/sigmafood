import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ChefHat } from 'lucide-react';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all required fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login({ name: form.name, email: form.email, phone: form.phone });
    toast.success('Account created! Welcome to Sigma Foods 🎉');
    setLoading(false);
    navigate('/');
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', Icon: User, placeholder: 'Your full name' },
    { key: 'email', label: 'Email Address', type: 'email', Icon: Mail, placeholder: 'your@email.com' },
    { key: 'phone', label: 'Phone Number', type: 'tel', Icon: Phone, placeholder: '+91 XXXXX XXXXX' },
    { key: 'password', label: 'Password', type: 'password', Icon: Lock, placeholder: 'Create a password' },
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.05) 0%, #070707 60%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,166,35,0.3)]">
            <ChefHat size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
          <p className="text-white/40 mt-2">Join the Sigma Foods family</p>
        </div>
        <div className="glass rounded-2xl p-8 border border-white/6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, Icon, placeholder }) => (
              <div key={key}>
                <label className="block text-white/50 text-xs mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-colors"
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all disabled:opacity-70 btn-shine"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                : 'Create Account'
              }
            </button>
          </form>
          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#f5a623] hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
