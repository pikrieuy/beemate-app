"use client";

import React from "react";
import { motion } from "framer-motion";

// Pointy-topped hexagon path calculation
const getHexPath = (cx: number, cy: number, r: number) => {
  let path = "";
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30;
    const angle_rad = (Math.PI / 180) * angle_deg;
    const x = cx + r * Math.cos(angle_rad);
    const y = cy + r * Math.sin(angle_rad);
    if (i === 0) path += `M ${x} ${y} `;
    else path += `L ${x} ${y} `;
  }
  path += "Z";
  return path;
};

export const HeroHoneycombNode = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const r = 100;
  const center = { x: 300, y: 300 };

  // Helper to round numbers for SVG attributes (prevents hydration mismatch)
  const f = (n: number) => Number(n.toFixed(4));

  const surroundingCenters = Array.from({ length: 6 }).map((_, i) => {
    const angle_deg = 60 * i;
    const angle_rad = (Math.PI / 180) * angle_deg;
    const dist = r * Math.sqrt(3);
    return {
      x: f(center.x + dist * Math.cos(angle_rad)),
      y: f(center.y + dist * Math.sin(angle_rad)),
    };
  });

  if (!mounted) {
    return <div style={{ width: "100%", maxWidth: "600px", aspectRatio: "1/1", margin: "0 auto" }} />;
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      maxWidth: "600px",
      aspectRatio: "1/1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
      background: "radial-gradient(circle at center, rgba(245,166,35,0.05) 0%, transparent 70%)"
    }}>
      <svg width="100%" height="100%" viewBox="0 0 600 600" style={{ overflow: "visible" }}>
        {/* Connection rays */}
        {surroundingCenters.map((c, i) => {
          const angle_deg = 60 * i;
          const angle_rad = (Math.PI / 180) * angle_deg;
          const outX = f(center.x + (r * 3.5) * Math.cos(angle_rad));
          const outY = f(center.y + (r * 3.5) * Math.sin(angle_rad));
          return (
            <motion.line
              key={`ray-${i}`}
              x1={outX} y1={outY} x2={c.x} y2={c.y}
              stroke="var(--bdr)" strokeWidth="2" strokeDasharray="6 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          );
        })}

        {/* Outer Hexagons */}
        {surroundingCenters.map((c, i) => (
          <motion.path
            key={`hex-${i}`}
            d={getHexPath(c.x, c.y, r)}
            fill="none" stroke="var(--bdr)" strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 2, delay: 1 + i * 0.2 }}
          />
        ))}

        {/* Central Hexagon */}
        <motion.path
          d={getHexPath(center.x, center.y, r)}
          fill="rgba(245, 166, 35, 0.05)" stroke="var(--ho)" strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Pulses */}
        <motion.circle
          cx={center.x} cy={center.y} r={r + 30}
          fill="none" stroke="var(--ho)" strokeWidth="2"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1.5, opacity: [0, 0.4, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />

        {/* Intersection Dots */}
        <motion.circle
          cx={center.x} cy={center.y} r={8}
          fill="var(--ho)" style={{ filter: "drop-shadow(0 0 15px var(--ho))" }}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
        />

        {surroundingCenters.map((c, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={c.x} cy={c.y} r={6}
            fill="var(--t2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, fill: ["#888", "#f5a623", "#888"] }}
            transition={{ fill: { duration: 2, repeat: Infinity }, delay: 2 + i * 0.2 }}
          />
        ))}

        {/* Data Packets */}
        {surroundingCenters.map((c, i) => {
          const angle_deg = 60 * i;
          const angle_rad = (Math.PI / 180) * angle_deg;
          const outX = f(center.x + (r * 3.5) * Math.cos(angle_rad));
          const outY = f(center.y + (r * 3.5) * Math.sin(angle_rad));
          return (
            <motion.g key={`packet-${i}`}
              animate={{ x: [outX, c.x, center.x], y: [outY, c.y, center.y], opacity: [0, 1, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.5 }}
            >
              <circle cx={0} cy={0} r={4} fill="var(--gn)" style={{ filter: "drop-shadow(0 0 10px var(--gn))" }}/>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};
