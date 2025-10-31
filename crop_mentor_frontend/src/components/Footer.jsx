// src/components/Footer.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Animated Ox-Plough SVG Component
  const OxPloughIcon = () => (
    <motion.div
      animate={{
        x: [0, 15, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className="absolute bottom-4 right-8 opacity-20 hidden lg:block"
    >
      <svg width="120" height="80" viewBox="0 0 120 80" className="filter drop-shadow-lg">
        {/* Ox Body */}
        <ellipse cx="60" cy="50" rx="35" ry="20" fill="#ffffff" opacity="0.8" />
        {/* Ox Head */}
        <ellipse cx="25" cy="45" rx="20" ry="18" fill="#ffffff" opacity="0.7" />
        {/* Horns */}
        <path d="M15 35 L10 25 L15 30" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M20 35 L15 25 L20 30" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />
        {/* Eye */}
        <circle cx="20" cy="45" r="2" fill="#237A57" />
        {/* Legs */}
        <rect x="45" y="60" width="8" height="20" fill="#ffffff" opacity="0.6" />
        <rect x="60" y="60" width="8" height="20" fill="#ffffff" opacity="0.6" />
        <rect x="70" y="60" width="8" height="20" fill="#ffffff" opacity="0.6" />
        <rect x="85" y="60" width="8" height="20" fill="#ffffff" opacity="0.6" />
        {/* Plow */}
        <path d="M95 60 L110 55 L115 60 L110 62 Z" fill="#ffffff" opacity="0.8" />
      </svg>
    </motion.div>
  );

  return (
    <footer className="relative bg-gradient-to-br from-[#237A57] via-[#2D8B6A] to-[#65CCB8] text-white w-full overflow-x-hidden shadow-2xl border-t-0">
      {/* Glowing Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Animated Ox-Plough */}
      <OxPloughIcon />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Crop Mentor</h3>
                <p className="text-sm text-white/80">AI-Powered Agriculture</p>
              </div>
            </motion.div>
            <p className="text-sm md:text-base text-white/85 mb-6 leading-relaxed">
              Empowering farmers with AI-driven insights for better crop decisions, yield predictions, and market intelligence.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, color: '#1877F2', name: 'Facebook' },
                { icon: Twitter, color: '#1DA1F2', name: 'Twitter' },
                { icon: Instagram, color: '#E4405F', name: 'Instagram' },
                { icon: Linkedin, color: '#0077B5', name: 'LinkedIn' }
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href="#"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredIcon(social.name)}
                  onHoverEnd={() => setHoveredIcon(null)}
                  className="w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg"
                >
                  <social.icon 
                    className={`w-5 h-5 transition-colors duration-300 ${
                      hoveredIcon === social.name ? `text-[${social.color}]` : 'text-white'
                    }`}
                    style={{ color: hoveredIcon === social.name ? social.color : 'white' }}
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg md:text-xl font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/crop-recommendation', label: 'Crop Recommendation' },
                { href: '/fertilizer-profit', label: 'Fertilizer & Profit' },
                { href: '/iot-monitoring', label: 'IoT Monitoring' },
                { href: '/voice-buddy', label: 'Voice Buddy' }
              ].map((link, index) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm md:text-base text-white/85 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg md:text-xl font-bold mb-6 text-white">Resources</h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                { href: '#', label: 'Help Center' },
                { href: '#', label: 'API Documentation' },
                { href: '#', label: 'Training Videos' },
                { href: '#', label: 'Blog' },
                { href: '#', label: 'FAQs' }
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm md:text-base text-white/85 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg md:text-xl font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 md:space-y-5">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#FFD86A] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm md:text-base text-white/85 group-hover:text-white transition-colors">
                  123 Agriculture Hub, Nashik, Maharashtra, India
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 flex-shrink-0 text-[#FFD86A] group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="tel:+911234567890"
                  className="text-sm md:text-base text-white/85 hover:text-white transition-colors"
                >
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#FFD86A] group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="mailto:support@cropmentor.com"
                  className="text-sm md:text-base text-white/85 hover:text-white transition-colors"
                >
                  support@cropmentor.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-white/20 pt-8 mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm md:text-base text-white/85 text-center md:text-left">
            <p className="font-medium">
              © {currentYear} Crop Mentor. All rights reserved. Built <span className="text-[#FFD86A]"></span> for farmers.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-end">
              {[
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
                { href: '#', label: 'Cookie Policy' }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-white transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD86A] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}