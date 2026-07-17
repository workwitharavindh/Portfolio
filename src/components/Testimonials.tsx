"use client";
import React from "react";
import { motion } from "framer-motion";

interface TestimonialItem { name: string; role: string; text: string; }

export default function Testimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  return (
    <section id="testimonials-section" style={{ background: "#0a0a0a", width: "100%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "7rem 2.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "2rem", marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.4em", color: "var(--primary)", textTransform: "uppercase" }}>05</span>
            <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#fff", letterSpacing: "0.05em" }}>TESTIMONIALS</h2>
          </div>
          <span className="font-mono" style={{ fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.3em" }}>{testimonials.length} REVIEWS</span>
        </div>

        {/* Featured quote */}
        {testimonials[0] && (
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ paddingBottom: "4rem", marginBottom: "4rem", borderBottom: "1px solid var(--border)" }}>
            <p className="font-display"
              style={{ fontSize: "clamp(20px,3vw,36px)", color: "#fff", lineHeight: 1.25, marginBottom: "2rem", maxWidth: 800 }}>
              &ldquo;{testimonials[0].text}&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 32, height: 1, background: "var(--primary)" }} />
              <div>
                <p className="font-body" style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{testimonials[0].name}</p>
                <p className="font-mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--primary)", textTransform: "uppercase" }}>{testimonials[0].role}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {testimonials.slice(1).map((item, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.08 }}
              style={{ padding: "2rem", border: "1px solid var(--border)", background: "#111", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <span className="font-display" style={{ fontSize: 36, color: "var(--primary)", lineHeight: 1 }}>&ldquo;</span>
              <p className="font-body" style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.75, flex: 1 }}>{item.text}</p>
              <div style={{ paddingTop: "1.25rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 32, height: 32, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="font-display" style={{ fontSize: 14, color: "#fff" }}>{item.name[0]}</span>
                </div>
                <div>
                  <p className="font-body" style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{item.name}</p>
                  <p className="font-mono" style={{ fontSize: 8, letterSpacing: "0.25em", color: "var(--text-dim)", textTransform: "uppercase" }}>{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
