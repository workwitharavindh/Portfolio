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

  // If no active organisations provided, return null
  if (activeOrgs.length === 0) {
    return null;
  }

  // Only scroll if there are MORE THAN 4 organisations
  const shouldScroll = activeOrgs.length > 4;

  // Duplicate items internally for marquee track if scrolling is active
  const targetCount = Math.max(12, activeOrgs.length * 2);
  const repeatFactor = shouldScroll ? Math.ceil(targetCount / activeOrgs.length) : 1;
  const trackItems = shouldScroll ? Array(repeatFactor).fill(activeOrgs).flat() : activeOrgs;

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

      {/* Static layout for <= 4 organisations OR Marquee layout for > 4 organisations */}
      {!shouldScroll ? (
        /* STATIC CENTERED DISPLAY (when 4 or fewer organisations) */
        <div className="w-full flex items-center justify-center flex-wrap gap-8 sm:gap-12 md:gap-16 py-6">
          {activeOrgs.map((org, index) => {
            const itemKey = `static-${org.id}-${index}`;
            const isFailed = failedLogos[itemKey] || !org.logoUrl?.trim();

            return (
              <div
                key={itemKey}
                className="h-[90px] sm:h-[120px] md:h-[140px] px-4 sm:px-6 py-2 flex items-center justify-center bg-transparent shrink-0 select-none group/card cursor-default"
              >
                {!isFailed ? (
                  <img
                    src={org.logoUrl}
                    alt={org.name || "Organisation Logo"}
                    onError={() => handleImageError(itemKey)}
                    className="max-h-[65px] sm:max-h-[85px] md:max-h-[105px] max-w-[150px] sm:max-w-[200px] md:max-w-[240px] w-auto h-auto object-contain transition-transform duration-300 group-hover/card:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center gap-2 font-display text-base sm:text-lg font-bold text-[#e1e6e1] group-hover/card:text-[#f73a0b] uppercase tracking-wider transition-colors text-center truncate">
                    <span className="w-2 h-2 rounded-full bg-[#f73a0b] shrink-0" />
                    <span className="truncate">{org.name || "Organisation"}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* CONTINUOUS MARQUEE DISPLAY (when > 4 organisations) */
        <div className="relative w-full overflow-hidden py-4 group">
          {/* Left Soft Edge Gradient Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-[#090809] via-[#090809]/80 to-transparent z-10 pointer-events-none" />

          {/* Right Soft Edge Gradient Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-[#090809] via-[#090809]/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Tracks Container */}
          <div className="flex w-full overflow-hidden">
            {/* Track 1 */}
            <div className="flex shrink-0 gap-8 sm:gap-12 md:gap-16 animate-marquee group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
              {trackItems.map((org, index) => {
                const itemKey = `track1-${org.id}-${index}`;
                const isFailed = failedLogos[itemKey] || !org.logoUrl?.trim();

                return (
                  <div
                    key={itemKey}
                    className="h-[90px] sm:h-[120px] md:h-[140px] px-4 sm:px-6 py-2 flex items-center justify-center bg-transparent shrink-0 select-none group/card cursor-default"
                  >
                    {!isFailed ? (
                      <img
                        src={org.logoUrl}
                        alt={org.name || "Organisation Logo"}
                        onError={() => handleImageError(itemKey)}
                        className="max-h-[65px] sm:max-h-[85px] md:max-h-[105px] max-w-[150px] sm:max-w-[200px] md:max-w-[240px] w-auto h-auto object-contain transition-transform duration-300 group-hover/card:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center gap-2 font-display text-base sm:text-lg font-bold text-[#e1e6e1] group-hover/card:text-[#f73a0b] uppercase tracking-wider transition-colors text-center truncate">
                        <span className="w-2 h-2 rounded-full bg-[#f73a0b] shrink-0" />
                        <span className="truncate">{org.name || "Organisation"}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Track 2 for seamless infinite scroll */}
            <div
              aria-hidden="true"
              className="flex shrink-0 gap-8 sm:gap-12 md:gap-16 animate-marquee group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused] ml-8 sm:ml-12 md:ml-16"
            >
              {trackItems.map((org, index) => {
                const itemKey = `track2-${org.id}-${index}`;
                const isFailed = failedLogos[itemKey] || !org.logoUrl?.trim();

                return (
                  <div
                    key={itemKey}
                    className="h-[90px] sm:h-[120px] md:h-[140px] px-4 sm:px-6 py-2 flex items-center justify-center bg-transparent shrink-0 select-none group/card cursor-default"
                  >
                    {!isFailed ? (
                      <img
                        src={org.logoUrl}
                        alt={org.name || "Organisation Logo"}
                        onError={() => handleImageError(itemKey)}
                        className="max-h-[65px] sm:max-h-[85px] md:max-h-[105px] max-w-[150px] sm:max-w-[200px] md:max-w-[240px] w-auto h-auto object-contain transition-transform duration-300 group-hover/card:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center gap-2 font-display text-base sm:text-lg font-bold text-[#e1e6e1] group-hover/card:text-[#f73a0b] uppercase tracking-wider transition-colors text-center truncate">
                        <span className="w-2 h-2 rounded-full bg-[#f73a0b] shrink-0" />
                        <span className="truncate">{org.name || "Organisation"}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
