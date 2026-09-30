import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  motion, useMotionValue, useSpring, useTransform, type Variants
} from 'framer-motion';
import {
  Star, ArrowRight, MapPin, Phone, Clock, Leaf, Shield,
  Smile, Play, X, Crown, Sparkles, Flame, Eye, Utensils,
  ChevronDown, Check
} from 'lucide-react';
import {
  BEST_SELLERS, CATEGORIES, CATEGORY_IMAGES, CATEGORY_EMOJIS, CATEGORY_COUNTS, REVIEWS, type Category
} from '../data/products';
import ProductCard from '../components/ProductCard';
import { useUIStore } from '../store';

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
      className="relative min-h-[96vh] flex items-center overflow-hidden pt-28 pb-12 perspective-1500"
      style={{
        background: 'radial-gradient(ellipse at 65% 35%, rgba(245,166,35,0.09) 0%, #070707 68%)',
      }}
    >
      {/* Background Layer 1: Ambient Restaurant Glow & Lighting */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute top-1/4 right-1/4 w-[650px] h-[650px] rounded-full blur-[140px] opacity-25 pointer-events-none"
        style-bg={{
          background: 'radial-gradient(circle, #f5a623 0%, #ff6b35 45%, transparent 70%)',
        }}
      />
      <div className="absolute top-12 left-10 w-96 h-96 rounded-full blur-[120px] opacity-10 bg-[#f5a623] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & Trust Badges */}
          <div className="lg:col-span-6 z-20">
            {/* Small Badge matching screenshot: Fresh • Hygienic • Vegetarian */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-white/10 mb-6 backdrop-blur-md shadow-lg"
            >
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <Leaf size={12} className="text-green-400" />
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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-6 tracking-tight">
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
              className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-xl"
            >
              Sigma Foods is a modern food outlet dedicated to serving delicious, hygienic, and freshly prepared vegetarian snacks and fast food at affordable prices.
            </motion.p>

            {/* CTA Buttons matching screenshot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/menu"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(245,166,35,0.4)] hover:shadow-[0_0_40px_rgba(245,166,35,0.6)] btn-shine"
                >
                  Explore Menu <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onWatchVideo}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(245,166,35,0.4)] text-white font-semibold text-sm sm:text-base transition-all cursor-pointer shadow-lg"
              >
                <div className="w-6 h-6 rounded-full bg-[#f5a623] flex items-center justify-center text-[#070707]">
                  <Play size={11} fill="#070707" className="ml-0.5" />
                </div>
                <span>Watch Video</span>
              </motion.button>
            </motion.div>

            {/* 3 Trust Features in a horizontal row matching screenshot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg"
            >
              {[
                { icon: Leaf, title: 'Fresh Ingredients', sub: 'Always Fresh', color: '#4ade80' },
                { icon: Shield, title: 'Hygienic Preparation', sub: 'Quality & Serving', color: '#f5a623' },
                { icon: Star, title: 'Great Taste', sub: 'Every Time', color: '#f5a623' },
              ].map(({ icon: Icon, title, sub, color }) => (
                <div
                  key={title}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-white/8 hover:border-[rgba(245,166,35,0.3)] transition-all flex flex-col justify-between"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold leading-tight">{title}</p>
                    <p className="text-white/40 text-[11px] mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: 3D Food Composition Masterpiece */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[540px]">
            {/* 3D Composition Frame with Mouse Tilt */}
            <motion.div
              style={{
                x: foodX,
                y: foodY,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] aspect-[4/3] rounded-3xl preserve-3d"
            >
              {/* Platter drop shadow */}
              <div
                className="absolute inset-x-8 bottom-0 h-16 bg-black/95 blur-2xl rounded-full"
                style={{ transform: 'translateZ(-40px)' }}
              />

              {/* Main 3D Composition Base Platter (Burger + Fries + Momos + Iced Drink) */}
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden border border-white/12 shadow-[0_30px_80px_rgba(0,0,0,0.9)] group bg-[#0e0e0e]"
                style={{ transform: 'translateZ(10px)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1200&q=80"
                  alt="Sigma Foods 3D Gourmet Burger, Fries and Momos Spread"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette & Backglow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/35 pointer-events-none" />
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />

                {/* Rising steam over burger and momos */}
                <div className="absolute bottom-28 left-1/3 w-16 h-28 pointer-events-none opacity-40 animate-steam">
                  <div className="w-full h-full bg-gradient-to-t from-white/35 to-transparent blur-md rounded-full" />
                </div>

                {/* Golden Neon Cursive Calligraphy: "Good Food Good Vibes!" matching screenshot */}
                <motion.div
                  style={{ transform: 'translateZ(45px)' }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none select-none z-20 text-right"
                >
                  <p
                    className="text-xl sm:text-2xl font-bold tracking-wide italic text-[#f5a623] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Good Food
                  </p>
                  <p
                    className="text-lg sm:text-xl font-bold tracking-wide italic text-[#f5a623]/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] flex items-center justify-end gap-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Good Vibes! ✨
                  </p>
                </motion.div>

                {/* Food Spread Badges */}
                <div
                  className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-wrap gap-2 z-20"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                    <span>🍔</span> Gourmet Burger
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                    <span>🍟</span> Crispy Fries
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                    <span>🥟</span> Veg Momos
                  </span>
                </div>
              </div>

              {/* Layer 2: Floating 3D Ingredients (Tomato, Onion, Cheese, Leaves) */}
              {/* Floating Tomato Slice (top-left) */}
              <motion.div
                style={{
                  x: ingX,
                  y: ingY,
                  transform: 'translateZ(55px)',
                }}
                animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 sm:-left-8 text-4xl sm:text-5xl filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.7)] pointer-events-none select-none z-30"
              >
                🍅
              </motion.div>

              {/* Floating Purple Onion Ring (top-center) */}
              <motion.div
                style={{
                  x: ingX,
                  y: ingY,
                  transform: 'translateZ(65px)',
                }}
                animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute -top-8 left-1/3 text-3xl sm:text-4xl filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.65)] pointer-events-none select-none z-30"
              >
                🧅
              </motion.div>

              {/* Floating Cheese Wedge (top-right) */}
              <motion.div
                style={{
                  x: ingX,
                  y: ingY,
                  transform: 'translateZ(60px)',
                }}
                animate={{ y: [0, -7, 0], rotate: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute -top-4 right-1/4 text-3xl sm:text-4xl filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.65)] pointer-events-none select-none z-30"
              >
                🧀
              </motion.div>

              {/* Floating Fresh Basil Leaf (mid-left) */}
              <motion.div
                style={{
                  x: fgX,
                  y: fgY,
                  transform: 'translateZ(75px)',
                }}
                animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -left-8 text-3xl sm:text-4xl filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] pointer-events-none select-none z-30"
              >
                🌿
              </motion.div>

              {/* Floating Chili Slice (bottom-left) */}
              <motion.div
                style={{
                  x: fgX,
                  y: fgY,
                  transform: 'translateZ(70px)',
                }}
                animate={{ y: [0, -8, 0], rotate: [0, 12, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
                className="absolute -bottom-6 left-1/4 text-2xl sm:text-3xl filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.65)] pointer-events-none select-none z-30"
              >
                🌶️
              </motion.div>

              {/* Floating 3D Badge 1: 5.0 Star Rating */}
              <motion.div
                style={{ transform: 'translateZ(50px)' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.08 }}
                className="absolute -top-5 -left-4 px-4 py-2 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 z-30 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center shadow-md">
                  <Star size={16} fill="#070707" className="text-[#070707]" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-xs leading-tight">5.0 Star Rating</p>
                  <p className="text-[#f5a623] text-[10px] font-semibold leading-tight">Google Verified</p>
                </div>
              </motion.div>

              {/* Floating 3D Badge 2: 100% Vegetarian */}
              <motion.div
                style={{ transform: 'translateZ(55px)' }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                whileHover={{ scale: 1.08 }}
                className="absolute -bottom-5 -right-4 px-4 py-2 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 z-30 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                  <Leaf size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-xs leading-tight">100% Vegetarian</p>
                  <p className="text-green-400 text-[10px] font-semibold leading-tight">Sector 2 Rohini</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Far Right: Animated Scroll Down Indicator matching screenshot */}
      <div className="hidden xl:flex flex-col items-center absolute right-6 top-1/2 -translate-y-1/2 z-20">
        {/* Mouse outline icon */}
        <motion.div
          onClick={scrollToCategories}
          className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1 cursor-pointer hover:border-[#f5a623] transition-colors"
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
          className="text-[10px] font-bold text-white/40 tracking-widest uppercase my-3 select-none"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll Down
        </span>
        {/* Glowing vertical line with moving golden dot */}
        <div className="w-[1.5px] h-14 bg-white/10 relative overflow-hidden rounded-full">
          <motion.div
            animate={{ y: [-15, 60] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-5 bg-gradient-to-b from-transparent via-[#f5a623] to-transparent shadow-[0_0_8px_#f5a623]"
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
      className="py-12 px-4 sm:px-6 relative bg-[#070707]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Floating Glass Rounded Container matching screenshot */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[rgba(18,18,18,0.7)] backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.75)]">
          {/* Header inside container with Cloche cover icon */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-white/6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(245,166,35,0.12)] border border-[rgba(245,166,35,0.25)] flex items-center justify-center shrink-0">
                <Utensils size={22} className="text-[#f5a623]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Popular <span className="text-[#f5a623]">Categories</span>
                </h2>
                <p className="text-white/45 text-xs sm:text-sm mt-0.5">
                  Explore our wide range of delicious vegetarian snacks and fast food.
                </p>
              </div>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-[#f5a623] hover:text-[#ffd080] font-bold text-xs sm:text-sm transition-colors shrink-0 group self-start sm:self-end"
            >
              <span>View All Menu</span>
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          {/* 7 Category Cards Row matching screenshot */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex overflow-x-auto scroll-touch-x pb-3 -mx-2 px-2 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4 snap-x"
          >
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat}
                variants={cardVariant}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="snap-card shrink-0 w-[145px] xs:w-[160px] sm:w-auto"
              >
                <Link to={`/menu?category=${cat}`} className="block group">
                  <div className="rounded-2xl p-2.5 bg-[rgba(255,255,255,0.03)] border border-white/8 hover:border-[rgba(245,166,35,0.45)] transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    {/* Food Photo */}
                    <div className="aspect-square rounded-xl overflow-hidden bg-black/60 relative mb-2.5">
                      <img
                        src={CATEGORY_IMAGES[cat]}
                        alt={cat}
                        className="w-full h-full object-cover group-hover:scale-112 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Bottom Pill: [Icon] Category Name + Item count + Arrow */}
                    <div className="py-2 px-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:bg-[#f5a623] group-hover:border-[#f5a623] transition-colors flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs shrink-0">{CATEGORY_EMOJIS[cat]}</span>
                          <p className="text-white group-hover:text-[#070707] font-bold text-xs truncate transition-colors">
                            {cat}
                          </p>
                        </div>
                        <p className="text-white/40 group-hover:text-[#070707]/75 text-[10px] pl-4 transition-colors">
                          {CATEGORY_COUNTS[cat]} Items
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-[#070707]/15 flex items-center justify-center shrink-0 ml-1">
                        <ArrowRight
                          size={11}
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
      className="py-20 relative bg-[#090909] border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Crown size={22} className="text-[#f5a623]" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Best Sellers
              </h2>
            </div>
            <p className="text-white/45 text-sm">Most loved. Most ordered.</p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-[#f5a623] hover:text-[#ffd080] font-semibold text-sm transition-colors shrink-0 group"
          >
            <span>View All Menu</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-16 px-4 sm:px-6 bg-[#070707]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          whileHover={{ borderColor: 'rgba(245,166,35,0.35)' }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-14 border border-[rgba(245,166,35,0.2)] transition-colors"
          style={{
            background: 'linear-gradient(135deg, #0e0e0e 0%, #15120a 50%, #0e0e0e 100%)',
          }}
        >
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-[100px] bg-[#f5a623]/15 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
                Hungry? <span className="text-[#f5a623]">We've Got You Covered.</span>
              </h2>
              <p className="text-white/60 text-base mb-8">
                Delicious food. Great prices. Zero compromise.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/menu')}
                className="px-8 py-3.5 rounded-full bg-[#f5a623] hover:bg-[#e09618] text-[#070707] font-extrabold text-sm sm:text-base transition-colors shadow-[0_0_30px_rgba(245,166,35,0.35)] btn-shine inline-flex items-center gap-2 cursor-pointer"
              >
                ORDER NOW <ArrowRight size={17} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Center: Food Visual */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-64 h-52 sm:w-80 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious food combo"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </motion.div>
            </div>

            {/* Right: Red Stamp Special Offer matching screenshot */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <motion.div
                animate={{ rotate: [-3, -1, -3], scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.06, rotate: 0 }}
                className="px-6 py-5 rounded-2xl text-center shadow-2xl border border-red-500/30 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #c92a2a 0%, #a61e1e 100%)',
                }}
              >
                <p className="text-white/90 text-sm font-bold tracking-wider uppercase mb-1">
                  Special Offer
                </p>
                <p className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                  UP TO
                </p>
                <p className="text-white font-extrabold text-3xl sm:text-4xl tracking-tight leading-none my-1">
                  20% OFF
                </p>
                <p className="text-white/80 text-[11px] font-medium mt-1">
                  Use Code: <span className="font-bold text-white underline">SIGMA20</span>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────── Why Choose Us (4 Cards) ──────────────────────────────
function WhyChooseUsSection() {
  const features = [
    { icon: Leaf, title: 'Fresh Ingredients', desc: 'Quality ingredients prepared fresh daily, never compromised.' },
    { icon: Shield, title: 'Hygienic Preparation', desc: 'Clean, hygienic food preparation following the highest standards.' },
    { icon: Smile, title: 'Great Taste', desc: 'Delicious flavors crafted with passion for every craving.' },
    { icon: Star, title: 'Affordable Prices', desc: 'Great food without compromising your budget.' },
  ];

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 relative bg-[#090909] border-t border-white/5 content-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-2">Our Promise</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Choose <span className="text-[#f5a623]">Sigma Foods?</span>
          </h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={cardVariant}
              whileHover={{ y: -6, borderColor: 'rgba(245,166,35,0.35)' }}
              className="glass rounded-2xl p-6 border border-white/8 transition-all group bg-[#0c0c0c]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center mb-4 group-hover:bg-[#f5a623] transition-colors">
                <Icon size={22} className="text-[#f5a623] group-hover:text-[#070707] transition-colors" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-white/45 text-xs sm:text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────── Google Reviews Section with Stagger Animation ─────────
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
      className="py-20 relative bg-[#070707] border-t border-white/5 content-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0 cursor-pointer"
            >
              <span className="font-extrabold text-2xl" style={{ color: '#4285F4' }}>G</span>
            </motion.div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Google Reviews</h2>
              <p className="text-white/45 text-sm">Real people. Real experiences.</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-center sm:justify-end gap-2 mb-1">
              <span className="text-white font-extrabold text-xl">5.0</span>
              <span className="text-white/40 text-sm">/5</span>
              <div className="flex gap-0.5 ml-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="text-[#f5a623]" fill="#f5a623" />
                ))}
              </div>
            </div>
            <div className="flex items-center sm:justify-end gap-3">
              <p className="text-white/40 text-xs">Based on 13+ Google reviews</p>
              <a
                href="https://g.co/kgs/sigma-foods"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f5a623] hover:underline text-xs font-semibold inline-flex items-center gap-1"
              >
                Read all reviews →
              </a>
            </div>
          </div>
        </div>

        {/* 3 Review Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {REVIEWS.map((r) => (
            <motion.div
              key={r.id}
              variants={cardVariant}
              whileHover={{ y: -6, borderColor: 'rgba(245,166,35,0.3)' }}
              transition={{ duration: 0.25 }}
              className="glass rounded-2xl p-5 border border-white/6 transition-all flex flex-col justify-between bg-[#0e0e0e]"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{r.name}</p>
                    <p className="text-white/40 text-[11px] flex items-center gap-1">
                      <span className="text-blue-400 font-bold">G</span> Google • {r.date}
                    </p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="text-[#f5a623]" fill="#f5a623" />
                  ))}
                </div>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-3">
                  {expanded[r.id] ? r.fullText : r.text}
                </p>
              </div>

              <button
                onClick={() => toggleExpand(r.id)}
                className="text-[#f5a623] hover:underline text-xs font-semibold text-left self-start mt-2 cursor-pointer"
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
      className="py-20 relative bg-[#090909] border-t border-white/5 content-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Cafe Storefront Photo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-4 rounded-3xl overflow-hidden border border-white/8 relative group min-h-[300px]"
          >
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
              alt="Sigma Foods Cafe Storefront at Rohini Sector 2"
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
            />
            {/* Glowing neon logo overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6">
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(245,166,35,0.2)', '0 0 35px rgba(245,166,35,0.4)', '0 0 20px rgba(245,166,35,0.2)'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="px-5 py-3 rounded-2xl bg-black/80 backdrop-blur-md border border-[#f5a623]/40 text-center"
              >
                <p className="text-white font-extrabold text-xl tracking-tight">Sigma <span className="text-[#f5a623]">Foods</span></p>
                <p className="text-[#f5a623]/80 text-[10px] tracking-widest uppercase">More Than Food, It's an Experience</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Middle: About Description */}
          <div className="lg:col-span-5 glass rounded-3xl p-7 sm:p-8 border border-white/8 flex flex-col justify-between bg-[#0c0c0c]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-xs font-semibold mb-4">
                <span>⭐</span> About Us
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Sigma <span className="text-[#f5a623]">Foods</span>
              </h2>
              <p className="text-[#f5a623] text-sm font-semibold mb-4">
                More Than Food, It's an Experience
              </p>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6">
                Sigma Foods is a modern food outlet dedicated to serving delicious, hygienic, and freshly prepared vegetarian snacks and fast food at affordable prices. We specialize in a wide range of flavorful dishes, including momos, burgers, pasta, cigar rolls, sandwiches, fries, and refreshing beverages, all made with high-quality ingredients and a passion for great taste.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="self-start">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5a623] hover:bg-[#e09618] text-[#070707] font-bold text-sm transition-colors shadow-md btn-shine"
              >
                Learn More <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </div>

          {/* Right: At A Glance Card with Updated Brand Address */}
          <div className="lg:col-span-3 glass rounded-3xl p-6 sm:p-7 border border-white/8 flex flex-col justify-between bg-[#0c0c0c]">
            <div>
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/5">
                <span className="text-[#f5a623]">⭐</span>
                <h3 className="text-white font-extrabold text-sm sm:text-base">At a glance</h3>
              </div>

              <div className="space-y-4">
                {/* What we do */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <span className="text-sm">☕</span>
                  </div>
                  <div>
                    <p className="text-white/40 text-[11px]">What we do</p>
                    <p className="text-white font-semibold text-xs sm:text-sm">Cafe</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <MapPin size={15} className="text-[#f5a623]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[11px]">Location</p>
                    <p className="text-white/80 font-medium text-xs leading-snug">
                      Shop No. 4, Flat N 289, Pocket-6-2, Sector-2, Rohini, Delhi-110085
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center shrink-0">
                    <Clock size={15} className="text-[#f5a623]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[11px]">Business hours</p>
                    <p className="text-white/80 font-medium text-xs">Monday-Saturday: 11am-11pm</p>
                    <p className="text-white/80 font-medium text-xs">Sunday: 9am-11pm</p>
                    <Link to="/contact" className="text-[#f5a623] hover:underline text-[11px] font-semibold mt-0.5 inline-block">
                      View all days
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Rating in glance */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
              <span className="text-2xl font-extrabold text-[#4285F4]">G</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-sm">5.0</span>
                  <span className="text-white/40 text-xs">/5</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="text-[#f5a623]" fill="#f5a623" />
                    ))}
                  </div>
                </div>
                <p className="text-white/40 text-[10px]">Based on 13+ Google reviews</p>
              </div>
            </div>
          </div>
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
      className="py-12 px-4 sm:px-6 bg-[#070707] content-auto"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          whileHover={{ borderColor: 'rgba(245,166,35,0.3)' }}
          className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-white/8 flex flex-col lg:flex-row items-center justify-between gap-6 transition-colors"
          style={{
            background: 'linear-gradient(135deg, #0f0f0f 0%, #15130b 100%)',
          }}
        >
          {/* Left: Decorative + Text */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] items-center justify-center shrink-0 text-3xl">
              🌿
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-xs font-semibold mb-2">
                <span>⭐</span> Get in Touch
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Visit Us or Order Now
              </h3>
              <p className="text-white/45 text-xs sm:text-sm mt-1">
                We're just around the corner in Rohini, Delhi.
              </p>
            </div>
          </div>

          {/* Center: Phone & Address */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Phone */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="tel:+917838853490"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-[rgba(245,166,35,0.3)] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center group-hover:bg-[#f5a623] transition-colors">
                <Phone size={16} className="text-[#f5a623] group-hover:text-[#070707]" />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">+91 7838853490</p>
                <p className="text-white/40 text-[11px]">Call us anytime</p>
              </div>
            </motion.a>

            {/* Location */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://maps.google.com/?q=Sector+2+Rohini+Delhi+110085"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-[rgba(245,166,35,0.3)] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center group-hover:bg-[#f5a623] transition-colors">
                <MapPin size={16} className="text-[#f5a623] group-hover:text-[#070707]" />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm truncate max-w-[200px]">
                  Shop No. 4, Flat N 289
                </p>
                <p className="text-[#f5a623] text-[11px] font-semibold flex items-center gap-1">
                  Get Directions →
                </p>
              </div>
            </motion.a>

            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="block px-6 py-3.5 rounded-2xl bg-[#f5a623] hover:bg-[#e09618] text-[#070707] font-extrabold text-sm transition-colors text-center shadow-lg btn-shine whitespace-nowrap"
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

      {/* 4. Promotional Banner with 20% OFF Red Stamp */}
      <PromotionalBanner />

      {/* 5. Why Choose Us (4 Cards) */}
      <WhyChooseUsSection />

      {/* 6. Google Reviews with Stagger Animation */}
      <GoogleReviewsSection />

      {/* 7. About Us & At A Glance with exact Address */}
      <AboutAndGlanceSection />

      {/* 8. Bottom Visit/Order Banner */}
      <VisitOrOrderBanner />

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
