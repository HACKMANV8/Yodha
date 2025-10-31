// src/components/WaveDivider.jsx
import React from 'react';

export default function WaveDivider() {
  return (
    <div className="absolute top-0 left-0 w-full h-20 -mt-20 overflow-hidden">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M0,120 Q300,80 600,100 T1200,100 L1200,120 L0,120 Z"
          fill="url(#gradient)"
          opacity="0.9"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A8FFCE" />
            <stop offset="100%" stopColor="#237A57" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

