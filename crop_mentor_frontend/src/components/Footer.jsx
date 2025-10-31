// src/components/Footer.jsx
import React from 'react';
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-700 text-white mt-12 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Crop Mentor</h3>
                <p className="text-xs text-green-200">AI-Powered Agriculture</p>
              </div>
            </div>
            <p className="text-sm text-green-100 mb-4">
              Empowering farmers with AI-driven insights for better crop decisions, yield predictions, and market intelligence.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>
                <a href="/" className="hover:text-white transition-colors">Dashboard</a>
              </li>
              <li>
                <a href="/crop-recommendation" className="hover:text-white transition-colors">Crop Recommendation</a>
              </li>
              <li>
                <a href="/fertilizer-profit" className="hover:text-white transition-colors">Fertilizer & Profit</a>
              </li>
              <li>
                <a href="/iot-monitoring" className="hover:text-white transition-colors">IoT Monitoring</a>
              </li>
              <li>
                <a href="/voice-buddy" className="hover:text-white transition-colors">Voice Buddy</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">API Documentation</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Training Videos</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-green-100">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Agriculture Hub, Nashik, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-white transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:support@cropmentor.com" className="hover:text-white transition-colors">
                  support@cropmentor.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-600 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-green-100">
            <p>© {currentYear} Crop Mentor. All rights reserved. Built with ❤️ for farmers.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}