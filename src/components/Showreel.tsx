"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface ShowreelItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
}

interface ShowreelProps {
  items: ShowreelItem[];
  onPlayItem: (item: ShowreelItem) => void;
}

export default function Showreel({ items, onPlayItem }: ShowreelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative py-36 md:py-52 px-6 md:px-16 bg-[#040405] overflow-hidden border-t border-white/5">
      {/* Dynamic backdrop glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-600/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-28 text-left border-l-2 border-red-600 pl-6 md:pl-8">
          <span className="font-outfit text-xs md:text-sm tracking-[0.4em] text-red-500 font-bold uppercase block mb-3">
            01 / SPOTLIGHT
          </span>
          <h2 className="font-cinzel text-4xl md:text-6xl font-black tracking-wider text-white uppercase text-glow">
            EDITORIAL PROJECTS
          </h2>
          <p className="font-outfit text-xs md:text-sm text-gray-500 tracking-[0.2em] uppercase mt-4">
            [ MULTI-GENRE HIGHLIGHTS • 4K STREAMING AVAILABLE ]
          </p>
        </div>

        {/* Vertical Editorial Showcase */}
        <div className="flex flex-col gap-36 md:gap-52">
          {items.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const indexStr = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={item.id}
                className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center relative ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* 1. Giant Asymmetrical Outline Number Background */}
                <div 
                  className={`absolute -top-16 font-cinzel text-9xl md:text-[13rem] font-black text-outline pointer-events-none select-none opacity-40 leading-none ${
                    isEven ? "right-0 lg:right-1/4" : "left-0 lg:left-1/4"
                  } ${hoveredId === item.id ? "text-outline-active" : ""}`}
                >
                  {indexStr}
                </div>

                {/* 2. Visual Media Container (Offset sizing) */}
                <div className="w-full lg:w-7/12 relative group">
                  <motion.div
                    className="relative aspect-video w-full overflow-hidden border border-white/10 bg-zinc-950 cursor-pointer shadow-2xl"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => onPlayItem(item)}
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    data-cursor="play"
                  >
                    {/* Hover Autoplay preview or static thumbnail */}
                    {hoveredId === item.id && item.videoUrl ? (
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover scale-102 transition-transform duration-700"
                        src={item.videoUrl}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040405] via-[#040405]/10 to-transparent opacity-80" />

                    {/* Hover button indicator */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center border border-white/20 shadow-[0_0_30px_#ff003c]">
                        <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 3. Text Info Panel (Offset, Asymmetrical alignment) */}
                <div className={`w-full lg:w-5/12 flex flex-col justify-center relative z-10 ${
                  isEven ? "text-left" : "text-left lg:text-right"
                }`}>
                  <span className="font-outfit text-xs tracking-[0.3em] text-red-500 font-bold uppercase mb-4 block">
                    {item.category}
                  </span>
                  
                  <h3 
                    onClick={() => onPlayItem(item)}
                    className="font-cinzel text-2xl md:text-4xl font-extrabold tracking-wider text-white uppercase mb-6 hover:text-red-500 transition-colors cursor-pointer leading-tight text-glow"
                  >
                    {item.title}
                  </h3>

                  <div className={`h-[1px] w-24 bg-white/10 mb-6 ${
                    isEven ? "mr-auto" : "ml-auto"
                  }`} />
                  
                  <p className="font-outfit text-sm md:text-base text-gray-400 font-light leading-relaxed mb-8 max-w-md">
                    {item.description}
                  </p>

                  <div className={`flex gap-6 text-[10px] font-outfit tracking-widest text-zinc-500 uppercase font-bold ${
                    isEven ? "justify-start" : "justify-start lg:justify-end"
                  }`}>
                    <span>RESOLUTION: 4K UHD</span>
                    <span>•</span>
                    <span>FORMAT: CINEMATIC WIDE</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
