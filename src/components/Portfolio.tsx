"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import MediaEmbed from "./MediaEmbed";
import { getPlatformColor, getPlatformLabel } from "@/lib/parseMediaUrl";
import type { Platform } from "@/lib/parseMediaUrl";

interface PortfolioItem {
  id: string; title: string; category: string;
  videoUrl: string; thumbnailUrl: string; description: string;
  isFeatured: boolean; beforeVideoUrl?: string; afterVideoUrl?: string;
  platform?: Platform; embedUrl?: string; rawUrl?: string;
}

export default function Portfolio({ items }: { items: PortfolioItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category));
    return ["All", ...Array.from(cats)];
  }, [items]);

  const filtered = useMemo(() =>
    activeCategory === "All" ? items : items.filter(i => i.category === activeCategory),
    [items, activeCategory]);

  return (
    <section id="portfolio-section" style={{ background: "#111111", width: "100%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "7rem 2.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "2rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.4em", color: "var(--primary)", textTransform: "uppercase" }}>02</span>
            <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#fff", letterSpacing: "0.05em" }}>PORTFOLIO</h2>
          </div>
          <span className="font-mono" style={{ fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.3em" }}>{filtered.length} FILES</span>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "3rem" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className="font-mono"
              style={{
                padding: "0.45rem 1rem", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase",
                background: activeCategory === cat ? "var(--primary)" : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--text-dim)",
                border: `1px solid ${activeCategory === cat ? "var(--primary)" : "var(--border)"}`,
                cursor: "pointer", transition: "all 0.2s"
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div key={item.id} layout
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}
                onClick={() => setSelected(item)}
                style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#1a1a1a", cursor: "pointer" }}
                onMouseEnter={e => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1)"; }}
              >
                {/* Thumbnail */}
                {item.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumbnailUrl} alt={item.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, background: item.platform ? getPlatformColor(item.platform) + "20" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="28" height="28" fill="rgba(255,255,255,0.2)" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
                {/* Platform badge */}
                {item.platform && item.platform !== "direct" && item.platform !== "unknown" && (
                  <div style={{ position: "absolute", top: 10, right: 10, background: getPlatformColor(item.platform), padding: "2px 7px" }}>
                    <span style={{ fontSize: 7, fontFamily: "Space Mono,monospace", letterSpacing: "0.2em", color: "#fff", textTransform: "uppercase" }}>
                      {getPlatformLabel(item.platform)}
                    </span>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.25rem" }}>
                  <p className="font-mono" style={{ fontSize: 8, letterSpacing: "0.3em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>{item.category}</p>
                  <h3 className="font-display" style={{ fontSize: "clamp(14px,1.8vw,18px)", color: "#fff", letterSpacing: "0.04em" }}>{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <button onClick={() => setSelected(null)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", width: 44, height: 44, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}>
              <X size={16} />
            </button>
            <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              style={{ width: "100%", maxWidth: 900, background: "#111", border: "1px solid var(--border)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "88vh" }}>
              <div style={{ background: "#000", flex: 1, minHeight: 200 }}>
                {selected.beforeVideoUrl && selected.afterVideoUrl ? (
                  <BeforeAfterSlider beforeUrl={selected.beforeVideoUrl} afterUrl={selected.afterVideoUrl} />
                ) : (
                  <MediaEmbed
                    platform={selected.platform ?? "direct"}
                    embedUrl={selected.embedUrl ?? selected.videoUrl ?? ""}
                    thumbnailUrl={selected.thumbnailUrl}
                    title={selected.title}
                    controls={true}
                    style={{ maxHeight: "65vh" }}
                  />
                )}
              </div>
              <div style={{ padding: "1.5rem 2rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div>
                  <p className="font-mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>{selected.category}</p>
                  <h3 className="font-display" style={{ fontSize: "clamp(16px,2vw,22px)", color: "#fff", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>{selected.title}</h3>
                  <p className="font-body" style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.65, maxWidth: 500 }}>{selected.description}</p>
                </div>
                <button onClick={() => setSelected(null)} className="font-mono"
                  style={{ padding: "0.6rem 1.25rem", border: "1px solid var(--border)", background: "transparent", color: "var(--text-dim)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}>
                  Close ×
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
