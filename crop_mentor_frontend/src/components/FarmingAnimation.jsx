// src/components/FarmingAnimation.jsx
import React, { useEffect, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function FarmingAnimation() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to horizontal position (0 to 100%)
  const x = useTransform(scrollYProgress, [0, 1], ['-20%', '120%']);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-0 left-0 w-full h-32 overflow-hidden pointer-events-none z-0 opacity-30"
    >
      <motion.div
        style={{ x }}
        className="absolute bottom-0 left-0 flex items-end"
      >
        {/* Ox */}
        <div className="relative">
          <svg width="120" height="80" viewBox="0 0 120 80" className="filter drop-shadow-lg">
            {/* Ox Body */}
            <ellipse cx="60" cy="50" rx="35" ry="20" fill="#8B4513" />
            {/* Ox Head */}
            <ellipse cx="25" cy="45" rx="20" ry="18" fill="#654321" />
            {/* Horns */}
            <path d="M15 35 L10 25 L15 30" stroke="#5D4037" strokeWidth="2" fill="none" />
            <path d="M20 35 L15 25 L20 30" stroke="#5D4037" strokeWidth="2" fill="none" />
            {/* Eye */}
            <circle cx="20" cy="45" r="2" fill="#000" />
            {/* Legs */}
            <rect x="45" y="60" width="8" height="20" fill="#654321" />
            <rect x="60" y="60" width="8" height="20" fill="#654321" />
            <rect x="70" y="60" width="8" height="20" fill="#654321" />
            <rect x="85" y="60" width="8" height="20" fill="#654321" />
          </svg>
        </div>

        {/* Farmer */}
        <div className="relative -ml-10">
          <svg width="60" height="80" viewBox="0 0 60 80" className="filter drop-shadow-lg">
            {/* Head */}
            <circle cx="30" cy="20" r="12" fill="#FDBCB4" />
            {/* Body */}
            <rect x="20" y="32" width="20" height="25" fill="#4A90E2" rx="2" />
            {/* Arms */}
            <rect x="15" y="32" width="6" height="20" fill="#4A90E2" rx="3" />
            <rect x="39" y="32" width="6" height="20" fill="#4A90E2" rx="3" />
            {/* Legs */}
            <rect x="22" y="57" width="6" height="20" fill="#654321" rx="2" />
            <rect x="32" y="57" width="6" height="20" fill="#654321" rx="2" />
            {/* Hat */}
            <path d="M18 15 L30 8 L42 15 L40 20 L20 20 Z" fill="#8B4513" />
          </svg>
        </div>

        {/* Plow */}
        <div className="relative -ml-5">
          <svg width="40" height="15" viewBox="0 0 40 15" className="filter drop-shadow-lg">
            <path d="M0 10 L35 5 L40 10 L35 12 Z" fill="#654321" />
            <rect x="2" y="10" width="30" height="3" fill="#8B4513" />
          </svg>
        </div>

        {/* Plowed Lines (trailing effect) */}
        <motion.div
          style={{ x: useTransform(scrollYProgress, [0, 1], ['-30%', '110%']) }}
          className="absolute bottom-0 left-0 w-full h-2 flex items-center gap-1"
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="h-1 w-12 bg-[#8B7355]/40 rounded-full"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

