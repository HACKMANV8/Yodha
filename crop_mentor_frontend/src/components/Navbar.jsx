import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, Home, TrendingUp, DollarSign, Radio, Phone, Globe, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const langDropdownRef = useRef(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

  const navLinks = [
    { path: '/dashboard', label: t('navbar.dashboard'), icon: Home },
    { path: '/crop-recommendation', label: t('navbar.cropRec'), icon: Sprout },
    { path: '/fertilizer-profit', label: t('navbar.fertilizerProfit'), icon: DollarSign },
    { path: '/iot-monitoring', label: t('navbar.iotMonitoring'), icon: Radio },
    { path: '/voice-buddy', label: t('navbar.voiceBuddy'), icon: Phone }
  ];

  const isActive = (path) => location.pathname === path;

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="bg-gradient-to-r from-[#65CCB8] to-[#4DB8A1] shadow-lg sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo & Brand - Aligned with menu */}
          <Link to="/" className="flex items-center gap-3 group h-full">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Sprout className="w-6 h-6 text-[#65CCB8]" />
            </div>
            <div className="flex items-center h-full">
              <h1 className="text-xl font-bold text-white">Crop Mentor</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0 h-full">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 h-full ${
                    active
                      ? 'bg-white text-[#65CCB8] shadow-md hover:shadow-lg'
                      : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* 🌐 Language Dropdown */}
            <div className="ml-3 relative h-full flex items-center">
              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg transition-all duration-300 border border-white/20"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    {i18n.language === 'en' ? '🇬🇧 EN' :
                     i18n.language === 'te' ? '🇮🇳 తెలుగు' :
                     i18n.language === 'hi' ? '🇮🇳 हिंदी' :
                     i18n.language === 'ta' ? '🇮🇳 தமிழ்' :
                     i18n.language === 'kn' ? '🇮🇳 ಕನ್ನಡ' : 'EN'}
                  </span>
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {[
                      { value: 'en', label: '🇬🇧 English', native: 'English' },
                      { value: 'te', label: '🇮🇳 తెలుగు', native: 'తెలుగు' },
                      { value: 'hi', label: '🇮🇳 हिंदी', native: 'हिंदी' },
                      { value: 'ta', label: '🇮🇳 தமிழ்', native: 'தமிழ்' },
                      { value: 'kn', label: '🇮🇳 ಕನ್ನಡ', native: 'ಕನ್ನಡ' }
                    ].map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => {
                          changeLanguage(lang.value);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                          i18n.language === lang.value ? 'bg-[#65CCB8]/10 text-[#65CCB8] font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="ml-3 flex items-center gap-2 bg-white text-[#65CCB8] px-4 py-2 rounded-lg font-semibold hover:bg-[#FFD86A] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
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
                      ? 'bg-white text-[#65CCB8] shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* 🌍 Language Switcher for Mobile */}
            <div className="px-4 mt-3">
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="en" className="text-gray-900">🇬🇧 English</option>
                <option value="te" className="text-gray-900">🇮🇳 తెలుగు</option>
                <option value="hi" className="text-gray-900">🇮🇳 हिंदी</option>
                <option value="ta" className="text-gray-900">🇮🇳 தமிழ்</option>
                <option value="kn" className="text-gray-900">🇮🇳 ಕನ್ನಡ</option>
              </select>
            </div>

            {/* Mobile Login Button */}
            <div className="px-4 mt-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-white text-[#65CCB8] px-4 py-3 rounded-lg font-semibold hover:bg-[#FFD86A] hover:text-white transition-all duration-300 shadow-md"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
