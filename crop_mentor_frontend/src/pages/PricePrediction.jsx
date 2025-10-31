// src/pages/PricePrediction.jsx
import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { predictPrice } from '../api/agroService';

const Card = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="p-4 bg-green-50/50 border-b border-green-100 flex items-center gap-3">
    {Icon && <Icon className="w-5 h-5 text-green-600" />}
    <h3 className="font-semibold text-gray-800">{title}</h3>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
      {...props}
    />
  </div>
);

const Button = ({ children, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
  >
    {children}
  </button>
);

export default function PricePrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    state: 'Maharashtra',
    district: 'Nashik',
    crop: 'Rice',
    variety: 'Basmati',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await predictPrice(formData);
      const prediction = response.prediction || response;
      setResult(prediction);
    } catch (err) {
      console.error('Price prediction error:', err);
      setError(err.message || 'Failed to predict price. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Price Prediction</h1>
        <p className="text-gray-600">Get AI-powered price predictions for your crops</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader icon={DollarSign} title="Market Information" />
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="State"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g., Maharashtra"
                required
              />
              <Input
                label="District"
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g., Nashik"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Crop / Commodity"
                type="text"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                placeholder="e.g., Rice"
                required
              />
              <Input
                label="Variety"
                type="text"
                name="variety"
                value={formData.variety}
                onChange={handleChange}
                placeholder="e.g., Basmati"
                required
              />
            </div>

            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Predicting...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Predict Price
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader icon={TrendingUp} title="Prediction Results" />
          <div className="p-6">
            {!result ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <DollarSign className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 max-w-xs">
                  Enter market information and click 'Predict Price' to get AI-powered price predictions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Price Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Min Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{result.predicted_min_price || result.min_price || '-'}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Modal Price</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{result.predicted_modal_price || result.modal_price || '-'}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Max Price</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{result.predicted_max_price || result.max_price || '-'}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">State</p>
                      <p className="font-medium text-gray-800">{result.state || formData.state}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">District</p>
                      <p className="font-medium text-gray-800">{result.district || formData.district}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Crop</p>
                      <p className="font-medium text-gray-800">{result.crop || formData.crop}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Variety</p>
                      <p className="font-medium text-gray-800">{result.variety || formData.variety}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Date</p>
                      <p className="font-medium text-gray-800">{result.date || formData.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Confidence</p>
                      <p className="font-medium text-gray-800">
                        {result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trend Indicator */}
                {result.trend && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    result.trend.toLowerCase().includes('up') || result.trend.toLowerCase().includes('increase')
                      ? 'bg-green-50 border border-green-200'
                      : result.trend.toLowerCase().includes('down') || result.trend.toLowerCase().includes('decrease')
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    {result.trend.toLowerCase().includes('up') || result.trend.toLowerCase().includes('increase') ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : result.trend.toLowerCase().includes('down') || result.trend.toLowerCase().includes('decrease') ? (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-gray-600" />
                    )}
                    <div>
                      <p className="text-xs text-gray-600">Market Trend</p>
                      <p className="font-semibold text-gray-800">{result.trend}</p>
                    </div>
                  </div>
                )}

                {/* Recommended Action */}
                {result.recommended_action && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm font-medium text-blue-900 mb-1">💡 Recommended Action</p>
                    <p className="text-sm text-blue-800">{result.recommended_action}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}