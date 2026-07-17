"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "splitting">("loading");
  const hasTriggered = useRef(false);

  // Auto-progress: smooth ramp from 0 → 100 in ~2.2s
  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 2200; // ms total

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      // Ease-out curve so it decelerates near 100
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 2.5);
      const val = Math.round(eased * 100);
      setProgress(val);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // 100% reached — pause briefly then split open
        setTimeout(() => {
          if (!hasTriggered.current) {
            hasTriggered.current = true;
            setPhase("splitting");
            setTimeout(() => onComplete(), 900);
          }
        }, 320);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const isSplitting = phase === "splitting";

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden select-none">

      {/* ── Top curtain half ── */}
      <motion.div
        className="absolute inset-x-0 top-0 bg-[#0a0a0a]"
        style={{ height: "50%" }}
        animate={{ y: isSplitting ? "-100%" : "0%" }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ── Bottom curtain half ── */}
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-[#0a0a0a]"
        style={{ height: "50%" }}
        animate={{ y: isSplitting ? "100%" : "0%" }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ── Content (fades out as curtains split) ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        animate={{ opacity: isSplitting ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Thin scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-white/5"
          animate={{ top: isSplitting ? "50%" : ["20%", "80%", "20%"] }}
          transition={
            isSplitting
              ? { duration: 0.2 }
              : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <div className="flex flex-col items-center gap-8 px-8 text-center">

          {/* Red dot + name */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#e63946]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <h1 className="font-mono text-[11px] md:text-[13px] tracking-[0.45em] text-white uppercase">
              ARAVINDHAN R
            </h1>
            <p className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] text-white/35 uppercase">
              Cinematic video editor
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-[180px] md:w-[240px] flex flex-col items-center gap-2.5">
            <div className="w-full h-px bg-white/8 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-[#e63946]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
            </div>
            <div className="flex w-full justify-between items-center">
              <span className="font-mono text-[7px] tracking-[0.3em] text-white/25 uppercase">
                Loading
              </span>
              <span className="font-mono text-[8px] tracking-[0.2em] text-white/50 tabular-nums">
                {String(progress).padStart(3, "0")}%
              </span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
