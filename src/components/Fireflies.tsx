"use client";

import React, { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  radius: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  alpha: number;
  alphaSpeed: number;
  alphaPhase: number;
  maxAlpha: number;
  color: string;
  wobbleAngle: number;
  wobbleSpeed: number;
  wobbleRadius: number;
}

export default function Fireflies() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef({ lastY: 0, velocityY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let fireflies: Firefly[] = [];
    const particleCount = 65; // Balanced for premium density and performance

    // Colors matching the dark cinematic red/orange palette
    const colors = [
      "rgba(247, 58, 11, ",   // Primary Red/Orange (#f73a0b)
      "rgba(234, 179, 8, ",   // Amber Yellow (#eab308)
      "rgba(249, 115, 22, ",  // Warm Orange (#f97316)
    ];

    // Set Canvas Dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize Particles
    const initParticles = () => {
      fireflies = [];
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2.2 + 0.8; // Varying sizes for depth
        const x = Math.random() * w;
        const y = Math.random() * h;
        
        fireflies.push({
          x,
          y,
          radius,
          baseX: x,
          baseY: y,
          // Floating speed
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(Math.random() * 0.4 + 0.1), // Primarily drifts upward
          alpha: Math.random() * 0.5 + 0.1,
          alphaSpeed: Math.random() * 0.02 + 0.005,
          alphaPhase: Math.random() * Math.PI * 2,
          maxAlpha: Math.random() * 0.5 + 0.4, // Breathing limits
          color: colors[Math.floor(Math.random() * colors.length)],
          wobbleAngle: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
          wobbleRadius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // Track scroll velocity
    scrollRef.current.lastY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - scrollRef.current.lastY;
      
      // Add vertical scroll influence (capped to avoid extreme warping)
      scrollRef.current.velocityY += diff * 0.15;
      if (Math.abs(scrollRef.current.velocityY) > 15) {
        scrollRef.current.velocityY = Math.sign(scrollRef.current.velocityY) * 15;
      }
      
      scrollRef.current.lastY = currentScrollY;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    resizeCanvas();

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;
      const scroll = scrollRef.current;

      // Decay scroll velocity smoothly back to 0 (lerp)
      scroll.velocityY *= 0.92;

      fireflies.forEach((p) => {
        // 1. Natural Drift & Wobble (Organic noise simulation)
        p.wobbleAngle += p.wobbleSpeed;
        const wobbleX = Math.cos(p.wobbleAngle) * p.wobbleRadius * 0.12;
        const wobbleY = Math.sin(p.wobbleAngle) * p.wobbleRadius * 0.12;

        p.x += p.vx + wobbleX;
        // Natural rising drift + scroll speed effect (scroll down pulls particles up)
        p.y += p.vy + wobbleY - (scroll.velocityY * 0.25);

        // 2. Mouse Interaction (Subtle Repulsion)
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const forceRadius = 130;

          if (distance < forceRadius) {
            const force = (forceRadius - distance) / forceRadius;
            const angle = Math.atan2(dy, dx);
            // Gently nudge particle away
            p.x += Math.cos(angle) * force * 1.8;
            p.y += Math.sin(angle) * force * 1.8;
          }
        }

        // 3. Screen wrap boundaries
        if (p.x < -20) p.x = w + 10;
        if (p.x > w + 20) p.x = -10;
        if (p.y < -20) p.y = h + 10;
        if (p.y > h + 20) p.y = -10;

        // 4. Breathing/Pulsing alpha (opacity animation)
        p.alphaPhase += p.alphaSpeed;
        const alpha = p.maxAlpha * (0.4 + 0.6 * Math.sin(p.alphaPhase));

        // 5. Draw Particle with Radial Gradient Glow
        ctx.beginPath();
        const radGrad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 3.5
        );
        radGrad.addColorStop(0, "rgba(255, 255, 255, " + alpha + ")");
        radGrad.addColorStop(0.2, p.color + alpha + ")");
        radGrad.addColorStop(0.6, p.color + (alpha * 0.35) + ")");
        radGrad.addColorStop(1, p.color + "0)");

        ctx.fillStyle = radGrad;
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full block"
      style={{
        zIndex: 2,
        mixBlendMode: "screen",
      }}
    />
  );
}
