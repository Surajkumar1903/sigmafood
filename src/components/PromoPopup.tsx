import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Copy, Check, ArrowRight, Clock, ChefHat } from 'lucide-react';
import { useCartStore } from '../store';
import toast from 'react-hot-toast';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins countdown
  const navigate = useNavigate();
  const applyCoupon = useCartStore(s => s.applyCoupon);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('sigma_promo_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // Trigger after 2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('sigma_promo_dismissed', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SIGMA20');
    setCopied(true);
    applyCoupon('SIGMA20');
    toast.success('Coupon SIGMA20 applied! 20% OFF 🎉');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaimOffer = () => {
    applyCoupon('SIGMA20');
    toast.success('Coupon SIGMA20 applied! 20% OFF 🎉');
    handleClose();
    navigate('/menu');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-[rgba(245,166,35,0.35)] shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-10"
            style={{
              background: 'linear-gradient(145deg, #121212 0%, #0a0a0a 60%, #151208 100%)',
            }}
          >
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5a623]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff6b35]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all z-20 cursor-pointer"
              aria-label="Close Popup"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8 text-center relative z-10">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[rgba(245,166,35,0.15)] border border-[rgba(245,166,35,0.35)] text-[#f5a623] text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
                <Sparkles size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
                <span>Special Welcome Offer</span>
              </div>

              {/* Floating 3D Food Icons */}
              <div className="flex items-center justify-center gap-4 my-2 text-4xl sm:text-5xl animate-float">
                <span className="drop-shadow-lg">🍔</span>
                <span className="text-3xl text-[#f5a623] font-black">+</span>
                <span className="drop-shadow-lg scale-110">🥟</span>
                <span className="text-3xl text-[#f5a623] font-black">+</span>
                <span className="drop-shadow-lg">🍟</span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
                Flat <span className="text-gradient-gold">20% OFF</span>
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                On your order today at <span className="text-[#f5a623] font-semibold">Sigma Foods</span>. Experience delicious & hygienic vegetarian fast food!
              </p>

              {/* Coupon Box */}
              <div className="my-6 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center text-[#070707] font-black shrink-0 shadow-md">
                    %
                  </div>
                  <div className="text-left">
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Use Promo Code</p>
                    <p className="text-lg font-extrabold text-white tracking-widest font-mono">SIGMA20</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                      : 'bg-[rgba(245,166,35,0.15)] text-[#f5a623] hover:bg-[#f5a623] hover:text-[#070707] border border-[rgba(245,166,35,0.3)]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Applied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy & Apply
                    </>
                  )}
                </button>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/50 mb-6">
                <Clock size={14} className="text-[#f5a623]" />
                <span>Limited time offer! Expires in: </span>
                <span className="font-mono font-bold text-[#f5a623] bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  {formattedTime}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleClaimOffer}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(245,166,35,0.4)] hover:shadow-[0_15px_40px_rgba(245,166,35,0.6)] hover:scale-[1.02] transition-all cursor-pointer btn-shine"
                >
                  <span>Claim 20% OFF & Order Now</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>

                <button
                  onClick={handleClose}
                  className="text-white/40 hover:text-white/80 text-xs transition-colors cursor-pointer"
                >
                  No thanks, I'll order at regular price
                </button>
              </div>
            </div>

            {/* Bottom Bar: Trust Indicators */}
            <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex items-center justify-around text-[11px] text-white/40">
              <span className="flex items-center gap-1">🌱 100% Pure Veg</span>
              <span>•</span>
              <span className="flex items-center gap-1">🚀 Fast Rohini Delivery</span>
              <span>•</span>
              <span className="flex items-center gap-1">⭐ 5.0 Google Rating</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
