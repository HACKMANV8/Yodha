// src/hooks/usePredictions.js
import { useState } from 'react';
import PredictiveService from '../services/PredictiveService';

export const usePredictions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCropRecommendation = async (soilData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PredictiveService.predictCrop(soilData);
      setLoading(false);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const getFertilizerRecommendation = async (cropData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PredictiveService.predictFertilizer(cropData);
      setLoading(false);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const getPricePrediction = async (marketData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PredictiveService.predictPrice(marketData);
      setLoading(false);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const getRiskAssessment = async (cropData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PredictiveService.assessRisk(cropData);
      setLoading(false);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const getWeatherInfo = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PredictiveService.getWeather(location);
      setLoading(false);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    error,
    getCropRecommendation,
    getFertilizerRecommendation,
    getPricePrediction,
    getRiskAssessment,
    getWeatherInfo,
  };
};