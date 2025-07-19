"use client";

import React, { useMemo, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

// --- Constants for the animation & content ---
const SENTENCE = "I have to go to the market to buy something. I’ll take my bike and bring cake for you.";
const KEYWORDS = ["market", "bike", "cake"];

// --- The Main Component: AboutSection ---

export const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<HTMLDivElement>(null);

  // --- Optimization 1: Memoize the sentence tokens ---
  // This ensures the list of words is calculated only once.
  const sentenceTokens = useMemo(() => {
    return SENTENCE.split(' ').map((word, i) => (
      <span
        key={i}
        className="token inline-block mr-2.5 anim-token" // Added 'anim-token' for CSS optimization
      >
        {word}
      </span>
    ));
  }, []);

  useLayoutEffect(() => {
    // GSAP's context handles cleanup automatically, which is great for React.
    const ctx = gsap.context(() => {
      const tokens = gsap.utils.toArray<HTMLElement>(".token");
      const keyTokens = tokens.filter(el => KEYWORDS.includes(el.innerText.toLowerCase().replace(/[,.]/g, '')));
      const fillerTokens = tokens.filter(el => !keyTokens.includes(el));
      const vectorBars = gsap.utils.toArray<HTMLElement>(".vector-bar");

      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom+=4000 top", // Ample space for the scroll animation
          scrub: 1.2, // A slightly softer scrub can feel smoother on some devices
          pin: true,
          anticipatePin: 1, // Helps prevent stuttering on pin activation
        },
        // --- Optimization 3: Use timeline defaults for cleaner code ---
        defaults: {
          ease: "power2.inOut",
        },
      });

      // --- CHAPTER 1: THE PROBLEM - MEAN POOLING (Radial Outward Animation) ---
      // Calculate radial positions for each token
      const radius = 180; // px, how far tokens move outward
      const centerY = sentenceRef.current!.offsetHeight / 2 - 20;
      const angleStep = (2 * Math.PI) / tokens.length;
      const radialPositions = tokens.map((_, i) => {
        const angle = i * angleStep;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius + centerY,
        };
      });

      tl.addLabel("chapter1")
        .to("#title-problem", { opacity: 1, duration: 1 })
        .to("#desc-problem", { opacity: 1, duration: 1 }, "-=0.5")
        .from(tokens, { opacity: 0, y: 30, stagger: 0.03, duration: 1.5 }, "+=0.5")

        .addLabel("pooling", "+=2") // Wait for 2s of scroll
        .to(tokens, {
          color: '#cbd5e1',
          duration: 3,
        }, "pooling")
        .to(tokens, {
          x: (i) => radialPositions[i].x,
          y: (i) => radialPositions[i].y,
          scale: 0.5,
          opacity: 0.2,
          stagger: 0.015,
          duration: 4,
        }, "pooling+=1")
        .to(vectorBars, {
          scaleY: 0.2,
          backgroundColor: '#64748b',
          duration: 3,
          ease: "expo.inOut"
        }, "pooling+=3")
        .to("#vector-label", { text: "Result: Low-Signal, Noisy Vector", duration: 2, ease: "none" }, "pooling+=3")
        .to(["#title-problem", "#desc-problem"], { opacity: 0, duration: 1.5 }, "pooling+=5");

      // --- CHAPTER 2: THE SOLUTION - SENTENCE-AWARE SALIENCE (Tokens return to original position) ---
      tl.addLabel("chapter2", "+=2")
        .to("#title-solution", { opacity: 1, duration: 1.5 })
        .to("#desc-solution", { opacity: 1, duration: 1.5 }, "-=1")
        .to(tokens, {
          x: 0, y: 0, scale: 1, opacity: 1,
          stagger: 0.02, duration: 4, ease: "power4.out"
        }, "chapter2")
        .to(fillerTokens, {
          color: '#e2e8f0',
          opacity: 0.25,
          scale: 0.9,
          duration: 3
        }, "chapter2+=2")
        .to(keyTokens, {
          color: '#2563eb',
          scale: 1.15,
          textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          duration: 3,
          stagger: 0.2
        }, "chapter2+=2")
        .to(vectorBars, {
          scaleY: (i) => [0.3, 0.9, 0.2, 0.7, 0.4, 1.0, 0.3, 0.6, 0.2, 0.8][i],
          backgroundColor: '#3b82f6',
          duration: 3,
          ease: "expo.out"
        }, "chapter2+=3")
        .to("#vector-label", { text: "Result: High-Fidelity, Precise Vector", duration: 2, ease: "none" }, "chapter2+=3");

      // --- CHAPTER 3: FADE OUT AND REVEAL CONTENT ---
      tl.addLabel("fadeOut", "+=4")
        .to([triggerRef.current, "#title-solution", "#desc-solution"], { opacity: 0, duration: 2 }, "fadeOut");
        
    }, sectionRef);

    return () => ctx.revert();
  }, [sentenceTokens]); // Dependency ensures effect re-runs if tokens change (they won't here, but it's good practice)

  return (
    <section ref={sectionRef} id="about-us" className="relative bg-white font-sans">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl lg:text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Beyond Completion. <span className="text-blue-600">True Collaboration.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We&apos;re engineering the world&apos;s first AI collaborator with a persistent, contextual memory—one that remembers, reasons, and retrieves with human-like precision.
            </p>
          </motion.div>
        </div>
      </div>

      <div ref={triggerRef} className="h-screen">
        <div className="sticky top-0 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-white">
          <div className="absolute inset-0 z-0 bg-grid"></div>
          
          <div className="relative z-10 w-full max-w-4xl text-center px-4">
            <h2 id="title-problem" className="text-3xl font-bold text-slate-800 opacity-0">The Retrieval Problem</h2>
            <p id="desc-problem" className="mt-2 text-lg text-slate-500 opacity-0">Standard models average all words, diluting key concepts.</p>
            
            <h2 id="title-solution" className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-3xl font-bold text-slate-800 opacity-0">Our Solution</h2>
            <p id="desc-solution" className="absolute top-10 left-1/2 -translate-x-1/2 w-full mt-2 text-lg text-slate-500 opacity-0">We identify and amplify high-signal tokens for a precise semantic vector.</p>

            <div ref={sentenceRef} className="mt-24 text-2xl md:text-3xl font-medium text-slate-700 leading-relaxed">
              {sentenceTokens}
            </div>
          </div>
          
          <div className="absolute bottom-12 w-full max-w-md h-32 px-4">
            <div className="flex h-full w-full items-end justify-between px-2 pb-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="vector-bar w-1/12 bg-slate-400" style={{ transformOrigin: 'bottom', transform: 'scaleY(0)' }}></div>
              ))}
            </div>
            <p id="vector-label" className="mt-2 text-center font-mono text-sm text-slate-500"></p>
          </div>
        </div>
      </div>

      <div className="h-48 bg-white" /> {/* Spacer */}

      {/* --- Optimization 4: CSS `will-change` property --- */}
      {/* This hints the browser to prepare for animation on these elements, 
          often by moving them to a separate GPU layer, resulting in silkier animations. */}
      <style jsx global>{`
        .bg-grid {
          background-image:
            linear-gradient(to right, #f0f4f8 1px, transparent 1px),
            linear-gradient(to bottom, #f0f4f8 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .anim-token {
          will-change: transform, opacity, color;
        }
        .vector-bar {
          will-change: transform, background-color;
        }
      `}</style>
    </section>
  );
};