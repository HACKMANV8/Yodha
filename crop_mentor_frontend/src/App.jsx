// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import PricePrediction from './pages/PricePrediction';
import MarketDashboard from './pages/MarketDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50 overflow-x-hidden">
        <Navbar />
        <main className="flex-grow w-full max-w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crop-recommendation" element={<CropRecommendation />} />
            <Route path="/price" element={<PricePrediction />} />
            <Route path="/market" element={<MarketDashboard />} />
            <Route path="/fertilizer-profit" element={<PricePrediction />} />
            <Route path="/iot-monitoring" element={<Dashboard />} />
            <Route path="/voice-buddy" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}