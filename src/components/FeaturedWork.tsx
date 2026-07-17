"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseMediaUrl } from "@/lib/parseMediaUrl";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  youtubeUrl?: string;
  thumbnailUrl: string;
  description: string;
  isFeatured: boolean;
  layout?: "Horizontal" | "Vertical";
}

export default function FeaturedWork({
  categories = [],
  items,
  onPlay
}: {
  categories?: string[];
  items: PortfolioItem[];
  onPlay: (i: PortfolioItem) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [limitRows, setLimitRows] = useState(3);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setLimitRows(3);
  };

  const fallbackCategories = React.useMemo(() => [
    "Featured Work",
    "Commercial Projects",
    "Viral Content",
    "YouTube Content",
    "Reels",
    "Color Grading"
  ], []);

  const displayCategories = React.useMemo(() => {
    const catsSet = new Set<string>();
    const baseCats = categories.length > 0 ? categories : fallbackCategories;
    
    // Add base categories to set
    baseCats.forEach(cat => {
      if (cat && cat.trim()) catsSet.add(cat.trim());
    });
    
    // Add categories from items to make sure all items are filterable
    items.forEach(item => {
      if (item.category && item.category.trim()) {
        const trimmed = item.category.trim();
        const existing = Array.from(catsSet).find(c => c.toLowerCase() === trimmed.toLowerCase());
        if (!existing) {
          catsSet.add(trimmed);
        }
      }
    });
    
    return ["All", ...Array.from(catsSet)];
  }, [categories, fallbackCategories, items]);

  // Prevent item duplication by tracking unique IDs
  const uniqueItems = React.useMemo(() => {
    const seen = new Set<string>();
    return items.filter(item => {
      if (!item.id) return false;
      const itemIdStr = String(item.id).trim();
      if (seen.has(itemIdStr)) return false;
      seen.add(itemIdStr);
      return true;
    });
  }, [items]);

  const filteredItems = React.useMemo(() => {
    return uniqueItems.filter(item => {
      if (activeCategory === "All") return true;
      return item.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase();
    });
  }, [uniqueItems, activeCategory]);

  // Visible items calculation based on limitRows in 3-column layout
  const getVisibleItemsForRows = React.useCallback((itemsList: PortfolioItem[], maxRows: number) => {
    const colHeights = [0, 0, 0];
    const visible: PortfolioItem[] = [];
    let hasMore = false;

    for (const item of itemsList) {
      const isVertical = item.layout === "Vertical";
      
      // Find column with minimum height
      let minColIdx = 0;
      let minHeight = colHeights[0];
      for (let i = 1; i < 3; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i];
          minColIdx = i;
        }
      }

      const itemHeight = isVertical ? 2 : 1;
      
      if (colHeights[minColIdx] + itemHeight <= maxRows) {
        colHeights[minColIdx] += itemHeight;
        visible.push(item);
      } else {
        hasMore = true;
        break; // Break the loop so subsequent items are not added out of order/skipped
      }
    }

    return { visible, hasMore };
  }, []);

  const { visible: visibleItems, hasMore } = getVisibleItemsForRows(filteredItems, limitRows);

  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
    const video = videoRefs.current[id];
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (id: string) => {
    setHoveredId(null);
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <section
      id="works"
      className="container-fluid px-4 md:px-8 py-12 md:py-16 w-full bg-transparent select-none"
      data-role="section"
      data-section="works"
    >
      {/* ── Section Tag and Title ── */}
      <h2
        className="a-tag font-mono text-[9px] tracking-[0.3em] text-[#f73a0b] uppercase mb-4"
        style={{ color: "var(--primary)" }}
      >
        (Works)
      </h2>

      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 gap-4">
          <h3 className="a-section-title-lg font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[#e1e6e1] font-bold uppercase leading-none tracking-normal">
            Selected Projects
          </h3>
          <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase hidden sm:inline">
            [{filteredItems.length} Files]
          </span>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex overflow-x-auto md:flex-wrap gap-2 md:gap-3 mb-8 md:mb-12 border-b border-white/5 pb-6 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {displayCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`font-mono text-[8px] md:text-[9px] tracking-[0.15em] md:tracking-[0.2em] px-3.5 md:px-4 py-2 uppercase border rounded-full md:rounded-none shrink-0 transition-all duration-300 relative cursor-pointer ${
                  isActive
                    ? "text-white border-[#f73a0b] bg-[#f73a0b]"
                    : "text-white/50 border-white/10 hover:border-white/20 hover:text-white bg-transparent"
                }`}
                style={{
                  textShadow: isActive ? "0 0 8px rgba(255,255,255,0.5)" : "none",
                  boxShadow: isActive ? "0 0 15px rgba(247,58,11,0.25)" : "none"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3-column unified grid for both mobile and desktop view */}
        <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto w-full relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {visibleItems.map((item) => {
              const isVertical = item.layout === "Vertical";

              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`w-full flex flex-col group ${
                    isVertical 
                      ? "row-span-2 col-span-1" 
                      : "col-span-1 row-span-1"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as const }}
                >
                  {/* Visual Frame Block */}
                  <div
                    className={`a-product-card w-full relative overflow-hidden bg-[#181818] cursor-pointer ${
                      isVertical ? "w-full aspect-[3/3.7] md:aspect-[3/3.65]" : "aspect-video w-full"
                    }`}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={() => handleMouseLeave(item.id)}
                    onClick={() => onPlay(item)}
                    data-mouse="video"
                  >
                    {/* Corner SVG Brackets */}
                    <svg className="a-work-hover-indicator absolute z-20 pointer-events-none" width="16" height="16" viewBox="0 0 25 25" fill="none" style={{ top: 6, left: 6 }}><path d="M0.5 24.5V0.5H24.5" stroke="#e1e6e1" strokeWidth="1.2" /></svg>
                    <svg className="a-work-hover-indicator absolute z-20 pointer-events-none" width="16" height="16" viewBox="0 0 25 25" fill="none" style={{ top: 6, right: 6 }}><path d="M0 0.5H24V24.5" stroke="#e1e6e1" strokeWidth="1.2" /></svg>
                    <svg className="a-work-hover-indicator absolute z-20 pointer-events-none" width="16" height="16" viewBox="0 0 25 25" fill="none" style={{ bottom: 6, right: 6 }}><path d="M0 24H24V0" stroke="#e1e6e1" strokeWidth="1.2" /></svg>
                    <svg className="a-work-hover-indicator absolute z-20 pointer-events-none" width="16" height="16" viewBox="0 0 25 25" fill="none" style={{ bottom: 6, left: 6 }}><path d="M0.5 0V24H24.5" stroke="#e1e6e1" strokeWidth="1.2" /></svg>

                    {/* Thumbnail and Video */}
                    {(() => {
                      const getThumbnailUrl = (pItem: PortfolioItem) => {
                        if (pItem.thumbnailUrl && pItem.thumbnailUrl.trim() !== "") {
                          const driveMatch = pItem.thumbnailUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
                          if (driveMatch) {
                            return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
                          }
                          return pItem.thumbnailUrl;
                        }
                        const parsed = parseMediaUrl(pItem.youtubeUrl || pItem.videoUrl);
                        if (parsed.platform === "youtube" && parsed.thumbnailUrl) return parsed.thumbnailUrl;
                        if (parsed.platform === "drive" && parsed.thumbnailUrl) return parsed.thumbnailUrl;
                        return "";
                      };

                      const thumbnailUrlToShow = getThumbnailUrl(item);
                      const parsed = parseMediaUrl(item.youtubeUrl || item.videoUrl);
                      const isDirectVideo = parsed.platform === "direct";
                      const isHovered = hoveredId === item.id;

                      return (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                          {thumbnailUrlToShow && (
                            <img
                              src={thumbnailUrlToShow}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 ease-out group-hover:scale-105"
                              style={{ opacity: isDirectVideo && isHovered ? 0 : 1 }}
                            />
                          )}

                          {isDirectVideo && item.videoUrl && (
                            <video
                              ref={(el) => { videoRefs.current[item.id] = el; }}
                              src={item.videoUrl}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 ease-out group-hover:scale-105"
                              style={{ opacity: (isHovered || !thumbnailUrlToShow) ? 1 : 0 }}
                            />
                          )}

                          {!isDirectVideo && (
                            <div
                              className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300"
                              style={{ opacity: isHovered ? 1 : 0, background: "rgba(0,0,0,0.35)" }}
                            >
                              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/60 flex items-center justify-center backdrop-blur-sm bg-black/30">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    <div className="absolute inset-0 bg-black/5 z-[5] pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8 md:mt-12">
            <button
              onClick={() => setLimitRows(prev => prev + 3)}
              className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] px-6 md:px-8 py-3 md:py-3.5 border border-white/10 hover:border-[#f73a0b] text-white/60 hover:text-white uppercase transition-all duration-300 bg-transparent hover:bg-[#f73a0b]/5 relative group cursor-pointer w-full md:w-auto text-center"
            >
              <span className="relative z-10">View More Works</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
