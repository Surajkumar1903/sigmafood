import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  motion, useMotionValue, useSpring, useTransform, type Variants
} from 'framer-motion';
import {
  Star, ArrowRight, MapPin, Phone, Clock, Leaf, Shield,
  Smile, Play, X, Crown, Sparkles, Flame, Eye, Utensils,
  ChevronDown, Check, Plus, MessageCircle, HelpCircle, Camera
} from 'lucide-react';

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}
import {
  BEST_SELLERS, CATEGORIES, CATEGORY_IMAGES, CATEGORY_EMOJIS, CATEGORY_COUNTS, REVIEWS, COMBOS, type Category, type ComboItem
} from '../data/products';
import ProductCard from '../components/ProductCard';
import { useUIStore, useCartStore } from '../store';
import toast from 'react-hot-toast';

// ────── Framer Motion Variants ──────────────────────────────
const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function DiamondIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3h12l4 6-10 12L2 9z"/>
      <path d="M11 3 8 9l4 12 4-12-3-6"/>
      <path d="M2 9h20"/>
    </svg>
  );
}

// ────── Hero Section with Layered 3D Food Composition ────────
function HeroSection({ onWatchVideo }: { onWatchVideo: () => void }) {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse coordinates mapped to -0.5 ... 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end organic feel
  const springX = useSpring(mouseX, { stiffness: 90, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 20 });

  // Multi-tier parallax transforms:
  // Layer 1 (background): 1x
  const bgX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const bgY = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  // Layer 2 (ingredients): 2x
  const ingX = useTransform(springX, [-0.5, 0.5], [-24, 24]);
  const ingY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  // Layer 3 (food scene): 4x
  const foodX = useTransform(springX, [-0.5, 0.5], [-40, 40]);
  const foodY = useTransform(springY, [-0.5, 0.5], [-30, 30]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  // Layer 4 (foreground particles): 6x
  const fgX = useTransform(springX, [-0.5, 0.5], [-60, 60]);
  const fgY = useTransform(springY, [-0.5, 0.5], [-45, 45]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center overflow-hidden pt-24 sm:pt-28 pb-8 sm:pb-12 perspective-1500"
      style={{
        background: 'radial-gradient(ellipse at 65% 35%, rgba(245,166,35,0.09) 0%, #070707 68%)',
      }}
    >
      {/* Background Layer 1: Ambient Restaurant Glow & Lighting */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute top-1/4 right-1/4 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full blur-[100px] sm:blur-[140px] opacity-25 pointer-events-none"
        style-bg={{
          background: 'radial-gradient(circle, #f5a623 0%, #ff6b35 45%, transparent 70%)',
        }}
      />
      <div className="absolute top-12 left-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-[90px] sm:blur-[120px] opacity-10 bg-[#f5a623] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Text & Trust Badges */}
          <div className="lg:col-span-6 z-20">
            {/* Small Badge matching screenshot: Fresh • Hygienic • Vegetarian */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-white/10 mb-4 sm:mb-6 backdrop-blur-md shadow-lg"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <Leaf size={11} className="text-green-400 sm:w-3 sm:h-3" />
              </div>
              <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wide">
                Fresh • Hygienic • Vegetarian
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] mb-3 sm:mb-6 tracking-tight">
                <span className="text-white block">More Than Food.</span>
                <span className="text-gradient-gold block drop-shadow-[0_0_35px_rgba(245,166,35,0.35)]">
                  It's an Experience.
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl"
            >
              Sigma Foods is a modern food outlet dedicated to serving delicious, hygienic, and freshly prepared vegetarian snacks and fast food at affordable prices.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-10"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/menu"
                  className="flex items-center gap-1.5 sm:gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-full bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-extrabold text-xs sm:text-base shadow-[0_0_25px_rgba(245,166,35,0.4)] hover:shadow-[0_0_35px_rgba(245,166,35,0.6)] btn-shine shrink-0"
                >
                  <span>Explore Menu</span> <ArrowRight size={16} strokeWidth={2.5} className="sm:w-4.5 sm:h-4.5" />
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onWatchVideo}
                className="flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3.5 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(245,166,35,0.4)] text-white font-semibold text-xs sm:text-base transition-all cursor-pointer shadow-lg shrink-0"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#f5a623] flex items-center justify-center text-[#070707]">
                  <Play size={10} fill="#070707" className="ml-0.5 sm:w-3 sm:h-3" />
                </div>
                <span>Watch Video</span>
              </motion.button>
            </motion.div>

            {/* 3 Premium Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-2 sm:gap-6 pt-4 sm:pt-6 border-t border-white/8"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition-transform shrink-0">
                  <Leaf size={15} className="sm:w-4.5 sm:h-4.5" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-[11px] sm:text-sm leading-tight">100%</p>
                  <p className="text-white/50 text-[9px] sm:text-xs">Vegetarian</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition-transform shrink-0">
                  <Shield size={15} className="sm:w-4.5 sm:h-4.5" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-[11px] sm:text-sm leading-tight">Freshly</p>
                  <p className="text-white/50 text-[9px] sm:text-xs">Prepared</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition-transform shrink-0">
                  <DiamondIcon size={15} className="sm:w-4.5 sm:h-4.5" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-[11px] sm:text-sm leading-tight">Affordable</p>
                  <p className="text-white/50 text-[9px] sm:text-xs">Prices</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Large 3D Photorealistic Food Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[260px] xs:min-h-[320px] sm:min-h-[460px] lg:min-h-[580px] w-full px-2 sm:px-0">
            {/* 3D Composition Frame with Mouse Tilt */}
            <motion.div
              style={{
                x: foodX,
                y: foodY,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[560px] preserve-3d"
            >
              {/* Golden Ambient Glow behind platter */}
              <div
                className="absolute inset-2 sm:inset-4 rounded-full blur-[60px] sm:blur-[80px] opacity-40 pointer-events-none -z-10"
                style={{
                  background: 'radial-gradient(circle, #f5a623 10%, #ff6b35 45%, transparent 70%)',
                  transform: 'translateZ(-30px)',
                }}
              />

              {/* Platter drop shadow */}
              <div
                className="absolute inset-x-6 sm:inset-x-8 -bottom-3 sm:-bottom-4 h-12 sm:h-16 bg-black/95 blur-xl sm:blur-2xl rounded-full pointer-events-none"
                style={{ transform: 'translateZ(-40px)' }}
              />

              {/* Main 3D Composition Image */}
              <div
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden group"
                style={{ transform: 'translateZ(10px)' }}
              >
                <img
                  src="/hero-composition.png"
                  alt="Sigma Foods 3D Gourmet Burger, Crispy Fries and Cold Drink Platter"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] group-hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Rising steam over burger */}
                <div className="absolute bottom-20 sm:bottom-24 left-1/2 w-12 sm:w-16 h-20 sm:h-24 pointer-events-none opacity-40 animate-steam">
                  <div className="w-full h-full bg-gradient-to-t from-white/35 to-transparent blur-md rounded-full" />
                </div>
              </div>

              {/* Interactive Floating 3D Ingredients on Mouse Parallax */}
              {/* Floating Tomato Slice */}
              <motion.div
                style={{
                  x: ingX,
                  y: ingY,
                  transform: 'translateZ(55px)',
                }}
                animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 sm:-top-4 left-1 sm:left-4 text-3xl sm:text-5xl filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)] pointer-events-none select-none z-30"
              >
                🍅
              </motion.div>

              {/* Floating Purple Onion Ring */}
              <motion.div
                style={{
                  x: ingX,
                  y: ingY,
                  transform: 'translateZ(65px)',
                }}
                animate={{ y: [0, 6, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute -top-4 sm:-top-6 right-1/4 text-2xl sm:text-4xl filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.65)] pointer-events-none select-none z-30"
              >
                🧅
              </motion.div>

              {/* Floating Fresh Basil Leaf */}
              <motion.div
                style={{
                  x: fgX,
                  y: fgY,
                  transform: 'translateZ(75px)',
                }}
                animate={{ y: [0, 8, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -left-2 sm:-left-6 text-2xl sm:text-4xl filter drop-shadow-[0_10px_18px_rgba(0,0,0,0.7)] pointer-events-none select-none z-30"
              >
                🌿
              </motion.div>

              {/* Floating Glass Badge: 100% Pure Veg Gourmet */}
              <motion.div
                style={{ transform: 'translateZ(45px)' }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 sm:-top-4 right-1 sm:right-4 z-30 pointer-events-none"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[rgba(15,15,15,0.88)] border border-[rgba(245,166,35,0.4)] backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[#f5a623] text-[10px] sm:text-xs font-bold tracking-wide">100% Pure Veg</span>
                </div>
              </motion.div>

              {/* Floating Glass Badge: 5.0 Rating */}
              <motion.div
                style={{ transform: 'translateZ(50px)' }}
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute -bottom-3 sm:-bottom-4 right-2 sm:right-6 z-30 pointer-events-none"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[rgba(15,15,15,0.88)] border border-white/15 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
                  <Star size={11} className="text-[#f5a623] sm:w-3 sm:h-3" fill="#f5a623" />
                  <span className="text-white text-[10px] sm:text-xs font-bold">5.0</span>
                  <span className="text-white/50 text-[9px] sm:text-[11px]">• 13+ Reviews</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Far Right: 3 Indicator Dots + Scroll Down Indicator matching screenshot */}
      <div className="hidden xl:flex flex-col items-center gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20">
        {/* 3 Vertical Carousel Dots matching screenshot */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#f5a623] shadow-[0_0_12px_#f5a623]" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/25" />

        {/* Small golden food doodle icon */}
        <div className="my-2 text-xs text-[#f5a623]/80 select-none">
          ✨
        </div>

        {/* Mouse outline icon */}
        <motion.div
          onClick={scrollToCategories}
          className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1 cursor-pointer hover:border-[#f5a623] transition-colors mt-2"
          title="Scroll Down"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-[#f5a623] rounded-full"
          />
        </motion.div>
        {/* Vertical text */}
        <span
          className="text-[10px] font-bold text-white/40 tracking-widest uppercase my-2 select-none"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll Down
        </span>
        {/* Glowing vertical line with moving golden dot */}
        <div className="w-[1.5px] h-12 bg-white/10 relative overflow-hidden rounded-full">
          <motion.div
            animate={{ y: [-15, 50] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-4 bg-gradient-to-b from-transparent via-[#f5a623] to-transparent shadow-[0_0_8px_#f5a623]"
          />
        </div>
      </div>
    </section>
  );
}

// ────── Popular Categories Section (Docked Glass Container) ───
function PopularCategoriesSection() {
  return (
    <motion.section
      id="categories-section"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="py-8 sm:py-12 px-3 sm:px-6 relative bg-[#070707]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Floating Glass Rounded Container */}
        <div className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 bg-[rgba(18,18,18,0.7)] backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.75)]">
          {/* Header inside container with Cloche cover icon */}
          <div className="flex flex-row items-center justify-between mb-4 sm:mb-8 pb-3 sm:pb-6 border-b border-white/6">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[rgba(245,166,35,0.12)] border border-[rgba(245,166,35,0.25)] flex items-center justify-center shrink-0">
                <Utensils size={18} className="text-[#f5a623] sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-white tracking-tight">
                  Popular <span className="text-[#f5a623]">Categories</span>
                </h2>
                <p className="text-white/45 text-[11px] sm:text-sm hidden xs:block mt-0.5">
                  Explore delicious vegetarian fast food & cafe specials.
                </p>
              </div>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1 sm:gap-1.5 text-[#f5a623] hover:text-[#ffd080] font-bold text-xs sm:text-sm transition-colors shrink-0 group"
            >
              <span>View All</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* 7 Category Cards Row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex overflow-x-auto scroll-touch-x pb-2 -mx-1 px-1 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-4 snap-x"
          >
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat}
                variants={cardVariant}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="snap-card shrink-0 w-[115px] xs:w-[130px] sm:w-auto"
              >
                <Link to={`/menu?category=${cat}`} className="block group">
                  <div className="rounded-xl sm:rounded-2xl p-2 sm:p-2.5 bg-[rgba(255,255,255,0.03)] border border-white/8 hover:border-[rgba(245,166,35,0.45)] transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    {/* Food Photo */}
                    <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-black/60 relative mb-2">
                      <img
                        src={CATEGORY_IMAGES[cat]}
                        alt={cat}
                        className="w-full h-full object-cover group-hover:scale-112 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Bottom Pill */}
                    <div className="py-1.5 px-2 sm:py-2 sm:px-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 group-hover:bg-[#f5a623] group-hover:border-[#f5a623] transition-colors flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] sm:text-xs shrink-0">{CATEGORY_EMOJIS[cat]}</span>
                          <p className="text-white group-hover:text-[#070707] font-bold text-[11px] sm:text-xs truncate transition-colors">
                            {cat}
                          </p>
                        </div>
                        <p className="text-white/40 group-hover:text-[#070707]/75 text-[9px] sm:text-[10px] pl-3.5 transition-colors">
                          {CATEGORY_COUNTS[cat]} Items
                        </p>
                      </div>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/5 group-hover:bg-[#070707]/15 flex items-center justify-center shrink-0 ml-1">
                        <ArrowRight
                          size={10}
                          className="text-white/40 group-hover:text-[#070707] group-hover:translate-x-0.5 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// ────── Best Sellers Section with Quick View & Add to Cart ────
function BestSellersSection() {
  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-12 sm:py-20 relative bg-[#090909] border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-10 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Crown size={18} className="text-[#f5a623] sm:w-5 sm:h-5" />
              </motion.div>
              <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight">
                Best Sellers
              </h2>
            </div>
            <p className="text-white/45 text-xs sm:text-sm">Most loved. Most ordered.</p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1 sm:gap-1.5 text-[#f5a623] hover:text-[#ffd080] font-bold text-xs sm:text-sm transition-colors shrink-0 group"
          >
            <span>View All</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* 2-Columns on Phone, 4-Columns on Desktop */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {BEST_SELLERS.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────── Promotional Offer Banner ─────────────────────────────
function PromotionalBanner() {
  const navigate = useNavigate();

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SIGMA20');
    toast.success('Coupon SIGMA20 copied! 🎁 20% OFF applied');
  };

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-10 sm:py-16 px-3 sm:px-6 bg-[#070707]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          whileHover={{ borderColor: 'rgba(245,166,35,0.35)' }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-12 lg:p-14 border border-[rgba(245,166,35,0.2)] transition-colors"
          style={{
            background: 'linear-gradient(135deg, #0e0e0e 0%, #15120a 50%, #0e0e0e 100%)',
          }}
        >
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-[100px] bg-[#f5a623]/15 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 text-center sm:text-left">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2 sm:mb-3">
                Hungry? <span className="text-[#f5a623]">We've Got You Covered.</span>
              </h2>
              <p className="text-white/60 text-xs sm:text-base mb-6 sm:mb-8">
                Delicious food. Great prices. Zero compromise.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/menu')}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#f5a623] hover:bg-[#e09618] text-[#070707] font-extrabold text-xs sm:text-base transition-colors shadow-[0_0_30px_rgba(245,166,35,0.35)] btn-shine inline-flex items-center gap-2 cursor-pointer"
              >
                ORDER NOW <ArrowRight size={15} strokeWidth={2.5} className="sm:w-4 sm:h-4" />
              </motion.button>
            </div>

            {/* Center: Food Visual */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-52 h-36 sm:w-80 sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious food combo"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </motion.div>
            </div>

            {/* Right: Red Stamp Special Offer with Tap to Copy */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <motion.div
                animate={{ rotate: [-3, -1, -3], scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.06, rotate: 0 }}
                onClick={handleCopyCode}
                className="px-5 py-4 sm:px-6 sm:py-5 rounded-2xl text-center shadow-2xl border border-red-500/30 cursor-pointer active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #c92a2a 0%, #a61e1e 100%)',
                }}
                title="Tap to copy code"
              >
                <p className="text-white/90 text-xs sm:text-sm font-bold tracking-wider uppercase mb-0.5">
                  Special Offer
                </p>
                <p className="text-white/80 text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
                  UP TO
                </p>
                <p className="text-white font-extrabold text-2xl sm:text-4xl tracking-tight leading-none my-1">
                  20% OFF
                </p>
                <p className="text-white/90 text-[10px] sm:text-[11px] font-medium mt-1 bg-black/25 px-2.5 py-1 rounded-full border border-white/15">
                  Tap Code: <span className="font-bold text-white underline">SIGMA20</span> 📋
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────── Chef's Special Combos Section ────────────────────────
function ChefSpecialCombosSection() {
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();

  const handleAddCombo = (combo: ComboItem) => {
    addItem({
      id: combo.id,
      name: combo.name,
      description: combo.description,
      longDescription: combo.description,
      category: 'Burgers',
      price: combo.price,
      originalPrice: combo.originalPrice,
      rating: combo.rating,
      reviewCount: combo.reviewCount,
      image: combo.image,
      emoji: combo.emoji.slice(0, 2),
      badge: combo.badge,
      isBestSeller: true,
      isVeg: true,
      spiceLevel: 1,
      ingredients: combo.items,
      isAvailable: true,
    });
    toast.success(`${combo.name} added to cart! 🛒`);
  };

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="py-12 sm:py-20 relative bg-[#080808] border-t border-white/5 content-auto"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,166,35,0.12)] border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
              <Flame size={13} className="text-[#f5a623]" />
              <span>Chef's Special Offers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Value <span className="text-[#f5a623]">Combos & Platters</span>
            </h2>
            <p className="text-white/45 text-xs sm:text-base mt-1">
              Curated hungry packs designed for maximum flavor and mega savings.
            </p>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-[#f5a623] hover:text-[#ffd080] font-bold text-xs sm:text-sm self-start sm:self-end group cursor-pointer"
          >
            <span>Explore All Combos</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
          </button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {COMBOS.map((combo) => (
            <motion.div
              key={combo.id}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="rounded-2xl sm:rounded-3xl overflow-hidden glass border border-white/8 hover:border-[rgba(245,166,35,0.35)] transition-all duration-300 flex flex-col justify-between group bg-[#0e0e0e] shadow-xl"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-black/40" />

                  {/* Saving Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#f5a623] text-[#070707] font-black text-[10px] sm:text-xs shadow-md">
                      {combo.badge}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1">
                    <Star size={11} fill="#f5a623" className="text-[#f5a623]" />
                    <span>{combo.rating}</span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span className="text-lg sm:text-xl">{combo.emoji}</span>
                    <h3 className="text-white font-extrabold text-base sm:text-lg leading-tight group-hover:text-[#f5a623] transition-colors">
                      {combo.name}
                    </h3>
                  </div>
                  <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                    {combo.description}
                  </p>

                  <div className="space-y-1 mb-4 sm:mb-6 pt-2.5 sm:pt-3 border-t border-white/5">
                    {combo.items.map((it) => (
                      <div key={it} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-white/70">
                        <Check size={12} className="text-[#f5a623] shrink-0" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-auto">
                <div>
                  <span className="text-white/35 line-through text-[11px] sm:text-xs mr-1.5">₹{combo.originalPrice}</span>
                  <span className="text-xl sm:text-2xl font-black text-[#f5a623]">₹{combo.price}</span>
                </div>
                <button
                  onClick={() => handleAddCombo(combo)}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-bold text-xs sm:text-sm shadow-md hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] hover:scale-105 transition-all cursor-pointer btn-shine"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Add Combo</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────── Why Choose Us (2x2 Grid on Mobile, 4 Cards on Desktop) ─
function WhyChooseUsSection() {
  const features = [
    { icon: Leaf, title: 'Fresh Ingredients', desc: 'Prepared fresh daily, never compromised.' },
    { icon: Shield, title: 'Hygienic Prep', desc: 'Highest safety and cleanliness standards.' },
    { icon: Smile, title: 'Great Taste', desc: 'Flavors crafted with authentic passion.' },
    { icon: Star, title: 'Affordable Prices', desc: 'Premium food at budget-friendly rates.' },
  ];

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-12 sm:py-20 relative bg-[#090909] border-t border-white/5 content-auto"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-1.5">Our Promise</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Choose <span className="text-[#f5a623]">Sigma Foods?</span>
          </h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={cardVariant}
              whileHover={{ y: -6, borderColor: 'rgba(245,166,35,0.35)' }}
              className="glass rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-white/8 transition-all group bg-[#0c0c0c]"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#f5a623] transition-colors">
                <Icon size={18} className="text-[#f5a623] group-hover:text-[#070707] transition-colors sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-white font-bold text-xs sm:text-base mb-1">{title}</h3>
              <p className="text-white/45 text-[10px] sm:text-xs leading-relaxed line-clamp-3 sm:line-clamp-none">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────── Google Reviews Section with Mobile Touch Swipe ────────
function GoogleReviewsSection() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(p => ({ ...p, [id]: !p[id] }));
  };

  return (
    <motion.section
      id="reviews"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-12 sm:py-20 relative bg-[#070707] border-t border-white/5 content-auto"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-8 sm:mb-10 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0 cursor-pointer"
            >
              <span className="font-extrabold text-xl sm:text-2xl" style={{ color: '#4285F4' }}>G</span>
            </motion.div>
            <div>
              <h2 className="text-lg sm:text-3xl font-extrabold text-white">Google Reviews</h2>
              <p className="text-white/45 text-xs hidden xs:block">Real people. Real experiences.</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 mb-0.5">
              <span className="text-white font-extrabold text-base sm:text-xl">5.0</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="text-[#f5a623] sm:w-3.5 sm:h-3.5" fill="#f5a623" />
                ))}
              </div>
            </div>
            <a
              href="https://g.co/kgs/sigma-foods"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5a623] hover:underline text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1"
            >
              13+ Reviews →
            </a>
          </div>
        </div>

        {/* Swipeable on Mobile, 3-Columns on Desktop */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex overflow-x-auto scroll-touch-x snap-x -mx-3 px-3 pb-3 md:grid md:grid-cols-3 gap-3 sm:gap-6"
        >
          {REVIEWS.map((r) => (
            <motion.div
              key={r.id}
              variants={cardVariant}
              whileHover={{ y: -6, borderColor: 'rgba(245,166,35,0.3)' }}
              transition={{ duration: 0.25 }}
              className="snap-card shrink-0 w-[84vw] max-w-[320px] md:w-auto glass rounded-2xl p-4 sm:p-5 border border-white/6 transition-all flex flex-col justify-between bg-[#0e0e0e]"
            >
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-white font-bold text-xs sm:text-sm truncate">{r.name}</p>
                    <p className="text-white/40 text-[10px] sm:text-[11px] flex items-center gap-1">
                      <span className="text-blue-400 font-bold">G</span> Google • {r.date}
                    </p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-2.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="text-[#f5a623] sm:w-3 sm:h-3" fill="#f5a623" />
                  ))}
                </div>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-2.5">
                  {expanded[r.id] ? r.fullText : r.text}
                </p>
              </div>

              <button
                onClick={() => toggleExpand(r.id)}
                className="text-[#f5a623] hover:underline text-[11px] sm:text-xs font-semibold text-left self-start mt-1 cursor-pointer"
              >
                {expanded[r.id] ? 'Show less' : 'Read more'}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────── About & At A Glance Section ───────────────────────────
function AboutAndGlanceSection() {
  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-12 sm:py-20 relative bg-[#090909] border-t border-white/5 content-auto"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
          {/* Left: Cafe Storefront Photo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-4 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/8 relative group min-h-[200px] sm:min-h-[300px]"
          >
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
              alt="Sigma Foods Cafe Storefront at Rohini Sector 2"
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
            />
            {/* Glowing neon logo overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(245,166,35,0.2)', '0 0 35px rgba(245,166,35,0.4)', '0 0 20px rgba(245,166,35,0.2)'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-black/80 backdrop-blur-md border border-[#f5a623]/40 text-center"
              >
                <p className="text-white font-extrabold text-lg sm:text-xl tracking-tight">Sigma <span className="text-[#f5a623]">Foods</span></p>
                <p className="text-[#f5a623]/80 text-[9px] sm:text-[10px] tracking-widest uppercase">More Than Food, It's an Experience</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Middle: About Description */}
          <div className="lg:col-span-5 glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/8 flex flex-col justify-between bg-[#0c0c0c]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-xs font-semibold mb-3 sm:mb-4">
                <span>⭐</span> About Us
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-1.5 sm:mb-2">
                Sigma <span className="text-[#f5a623]">Foods</span>
              </h2>
              <p className="text-[#f5a623] text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                More Than Food, It's an Experience
              </p>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                Sigma Foods is a modern food outlet dedicated to serving delicious, hygienic, and freshly prepared vegetarian snacks and fast food at affordable prices. We specialize in momos, burgers, pasta, cigar rolls, sandwiches, fries, and refreshing beverages in Rohini Sector 2.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="self-start">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#f5a623] hover:bg-[#e09618] text-[#070707] font-bold text-xs sm:text-sm transition-colors shadow-md btn-shine"
              >
                Learn More <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </div>

          {/* Right: At A Glance Card with Updated Brand Address */}
          <div className="lg:col-span-3 glass rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-white/8 flex flex-col justify-between bg-[#0c0c0c]">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-white/5">
                <span className="text-[#f5a623]">⭐</span>
                <h3 className="text-white font-extrabold text-xs sm:text-base">At a glance</h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-4">
                {/* What we do */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <span className="text-xs sm:text-sm">☕</span>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] sm:text-[11px]">What we do</p>
                    <p className="text-white font-semibold text-xs sm:text-sm">Cafe</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <span className="text-xs sm:text-sm">⭐</span>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] sm:text-[11px]">Rating</p>
                    <p className="text-white font-semibold text-xs sm:text-sm">5.0 / 5 (13+)</p>
                  </div>
                </div>

                {/* Location */}
                <div className="col-span-2 lg:col-span-1 flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-[#f5a623] sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] sm:text-[11px]">Location</p>
                    <p className="text-white/80 font-medium text-[11px] sm:text-xs leading-snug">
                      Shop No. 4, Flat N 289, Pocket-6-2, Sector-2, Rohini, Delhi-110085
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="col-span-2 lg:col-span-1 flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <Clock size={14} className="text-[#f5a623] sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] sm:text-[11px]">Business hours</p>
                    <p className="text-white/80 font-medium text-[11px] sm:text-xs">Mon-Sat: 11am-11pm • Sun: 9am-11pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Rating in glance */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-extrabold text-[#4285F4]">G</span>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-xs sm:text-sm">5.0 / 5</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="text-[#f5a623]" fill="#f5a623" />
                    ))}
                  </div>
                </div>
                <p className="text-white/40 text-[9px] sm:text-[10px]">13+ Google reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ────── Frequently Asked Questions Section ───────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is all food served at Sigma Foods 100% Pure Vegetarian?",
      a: "Yes, absolutely! Sigma Foods is a strictly 100% vegetarian cafe. All dishes, sauces, dips, and gravies are prepared with fresh vegetarian ingredients under strict hygiene standards in Rohini Sector 2."
    },
    {
      q: "What is your delivery coverage & average delivery time?",
      a: "We deliver across Sector 1, Sector 2, Sector 3, Sector 4, Sector 5, Sector 6, Sector 7, Sector 8, and surrounding neighborhoods of Rohini, Delhi. Orders are typically delivered hot & fresh within 25 to 35 minutes."
    },
    {
      q: "What payment methods are supported for home delivery?",
      a: "We support Cash on Delivery (COD), instant UPI via QR code (Google Pay, PhonePe, Paytm), and major Credit/Debit Cards. You can select your preferred payment mode during checkout."
    },
    {
      q: "Do you take party packs or bulk snacks orders for birthdays?",
      a: "Yes! We specialize in delicious party platters, bulk burger & momos packs, and beverage combos for office events, get-togethers, and birthday parties. Call us directly at +91 7838853490 for custom discounts."
    },
  ];

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-12 sm:py-20 relative bg-[#070707] border-t border-white/5 content-auto"
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,166,35,0.12)] border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <HelpCircle size={13} className="text-[#f5a623]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="text-[#f5a623]">Questions</span>
          </h2>
          <p className="text-white/45 text-xs sm:text-base mt-1.5">
            Everything you need to know about our food, delivery, and quality.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[rgba(255,255,255,0.04)] border-[rgba(245,166,35,0.4)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-[#0c0c0c] border-white/8 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="font-bold text-white text-xs sm:text-base leading-snug">{faq.q}</span>
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-[#f5a623] text-[#070707] rotate-180' : 'bg-white/5 text-white/50'
                    }`}
                  >
                    <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                  </div>
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-white/60 text-xs sm:text-sm leading-relaxed border-t border-white/5"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

// ────── Instagram Community Showcase (3 Columns on Mobile) ───
function InstagramShowcaseSection() {
  const photos = [
    { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', caption: 'Gourmet Cheese Burgers' },
    { url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', caption: 'Hot Steamed Veg Momos' },
    { url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80', caption: 'Creamy Alfredo Pasta' },
    { url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80', caption: 'Peri Peri Crisp Fries' },
    { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', caption: 'Crispy Veg Cigar Rolls' },
    { url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', caption: 'Refreshing Chilled Beverages' },
  ];

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="py-10 sm:py-16 bg-[#090909] border-t border-white/5 content-auto"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,166,35,0.12)] border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <InstagramIcon size={13} className="text-[#f5a623]" />
            <span>@sigmafoodsofficial</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            Follow Our <span className="text-[#f5a623]">Foodie Journey</span>
          </h2>
          <p className="text-white/45 text-[11px] sm:text-sm mt-0.5">
            Tag us in your photos to get featured on our feed!
          </p>
        </div>

        {/* 3 Columns on Phone, 6 on Desktop */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {photos.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.03 }}
              className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer border border-white/8 shadow-lg"
            >
              <img
                src={p.url}
                alt={p.caption}
                className="w-full h-full object-cover group-hover:scale-112 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-center">
                <InstagramIcon size={18} className="text-[#f5a623] mb-1 sm:w-6 sm:h-6" />
                <p className="text-white font-bold text-[10px] sm:text-xs line-clamp-1">{p.caption}</p>
                <p className="text-[#f5a623] text-[9px] mt-0.5 font-semibold">#SigmaFoods</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ────── Visit Us or Order Now (Bottom Banner) ─────────────────
function VisitOrOrderBanner() {
  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-8 sm:py-12 px-3 sm:px-6 bg-[#070707] content-auto"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          whileHover={{ borderColor: 'rgba(245,166,35,0.3)' }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-10 border border-white/8 flex flex-col lg:flex-row items-center justify-between gap-6 transition-colors"
          style={{
            background: 'linear-gradient(135deg, #0f0f0f 0%, #15130b 100%)',
          }}
        >
          {/* Left: Decorative + Text */}
          <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] items-center justify-center shrink-0 text-2xl">
              🌿
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-[11px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
                <span>⭐</span> Get in Touch
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white">
                Visit Us or Order Now
              </h3>
              <p className="text-white/45 text-xs sm:text-sm mt-0.5">
                We're just around the corner in Sector-2, Rohini, Delhi.
              </p>
            </div>
          </div>

          {/* Center: Phone & Address */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Phone */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="tel:+917838853490"
              className="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 hover:border-[rgba(245,166,35,0.3)] transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center group-hover:bg-[#f5a623] transition-colors shrink-0">
                <Phone size={15} className="text-[#f5a623] group-hover:text-[#070707]" />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">+91 7838853490</p>
                <p className="text-white/40 text-[10px]">Call us anytime</p>
              </div>
            </motion.a>

            {/* Location */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://maps.google.com/?q=Sector+2+Rohini+Delhi+110085"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 hover:border-[rgba(245,166,35,0.3)] transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center group-hover:bg-[#f5a623] transition-colors shrink-0">
                <MapPin size={15} className="text-[#f5a623] group-hover:text-[#070707]" />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm truncate max-w-[190px]">
                  Shop No. 4, Rohini Sector-2
                </p>
                <p className="text-[#f5a623] text-[10px] font-semibold flex items-center gap-1">
                  Get Directions →
                </p>
              </div>
            </motion.a>

            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="block px-5 py-3 rounded-xl sm:rounded-2xl bg-[#f5a623] hover:bg-[#e09618] text-[#070707] font-extrabold text-xs sm:text-sm transition-colors text-center shadow-lg btn-shine whitespace-nowrap"
              >
                Contact Us →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────── Floating WhatsApp Quick Order Button ─────────────────
function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/917838853490?text=Hi%20Sigma%20Foods%2C%20I%20want%20to%20place%20an%20order!"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-8 right-3 sm:right-6 z-40 flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.6)] hover:scale-105 transition-all group"
      aria-label="Order on WhatsApp"
    >
      <MessageCircle size={18} fill="white" className="text-white" />
      <span className="hidden sm:inline font-bold">Quick WhatsApp Order</span>
    </a>
  );
}

// ────── Main Home Page ────────────────────────────────────────
export default function HomePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div className="bg-[#070707] min-h-screen text-white overflow-hidden">
      {/* 1. Hero Section with 3D Parallax Tilt, Floating Ingredients, and Scroll Down Indicator */}
      <HeroSection onWatchVideo={() => setVideoModalOpen(true)} />

      {/* 2. Popular Categories Enclosed in Floating Glass Rounded Container */}
      <PopularCategoriesSection />

      {/* 3. Best Sellers with Quick View & Add to Cart */}
      <BestSellersSection />

      {/* 4. Value Combos & Platters */}
      <ChefSpecialCombosSection />

      {/* 5. Promotional Banner with 20% OFF Red Stamp */}
      <PromotionalBanner />

      {/* 6. Why Choose Us (4 Cards) */}
      <WhyChooseUsSection />

      {/* 7. Google Reviews with Stagger Animation */}
      <GoogleReviewsSection />

      {/* 8. About Us & At A Glance with exact Address */}
      <AboutAndGlanceSection />

      {/* 9. Frequently Asked Questions (FAQ) */}
      <FAQSection />

      {/* 10. Instagram Community Foodie Showcase */}
      <InstagramShowcaseSection />

      {/* 11. Bottom Visit/Order Banner */}
      <VisitOrOrderBanner />

      {/* 12. Floating WhatsApp Quick Order Button */}
      <FloatingWhatsAppButton />

      {/* Video Experience Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setVideoModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-3xl bg-[#0e0e0e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl z-10"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/8">
              <div className="flex items-center gap-2">
                <span className="text-[#f5a623]">▶</span>
                <p className="text-white font-bold text-sm">Sigma Foods Experience</p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
                alt="Sigma Foods Video Experience"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-full bg-[#f5a623] flex items-center justify-center shadow-[0_0_40px_rgba(245,166,35,0.6)] mb-4 cursor-pointer"
                >
                  <Play size={24} fill="#070707" className="text-[#070707] ml-1" />
                </motion.div>
                <h3 className="text-white font-extrabold text-2xl mb-1">
                  More Than Food, It's an Experience
                </h3>
                <p className="text-white/60 text-sm max-w-md">
                  Fresh, hygienic, and deliciously prepared vegetarian street food and cafe snacks in Rohini Sector 2.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
