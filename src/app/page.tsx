"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import FeaturedWork from "@/components/FeaturedWork";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MediaEmbed from "@/components/MediaEmbed";
import Fireflies from "@/components/Fireflies";
import { parseMediaUrl } from "@/lib/parseMediaUrl";
import defaultConfig from "@/data/config.json";

// ─────────── Types ───────────
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  videoUrl: string;
  youtubeUrl?: string;
  thumbnailUrl: string;
  description: string;
  isFeatured: boolean;
  layout?: "Horizontal" | "Vertical";
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(defaultConfig);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(defaultConfig.portfolioItems as PortfolioItem[]);
  const [playItem, setPlayItem] = useState<PortfolioItem | null>(null);

  // Scroll-linked parallax background values
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.22, 0.08]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.75]);

  // Fullscreen video player controls state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerVideoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [activeVideoUrl, setActiveVideoUrl] = useState("");

  // Fetch latest config at load time
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
          setPortfolioItems((data.portfolioItems ?? defaultConfig.portfolioItems) as PortfolioItem[]);
        }
      } catch {
        // Fall back to static config
      }
    };
    fetchConfig();
  }, []);

  // Update active video URL when items are resolved
  useEffect(() => {
    if (portfolioItems.length > 0) {
      const heroVid =
        portfolioItems.find(i => i.isFeatured && i.videoUrl)?.videoUrl ||
        portfolioItems.find(i => i.videoUrl)?.videoUrl ||
        "";
      setActiveVideoUrl(heroVid);
    }
  }, [portfolioItems]);

  const heroVideo =
    portfolioItems.find(i => i.isFeatured && i.videoUrl)?.videoUrl ||
    portfolioItems.find(i => i.videoUrl)?.videoUrl ||
    "";

  const socials: Record<string, string> = {
    Instagram: config.contactDetails?.instagram ?? "",
    LinkedIn: config.contactDetails?.linkedin ?? "",
  };

  // Fullscreen player handlers
  useEffect(() => {
    if (playItem) {
      setIsPlaying(true);
      setIsMuted(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [playItem]);

  const togglePlay = () => {
    const video = playerVideoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = playerVideoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const video = playerVideoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = playerVideoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const video = playerVideoRef.current;
    if (!progressBar || !video || duration === 0) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const newTime = percent * duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
  };

  return (
    <>
      {/* Preloader split-reveal */}
      <AnimatePresence mode="wait">
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Main Experience Layout */}
      {!loading && (
        <>
          {/* Global Background Video (Fixed and transparent with scroll-parallax scaling) */}
          <motion.video
            key={activeVideoUrl}
            src={activeVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
            style={{ 
              scale: bgScale,
              opacity: bgOpacity,
            }}
          />
          {/* Global dark filter for contrast overlay */}
          <motion.div 
            className="fixed inset-0 bg-[#090809] pointer-events-none z-0" 
            style={{ opacity: overlayOpacity }}
          />

          {/* Interactive Cinematic Fireflies Background */}
          <Fireflies />

          <SmoothScroll>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col w-full min-h-screen relative z-10"
            >
              {/* Hero & Navigation */}
              <Hero
                name={config.siteName}
                tagline={config.tagline}
                subtagline={config.subtagline}
                activeVideoUrl={activeVideoUrl}
                onVideoChange={setActiveVideoUrl}
                items={portfolioItems}
              />

            {/* About Narrative split overlay */}
            <About
              aboutText={config.aboutText ?? ""}
              imageUrl={config.aboutImageUrl}
            />

            {/* Selected Works vertical asymmetric grid */}
            <FeaturedWork
              categories={config.categories ?? []}
              subcategories={config.subcategories ?? []}
              items={portfolioItems}
              onPlay={(item) => setPlayItem(item)}
            />

            {/* What I Do - typographic services rows */}
            <Services services={config.services ?? []} />

            {/* Connect - SVG contact page */}
            <Contact
              email={config.contactDetails?.email ?? ""}
              phone={config.contactDetails?.whatsapp ?? ""}
              socials={socials}
            />

            {/* Footer with giant SVG name */}
            <Footer name={config.siteName} />
          </motion.div>
        </SmoothScroll>
        </>
      )}

      {/* ── Custom Fullscreen Video Preview Player ── */}
      <AnimatePresence>
        {playItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[1000] bg-[#090809] flex flex-col justify-between items-stretch p-4 md:p-8"
          >
            {/* Player Header - CLOSE button */}
            <div className="flex justify-end w-full py-4 relative z-10">
              <button
                onClick={() => setPlayItem(null)}
                className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#e1e6e1] bg-transparent border-none cursor-pointer hover:text-[#f73a0b] transition-colors"
                data-mouse="link"
              >
                CLOSE
              </button>
            </div>

            {/* Main Video Frame */}
            <div className="flex-1 w-full flex items-center justify-center relative max-h-[72vh] md:max-h-[78vh] overflow-hidden">
              {playItem && (
                (() => {
                  const parsedMedia = parseMediaUrl(playItem.youtubeUrl || playItem.videoUrl);
                  if (parsedMedia.platform === "direct") {
                    return (
                      <video
                        ref={playerVideoRef}
                        autoPlay
                        playsInline
                        src={playItem.videoUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onClick={togglePlay}
                        className="max-w-full max-h-full object-contain cursor-pointer"
                      />
                    );
                  } else {
                    return (
                      <MediaEmbed
                        platform={parsedMedia.platform}
                        embedUrl={parsedMedia.embedUrl}
                        thumbnailUrl={playItem.thumbnailUrl}
                        title={playItem.title}
                        autoPlay={true}
                        style={playItem.layout === "Vertical"
                          ? { height: "100%", width: "auto", aspectRatio: "9/16", maxHeight: "75vh", maxWidth: "100%" }
                          : { height: "auto", width: "100%", maxWidth: "960px", aspectRatio: "16/9" }
                        }
                      />
                    );
                  }
                })()
              )}
            </div>

            {/* Custom Control Deck at Bottom */}
            <div className="w-full flex flex-col pt-6 z-10 select-none">
              <div className="flex justify-between items-end pb-3">
                {/* Title Details */}
                <div className="flex flex-col">
                  <span className="font-mono text-[7px] text-[#f73a0b] uppercase tracking-widest leading-none mb-1">
                    {playItem.category}
                  </span>
                  <h3 className="font-display text-xl md:text-3xl lg:text-4xl text-[#e1e6e1] leading-none uppercase">
                    {playItem.title}
                  </h3>
                </div>

                {/* Circle Controls (Play & Mute) - Only for Direct MP4 */}
                {playItem && parseMediaUrl(playItem.youtubeUrl || playItem.videoUrl).platform === "direct" && (
                  <div className="flex gap-4">
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-[#e1e6e1] hover:bg-[#f73a0b] transition-colors group cursor-pointer border-none"
                      data-mouse="link"
                    >
                      {isPlaying ? (
                        <svg width="14" height="14" fill="#090809" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" fill="#090809" viewBox="0 0 24 24" className="ml-0.5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Mute/Unmute Button */}
                    <button
                      onClick={toggleMute}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-[#e1e6e1] hover:bg-[#f73a0b] transition-colors group cursor-pointer border-none"
                      data-mouse="link"
                    >
                      {isMuted ? (
                        <svg width="14" height="14" fill="#090809" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM3 9v6h4l5 5V4L7 9H3zm13.5 3c0 2.22-1.03 4.2-2.5 5.5v2.24c3.08-1.5 5.5-4.66 5.5-7.74s-2.42-6.24-5.5-7.74v2.24c1.47 1.3 2.5 3.28 2.5 5.5z" />
                          <line x1="1" y1="1" x2="23" y2="23" stroke="#090809" strokeWidth="2" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" fill="#090809" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Seek Bar - Only for Direct MP4 */}
              {playItem && parseMediaUrl(playItem.youtubeUrl || playItem.videoUrl).platform === "direct" && (
                <>
                  <div
                    ref={progressBarRef}
                    onClick={handleProgressBarClick}
                    className="w-full h-[3px] bg-white/10 relative cursor-pointer group mb-2 hover:h-[5px] transition-all"
                    data-mouse="link"
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-[#e1e6e1]"
                      style={{
                        width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  {/* Time stamps */}
                  <div className="flex justify-between items-center text-[#e1e6e1a0] font-mono text-[9px] tracking-widest pt-1.5">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
