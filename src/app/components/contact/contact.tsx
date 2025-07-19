"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { gsap } from "gsap";
import { Copy, Check, ArrowUpRight, Github, Linkedin } from "lucide-react";

// --- Configuration ---
const CONTACT_EMAIL = "colsylabs@gmail.com";
const SOCIAL_LINKS = {
  github: "https://github.com/Colsy-Labs", // Replace with your link
  linkedin: "https://www.linkedin.com/company/colsy", // Replace with your link
};

export const ContactSection = () => {
  const [isCopied, setIsCopied] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
    });
  };

  // Smooth entry animation for the section
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        [
          ".contact-label",
          ".contact-headline",
          ".contact-subheading",
          ".contact-button",
          ".contact-socials",
        ],
        {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }, sectionRef);

    // Don't forget to install and import ScrollTrigger if you use it
    // gsap.registerPlugin(ScrollTrigger); 
    // If you don't have ScrollTrigger, you can remove the scrollTrigger object
    // and the animation will just run on load.

    return () => ctx.revert();
  }, []);

  const iconVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: easeOut } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2, ease: easeOut } },
  };

  return (
    <section ref={sectionRef} className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* === Text Content === */}
        <p className="contact-label text-base font-semibold leading-7 text-blue-600">
          Get in Touch
        </p>
        <h2 className="contact-headline mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Let&apos;s Start a Conversation
        </h2>
        <p className="contact-subheading mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Have a project in mind, a question, or just want to connect? My inbox is
          always open. I&apos;ll get back to you as soon as possible.
        </p>

        {/* === Interactive Email Button === */}
        <div className="contact-button mt-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-slate-50 p-1 transition-shadow duration-300 hover:shadow-md"
            onClick={handleCopy}
          >
            <span className="px-6 py-3 text-base font-medium text-slate-700">
              {CONTACT_EMAIL}
            </span>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {isCopied ? (
                  <motion.div
                    key="check"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Check className="h-5 w-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Copy className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <p className="mt-4 text-sm text-slate-500">
            Click to copy or{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1 font-medium text-blue-600 underline-offset-4 hover:underline"
            >
              open in your mail client
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </p>
        </div>

        {/* === Social Links === */}
        <div className="contact-socials mt-20 flex items-center justify-center gap-8">
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-colors hover:text-blue-600">
                <Github className="h-7 w-7" />
                <span className="sr-only">GitHub</span>
            </a>
             <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-colors hover:text-blue-600">
                <Linkedin className="h-7 w-7" />
                <span className="sr-only">LinkedIn</span>
            </a>
        </div>
      </div>
    </section>
  );
};