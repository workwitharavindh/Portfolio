"use client";
import React, { useState, useRef, useEffect } from "react";
import { getPlatformLabel, getPlatformColor } from "@/lib/parseMediaUrl";
import type { Platform } from "@/lib/parseMediaUrl";

interface MediaEmbedProps {
  platform: Platform;
  embedUrl: string;
  thumbnailUrl?: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function MediaEmbed({
  platform,
  embedUrl,
  thumbnailUrl,
  title = "",
  autoPlay = false,
  controls = true,
  style = {},
}: MediaEmbedProps) {
  const [playing, setPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [autoPlay]);

  const wrapStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    background: "#000",
    overflow: "hidden",
    ...style,
  };

  // ── Direct MP4 video ──────────────────────────────────────
  if (platform === "direct") {
    return (
      <div style={wrapStyle}>
        <video
          ref={videoRef}
          src={embedUrl}
          controls={controls}
          autoPlay={autoPlay}
          loop
          muted={autoPlay}
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  // ── YouTube / Google Drive iframe ─────────────────────────
  if (platform === "youtube" || platform === "drive") {
    // For YouTube, if not playing yet show thumbnail + play button
    if (platform === "youtube" && !playing && thumbnailUrl) {
      return (
        <div style={{ ...wrapStyle, cursor: "pointer" }} onClick={() => setPlaying(true)}>
          {/* Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Dark overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
          {/* Play button */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 64, height: 64, borderRadius: "50%", background: "#e63946",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 40px rgba(230,57,70,0.5)", transition: "transform 0.2s",
          }}>
            <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24" style={{ marginLeft: 3 }}>
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
          {/* Platform badge */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: getPlatformColor(platform), padding: "3px 8px",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 9, fontFamily: "Space Mono,monospace", letterSpacing: "0.2em", color: "#fff", textTransform: "uppercase" }}>
              {getPlatformLabel(platform)}
            </span>
          </div>
        </div>
      );
    }

    const src = platform === "youtube" && playing
      ? embedUrl.replace("autoplay=0", "autoplay=1")
      : embedUrl;

    return (
      <div style={wrapStyle}>
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: getPlatformColor(platform), padding: "3px 8px",
          pointerEvents: "none",
        }}>
          <span style={{ fontSize: 9, fontFamily: "Space Mono,monospace", letterSpacing: "0.2em", color: "#fff", textTransform: "uppercase" }}>
            {getPlatformLabel(platform)}
          </span>
        </div>
      </div>
    );
  }

  // ── Instagram embed ──────────────────────────────────────
  if (platform === "instagram") {
    return (
      <div style={{
        position: "relative",
        height: "100%",
        width: "auto",
        aspectRatio: "9/16",
        background: "#000",
        margin: "0 auto",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}>
        <iframe
          src={embedUrl}
          title={title}
          allowFullScreen
          scrolling="no"
          style={{ position: "absolute", top: -2, left: -2, width: "calc(100% + 4px)", height: "calc(100% + 4px)", border: "none" }}
        />
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: getPlatformColor("instagram"), padding: "3px 8px",
          pointerEvents: "none", borderRadius: "4px"
        }}>
          <span style={{ fontSize: 9, fontFamily: "Space Mono,monospace", letterSpacing: "0.2em", color: "#fff", textTransform: "uppercase" }}>
            Instagram Reel
          </span>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div style={{ ...wrapStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-dim)", fontFamily: "Space Mono,monospace", fontSize: 11 }}>
        Unsupported media type
      </p>
    </div>
  );
}
