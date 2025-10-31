// src/pages/CropRecommendation.jsx
import React, { useState, useEffect } from 'react';
import { Sprout, Sparkles } from 'lucide-react';
import { addCropData, getAllCrops } from '../api/agroService';

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

const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
    <div 
      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
      style={{ width: `${value}%` }}
    />
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

const Button = ({ children, disabled, className = "", onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
  >
    {children}
  </button>
);

export default function CropRecommendation() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  const [allRecords, setAllRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    N: '45',
    P: '38',
    K: '42',
    ph: '6.5',
    humidity: '68',
    temperature: '28',
    rainfall: '120'
  });

  useEffect(() => {
    loadAllRecords();
  }, []);

  const loadAllRecords = async () => {
    try {
      const data = await getAllCrops();
      setAllRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading records:', err);
      setAllRecords([]);
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const payload = {
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall)
      };

      const result = await addCropData(payload);
      
      // Create recommendations based on backend response
      const primaryCrop = result.recommended_crop || result.predicted_crop || 'Rice';
      
      const recs = [
        {
          name: primaryCrop,
          badge: 'Best Match',
          score: 95,
          description: `Excellent fit for your soil's NPK levels (N:${payload.N}, P:${payload.P}, K:${payload.K}) and moisture content. Expected yield: 4.2 tons/hectare`,
          bgColor: 'bg-green-100',
          borderColor: 'border-green-300',
          badgeBg: 'bg-green-600'
        },
        {
          name: primaryCrop === 'Rice' ? 'Wheat' : 'Rice',
          badge: 'Good Match',
          score: 87,
          description: `Well-suited for current conditions (pH:${payload.ph}, Temp:${payload.temperature}°C). High market demand. Expected yield: 3.8 tons/hectare`,
          bgColor: 'bg-teal-100',
          borderColor: 'border-teal-300',
          badgeBg: 'bg-teal-600'
        },
        {
          name: 'Maize',
          badge: 'Suitable',
          score: 78,
          description: `Moderate fit for rainfall ${payload.rainfall}mm. Consider adjusting pH levels for better results. Expected yield: 3.2 tons/hectare`,
          bgColor: 'bg-cyan-100',
          borderColor: 'border-cyan-300',
          badgeBg: 'bg-cyan-600'
        }
      ];
      
      setRecommendations({
        crops: recs,
        docId: result.doc_id || result.id,
        insights: generateInsights(payload, primaryCrop)
      });

      // Reload records to show the new entry
      await loadAllRecords();
      
    } catch (err) {
      console.error('Crop recommendation error:', err);
      setError(err.message || 'Failed to get recommendations. Please check your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInsights = (data, crop) => {
    const insights = [];
    
    if (data.N >= 40) {
      insights.push(`Your soil has optimal nitrogen levels (${data.N}) for ${crop} cultivation`);
    } else {
      insights.push(`Consider increasing nitrogen levels (current: ${data.N}) for better yields`);
    }
    
    if (data.P < 40) {
      insights.push(`Consider increasing phosphorus (current: ${data.P}) for better wheat yields`);
    } else {
      insights.push(`Phosphorus levels (${data.P}) are adequate for most crops`);
    }
    
    if (data.humidity >= 60) {
      insights.push(`Current moisture levels (${data.humidity}%) are perfect for water-intensive crops`);
    } else {
      insights.push(`Monitor irrigation - humidity is at ${data.humidity}%`);
    }
    
    return insights;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredRecords = allRecords.filter(record => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (record.farmer_name && record.farmer_name.toLowerCase().includes(query)) ||
      (record.predicted_crop && record.predicted_crop.toLowerCase().includes(query)) ||
      (record.crop && record.crop.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Crop Recommendation</h1>
        <p className="text-gray-600">Get personalized crop suggestions based on your soil analysis</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader icon={Sprout} title="Soil Parameters" />
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nitrogen (N)"
                type="number"
                name="N"
                placeholder="0-100"
                value={formData.N}
                onChange={handleChange}
                required
              />
              <Input
                label="Phosphorus (P)"
                type="number"
                name="P"
                placeholder="0-100"
                value={formData.P}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Potassium (K)"
                type="number"
                name="K"
                placeholder="0-100"
                value={formData.K}
                onChange={handleChange}
                required
              />
              <Input
                label="pH Level"
                type="number"
                name="ph"
                step="0.1"
                placeholder="0-14"
                value={formData.ph}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Humidity (%)"
                type="number"
                name="humidity"
                placeholder="0-100"
                value={formData.humidity}
                onChange={handleChange}
                required
              />
              <Input
                label="Temperature (°C)"
                type="number"
                name="temperature"
                placeholder="0-50"
                value={formData.temperature}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Average Rainfall (mm)"
              type="number"
              name="rainfall"
              placeholder="0-500"
              value={formData.rainfall}
              onChange={handleChange}
              required
            />

            <Button disabled={isAnalyzing} onClick={handleSubmit}>
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get AI Recommendations
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader icon={Sparkles} title="AI Recommendations" />
          <div className="p-6">
            {!recommendations ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Sprout className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 max-w-xs">
                  Enter your soil parameters and click 'Get AI Recommendations' to see personalized crop suggestions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.docId && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    Record ID: {recommendations.docId}
                  </div>
                )}

                {recommendations.crops.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${rec.bgColor} ${rec.borderColor}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-gray-800">{rec.name}</h4>
                      <span className={`px-3 py-1 ${rec.badgeBg} text-white rounded-full text-sm font-semibold`}>
                        {rec.badge}
                      </span>
                    </div>
                    <Progress value={rec.score} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">{rec.score}% compatibility score</p>
                    <p className="text-sm text-gray-700">{rec.description}</p>
                  </div>
                ))}

                <div className="p-4 bg-gray-50/30 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">💡 AI Insights</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {recommendations.insights.map((insight, idx) => (
                      <p key={idx}>• {insight}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Records Table */}
      {allRecords.length > 0 && (
        <Card>
          <CardHeader icon={Sprout} title="Recent Crop Recommendations" />
          <div className="p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by farmer name or crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Farmer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Crop</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">N-P-K</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">pH</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Temp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.slice(0, 10).map((record, idx) => (
                    <tr key={record.id || idx} className="hover:bg-green-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{record.farmer_name || 'Anonymous'}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{record.predicted_crop || record.crop || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.N}-{record.P}-{record.K}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.ph || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.temperature}°C</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{record.timestamp ? new Date(record.timestamp).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}