"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface Organisation {
  id: string;
  name: string;
  logoUrl: string;
  displayOrder?: number;
  active?: boolean;
}

interface PreviousOrganisationsProps {
  organisations?: Organisation[];
}

export default function PreviousOrganisations({ organisations = [] }: PreviousOrganisationsProps) {
  // Filter for active organisations only
  const activeOrgs = organisations.filter(org => org.active !== false);

  // Track images that failed to load
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedLogos(prev => ({ ...prev, [id]: true }));
  };

  // If no active organisations provided, return null or empty wrapper
  if (activeOrgs.length === 0) {
    return null;
  }

  // Duplicate items internally to guarantee seamless continuous looping across any screen width
  // Even if there is only 1 organisation logo, repeating it creates a long track that loops smoothly without gaps.
  const targetCount = Math.max(12, activeOrgs.length * 2);
  const repeatFactor = Math.ceil(targetCount / activeOrgs.length);
  const trackItems = Array(repeatFactor).fill(activeOrgs).flat();

  return (
    <section
      id="organisations"
      className="container px-4 md:px-8 py-12 md:py-16 w-full overflow-hidden bg-transparent select-none mx-auto relative"
      data-role="section"
      data-section="organisations"
    >
      {/* Section Header */}
      <div className="w-full flex flex-col items-center text-center mb-8 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="a-tag font-mono text-[9px] md:text-[10px] tracking-[0.35em] text-[#f73a0b] uppercase mb-3"
        >
          (Previous Organisations)
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="a-section-title-lg font-display text-3xl md:text-5xl lg:text-6xl text-[#e1e6e1] font-bold uppercase leading-none tracking-normal"
        >
          BRANDS & ORGANISATIONS
        </motion.h3>
      </div>

      {/* Marquee Outer Wrapper with Soft Fade Edges */}
      <div className="relative w-full overflow-hidden py-4 group">
        {/* Left Soft Edge Gradient Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-[#090809] via-[#090809]/80 to-transparent z-10 pointer-events-none" />

        {/* Right Soft Edge Gradient Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-[#090809] via-[#090809]/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Tracks Container */}
        <div className="flex w-full overflow-hidden">
          {/* Dual track infinite flex animation */}
          <div className="flex shrink-0 gap-4 sm:gap-6 md:gap-8 animate-marquee group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused] motion-reduce:[animation-duration:90s]">
            {trackItems.map((org, index) => {
              const itemKey = `track1-${org.id}-${index}`;
              const isFailed = failedLogos[itemKey] || !org.logoUrl?.trim();

              return (
                <div
                  key={itemKey}
                  tabIndex={0}
                  className="w-[140px] sm:w-[170px] md:w-[210px] h-[72px] sm:h-[82px] md:h-[90px] px-4 sm:px-6 py-3 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-[#f73a0b]/60 hover:bg-white/[0.08] hover:scale-[1.04] hover:shadow-[0_0_25px_rgba(247,58,11,0.22)] shrink-0 select-none group/card cursor-default outline-none focus:border-[#f73a0b]"
                >
                  {!isFailed ? (
                    <img
                      src={org.logoUrl}
                      alt={org.name || "Organisation Logo"}
                      onError={() => handleImageError(itemKey)}
                      className="max-h-[38px] sm:max-h-[44px] md:max-h-[50px] max-w-[110px] sm:max-w-[130px] md:max-w-[160px] w-auto h-auto object-contain filter brightness-90 contrast-125 grayscale group-hover/card:grayscale-0 group-hover/card:brightness-100 group-hover/card:contrast-100 transition-all duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center gap-2 font-display text-xs sm:text-sm font-bold text-[#e1e6e1]/80 group-hover/card:text-[#f73a0b] uppercase tracking-wider transition-colors text-center truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f73a0b] shrink-0" />
                      <span className="truncate">{org.name || "Organisation"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Second duplicate track for 100% continuous seamless scrolling */}
          <div
            aria-hidden="true"
            className="flex shrink-0 gap-4 sm:gap-6 md:gap-8 animate-marquee group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused] motion-reduce:[animation-duration:90s] ml-4 sm:ml-6 md:ml-8"
          >
            {trackItems.map((org, index) => {
              const itemKey = `track2-${org.id}-${index}`;
              const isFailed = failedLogos[itemKey] || !org.logoUrl?.trim();

              return (
                <div
                  key={itemKey}
                  className="w-[140px] sm:w-[170px] md:w-[210px] h-[72px] sm:h-[82px] md:h-[90px] px-4 sm:px-6 py-3 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-[#f73a0b]/60 hover:bg-white/[0.08] hover:scale-[1.04] hover:shadow-[0_0_25px_rgba(247,58,11,0.22)] shrink-0 select-none group/card cursor-default"
                >
                  {!isFailed ? (
                    <img
                      src={org.logoUrl}
                      alt={org.name || "Organisation Logo"}
                      onError={() => handleImageError(itemKey)}
                      className="max-h-[38px] sm:max-h-[44px] md:max-h-[50px] max-w-[110px] sm:max-w-[130px] md:max-w-[160px] w-auto h-auto object-contain filter brightness-90 contrast-125 grayscale group-hover/card:grayscale-0 group-hover/card:brightness-100 group-hover/card:contrast-100 transition-all duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center gap-2 font-display text-xs sm:text-sm font-bold text-[#e1e6e1]/80 group-hover/card:text-[#f73a0b] uppercase tracking-wider transition-colors text-center truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f73a0b] shrink-0" />
                      <span className="truncate">{org.name || "Organisation"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
