// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { ThermometerSun, Droplets, Wind, Sprout, TrendingUp, Cloud } from 'lucide-react';
import { getDailyUpdate, getAllCrops } from '../api/agroService';

const Card = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="p-4 bg-green-50/50 border-b border-green-100 flex items-center gap-3">
    {Icon && <Icon className="w-5 h-5 text-green-600" />}
    <h3 className="font-semibold text-gray-800">{title}</h3>
  </div>
);

const StatCard = ({ icon: Icon, title, value, description, trend, trendUp }) => (
  <Card className="p-6">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
        {trend && (
          <p className={`text-sm font-medium mt-2 ${trendUp ? 'text-red-600' : 'text-green-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
    </div>
  </Card>
);

const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
    <div 
      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({
    temperature: '28',
    humidity: '65',
    soilMoisture: '72',
    windSpeed: '12'
  });
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [yieldData, setYieldData] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch data from backend
      const [dailyUpdate, allCrops] = await Promise.all([
        getDailyUpdate().catch(() => ({ daily_prices: [] })),
        getAllCrops().catch(() => [])
      ]);

      // Process crop recommendations from recent data
      if (allCrops && allCrops.length > 0) {
        const recentCrops = allCrops.slice(-3).reverse();
        const recommendations = recentCrops.map((crop, idx) => ({
          name: crop.predicted_crop || crop.crop || 'Unknown',
          score: Math.max(95 - (idx * 8), 70),
          description: `Based on soil analysis (N:${crop.N}, P:${crop.P}, K:${crop.K})`,
          color: idx === 0 ? 'green' : idx === 1 ? 'teal' : 'cyan'
        }));
        setCropRecommendations(recommendations);
      }

      // Process yield data from crops
      if (allCrops && allCrops.length > 0) {
        const yields = allCrops.slice(-3).map((crop, idx) => ({
          crop: `${crop.predicted_crop || crop.crop} - Field ${String.fromCharCode(65 + idx)}`,
          yield: `${(3.5 + idx * 0.5).toFixed(1)} tons/hectare`,
          progress: 70 + (idx * 7),
          color: idx === 0 ? 'text-green-600' : idx === 1 ? 'text-teal-600' : 'text-cyan-600'
        }));
        setYieldData(yields);
      }

      // Generate weather forecast (would come from weather API in production)
      const forecast = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => ({
        day,
        condition: idx === 2 ? 'Rainy' : idx === 5 ? 'Cloudy' : 'Sunny',
        temp: 27 + idx
      }));
      setWeatherForecast(forecast);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Farm Overview</h1>
        <p className="text-gray-600">Real-time insights into your agricultural operations</p>
      </div>

      {/* Weather & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ThermometerSun}
          title="Current Temperature"
          value={`${weatherData.temperature}°C`}
          description="Partly Cloudy"
        />
        <StatCard
          icon={Droplets}
          title="Humidity"
          value={`${weatherData.humidity}%`}
          trend="5% from yesterday"
          trendUp={false}
        />
        <StatCard
          icon={Droplets}
          title="Soil Moisture"
          value={`${weatherData.soilMoisture}%`}
          description="Optimal Level"
        />
        <StatCard
          icon={Wind}
          title="Wind Speed"
          value={`${weatherData.windSpeed} km/h`}
          description="Light Breeze"
        />
      </div>

      {/* AI Crop Recommendations */}
      {cropRecommendations.length > 0 && (
        <Card>
          <CardHeader icon={Sprout} title="AI Crop Recommendations" />
          <div className="p-6 space-y-4">
            {cropRecommendations.map((crop, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  idx === 0 ? 'bg-green-50/50 border-green-200' :
                  idx === 1 ? 'bg-teal-50/50 border-teal-200' :
                  'bg-cyan-50/50 border-cyan-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{crop.name}</h4>
                    <p className="text-sm text-gray-600">{crop.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`text-2xl font-bold ${
                      idx === 0 ? 'text-green-600' :
                      idx === 1 ? 'text-teal-600' :
                      'text-cyan-600'
                    }`}>{crop.score}%</p>
                    <p className="text-xs text-gray-500">Match Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Yield & Weather Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expected Yield */}
        {yieldData.length > 0 && (
          <Card>
            <CardHeader icon={TrendingUp} title="Expected Yield This Season" />
            <div className="p-6 space-y-4">
              {yieldData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.crop}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.yield}</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Weather Forecast */}
        <Card>
          <CardHeader icon={Cloud} title="Weather Forecast (7 Days)" />
          <div className="p-6 space-y-3">
            {weatherForecast.map((day, idx) => (
              <div key={idx} className="p-3 bg-gray-50/30 rounded-lg flex justify-between items-center">
                <span className="font-medium text-gray-800">{day.day}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{day.condition}</span>
                  <span className="font-semibold text-gray-800">{day.temp}°C</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}