// src/api/agroService.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.detail || 'Invalid request data');
        case 404:
          throw new Error('Resource not found');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.detail || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('Cannot connect to server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

/**
 * Get all crop records
 * @returns {Promise<Array>} Array of crop records
 */
export const getAllCrops = async () => {
  try {
    const response = await api.get('/get_all_crops');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching all crops:', error);
    throw error;
  }
};

/**
 * Add new crop data and get recommendation
 * @param {Object} payload - Crop data
 * @param {number} payload.N - Nitrogen level
 * @param {number} payload.P - Phosphorus level
 * @param {number} payload.K - Potassium level
 * @param {number} payload.temperature - Temperature in Celsius
 * @param {number} payload.humidity - Humidity percentage
 * @param {number} payload.ph - Soil pH level
 * @param {number} payload.rainfall - Rainfall in mm
 * @returns {Promise<Object>} Recommendation result
 */
export const addCropData = async (payload) => {
  try {
    // Validate payload
    const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const response = await api.post('/add_crop_data', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding crop data:', error);
    throw error;
  }
};

/**
 * Predict crop price
 * @param {Object} payload - Price prediction data
 * @param {string} payload.state - State name
 * @param {string} payload.district - District name
 * @param {string} payload.crop - Crop/commodity name
 * @param {string} payload.variety - Crop variety
 * @param {string} payload.date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Price prediction result
 */
export const predictPrice = async (payload) => {
  try {
    // Validate payload
    if (!payload.state || !payload.district || !payload.crop) {
      throw new Error('State, district, and crop are required');
    }

    const response = await api.post('/predict_price', payload);
    return response.data;
  } catch (error) {
    console.error('Error predicting price:', error);
    throw error;
  }
};

/**
 * Get daily market updates
 * @returns {Promise<Array>} Array of daily price updates
 */
export const getDailyUpdate = async () => {
  try {
    const response = await api.get('/daily-update');
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.daily_prices) {
      return response.data.daily_prices;
    } else if (response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching daily updates:', error);
    throw error;
  }
};

/**
 * Get weather data (if endpoint exists)
 * @param {string} location - Location for weather data
 * @returns {Promise<Object>} Weather data
 */
export const getWeatherData = async (location = 'default') => {
  try {
    const response = await api.get(`/weather/${location}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return mock data if endpoint doesn't exist
    return {
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy'
    };
  }
};

/**
 * Get IoT sensor data (if endpoint exists)
 * @param {string} sensorId - Sensor ID
 * @returns {Promise<Object>} Sensor data
 */
export const getSensorData = async (sensorId) => {
  try {
    const response = await api.get(`/iot/sensor/${sensorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    throw error;
  }
};

/**
 * Get farmer profile (if endpoint exists)
 * @param {string} farmerId - Farmer ID
 * @returns {Promise<Object>} Farmer profile data
 */
export const getFarmerProfile = async (farmerId) => {
  try {
    const response = await api.get(`/farmer/${farmerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching farmer profile:', error);
    throw error;
  }
};

/**
 * Update farmer profile (if endpoint exists)
 * @param {string} farmerId - Farmer ID
 * @param {Object} data - Updated profile data
 * @returns {Promise<Object>} Updated profile
 */
export const updateFarmerProfile = async (farmerId, data) => {
  try {
    const response = await api.put(`/farmer/${farmerId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating farmer profile:', error);
    throw error;
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Server status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error checking server health:', error);
    throw error;
  }
};

// Export all functions
export default {
  getAllCrops,
  addCropData,
  predictPrice,
  getDailyUpdate,
  getWeatherData,
  getSensorData,
  getFarmerProfile,
  updateFarmerProfile,
  healthCheck,
};

// Utility function to check if backend is online
export const checkBackendConnection = async () => {
  try {
    await healthCheck();
    return true;
  } catch {
    return false;
  }
};