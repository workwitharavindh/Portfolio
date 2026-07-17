"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Particles Geometry
    const particlesCount = 280;
    const positions = new Float32Array(particlesCount * 3);
    const randomSpeeds = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Positions
      positions[i] = (Math.random() - 0.5) * 10; // X
      positions[i + 1] = (Math.random() - 0.5) * 10; // Y
      positions[i + 2] = (Math.random() - 0.5) * 8; // Z

      // Drift speeds
      randomSpeeds[i] = (Math.random() - 0.5) * 0.002;
      randomSpeeds[i + 1] = (Math.random() - 0.5) * 0.002;
      randomSpeeds[i + 2] = (Math.random() - 0.5) * 0.002;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // 5. Particles Material (custom circular glow)
    // Create a canvas texture for a circular soft glow
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, "rgba(255, 0, 60, 1)");
      gradient.addColorStop(0.3, "rgba(255, 0, 85, 0.8)");
      gradient.addColorStop(1, "rgba(255, 0, 60, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.08,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    // 6. Create points
    const particleField = new THREE.Points(geometry, material);
    scene.add(particleField);

    // 7. Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };
    window.removeEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow overall drift
      const positionsArr = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount * 3; i += 3) {
        positionsArr[i] += randomSpeeds[i];
        positionsArr[i + 1] += randomSpeeds[i + 1];

        // Boundary checks to recycle particles
        if (Math.abs(positionsArr[i]) > 5) randomSpeeds[i] *= -1;
        if (Math.abs(positionsArr[i + 1]) > 5) randomSpeeds[i + 1] *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Parallax effect based on mouse
      const targetX = mouseRef.current.x * 0.4;
      const targetY = -mouseRef.current.y * 0.4;

      particleField.rotation.y += (targetX - particleField.rotation.y) * 0.05;
      particleField.rotation.x += (targetY - particleField.rotation.x) * 0.05;
      
      // Auto rotation drift
      particleField.rotation.z += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      texture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-[2]" 
      style={{ mixBlendMode: "plus-lighter" }}
    />
  );
}
