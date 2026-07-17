"use client";

import React from "react";
import { motion } from "framer-motion";

interface ContactProps {
  email: string;
  phone: string;
  socials: Record<string, string>;
}

export default function Contact({ email, phone, socials }: ContactProps) {
  const displayEmail = email || "aravasu.r@gmail.com";
  const displayPhone = phone || "+919876543210";

  // Parent stagger variants
  const footerRowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const footerItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <section
      id="contact"
      className="container px-4 md:px-8 py-12 md:py-16 w-full overflow-hidden bg-transparent select-none mx-auto"
      data-role="section"
      data-section="contact"
    >
      {/* ── DESKTOP VIEW CONTACT (Hidden on mobile) ── */}
      <div className="hidden md:flex flex-col w-full">
        {/* Section tag header */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="a-tag font-mono text-[9px] tracking-[0.3em] text-[#f73a0b] uppercase mb-4"
        >
          (Contact)
        </motion.h2>

        {/* Narrative bio */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="a-desc-lg font-body text-sm md:text-md text-white/50 max-w-[500px] leading-relaxed mb-10"
        >
          Let&apos;s work together. If you have an idea, a project, or simply want to talk about visuals, pace, and editing, feel free to reach out. You can email me directly or drop a hi through other channels.
        </motion.p>

        {/* Giant full-width responsive SVG email link */}
        <motion.a
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          href={`mailto:${displayEmail}?subject=Video%20Editing%20Query`}
          target="_blank"
          rel="noreferrer noopener"
          className="block w-full pb-4 pointer-events-auto hover:opacity-80 transition-opacity duration-300"
          data-mouse="link"
        >
          <svg
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 120"
            preserveAspectRatio="xMidYMid meet"
          >
            <motion.text
              x="0"
              y="75"
              fontSize="85"
              fontWeight="800"
              textLength="800"
              lengthAdjust="spacingAndGlyphs"
              className="font-display fill-[#e1e6e1] hover:fill-[#f73a0b] transition-colors duration-300"
              dominantBaseline="middle"
              initial={{ letterSpacing: "0.06em", opacity: 0 }}
              whileInView={{ letterSpacing: "normal", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const }}
            >
              {displayEmail}
            </motion.text>
          </svg>
        </motion.a>

        {/* Secondary Contact Channels row */}
        <motion.div 
          variants={footerRowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-row items-center justify-between gap-6 pt-8 w-full"
        >
          {socials.Instagram ? (
            <motion.a
              variants={footerItemVariants}
              href={socials.Instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-[9px] tracking-[0.25em] a-text-link uppercase"
              data-mouse="link"
            >
              INSTAGRAM
            </motion.a>
          ) : (
            <div />
          )}

          <motion.div 
            variants={footerItemVariants}
            className="flex flex-row gap-8 justify-center"
          >
            {displayPhone && (
              <a
                href={`https://wa.me/${String(displayPhone).replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[9px] tracking-[0.2em] a-text-link uppercase"
                data-mouse="link"
              >
                WHATSAPP ({displayPhone})
              </a>
            )}
          </motion.div>

          {socials.LinkedIn ? (
            <motion.a
              variants={footerItemVariants}
              href={socials.LinkedIn}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-[9px] tracking-[0.25em] a-text-link uppercase"
              data-mouse="link"
            >
              LINKEDIN
            </motion.a>
          ) : (
            <div />
          )}
        </motion.div>
      </div>

      {/* ── MOBILE VIEW CONTACT (Completely custom centered buttons card deck) ── */}
      <div className="flex md:hidden flex-col w-full items-center justify-center text-center gap-6">
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[9px] tracking-[0.3em] text-[#f73a0b] uppercase mb-2"
          >
            (Contact)
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-body text-xs text-white/50 max-w-[280px] leading-relaxed px-2"
          >
            Let&apos;s talk about visuals, pacing, and editing. Tap below to write or connect.
          </motion.p>
        </div>

        {/* Responsive, readable Email link */}
        <motion.a
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          href={`mailto:${displayEmail}?subject=Video%20Editing%20Query`}
          target="_blank"
          rel="noreferrer noopener"
          className="block w-full py-4 hover:text-[#f73a0b] font-display text-[5.5vw] text-[#e1e6e1] tracking-wide break-all leading-snug"
        >
          {displayEmail.toLowerCase()}
        </motion.a>

        {/* Mobile touch button stack (Well spaced and padded) */}
        <motion.div
          variants={footerRowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-3 w-full px-6 pt-4"
        >
          {displayPhone && (
            <motion.a
              variants={footerItemVariants}
              href={`https://wa.me/${String(displayPhone).replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer noopener"
              className="py-3.5 px-4 font-mono text-[9px] text-[#e1e6e1] tracking-widest text-center uppercase border border-white/10 bg-black/10 rounded-sm hover:border-[#f73a0b] active:scale-95 transition-all"
            >
              WHATSAPP ({displayPhone})
            </motion.a>
          )}

          {socials.Instagram && (
            <motion.a
              variants={footerItemVariants}
              href={socials.Instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="py-3.5 px-4 font-mono text-[9px] text-[#e1e6e1] tracking-widest text-center uppercase border border-white/10 bg-black/10 rounded-sm hover:border-[#f73a0b] active:scale-95 transition-all"
            >
              INSTAGRAM
            </motion.a>
          )}

          {socials.LinkedIn && (
            <motion.a
              variants={footerItemVariants}
              href={socials.LinkedIn}
              target="_blank"
              rel="noreferrer noopener"
              className="py-3.5 px-4 font-mono text-[9px] text-[#e1e6e1] tracking-widest text-center uppercase border border-white/10 bg-black/10 rounded-sm hover:border-[#f73a0b] active:scale-95 transition-all"
            >
              LINKEDIN
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
