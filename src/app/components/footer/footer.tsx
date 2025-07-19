// components/Footer.tsx

"use client";

import Image from "next/image";
import { Linkedin } from 'lucide-react';

// A reusable, styled icon button component for our footer actions
type FooterIconButtonProps = {
  href: string;
  target?: string;
  rel?: string;
  ariaLabel: string;
  children: React.ReactNode;
};

const FooterIconButton = ({
  href,
  target = "_blank",
  rel = "noopener noreferrer",
  ariaLabel,
  children,
}: FooterIconButtonProps) => (
  <a
    href={href}
    target={target}
    rel={rel}
    aria-label={ariaLabel}
    className="group rounded-full p-2 transition-colors duration-200 ease-in-out hover:bg-black/5 dark:hover:bg-white/10"
  >
    {children}
  </a>
);


export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <div className="w-[95vw] max-w-4xl mb-4 pointer-events-auto bg-gray-100 rounded-2xl">
        <div className="flex h-16 items-center justify-between rounded-2xl bg-white/70 px-4 shadow-2xl shadow-black/10 ring-1 ring-black/5 backdrop-blur-xl dark:bg-black/50 dark:ring-white/10">
          {/* Left Section: Brand & Status */}
          <div className="flex items-center gap-4">
            <Image src="/logo/colsy.svg" alt="Colsy Labs Logo" width={32} height={32} priority />
          </div>
          {/* Center Section: Copyright */}
          <div className="flex-1 flex justify-center">
            <span className="text-xs md:text-sm text-gray-500 font-medium select-none">© 2025 Colsy Labs · India</span>
          </div>
          {/* Right Section: Actions & Social */}
          <div className="flex items-center gap-1">
            <FooterIconButton href="https://linkedin.com/company/colsy" ariaLabel="Colsy Labs on LinkedIn">
              <Linkedin className="h-5 w-5 text-gray-600 transition-colors group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-white" />
            </FooterIconButton>
          </div>
        </div>
      </div>
    </footer>
  );
};