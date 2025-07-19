// app/components/NavBar.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { id: "about", href: "#about-us", text: "ABOUT US", left: "50%" },
  { id: "contact", href: "#contact", text: "CONTACT", left: "65%" },
];

export const NavBar = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const navBlockRef = useRef<HTMLDivElement>(null);
  const [slideX, setSlideX] = useState(0);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
        setNavVisible(false);
      } else {
        setScrolled(false);
        setNavVisible(true);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Calculate slide distance so only logo is visible
  useEffect(() => {
    if (navBlockRef.current) {
      const navWidth = navBlockRef.current.offsetWidth;
      // Logo: left-6 (1.5rem = 24px), width 80px, gap 8px, so total ~112px
      const logoVisible = 24 + 80 + 8; // px
      setSlideX(navWidth - logoVisible);
    }
  }, []);

  // Parent container animation
  const navBarVariants = {
    initial: { opacity: 0, y: -30, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeInOut" as const,
        delayChildren: 0.4,
      },
    },
  };
  
  const mobileMenuVariants = {
    open: { opacity: 1, backdropFilter: 'blur(16px)', transition: { duration: 0.4, ease: 'easeOut' as const } },
    closed: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.3, ease: 'easeIn' as const } },
  };

  // ...wires removed...

  return (
    <>
      {/* --- DESKTOP NAVIGATION --- */}
      <motion.header
        className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl"
        variants={navBarVariants}
        initial="initial"
        animate="animate"
      >
        <div className="relative h-20">
          <motion.div
            ref={navBlockRef}
            className="absolute inset-0 rounded-2xl bg-gray-50 border shadow-lg backdrop-blur-xl overflow-hidden"
            animate={{ x: scrolled && !navVisible ? slideX : 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            {/* Logo (moves with navbar, clickable when nav is hidden) */}
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20 cursor-pointer"
              onClick={() => {
                if (scrolled && !navVisible) setNavVisible(true);
              }}
              style={{ pointerEvents: scrolled && !navVisible ? 'auto' : 'none' }}
            >
              <Image src="/logo/colsy.svg" alt="Colsy Labs" width={80} height={96} priority/>
              {(!scrolled || navVisible) && (
                <span className="text-lg font-semibold text-brand-dark tracking-wide">Colsy Labs</span>
              )}
            </div>

            {/* Navigation Links & Aurora Glows */}
            {navLinks.map((link) => (
            <div
              key={link.id}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: link.left, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredId(link.id)}
              onMouseLeave={() => setHoveredId(null)}
            >



              {/* Link Text */}
              <a href={link.href} className="relative block overflow-hidden text-sm font-medium text-brand-dark">
                <motion.span 
                  className="block"
                  animate={{ y: hoveredId === link.id ? '-100%' : '0%'}}
                  transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                >
                  {link.text}
                </motion.span>
                <motion.span 
                  className="absolute inset-0 block"
                  initial={{ y: '100%' }}
                  animate={{ y: hoveredId === link.id ? '0%' : '100%' }}
                  transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                >
                  {link.text}
                </motion.span>
              </a>
            </div>
          ))}
        </motion.div>
      </div>
      </motion.header>

      {/* --- MOBILE NAVIGATION --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-20 px-4 bg-brand-white/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/colsy.svg" alt="Colsy Labs" width={80} height={96} priority draggable={false} />
            <span className="font-semibold text-brand-dark">Colsy Labs</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
            <Menu className="h-6 w-6 text-brand-dark" />
        </button>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden fixed inset-0 z-[100] bg-black/20"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-brand-white/90 p-8">
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2">
                    <X className="h-6 w-6 text-brand-dark" />
                </button>
                <nav className="mt-16 flex flex-col space-y-8">
                    <a href="#about-us" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-semibold text-brand-dark">ABOUT US</a>
                    <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-semibold text-brand-dark">CONTACT</a>
                </nav>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};