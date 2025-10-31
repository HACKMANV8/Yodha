// src/pages/MarketDashboard.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, RefreshCw } from 'lucide-react';
import { getDailyUpdate } from '../api/agroService';

const Card = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title, action }) => (
  <div className="p-4 bg-green-50/50 border-b border-green-100 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-green-600" />}
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {action}
  </div>
);

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
    )}
    <input
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
        Icon ? 'pl-10' : ''
      }`}
      {...props}
    />
  </div>
);

export default function MarketDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    crop: '',
    state: '',
    district: ''
  });

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const response = await getDailyUpdate();
      const marketData = Array.isArray(response) 
        ? response 
        : (response.daily_prices || response.data || []);
      setData(marketData);
    } catch (error) {
      console.error('Error loading market data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredData = data.filter((row) => {
    const cropMatch = !filters.crop || 
      (row.crop || row.commodity || '').toLowerCase().includes(filters.crop.toLowerCase());
    const stateMatch = !filters.state || 
      (row.state || '').toLowerCase().includes(filters.state.toLowerCase());
    const districtMatch = !filters.district || 
      (row.district || '').toLowerCase().includes(filters.district.toLowerCase());
    
    return cropMatch && stateMatch && districtMatch;
  });

  const getTrendColor = (trend) => {
    if (!trend) return 'text-gray-600';
    const t = trend.toLowerCase();
    if (t.includes('up') || t.includes('increase')) return 'text-green-600';
    if (t.includes('down') || t.includes('decrease')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend) => {
    if (!trend) return '→';
    const t = trend.toLowerCase();
    if (t.includes('up') || t.includes('increase')) return '↑';
    if (t.includes('down') || t.includes('decrease')) return '↓';
    return '→';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Market Dashboard</h1>
        <p className="text-gray-600">Real-time market prices and trends</p>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader 
          icon={Search} 
          title="Search & Filter"
          action={
            <button
              onClick={loadMarketData}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          }
        />
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              icon={Search}
              placeholder="Filter by crop/commodity..."
              value={filters.crop}
              onChange={(e) => handleFilterChange('crop', e.target.value)}
            />
            <Input
              icon={Search}
              placeholder="Filter by state..."
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            />
            <Input
              icon={Search}
              placeholder="Filter by district..."
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
            />
          </div>
          {filteredData.length > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              Showing {filteredData.length} of {data.length} records
            </p>
          )}
        </div>
      </Card>

      {/* Market Data Table */}
      <Card>
        <CardHeader icon={TrendingUp} title="Market Prices" />
        <div className="p-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No market data available</p>
              <button
                onClick={loadMarketData}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Reload Data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      District
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Market
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Commodity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Variety
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Min Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Max Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Modal Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Trend
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.state || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.district || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {row.market || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {row.crop || row.commodity || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {row.variety || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ₹{row.min_price || row.predicted_min_price || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ₹{row.max_price || row.predicted_max_price || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-600">
                        ₹{row.modal_price || row.predicted_modal_price || '-'}
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium ${getTrendColor(row.trend)}`}>
                        {getTrendIcon(row.trend)} {row.trend || 'Stable'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {row.arrival_date || row.date || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}