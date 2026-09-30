import { motion, useScroll, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowTopBtn(latest > 350);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Golden Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f5a623] via-[#ff6b35] to-[#ffd080] origin-left z-50 shadow-[0_0_12px_rgba(245,166,35,0.8)]"
        style={{ scaleX }}
      />

      {/* Floating Scroll To Top Button with Circular Progress */}
      {showTopBtn && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-8 right-6 z-40 w-12 h-12 rounded-full bg-[#121212]/90 backdrop-blur-xl border border-[rgba(245,166,35,0.4)] text-[#f5a623] flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-shadow cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </motion.button>
      )}
    </>
  );
}
