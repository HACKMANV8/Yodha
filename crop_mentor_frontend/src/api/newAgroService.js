// src/api/agroService.js
import { useState } from 'react';
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";
const API_VERSION = 'v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// API endpoints
const ENDPOINTS = {
  CROP_RECOMMENDATION: `/api/${API_VERSION}/get_recommendation`,
  FERTILIZER_RECOMMENDATION: `/api/${API_VERSION}/get_fertilizer`,
  PRICE_PREDICTION: `/api/${API_VERSION}/predict_price`,
  WEATHER: `/api/${API_VERSION}/get_weather`,
  RISK_ASSESSMENT: `/api/${API_VERSION}/assess_risk`,
};

// Error handler utility
const handleApiError = (error) => {
  const customError = {
    message: 'An unexpected error occurred',
    status: error.response?.status || 500,
    data: error.response?.data || {},
  };

  if (error.response) {
    // Server responded with error
    customError.message = error.response.data.message || error.message;
  } else if (error.request) {
    // Request made but no response
    customError.message = 'Server is not responding';
  } else {
    // Request setup error
    customError.message = error.message;
  }

  console.error('❌ API Error:', customError);
  return Promise.reject(customError);
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return handleApiError(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response.data; // Automatically extract data
  },
  handleApiError
);

// API methods
export const getCropRecommendation = async (data) => {
  try {
    return await api.post(ENDPOINTS.CROP_RECOMMENDATION, data);
  } catch (error) {
    throw error;
  }
};

export const getFertilizerRecommendation = async (data) => {
  try {
    return await api.post(ENDPOINTS.FERTILIZER_RECOMMENDATION, data);
  } catch (error) {
    throw error;
  }
};

export const getPricePrediction = async (data) => {
  try {
    return await api.post(ENDPOINTS.PRICE_PREDICTION, data);
  } catch (error) {
    throw error;
  }
};

export const getWeatherInfo = async (location) => {
  try {
    return await api.get(ENDPOINTS.WEATHER, { params: location });
  } catch (error) {
    throw error;
  }
};

export const getRiskAssessment = async (data) => {
  try {
    return await api.post(ENDPOINTS.RISK_ASSESSMENT, data);
  } catch (error) {
    throw error;
  }
};

// Custom hook for handling API requests
export const useApiRequest = (apiFunction) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
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