import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, Home, TrendingUp, DollarSign, Radio, Phone, User, Shield, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navLinks = [
    { path: '/dashboard', label: t('navbar.dashboard'), icon: Home },
    { path: '/crop-recommendation', label: t('navbar.cropRec'), icon: Sprout },
    { path: '/fertilizer-profit', label: t('navbar.fertilizerProfit'), icon: DollarSign },
    { path: '/iot-monitoring', label: t('navbar.iotMonitoring'), icon: Radio },
    { path: '/voice-buddy', label: t('navbar.voiceBuddy'), icon: Phone },
    { path: '/profile', label: t('navbar.profile'), icon: User },
    { path: '/admin', label: t('navbar.admin'), icon: Shield }
  ];

  const isActive = (path) => location.pathname === path;

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 shadow-lg sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Crop Mentor</h1>
              <p className="text-xs text-green-100 hidden sm:block">{t('navbar.subtitle')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    active
                      ? 'bg-white text-green-700 shadow-md'
                      : 'text-white hover:bg-green-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* 🌐 Language Switcher */}
            <div className="ml-3 relative">
              <div className="flex items-center bg-white text-green-700 px-2 py-1 rounded-lg">
                <Globe className="w-4 h-4 mr-1" />
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="te">🇮🇳 తెలుగు</option>
                  <option value="hi">🇮🇳 हिंदी</option>
                  <option value="ta">🇮🇳 தமிழ்</option>
                  <option value="kn">🇮🇳 ಕನ್ನಡ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-green-600 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    active
                      ? 'bg-white text-green-700 shadow-md'
                      : 'text-white hover:bg-green-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* 🌍 Language Switcher for Mobile */}
            <div className="px-4 mt-3">
              <div className="flex items-center bg-white text-green-700 px-3 py-2 rounded-lg">
                <Globe className="w-5 h-5 mr-2" />
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer w-full"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="te">🇮🇳 తెలుగు</option>
                  <option value="hi">🇮🇳 हिंदी</option>
                  <option value="ta">🇮🇳 தமிழ்</option>
                  <option value="kn">🇮🇳 ಕನ್ನಡ</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
