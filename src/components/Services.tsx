"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceItem {
  title: string;
  description: string;
}

export default function Services({ services }: { services: ServiceItem[] }) {
  const displayServices = services.length > 0 ? services : [
    { title: "YouTube Editing", description: "High-retention, engaging edits with premium pacing, color, and sound design." },
    { title: "Reels & Shorts", description: "Fast-paced, hook-driven vertical edits designed to trigger algorithm virality." },
    { title: "Commercial Editing", description: "High-production-value brand ads and cinematic product showcases." },
    { title: "Color Grading", description: "Hollywood-grade cinematic color processing and exposure calibration." },
  ];

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <section
      id="services"
      className="container-fluid px-0 py-12 md:py-16 w-full overflow-hidden bg-transparent select-none"
    >
      <div className="w-full flex flex-col justify-center">
        {/* Section title */}
        <div className="container px-4 md:px-8 mb-10 text-center md:text-left">
          <h2 className="a-tag font-mono text-[9px] tracking-[0.3em] text-[#f73a0b] uppercase mb-4">
            (Services)
          </h2>
          <h3 className="a-section-title-lg font-display text-4xl md:text-6xl lg:text-7xl text-[#e1e6e1] font-bold uppercase leading-none tracking-normal">
            What I Do
          </h3>
        </div>

        {/* ── DESKTOP SERVICES LIST ── */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="hidden md:flex w-full flex-col mt-6"
        >
          {displayServices.map((service, idx) => (
            <div
              key={idx}
              className="a-services-row-wrap relative w-full overflow-hidden group transition-all duration-300 cursor-pointer"
              data-mouse="link"
            >
              {/* Full-bleed hover background */}
              <div className="absolute inset-0 bg-[#f73a0b] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-out z-0" />

              <div className="a-services-row grid py-6 md:py-8 container px-4 md:px-8 items-center relative z-10">
                <span className="a-desc-lg font-mono text-[11px] tracking-widest text-[#e1e6e160] group-hover:text-black/60 transition-colors duration-300">
                  #{String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1.5 ml-6 md:ml-12">
                  <span className="a-title-lg font-body text-lg md:text-2xl text-[#e1e6e1] group-hover:text-black group-hover:font-medium transition-colors duration-300">
                    {service.title}
                  </span>
                  {/* Description slides in on hover */}
                  <p className="font-body text-sm text-black/70 max-w-xl leading-relaxed overflow-hidden max-h-0 group-hover:max-h-16 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    {service.description || "Premium post-production service delivering polished visual assets."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── MOBILE SERVICES LIST ── */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="flex md:hidden w-full flex-col px-4 pt-2"
        >
          {displayServices.map((service, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="py-5 flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#f73a0b] font-bold">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-base text-[#e1e6e1] font-semibold tracking-wide uppercase">
                    {service.title}
                  </span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f73a0b]/80 shadow-[0_0_8px_#f73a0b]" />
              </div>
              <p className="font-body text-xs text-white/50 leading-relaxed pl-7 pr-3">
                {service.description || "Premium post-production service delivering polished visual assets for brands and creators."}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .a-services-row {
          grid-template-columns: 8rem 1fr;
        }
        @media (max-width: 768px) {
          .a-services-row {
            grid-template-columns: 4rem 1fr;
          }
        }
      `}</style>
    </section>
  );
}
