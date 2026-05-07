"use client";

import React, { useEffect } from "react";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame,
  type MotionValue
} from "framer-motion";

export const TheInfiniteGrid = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use raw clientX/clientY for viewport-fixed coordinate tracking mapping perfectly to the fixed layer
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.12;
  const speedY = 0.08;

  // Slow, smooth infinite grid drift animation — lightweight at 0.12px/frame
  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Dimmed Base Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>

      {/* Interactive Cursor Grid Reveal */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20 dark:opacity-30"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Glowing Ambient Orbs - Mengurangi efek ekstrim blur yang sering menyebabkan laptop freeze */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ transform: "translateZ(0)" }}>
        <div className="absolute right-[-10%] top-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/5 dark:bg-orange-600/5 blur-3xl" />
        <div className="absolute right-[20%] top-[40%] w-[20%] h-[20%] rounded-full bg-yellow-500/5 dark:bg-yellow-500/5 blur-3xl" />
        <div className="absolute left-[-10%] bottom-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-600/5 blur-3xl" />
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY }: { offsetX: MotionValue<number>; offsetY: MotionValue<number> }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};
