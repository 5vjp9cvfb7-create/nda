"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="noise relative isolate min-h-[calc(100vh-80px)] overflow-hidden">
      <Image
        src="/images/coalition-banner.jpeg"
        alt="NDA student coalition visual"
        fill
        sizes="100vw"
        className="z-[-2] object-cover"
        priority
      />
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-ink via-ink/72 to-white/20 dark:from-ink dark:via-ink/84 dark:to-ink/30" />
      <div className="section-shell flex min-h-[calc(100vh-80px)] items-center py-16">
        <motion.div
          className="max-w-3xl text-white"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/18 bg-white/12 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-xl">
            <Sparkles size={15} className="text-gold" />
            Official Student Coalition
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-gold/50 bg-white shadow-gold">
              <Image src="/images/nda-emblem.jpeg" alt="NDA logo" fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/25 bg-white/14 text-xl font-black text-white backdrop-blur-xl">
              UD
            </div>
          </div>

          <h1 className="mt-7 text-balance text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">NDA x UD</h1>
          <p className="mt-5 max-w-2xl text-balance text-xl font-semibold leading-8 text-white/90 sm:text-2xl">
            Your Voice. Our Responsibility. Together for Every Student.
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/76">
            Dream Bigger. Lead Better. Together We Rise.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/about" variant="secondary">
              Learn More
            </Button>
            <Button href="/join-us" className="bg-gold text-ink hover:bg-gold-soft">
              Join Our Movement
              <ArrowRight size={17} />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
