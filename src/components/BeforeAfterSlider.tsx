"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeVideoRef = useRef<HTMLVideoElement>(null);
  const afterVideoRef = useRef<HTMLVideoElement>(null);

  // Keep both videos in sync
  useEffect(() => {
    const v1 = beforeVideoRef.current;
    const v2 = afterVideoRef.current;
    if (!v1 || !v2) return;

    const syncPlay = () => {
      v2.currentTime = v1.currentTime;
      if (v1.paused) {
        v2.pause();
      } else {
        v2.play().catch(() => {});
      }
    };

    v1.addEventListener("play", syncPlay);
    v1.addEventListener("pause", syncPlay);
    v1.addEventListener("seeking", syncPlay);
    v1.addEventListener("seeked", syncPlay);
    v1.addEventListener("timeupdate", () => {
      if (Math.abs(v1.currentTime - v2.currentTime) > 0.15) {
        v2.currentTime = v1.currentTime;
      }
    });

    return () => {
      v1.removeEventListener("play", syncPlay);
      v1.removeEventListener("pause", syncPlay);
      v1.removeEventListener("seeking", syncPlay);
      v1.removeEventListener("seeked", syncPlay);
    };
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden aspect-video w-full border border-white/10 ${className}`}
    >
      {/* Before Video / Image (Base layer) */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={beforeVideoRef}
          src={beforeUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 text-[10px] tracking-widest text-white uppercase font-bold border border-white/15">
          RAW/LOG
        </div>
      </div>

      {/* After Video / Image (Clipped overlay layer) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <video
          ref={afterVideoRef}
          src={afterUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-red-600/95 px-3 py-1 text-[10px] tracking-widest text-white uppercase font-bold border border-red-500/30">
          GRADED VFX
        </div>
      </div>

      {/* Slider Bar Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-red-500 cursor-ew-resize z-30 shadow-[0_0_10px_#ff003c]"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-600 border border-white/20 shadow-2xl flex items-center justify-center pointer-events-none text-white">
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
