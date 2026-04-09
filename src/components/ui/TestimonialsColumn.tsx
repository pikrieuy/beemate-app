"use client";
import React from "react";
import { motion } from "framer-motion";

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  av: string;
  color: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  style?: React.CSSProperties;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div
      className={props.className}
      style={{
        overflow: "hidden",
        ...props.style,
      }}
    >
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 16 }}
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, name, role, av, color }, i) => (
              <div key={i} className="testi-col-card">
                {/* Top accent bar */}
                <div className="testi-col-accent" />

                {/* Quote icon */}
                <div style={{ fontSize: 20, color: "var(--ho)", marginBottom: 12, opacity: 0.6 }}>
                  &ldquo;
                </div>

                {/* Text */}
                <p style={{
                  fontSize: 12,
                  color: "var(--t2)",
                  lineHeight: 1.85,
                  marginBottom: 18,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}>
                  {text}
                </p>

                {/* Stars */}
                <div style={{
                  color: "var(--ho)",
                  fontSize: 10,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}>
                  ★★★★★
                </div>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    className="av av-36"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, flexShrink: 0 }}
                  >
                    {av}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "-0.2px" }}>
                      {name}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 1 }}>
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]
        }
      </motion.div>
    </div>
  );
};
