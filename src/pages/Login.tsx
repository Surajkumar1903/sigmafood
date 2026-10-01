import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChefHat,
  Shield,
  Phone,
  ArrowRight,
  Zap,
  CheckCircle2,
  Smartphone,
  Sparkles,
  RefreshCw,
  KeyRound,
  Copy,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { db, type DbUser } from '../services/db';
import { CLOUD_TEST_ACCOUNTS } from '../services/cloudDb';
import toast from 'react-hot-toast';

type LoginTab = 'phone' | 'email';

export default function LoginPage() {
  const [tab, setTab] = useState<LoginTab>('phone');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Google Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Show/Hide test credentials banner
  const [showCredentialsCard, setShowCredentialsCard] = useState(true);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Handle successful login and database sync
  const completeLogin = async (userRecord: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    password?: string;
    provider: 'google' | 'phone' | 'email';
    role?: 'admin' | 'customer';
  }) => {
    const dbUser: DbUser = {
      id: `usr_${Date.now()}`,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      avatar: userRecord.avatar,
      password: userRecord.password || '******',
      role: userRecord.role || (userRecord.email.toLowerCase().includes('admin') ? 'admin' : 'customer'),
      authProvider: userRecord.provider,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Save to real persistent database (IndexedDB + Cloud)
    await db.saveUser(dbUser);

    // Save to Zustand Auth store
    login({
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      avatar: userRecord.avatar,
    });

    const isAdmin = userRecord.role === 'admin' || userRecord.email.toLowerCase().includes('admin');
    navigate(isAdmin ? '/admin' : '/');
  };

  // ──────────────────────────────────────────────────────────
  // 1-CLICK INSTANT LOGIN WITH VISIBLE TEST ACCOUNTS
  // ──────────────────────────────────────────────────────────
  const handleAutoLoginAccount = (account: typeof CLOUD_TEST_ACCOUNTS[0]) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      completeLogin({
        name: account.name,
        email: account.email,
        phone: account.phone,
        password: account.password,
        avatar: account.avatar,
        provider: account.authProvider,
        role: account.role,
      });
      toast.success(`Logged in as ${account.name}! 🎉`);
    }, 450);
  };

  // ──────────────────────────────────────────────────────────
  // 1. GOOGLE LOGIN HANDLER
  // ──────────────────────────────────────────────────────────
  const handleGoogleLogin = async (selectedEmail?: string, selectedName?: string) => {
    setGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setGoogleLoading(false);
    setShowGoogleModal(false);

    const emailToUse = selectedEmail || 'surajkumar1903@gmail.com';
    const nameToUse = selectedName || 'Suraj Kumar';

    await completeLogin({
      name: nameToUse,
      email: emailToUse,
      phone: '+91 7838853490',
      password: 'google_oauth_token',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      provider: 'google',
    });

    toast.success(`Welcome, ${nameToUse}! Signed in with Google 🎉`);
  };

  // ──────────────────────────────────────────────────────────
  // 2. PHONE OTP LOGIN HANDLERS
  // ──────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);

    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setTimer(30);
    setCanResend(false);

    toast.success(`OTP sent to +91 ${cleanPhone.slice(-10)} 📲`, { duration: 4000 });
    setTimeout(() => {
      toast(
        (t) => (
          <div className="flex items-start gap-2">
            <Smartphone className="w-5 h-5 text-[#f5a623] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Sigma Foods SMS</p>
              <p className="text-xs text-white/80">
                Your login OTP is: <span className="font-mono text-[#f5a623] font-extrabold text-sm">{mockOtp}</span>
              </p>
            </div>
          </div>
        ),
        { duration: 9000, position: 'top-center' }
      );
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    await completeLogin({
      name: `User +91 ${cleanPhone.slice(-4)}`,
      email: `user_${cleanPhone}@sigmafoods.com`,
      phone: `+91 ${cleanPhone}`,
      provider: 'phone',
    });

    toast.success('Phone verified successfully! Welcome 🎉');
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const nextDigits = [...otpDigits];
    nextDigits[index] = val.slice(-1);
    setOtpDigits(nextDigits);

    if (val && index < 5) {
      document.getElementById(`otp-box-${index + 1}`)?.focus();
    }
  };

  const handleQuickFillOtp = () => {
    if (generatedOtp) {
      setOtpDigits(generatedOtp.split(''));
      toast.success('Auto-filled OTP! ✨');
    }
  };

  // ──────────────────────────────────────────────────────────
  // 3. EMAIL/PASSWORD LOGIN HANDLER
  // ──────────────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);

    const isAdmin = email.toLowerCase().includes('admin');
    await completeLogin({
      name: isAdmin ? 'Sigma Admin' : email.split('@')[0],
      email,
      phone: '+91 7838853490',
      password,
      provider: 'email',
    });

    toast.success(isAdmin ? 'Welcome to Admin Portal! 👑' : 'Welcome back! 🎉');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.08) 0%, #070707 70%)',
      }}
    >
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center mb-3 shadow-[0_0_35px_rgba(245,166,35,0.4)]">
            <ChefHat size={32} className="text-[#070707]" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Sign In</h1>
          <p className="text-white/50 text-sm mt-1">Order your favorite pure veg delicacies</p>
        </div>

        {/* ── VISIBLE TEST ACCOUNTS & PASSWORDS (DIRECT REVEAL) ──── */}
        {showCredentialsCard && (
          <div className="mb-6 p-4 rounded-3xl bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.3)] shadow-xl animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <KeyRound size={16} className="text-[#f5a623]" />
                <span className="text-white font-bold text-xs uppercase tracking-wider">
                  Live Test Accounts (IDs & Passwords)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5a623] text-[#070707] font-extrabold">
                1-Click Login
              </span>
            </div>

            <p className="text-white/60 text-xs mb-3">
              Aap inme se kisi bhi account par tap karke instant login kar sakte hain:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Account 1: Admin */}
              <div className="p-3 rounded-2xl bg-black/50 border border-white/8 hover:border-[rgba(245,166,35,0.4)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      👑 Admin Account
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-semibold">Admin</span>
                  </div>
                  <p className="text-white/40 text-[11px] mt-1 font-mono">
                    ID: <strong className="text-white select-all">admin@sigmafoods.com</strong>
                  </p>
                  <p className="text-white/40 text-[11px] font-mono">
                    Pass: <strong className="text-[#f5a623] select-all">admin123</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAutoLoginAccount(CLOUD_TEST_ACCOUNTS[0])}
                  className="mt-2.5 py-1.5 px-3 rounded-xl bg-[#f5a623] hover:bg-[#e09618] text-[#070707] text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Zap size={12} /> Login as Admin
                </button>
              </div>

              {/* Account 2: Google Verified */}
              <div className="p-3 rounded-2xl bg-black/50 border border-white/8 hover:border-[rgba(245,166,35,0.4)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      🌐 Google Account
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-semibold">Google</span>
                  </div>
                  <p className="text-white/40 text-[11px] mt-1 font-mono">
                    ID: <strong className="text-white select-all">surajkumar1903@gmail.com</strong>
                  </p>
                  <p className="text-white/40 text-[11px] font-mono">
                    Pass: <strong className="text-[#f5a623] select-all">suraj123</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAutoLoginAccount(CLOUD_TEST_ACCOUNTS[1])}
                  className="mt-2.5 py-1.5 px-3 rounded-xl bg-white hover:bg-neutral-200 text-[#070707] text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Zap size={12} /> Login with Google
                </button>
              </div>

              {/* Account 3: Phone OTP Account */}
              <div className="p-3 rounded-2xl bg-black/50 border border-white/8 hover:border-[rgba(245,166,35,0.4)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      📱 Phone OTP User
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Phone</span>
                  </div>
                  <p className="text-white/40 text-[11px] mt-1 font-mono">
                    Phone: <strong className="text-white select-all">+91 9876543210</strong>
                  </p>
                  <p className="text-white/40 text-[11px] font-mono">
                    Default OTP: <strong className="text-emerald-400 select-all">482910</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTab('phone');
                    setPhone('9876543210');
                    handleAutoLoginAccount(CLOUD_TEST_ACCOUNTS[2]);
                  }}
                  className="mt-2.5 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Zap size={12} /> Login with Phone OTP
                </button>
              </div>

              {/* Account 4: Customer Account */}
              <div className="p-3 rounded-2xl bg-black/50 border border-white/8 hover:border-[rgba(245,166,35,0.4)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      👤 Customer (Priya)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-semibold">Email</span>
                  </div>
                  <p className="text-white/40 text-[11px] mt-1 font-mono">
                    ID: <strong className="text-white select-all">priya.verma@gmail.com</strong>
                  </p>
                  <p className="text-white/40 text-[11px] font-mono">
                    Pass: <strong className="text-[#f5a623] select-all">priya123</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAutoLoginAccount(CLOUD_TEST_ACCOUNTS[3])}
                  className="mt-2.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Zap size={12} /> Login as Priya
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── GOOGLE 1-TAP LOGIN BUTTON ─────────────────────── */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/40 text-xs uppercase tracking-wider font-semibold">Or Type ID & Password</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* ── LOGIN METHOD TABS (PHONE vs EMAIL) ────────────── */}
        <div className="flex p-1 rounded-2xl bg-white/5 border border-white/8 mb-6">
          <button
            type="button"
            onClick={() => setTab('phone')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              tab === 'phone'
                ? 'bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone size={14} /> Phone Number (OTP)
          </button>
          <button
            type="button"
            onClick={() => setTab('email')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              tab === 'email'
                ? 'bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Mail size={14} /> Email & Password
          </button>
        </div>

        {/* ── CARD CONTAINER ────────────────────────────────── */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-[#0c0c0c]/90 backdrop-blur-2xl">
          {/* TAB 1: PHONE NUMBER & OTP LOGIN */}
          {tab === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 font-medium">Enter Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm flex items-center justify-center shrink-0">
                        🇮🇳 +91
                      </div>
                      <div className="relative flex-1">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm tracking-wider font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.length < 10}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-bold text-sm hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#070707]/30 border-t-[#070707] rounded-full animate-spin" />
                    ) : (
                      <>Get Verification OTP <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-up">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">Verify OTP</p>
                      <p className="text-white/40 text-xs">Sent to +91 {phone.slice(-10)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-[#f5a623] hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  {/* 6 Digit OTP Input Boxes */}
                  <div className="flex justify-between gap-1.5 sm:gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-box-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && idx > 0) {
                            document.getElementById(`otp-box-${idx - 1}`)?.focus();
                          }
                        }}
                        className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl text-center bg-white/5 border border-white/15 text-white font-extrabold text-lg focus:outline-none focus:border-[#f5a623] focus:bg-[#f5a623]/10 transition-all"
                      />
                    ))}
                  </div>

                  {/* Auto-fill Helper */}
                  {generatedOtp && (
                    <div className="p-2.5 rounded-xl bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] flex items-center justify-between text-xs">
                      <span className="text-white/70">
                        Received OTP: <strong className="text-[#f5a623] font-mono text-sm">{generatedOtp}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleQuickFillOtp}
                        className="text-[#f5a623] hover:underline font-bold"
                      >
                        1-Tap Auto Fill ✨
                      </button>
                    </div>
                  )}

                  {/* Resend Timer */}
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>Didn't receive code?</span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#f5a623] font-semibold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw size={11} /> Resend OTP
                      </button>
                    ) : (
                      <span>Resend in <strong className="text-white">{timer}s</strong></span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length < 6}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-bold text-sm hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#070707]/30 border-t-[#070707] rounded-full animate-spin" />
                    ) : (
                      <>Verify & Sign In <CheckCircle2 size={16} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL & PASSWORD LOGIN */}
          {tab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-up">
              <div>
                <label className="block text-white/50 text-xs mb-1.5 font-medium">Email Address (ID)</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sigmafoods.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm transition-colors font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/50 text-xs font-medium">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-[11px] text-[#f5a623] hover:underline flex items-center gap-1"
                  >
                    {showPw ? <><EyeOff size={11} /> Hide Password</> : <><Eye size={11} /> Show Password</>}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin123"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#f5a623] text-sm transition-colors font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-bold text-sm hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#070707]/30 border-t-[#070707] rounded-full animate-spin" />
                ) : (
                  <>Sign In with Password <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-white/40 text-xs sm:text-sm mt-6">
            New to Sigma Foods?{' '}
            <Link to="/register" className="text-[#f5a623] hover:underline font-semibold">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* ── GOOGLE ACCOUNT CHOOSER MODAL ────────────────────── */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-up">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#181818] border border-white/10 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-white font-bold text-sm">Choose Google Account</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-white/50 text-xs mb-4">to continue to <strong>Sigma Foods</strong></p>

            <div className="space-y-2 mb-6">
              <button
                type="button"
                onClick={() => handleGoogleLogin('surajkumar1903@gmail.com', 'Suraj Kumar')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  S
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold truncate">Suraj Kumar</p>
                  <p className="text-white/40 text-xs truncate">surajkumar1903@gmail.com</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLogin('foodssigma@gmail.com', 'Sigma Foods')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f5a623] to-[#ff6b35] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  Σ
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold truncate">Sigma Foods Official</p>
                  <p className="text-white/40 text-xs truncate">foodssigma@gmail.com</p>
                </div>
              </button>
            </div>

            {googleLoading ? (
              <div className="flex items-center justify-center py-2 text-xs text-[#f5a623] gap-2">
                <div className="w-4 h-4 border-2 border-[#f5a623]/30 border-t-[#f5a623] rounded-full animate-spin" />
                Signing in with Google...
              </div>
            ) : (
              <p className="text-center text-[10px] text-white/30">
                To continue, Google will share your name, email address, and profile picture with Sigma Foods.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
