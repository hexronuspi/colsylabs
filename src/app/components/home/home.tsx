"use client";

import React, { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

// --- Configuration ---
const HEADLINE = "Your Personal AI Collaborator";
const PARTICLE_COUNT = 2500;
const FONT_FAMILY = "Inter, sans-serif"; // A premium, clean font


export const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);


  useLayoutEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 640) {
      // Block all animation logic on mobile
      return;
    }

    // ...existing code for canvas and GSAP animation...
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // An object to hold the animation state, controlled by GSAP
    const animState = {
      attractionForce: 0,
      chaos: 1,
      textOpacity: 0,
    };

    // Device Pixel Ratio for crisp rendering on high-DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = sectionRef.current!.clientWidth * dpr;
    canvas.height = sectionRef.current!.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const canvasWidth = sectionRef.current!.clientWidth;
    const canvasHeight = sectionRef.current!.clientHeight;

    class Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      targetX: number;
      targetY: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      baseColor: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.targetX = x;
        this.targetY = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseColor = `rgba(148, 163, 184, ${Math.random() * 0.5 + 0.2})`; // slate-400
        this.color = this.baseColor;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Attraction to target
        const dx_target = this.targetX - this.x;
        const dy_target = this.targetY - this.y;
        this.vx += dx_target * 0.005 * animState.attractionForce;
        this.vy += dy_target * 0.005 * animState.attractionForce;

        // Repulsion from origin (chaos)
        const dx_origin = this.x - this.originX;
        const dy_origin = this.y - this.originY;
        const dist_origin = Math.sqrt(dx_origin * dx_origin + dy_origin * dy_origin);
        if (dist_origin > 0) {
            this.vx -= (dx_origin / dist_origin) * 0.1 * animState.chaos;
            this.vy -= (dy_origin / dist_origin) * 0.1 * animState.chaos;
        }

        // Apply friction
        this.vx *= 0.95;
        this.vy *= 0.95;

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    function getTextCoordinates() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return [];
        
        const fontSize = Math.min(canvasWidth / 12, 80);
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;

        tempCtx.fillStyle = "white";
        tempCtx.font = `bold ${fontSize}px ${FONT_FAMILY}`;
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(HEADLINE, canvasWidth / 2, canvasHeight / 2);

        const imageData = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
        const coordinates = [];
        for (let y = 0; y < canvasHeight; y += 4) {
            for (let x = 0; x < canvasWidth; x += 4) {
                const alpha = imageData[(y * canvasWidth + x) * 4 + 3];
                if (alpha > 128) {
                    coordinates.push({ x, y });
                }
            }
        }
        return coordinates;
    }
    
    function init() {
        const textCoords = getTextCoordinates();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = new Particle(Math.random() * canvasWidth, Math.random() * canvasHeight);
            if(textCoords[i % textCoords.length]) {
              const target = textCoords[i % textCoords.length];
              p.targetX = target.x;
              p.targetY = target.y;
              p.baseColor = '#2563eb'; // The final blue color for text particles
            }
            particles.push(p);
        }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    
    // --- GSAP Orchestration ---
    const ctxGSAP = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.5 });
        
        // ACT 1: Synthesis
        // The core animation. We animate our state object, and the canvas loop reacts.
        tl.to(animState, {
          attractionForce: 1,
          chaos: 0,
          duration: 2.5,
          ease: "power3.inOut",
        }, 0)
        // Simultaneously fade in the final text on top of the canvas, perfectly synced
        .to("#final-headline", {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
        }, 1.5) // Starts when particles are mostly in place
        // Fade out the canvas to reveal only the crisp HTML text
        .to(canvasRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
        }, 2);

        // ACT 2: Reveal UI
        // The rest of the UI appears after the headline is formed.
        tl.fromTo("#hero-subheading", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
            2
        )
        .fromTo("#hero-cta",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
            2.2
        );

    }, sectionRef);

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ctxGSAP.revert(); // GSAP cleanup
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden bg-white font-sans mt-[5rem] pt-20"
    >
      <div className="absolute inset-0 z-0 bg-grid"></div>

      {/* Desktop: Animated Canvas and Animated Headline */}
      <div className="hidden sm:block w-full h-full">
        <canvas ref={canvasRef} className="absolute inset-0 z-10 hero-anim-el"></canvas>
        <div ref={uiRef} className="relative z-20 mx-auto w-full max-w-5xl px-6 text-center flex flex-col items-center">
          {/* This HTML text is initially invisible. It layers on top of the canvas for a crisp final result. */}
          <h1 id="final-headline" className="hero-anim-el text-5xl font-bold tracking-tighter text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl opacity-0">
            Your Personal <span className="text-blue-600">AI Collaborator</span>
          </h1>
          <p id="hero-subheading" className="hero-anim-el mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 opacity-0">
            Beyond tools. A true partner in thought that synthesizes complexity into clarity.
          </p>
          <div id="hero-cta" className="hero-anim-el mt-10 flex justify-center opacity-0">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -10px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700"
            >
              Coming Soon!
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile: Static Headline and Subheading, no animation, no canvas */}
      <div className="block sm:hidden w-full h-full">
        <div className="relative z-20 mx-auto w-full max-w-5xl px-6 text-center flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-tighter text-slate-900 mb-4">
            Your Personal <span className="text-blue-600">AI Collaborator</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Beyond tools. A true partner in thought that synthesizes complexity into clarity.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              className="flex items-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700"
              disabled
            >
              Coming Soon!
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        .bg-grid {
          background-image:
            linear-gradient(to right, #f0f4f8 1px, transparent 1px),
            linear-gradient(to bottom, #f0f4f8 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .hero-anim-el {
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  );
};