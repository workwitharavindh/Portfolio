"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  youtubeUrl?: string;
  thumbnailUrl: string;
  description: string;
  isFeatured: boolean;
}

interface HeroProps {
  name: string;
  tagline: string;
  subtagline: string;
  items: PortfolioItem[];
  activeVideoUrl: string;
  onVideoChange: (url: string) => void;
  onViewWork?: () => void;
  onContact?: () => void;
}

const fixedNames = [
  "Shot 1.MP4",
  "Sequence 13.MP4",
  "Reel 7.MP4",
  "Video Cut.MP4",
  "Drone shot 3.MP4"
];

export default function Hero({ tagline, subtagline, items, activeVideoUrl, onVideoChange }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playheadX, setPlayheadX] = useState(0);
  const [hoverTimecode, setHoverTimecode] = useState("00:00:00:00");

  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the hero section relative to the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Create smooth scroll-linked fade and movement offsets
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, -35]);

  // Take the first 6 portfolio items for the interactive timeline
  const timelineItems = items.slice(0, 6);

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (timelineItems.length > 0 && !hasInitializedRef.current) {
      const initialPercent = (0 / timelineItems.length) * 100 + (100 / timelineItems.length) / 2;
      setPlayheadX(initialPercent);
      hasInitializedRef.current = true;
    }
  }, [timelineItems]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPlayheadX(percent);

    // Calculate timecode based on percent (total duration 2m 5s = 125 seconds)
    const totalSeconds = 125;
    const currentSeconds = (percent / 100) * totalSeconds;
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = Math.floor(currentSeconds % 60);
    const frames = Math.floor((currentSeconds % 1) * 24); // 24 fps
    
    setHoverTimecode(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`
    );

    // Update active video index dynamically based on coordinates
    if (timelineItems.length > 0) {
      const itemIdx = Math.min(
        timelineItems.length - 1,
        Math.floor((percent / 100) * timelineItems.length)
      );
      if (itemIdx !== activeIndex) {
        setActiveIndex(itemIdx);
        const item = timelineItems[itemIdx];
        if (item?.videoUrl) {
          onVideoChange(item.videoUrl);
        }
      }
    }
  };

  const handleMouseLeave = () => {
    if (timelineItems.length > 0) {
      const defaultX = (activeIndex / timelineItems.length) * 100 + (100 / timelineItems.length) / 2;
      setPlayheadX(defaultX);
    }
    setHoverTimecode("00:00:00:00");
  };

  const renderTimeline = () => {
    return (
      <div className="a-timeline-wrapper relative flex flex-col w-full z-20 pb-4">
        <div className="w-full flex flex-col font-mono text-[9px] select-none border border-white/10 bg-black/40 backdrop-blur-md rounded-md overflow-visible">
          {/* Timeline Ruler Header */}
          <div className="w-full h-8 border-b border-white/10 flex items-center bg-black/30 relative">
            {/* Left corner timecode */}
            <div className="w-16 md:w-20 border-r border-white/10 h-full flex items-center justify-center font-bold text-[#f73a0b] text-[10px] tracking-wider font-mono">
              {hoverTimecode}
            </div>
            {/* Ruler Ticks */}
            <div className="flex-1 h-full relative overflow-hidden flex items-end pb-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="absolute bottom-0 h-2 border-l border-white/20" style={{ left: `${(i / 11) * 100}%` }}>
                  <span className="absolute bottom-3 -left-3 text-[7px] text-white/30 hidden md:block">
                    {`00:00:${String(i * 10).padStart(2, "0")}:00`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tracks Container */}
          <div className="flex relative w-full h-36 md:h-44 overflow-visible">
            {/* Left Panel: Track Headers */}
            <div className="w-16 md:w-20 border-r border-white/10 bg-black/25 flex flex-col justify-stretch z-10">
              {/* V2 Header */}
              <div className="flex-1 border-b border-white/5 flex items-center px-1.5 justify-between text-white/40">
                <span className="font-bold text-[8px]">V2</span>
                <div className="flex gap-1.5">
                  <span className="cursor-pointer hover:text-white text-[8px]">👁</span>
                  <span className="cursor-pointer hover:text-white text-[8px]">🔒</span>
                </div>
              </div>
              {/* V1 Header */}
              <div className="flex-1 border-b border-white/5 flex items-center px-1.5 justify-between text-[#e1e6e1]/80">
                <span className="font-bold text-[8px] text-white">V1</span>
                <div className="flex gap-1.5">
                  <span className="cursor-pointer hover:text-white text-white text-[8px]">👁</span>
                  <span className="cursor-pointer hover:text-white text-[8px]">🔒</span>
                </div>
              </div>
              {/* A1 Header */}
              <div className="flex-1 border-b border-white/5 flex items-center px-1.5 justify-between text-[#e1e6e1]/80">
                <span className="font-bold text-[8px] text-white font-mono">A1</span>
                <div className="flex gap-1.5">
                  <span className="cursor-pointer hover:text-white text-[8px]">M</span>
                  <span className="cursor-pointer hover:text-white text-[8px]">S</span>
                </div>
              </div>
              {/* A2 Header */}
              <div className="flex-1 flex items-center px-1.5 justify-between text-white/40">
                <span className="font-bold text-[8px] font-mono">A2</span>
                <div className="flex gap-1.5">
                  <span className="cursor-pointer hover:text-white text-[8px]">M</span>
                  <span className="cursor-pointer hover:text-white text-[8px]">S</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Track Timeline Area */}
            <div 
              className="flex-1 relative flex flex-col justify-stretch bg-black/10 overflow-visible"
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
            >
              {/* V2 Track (Text overlays / Adjustment layers) */}
              <div className="flex-1 border-b border-white/5 relative flex items-center px-2">
                <div className="absolute left-[5%] w-[40%] h-[70%] border border-[#f73a0b]/30 bg-[#f73a0b]/5 rounded-sm flex items-center justify-between px-2 text-[7px] text-[#f73a0b] opacity-60">
                  <span>Adjustment Layer [Grade]</span>
                  <span className="hidden sm:inline">LUT_Slog3_Rec709.cube</span>
                </div>
                <div className="absolute left-[52%] w-[35%] h-[70%] border border-blue-500/30 bg-blue-500/5 rounded-sm flex items-center justify-center text-[7px] text-blue-400 opacity-60">
                  <span>Letterbox Overlay (2.35:1)</span>
                </div>
              </div>

              {/* V1 Track (Main Video Clips) */}
              <div className="flex-1 border-b border-white/5 relative flex items-stretch py-1">
                {timelineItems.map((item, idx) => {
                  const widthPercent = 100 / timelineItems.length;
                  const leftPercent = idx * widthPercent;
                  const colors = [
                    "bg-[#1e3a8a]/60 border-[#2563eb]/50 hover:bg-[#1e3a8a]/80", // Iris Blue
                    "bg-[#581c87]/60 border-[#7c3aed]/50 hover:bg-[#581c87]/80", // Violet
                    "bg-[#065f46]/60 border-[#059669]/50 hover:bg-[#065f46]/80", // Forest Green
                    "bg-[#78350f]/60 border-[#d97706]/50 hover:bg-[#78350f]/80", // Mango Gold
                    "bg-[#1e293b]/60 border-[#475569]/50 hover:bg-[#1e293b]/80", // Stone Slate
                    "bg-[#831843]/60 border-[#db2777]/50 hover:bg-[#831843]/80", // Rose Pink
                  ];
                  const colorClass = colors[idx % colors.length];
                  const isActive = activeIndex === idx;

                  return (
                    <div
                      key={item.id}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent - 0.4}%`, // tiny gap between blocks
                        transformOrigin: "bottom",
                      }}
                      className={`absolute top-1 bottom-1 border rounded-[3px] flex flex-col justify-between p-1.5 cursor-pointer transition-all duration-200 z-10 overflow-visible ${colorClass} ${isActive ? "ring-1 ring-white/30" : ""}`}
                    >
                      <div className="flex justify-between items-center leading-none">
                        <span className="font-bold text-[7px] md:text-[8px] text-white truncate max-w-[85%] uppercase">
                          {fixedNames[idx] || `${String(item.title).replace(/\s+/g, "_")}.mp4`}
                        </span>
                        <span className="text-[6px] text-white/40 hidden md:inline font-mono">
                          V{String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[5px] md:text-[6px] text-white/50 leading-none">
                        <span className="truncate max-w-[60%]">{item.category}</span>
                        <span>24fps</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* A1 Track (Main Audios with custom waveforms) */}
              <div className="flex-1 border-b border-white/5 relative flex items-stretch py-1">
                {timelineItems.map((item, idx) => {
                  const widthPercent = 100 / timelineItems.length;
                  const leftPercent = idx * widthPercent;
                  return (
                    <div
                      key={item.id}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent - 0.4}%`,
                      }}
                      className="absolute top-1 bottom-1 border border-emerald-600/30 bg-emerald-900/30 rounded-[3px] flex items-center p-1 opacity-80 overflow-hidden"
                    >
                      <div className="w-full h-full flex items-center justify-around gap-[1px] opacity-40">
                        {Array.from({ length: 14 }).map((_, waveIdx) => {
                          const height = 15 + Math.sin(waveIdx * 0.8 + idx) * 10 + Math.random() * 5;
                          return (
                            <div
                              key={waveIdx}
                              className="bg-emerald-400 w-[1.5px]"
                              style={{ height: `${Math.max(4, Math.min(22, height))}px` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* A2 Track (Background Music Track) */}
              <div className="flex-1 relative flex items-center px-2">
                <div className="absolute left-[1%] w-[98%] h-[70%] border border-teal-500/30 bg-teal-950/30 rounded-sm flex items-center justify-between px-2 text-[7px] text-teal-400/90 overflow-hidden">
                  <span className="truncate max-w-[35%] uppercase">Soundtrack_Cinematic_Foley.wav</span>
                  <div className="flex-1 h-3 flex items-center justify-around gap-[1.5px] opacity-25 px-8">
                    {Array.from({ length: 48 }).map((_, waveIdx) => {
                      const height = 4 + Math.sin(waveIdx * 0.3) * 6;
                      return (
                        <div key={waveIdx} className="bg-teal-400 w-[1px]" style={{ height: `${height}px` }} />
                      );
                    })}
                  </div>
                  <span className="hidden sm:inline">00:02:05:00</span>
                </div>
              </div>

              {/* Vertical Interactive Playhead (follows mouse coordinate percent) */}
              <div
                className="absolute top-[-32px] bottom-0 w-[1px] bg-[#f73a0b] pointer-events-none z-30 shadow-[0_0_8px_#f73a0b]"
                style={{ left: `${playheadX}%` }}
              />
              <div
                className="absolute top-[-32px] w-3 h-3 bg-[#f73a0b] pointer-events-none z-30"
                style={{
                  left: `${playheadX}%`,
                  transform: "translate(-50%, 0)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />
            </div>
          </div>

          {/* Active clip info bar */}
          <div className="flex justify-between items-center px-3 py-1.5 border-t border-white/5 bg-black/20">
            <span className="text-[#f73a0b] font-bold text-[8px] tracking-wider">CLIP_{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="text-[#e1e6e1] text-[8px] uppercase truncate max-w-[60%] font-semibold tracking-wider">
              {fixedNames[activeIndex] || timelineItems[activeIndex]?.title}
            </span>
            <span className="text-white/30 text-[7px] font-mono">24fps</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="a-hero-section-wrapper a-section-wrapper w-full h-[100svh] min-h-[600px] flex flex-col justify-between items-stretch relative overflow-hidden px-4 md:px-8 py-6 select-none bg-transparent"
      data-mouse="hero"
    >
      {/* ── Gradient Overlays ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* ── Header Navigation Bar ── */}
      <header className="relative w-full z-20 flex justify-end items-center h-16 mix-blend-difference">
        <nav className="flex gap-4 sm:gap-6 md:gap-10">
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="a-text-link font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase bg-transparent border-none cursor-pointer"
            data-mouse="link"
          >
            ABOUT
          </button>
          <button
            onClick={() => document.getElementById("works")?.scrollIntoView({ behavior: "smooth" })}
            className="a-text-link font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase bg-transparent border-none cursor-pointer"
            data-mouse="link"
          >
            WORKS
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="a-text-link font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase bg-transparent border-none cursor-pointer"
            data-mouse="link"
          >
            CONTACT
          </button>
        </nav>
      </header>

      {/* ── DESKTOP VIEW LAYOUT (Hidden on mobile) ── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="hidden md:flex flex-1 flex-col justify-between items-stretch relative"
      >
        {/* Center Wrapper: centered between header and timeline */}
        <div className="flex-1 relative flex items-center justify-center w-full z-10">
          {/* Center Headings (Absolute position at the top of the center wrapper) */}
          <div className="absolute top-0 flex flex-col items-center justify-center text-center pt-2 md:pt-4">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="a-hero-title font-body text-xl md:text-3xl lg:text-4xl text-[#e1e6e1] font-light leading-none tracking-normal mb-2"
            >
              {tagline}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="a-desc-sm font-body text-[10px] md:text-[12px] text-white/50 max-w-[480px] leading-relaxed"
            >
              {subtagline}
            </motion.h2>
          </div>

          {/* Full-width responsive SVG name */}
          <div className="w-full flex items-center justify-center select-none pointer-events-none">
            <svg
              className="a-hero-name w-full h-auto max-h-[30vh]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 135"
              preserveAspectRatio="xMidYMid meet"
            >
              <motion.text
                x="500"
                y="110"
                fontSize="130"
                fontWeight="900"
                textAnchor="middle"
                className="font-display fill-[#e1e6e1]"
                initial={{ letterSpacing: "0.15em", opacity: 0 }}
                animate={{ letterSpacing: "normal", opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              >
                ARAVINDHAN R
              </motion.text>
            </svg>
          </div>
        </div>

        {/* Interactive Video Editing Timeline Panel */}
        {renderTimeline()}
      </motion.div>

      {/* ── MOBILE VIEW LAYOUT ── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="flex md:hidden flex-1 flex-col justify-between items-stretch relative"
      >
        {/* Center headings and SVG name */}
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-4 px-2 py-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body text-xl sm:text-2xl text-[#e1e6e1] font-light leading-snug tracking-normal uppercase"
            >
              {tagline}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-body text-[13px] text-white/45 max-w-[300px] leading-relaxed px-2"
            >
              {subtagline}
            </motion.h2>
          </div>

          {/* Full-width responsive SVG name */}
          <div className="w-full select-none pointer-events-none px-1">
            <svg
              className="w-full h-auto max-h-[26vh]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 135"
              preserveAspectRatio="xMidYMid meet"
            >
              <motion.text
                x="500"
                y="110"
                fontSize="130"
                fontWeight="900"
                textAnchor="middle"
                className="font-display fill-[#e1e6e1]"
                initial={{ letterSpacing: "0.12em", opacity: 0 }}
                animate={{ letterSpacing: "normal", opacity: 1 }}
                transition={{ duration: 1.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              >
                ARAVINDHAN R
              </motion.text>
            </svg>
          </div>
        </div>

        {/* Mobile Timeline Panel (Exact Same Design) */}
        {renderTimeline()}
      </motion.div>
    </section>
  );
}
