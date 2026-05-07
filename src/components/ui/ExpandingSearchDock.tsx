"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState, useRef } from "react";

type ExpandingSearchDockProps = {
  value?: string;
  onChange?: (query: string) => void;
  placeholder?: string;
};

export function ExpandingSearchDock({
  value = "",
  onChange,
  placeholder = "Cari...",
}: ExpandingSearchDockProps) {
  const [isExpanded, setIsExpanded] = useState(Boolean(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldExpand = isExpanded || Boolean(value);

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    onChange?.("");
  };

  return (
    <div style={{ position: "relative", height: 36 }}>
      <AnimatePresence mode="wait">
        {!shouldExpand ? (
          <motion.button
            key="icon"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleExpand}
            title="Cari"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              width: 36,
              borderRadius: 10,
              border: "1px solid var(--b)",
              background: "var(--bg4)",
              color: "var(--t2)",
              cursor: "pointer",
              transition: "border-color .15s, background .15s, color .15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--b2)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--t)";
              (e.currentTarget as HTMLButtonElement).style.background = "var(--sf)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--b)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--t2)";
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg4)";
            }}
          >
            <Search size={15} />
          </motion.button>
        ) : (
          <motion.div
            key="input"
            initial={{ width: 36, opacity: 0.5 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 36, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 36,
              borderRadius: 10,
              border: "1px solid var(--ho)",
              background: "var(--bg4)",
              overflow: "hidden",
              boxShadow: "0 0 0 3px rgba(245,166,35,.1)",
              paddingLeft: 10,
              paddingRight: 4,
            }}
          >
            {/* Search icon */}
            <Search size={14} style={{ color: "var(--ho)", flexShrink: 0 }} />

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={e => onChange?.(e.target.value)}
              placeholder={placeholder}
              autoFocus
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--t)",
                fontFamily: "inherit",
                minWidth: 0,
              }}
            />

            {/* Clear / collapse button */}
            <motion.button
              type="button"
              onClick={handleCollapse}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: 7,
                border: "none",
                background: "transparent",
                color: "var(--t3)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background .12s, color .12s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--rdb)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--rd)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--t3)";
              }}
            >
              <X size={13} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
