// src/api/agroService.js
import React from 'react';
import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000";
const API_VERSION = 'v1';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api/${API_VERSION}`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Centralized endpoints
const ENDPOINTS = {
  CROP_RECOMMENDATION: '/get_recommendation',
  FERTILIZER_RECOMMENDATION: '/get_fertilizer',
  PRICE_PREDICTION: '/predict_price',
  WEATHER: '/get_weather',
  RISK_ASSESSMENT: '/assess_risk',
};

// --- Utility Error Handler ---
const handleApiError = (error) => {
  let message = 'An unexpected error occurred';

  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400: message = data.detail || 'Invalid request data'; break;
      case 404: message = 'Resource not found'; break;
      case 500: message = 'Server error. Please try again later.'; break;
      default: message = data.detail || error.message;
    }
  } else if (error.request) {
    message = 'Cannot connect to server. Please check your connection.';
  } else {
    message = error.message;
  }

  console.error('❌ API Error:', message);
  return Promise.reject(new Error(message));
};

// Attach interceptors
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => handleApiError(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => handleApiError(error)
);

// --- API FUNCTIONS ---

export const getCropRecommendation = (data) => api.post(ENDPOINTS.CROP_RECOMMENDATION, data);
export const getFertilizerRecommendation = (data) => api.post(ENDPOINTS.FERTILIZER_RECOMMENDATION, data);
export const getPricePrediction = (data) => api.post(ENDPOINTS.PRICE_PREDICTION, data);
export const getWeatherInfo = (params) => api.get(ENDPOINTS.WEATHER, { params });
export const getRiskAssessment = (data) => api.post(ENDPOINTS.RISK_ASSESSMENT, data);

// --- Hook for easy request handling ---
export const useApiRequest = (apiFunction) => {
  const [state, setState] = React.useState({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (...args) => {
    try {
      setState({ data: null, loading: true, error: null });
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  };

  return { ...state, execute };
};

// --- Utility function for health check ---
export const healthCheck = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {
    console.error('Server health check failed:', error);
    throw error;
  }
};

// --- Export all APIs ---
export default {
  getCropRecommendation,
  getFertilizerRecommendation,
  getPricePrediction,
  getWeatherInfo,
  getRiskAssessment,
  healthCheck,
};
