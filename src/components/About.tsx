"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AboutProps {
  aboutText: string;
  imageUrl?: string;
}

export default function About({ aboutText, imageUrl }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this section to drive image parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Scale and translate transforms to make the image float organically within its viewport mask
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 0.98]);
  const imgY = useTransform(scrollYProgress, [0, 1], [25, -25]);

  // Parse Google Drive sharing URLs to direct-render urls if applicable
  const resolveImageUrl = (url: string | undefined): string => {
    if (!url) return "https://images.unsplash.com/photo-1585647347483-22b66260dffd?auto=format&fit=crop&w=1200&q=80";
    
    // Check if it's a standard Google Drive file view URL
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://drive.google.com/uc?id=${driveMatch[1]}`;
    }
    
    // Check if it's a Google Drive uc?id URL
    const driveUcMatch = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (driveUcMatch) {
      return `https://drive.google.com/uc?id=${driveUcMatch[1]}`;
    }
    
    return url;
  };

  const defaultImage = resolveImageUrl(imageUrl);

  // Animation variants for skills stagger reveal
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <section
      ref={containerRef}
      id="about"
      className="container-fluid px-4 md:px-8 a-about-section-wrapper a-section-wrapper py-12 md:py-16 relative w-full overflow-hidden bg-transparent"
      data-role="section"
      data-section="about"
    >
      {/* ── DESKTOP LAYOUT (Hidden on mobile) ── */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-6xl mx-auto w-full">
        {/* Left Column: Bio Narrative & Skills */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="a-tag font-mono text-[9px] tracking-[0.3em] text-[#f73a0b] uppercase mb-4"
          >
            (About)
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="a-section-title font-body text-xl md:text-2xl lg:text-3xl text-[#e1e6e1] font-light leading-snug tracking-tight mb-6"
          >
            I&apos;m an India-based video editor exploring color grading, post-production, and premium visual storytelling.
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="a-desc-lg font-body text-xs md:text-sm text-white/60 leading-relaxed mb-8"
          >
            {aboutText || (
              <>
                I&apos;ve always been drawn to visuals, the way a single moment can feel completely different depending on how it&apos;s captured, framed, or edited. Over time, that curiosity grew into a genuine interest in photography, videography, and editing. I enjoy the entire process from capturing a frame to shaping the final story.
                <br />
                <br />
                My work often begins in post production, where pacing, color, sound, and structure shape how a story feels. Photography and videography naturally extend that process, helping maintain a consistent visual direction from capture to the final output.
                <br />
                <br />
                Based in India, I collaborate with clients across the globe on individual and commercial projects, delivering visuals that are crafted, deliberate, and built to last.
              </>
            )}
          </motion.p>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-wrap gap-2"
          >
            {["Final Cut Pro", "Premiere Pro", "Davinci Resolve", "After Effects", "Photoshop", "Lightroom"].map((skill) => (
              <motion.span
                key={skill}
                variants={itemVariants}
                className="font-mono text-[9px] sm:text-[8px] tracking-[0.2em] text-[#e1e6e1a0] border border-[#e1e6e115] px-3 py-1.5 uppercase bg-white/2"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Portrait Image with mask-scroll parallax zoom */}
        <div className="col-span-12 lg:col-span-5 flex justify-center lg:justify-end">
          <div 
            className="a-about-image-wrap overflow-hidden rounded-sm border border-white/5 shadow-2xl w-full max-w-[320px] lg:max-w-full relative max-h-[70svh]"
            style={{
              aspectRatio: "3/4"
            }}
          >
            <motion.img
              src={defaultImage}
              alt="Aravindhan R - Video Editor Portrait"
              className="a-about-image object-cover absolute inset-0 w-full h-full"
              style={{
                scale: imgScale,
                y: imgY,
                height: "120%", // Extra height to absorb parallax translation
                top: "-10%",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (Completely custom centered flow layout) ── */}
      <div className="flex md:hidden flex-col items-center justify-center text-center max-w-sm mx-auto w-full gap-8">
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[9px] tracking-[0.3em] text-[#f73a0b] uppercase mb-2"
          >
            (About)
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-body text-[17px] text-[#e1e6e1] font-normal leading-relaxed px-2"
          >
            India-based video editor exploring post-production &amp; storytelling.
          </motion.h3>
        </div>

        {/* Centered Circular Portrait Image with breathing glow border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8 }}
          className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-[#f73a0b]/80 shadow-[0_0_15px_rgba(247,58,11,0.25)]"
        >
          <img
            src={defaultImage}
            alt="Aravindhan R"
            className="object-cover w-full h-full"
          />
        </motion.div>

        {/* Narrative bio */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-body text-xs text-white/70 leading-relaxed px-4"
        >
          {aboutText || (
            "I've always been drawn to visuals, the way a single moment can feel completely different depending on how it's captured or edited. I collaborate with clients across the globe on post-production, grading, foley sound design, and post workflow development."
          )}
        </motion.p>

        {/* Skills Chips Grid */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-2.5 w-full px-6"
        >
          {["Final Cut Pro", "Premiere Pro", "Davinci Resolve", "After Effects", "Photoshop", "Lightroom"].map((skill) => (
            <motion.span
              key={skill}
              variants={itemVariants}
              className="font-mono text-[8px] tracking-[0.15em] text-[#e1e6e1] border border-white/10 rounded-sm py-2 px-2 uppercase bg-black/10 text-center truncate"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
