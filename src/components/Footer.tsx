"use client";

import React from "react";

export default function Footer({ name }: { name: string }) {
  const displayName = name || "ARAVINDHAN R";

  return (
    <footer
      className="container-fluid px-4 md:px-8 py-8 md:py-10 relative w-full bg-transparent border-t border-white/5 select-none overflow-hidden"
    >
      {/* ── DESKTOP VIEW FOOTER (Hidden on mobile) ── */}
      <div className="hidden lg:flex relative z-10 w-full flex-col gap-4 text-white/40">
        {/* Row 1 */}
        <div className="flex flex-row items-center justify-between pt-2">
          <span className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase">
            (India, Available Worldwide)
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
        {/* Row 2 */}
        <div className="flex flex-row justify-center border-t border-white/[0.03] pt-4">
          <span className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase text-white/30">
            Designed & maintained by <a href="https://wa.me/917708414584" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#f73a0b] transition-colors" data-mouse="link">@arasukirubanandhan</a>
          </span>
        </div>
      </div>

      {/* ── MOBILE VIEW FOOTER (Hidden on desktop - custom centered stack) ── */}
      <div className="flex lg:hidden relative z-10 w-full flex-col items-center justify-center text-center gap-4 px-4 text-white/40">
        {/* Row 1 Stack */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[8px] tracking-[0.2em] uppercase">
            (India • Available Worldwide)
          </span>
          <div className="flex items-center gap-4 pt-1">
            <a
              href="/admin"
              className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/20 hover:text-[#f73a0b]"
            >
              [ADMIN CONTROL]
            </a>
            <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/30">
              (2026 © All rights reserved)
            </span>
          </div>
        </div>
        {/* Row 2 Stack */}
        <div className="w-full border-t border-white/[0.03] pt-3.5">
          <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/35">
            Designed & maintained by <a href="https://wa.me/917708414584" target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-[#f73a0b] transition-colors">@arasukirubanandhan</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
