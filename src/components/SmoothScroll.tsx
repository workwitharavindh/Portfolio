"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        duration: 1.6, 
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // Clean exponential out
        smoothWheel: true,
        wheelMultiplier: 1.0,
        syncTouch: true, // Sync touch scroll for mobile/trackpad consistency
      }}
    >
      {children}
    </ReactLenis>
  );
}
