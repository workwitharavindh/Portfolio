"use client";

import React from "react";

export default function Footer({ name }: { name: string }) {
  const displayName = name || "ARAVINDHAN R";

  return (
    <footer
      className="container-fluid px-4 md:px-8 py-8 md:py-12 relative w-full bg-transparent border-t border-white/5 select-none overflow-hidden"
    >
      {/* ── DESKTOP VIEW FOOTER (Hidden on mobile) ── */}
      <div className="hidden lg:flex relative z-10 w-full flex-col">
        <div className="flex flex-row items-center justify-between pt-2 text-white/40">
          <span className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase">
            (India, Available Worldwide)
          </span>
          <span className="font-body text-[9px] md:text-[10px] tracking-[0.1em] font-light uppercase">
          Cinematic video editor
          </span>
          <div className="flex flex-row gap-6 items-center">
            <a
              href="/admin"
              className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase text-white/20 hover:text-[#f73a0b] transition-colors"
              data-mouse="link"
            >
              [ADMIN CONTROL]
            </a>
            <span className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase">
              (2026 © All rights reserved)
            </span>
          </div>
        </div>
      </div>

      {/* ── MOBILE VIEW FOOTER (Hidden on desktop - custom centered stack) ── */}
      <div className="flex lg:hidden relative z-10 w-full flex-col items-center justify-center text-center gap-4 px-4">
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/40">
          (India • Available Worldwide)
        </span>
        <span className="font-body text-[9px] tracking-[0.1em] font-light uppercase text-white/50">
          Cinematic video editor
        </span>
        <div className="flex flex-col gap-2.5 items-center pt-2">
          <a
            href="/admin"
            className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/20 hover:text-[#f73a0b]"
          >
            [ADMIN CONTROL]
          </a>
          <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/30 pt-1">
            (2026 © All rights reserved)
          </span>
        </div>
      </div>
    </footer>
  );
}
