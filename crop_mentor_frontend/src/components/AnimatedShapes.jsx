// src/components/AnimatedShapes.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

export default function AnimatedShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Leaves */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`leaf-${i}`}
          initial={{ opacity: 0, y: 50, rotate: -20 }}
          whileInView={{ opacity: 0.3, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 3
          }}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
        >
          <Sprout 
            className="w-8 h-8 text-white/30" 
            style={{ transform: `rotate(${-30 + i * 15}deg)` }}
          />
        </motion.div>
      ))}

      {/* Abstract Wave Shapes */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute bottom-0 left-0 w-full h-20 opacity-10"
      >
        <svg viewBox="0 0 1200 120" className="w-full h-full">
          <path
            d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </motion.div>

      {/* Gentle Bubbles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.2, scale: 1 }}
          viewport={{ once: true }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5
          }}
          className="absolute rounded-full bg-white/20"
          style={{
            width: `${40 + i * 20}px`,
            height: `${40 + i * 20}px`,
            left: `${10 + i * 25}%`,
            bottom: `${10 + (i % 2) * 20}%`,
          }}
        />
      ))}
    </div>
  );
}

