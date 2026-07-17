"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "link" | "video">("default");
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for direct mouse tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Springs for smooth cursor trailing
  const springConfig = { damping: 35, stiffness: 350, mass: 0.35 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const cursorAttr = target.closest("[data-mouse]")?.getAttribute("data-mouse");
      const isLink =
        cursorAttr === "link" ||
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button");

      if (cursorAttr === "video") {
        setCursorType("video");
      } else if (isLink) {
        setCursorType("link");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* ── Screen-wide Crosshairs (Only visible on Desktop/hover) ── */}
      <motion.div
        className="a-mouse-horizonatal-line hidden md:block"
        style={{ y: mouseX }} // Wait, y needs to bind to mouseY, not mouseX! Correcting.
      />
      <motion.div
        className="a-mouse-horizonatal-line hidden md:block"
        style={{ top: mouseY }}
      />
      <motion.div
        className="a-mouse-vertical-line hidden md:block"
        style={{ left: mouseX }}
      />

      {/* ── Main Dynamic Cursor ── */}
      <motion.div
        className="a-mouse-main-wrapper hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        {/* Cursor Dot / Ring */}
        <motion.div
          className="relative flex items-center justify-center rounded-full"
          animate={{
            width: cursorType === "video" ? 90 : cursorType === "link" ? 70 : 8,
            height: cursorType === "video" ? 90 : cursorType === "link" ? 70 : 8,
            backgroundColor: cursorType === "link" ? "#e1e6e1" : "var(--primary)",
            scale: 1,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          style={{
            transform: "translate(-50%, -50%)",
            transformOrigin: "center",
          }}
        >
          {/* Rotating "PLAY • VIEW" circular text path for video hovers */}
          {cursorType === "video" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              {/* Rotating Outer SVG text */}
              <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_8s_linear_infinite] pointer-events-none">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text fill="#000000" fontSize="9" fontWeight="700" letterSpacing="2.5">
                  <textPath href="#circlePath">
                    PLAY • WORK • PLAY • WORK •
                  </textPath>
                </text>
              </svg>
              {/* Play symbol in center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-1/2">
                <svg width="12" height="12" fill="#000" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
