"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(15, 17, 23)", // BeeMate dark base
  gradientBackgroundEnd = "rgb(20, 23, 36)",   // BeeMate dark base
  firstColor = "245, 166, 35",                // Honey
  secondColor = "167, 139, 250",               // Purple
  thirdColor = "91, 156, 246",                 // Blue
  fourthColor = "45, 214, 122",                // Green
  fifthColor = "249, 107, 107",                // Red
  pointerColor = "245, 166, 35",               // Pointer Honey
  size = "100%",
  blendingValue = "screen",
  children,
  className,
  interactive = true,
  containerClassName,
  showGrid = true, // Integration of GlobalGrid logic here
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
  showGrid?: boolean;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  // --- Grid Animation Logic ---
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);
  const speedX = 0.12;
  const speedY = 0.08;

  useAnimationFrame(() => {
    if (!showGrid) return;
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [gradientBackgroundStart, gradientBackgroundEnd, firstColor, secondColor, thirdColor, fourthColor, fifthColor, pointerColor, size, blendingValue]);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return;
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    }
    move();
  }, [tgX, tgY, curX, curY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      {/* Content Layer (children/hero text) - HIGHEST LAYER */}
      <div className={cn("relative z-20", className)}>{children}</div>

      {/* --- GRID LAYER (Integrated here to be between colors and content) --- */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-20 dark:opacity-25 overflow-hidden">
          <svg className="w-full h-full">
            <defs>
              <motion.pattern
                id="integrated-grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                x={gridOffsetX}
                y={gridOffsetY}
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
            <rect width="100%" height="100%" fill="url(#integrated-grid-pattern)" />
          </svg>
        </div>
      )}

      {/* STATIC Gradient Orbs Layer - LOWEST LAYER */}
      <div
        className={cn(
          "gradients-container absolute inset-0 z-0 blur-lg",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        )}
      >
        <div className={cn(
          `absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.15)_0,_rgba(var(--first-color),_0)_50%)_no-repeat]`,
          `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] opacity-100`
        )}></div>
        <div className={cn(
          `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.15)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
          `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(10%-var(--size)/2)] left-[calc(10%-var(--size)/2)] opacity-100`
        )}></div>
        <div className={cn(
          `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.2)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
          `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(70%-var(--size)/2)] opacity-100`
        )}></div>
        <div className={cn(
          `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.15)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
          `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(80%-var(--size)/2)] left-[calc(20%-var(--size)/2)] opacity-70`
        )}></div>
        <div className={cn(
          `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.15)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
          `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(20%-var(--size)/2)] left-[calc(80%-var(--size)/2)] opacity-80`
        )}></div>

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.18)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
              `opacity-70 z-20`
            )}
          ></div>
        )}
      </div>
    </div>
  );
};
