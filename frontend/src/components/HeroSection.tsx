"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  badge: string;
  bgImage: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  badge,
  bgImage,
}) => {
  // Highlight the last word in the accent (gold) color
  const words = title.split(" ");
  const lastWord = words.pop() ?? "";
  const mainTitle = words.join(" ");

  return (
    <section className="w-full mt-20 select-none" aria-label={title}>
      {/* ═══════════════════════════════════════════════════
          MOBILE (< md): image rendered as its own rounded
          card, content stacked below in normal document flow
          — matches the requested separated mobile pattern
      ═══════════════════════════════════════════════════ */}
      <div className="md:hidden px-4 pt-6 pb-4">
        <div className="relative w-full aspect-[7/4] rounded-3xl overflow-hidden shadow-xl mb-8">
          <Image
            src={bgImage}
            alt=""
            aria-hidden="true"
            loading="eager"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col items-start text-left">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-5 inline-flex items-center rounded-full
             border border-accent
             bg-accent
             px-4 py-1.5
             text-[11px] font-black uppercase
             tracking-[0.18em]
             text-white
             shadow-lg shadow-accent/40"
          >
            {badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mb-4 max-w-xl text-balance
                       text-3xl sm:text-4xl
                       font-black leading-[1.1] tracking-tight
                       text-primary"
          >
            <span className="text-(--primary)">{mainTitle}</span>
        {lastWord && (
  <>
    {mainTitle ? " " : ""}
    <span className="text-primary-foreground">{lastWord}</span>
  </>
)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="max-w-xl text-pretty text-sm sm:text-base
                       font-medium leading-relaxed
                       text-gray-600"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          DESKTOP (md+): original full-bleed background image
          with text overlaid on top — unchanged from before
      ═══════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex relative w-full overflow-hidden isolate
                   min-h-[560px] lg:min-h-[640px]
                   items-center bg-primary"
      >
        <Image
          src={bgImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          priority
          fill
          className="absolute inset-0 h-full w-full object-cover object-right
                     pointer-events-none -z-10"
          draggable={false}
        />

        {/* Desktop scrim: dark left → transparent right */}
        <div
          className="absolute inset-0 pointer-events-none -z-10
                     bg-gradient-to-r from-secondary/20 via-secondary/10"
        />

        {/* Subtle top/bottom vignette for premium framing */}
        <div
          className="absolute inset-0 pointer-events-none -z-10
                     bg-gradient-to-b from-secondary/20 via-secondary/10"
        />

        <div
          className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8
                     py-16 flex flex-col items-start text-left"
        >
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-5 inline-flex items-center rounded-full
             border border-accent
             bg-accent
             px-4 py-1.5
             text-xs font-black uppercase
             tracking-[0.18em]
             text-white
             shadow-lg shadow-accent/40"
          >
            {badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mb-4 max-w-xl lg:max-w-3xl text-balance
                       text-5xl lg:text-6xl
                       font-black leading-[1.1] tracking-tight
                       text-primary-foreground"
          >
            <span className="text-(--primary)">{mainTitle}</span>
        {lastWord && (
  <>
    {mainTitle ? " " : ""}
    <span className="text-primary">{lastWord}</span>
  </>
)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="max-w-xl text-pretty text-base lg:text-lg
                       font-medium leading-relaxed
                       text-primary-foreground/85"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
