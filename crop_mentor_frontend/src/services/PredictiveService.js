// src/services/PredictiveService.js
import agroService from '../api/agroService';

class PredictiveService {
  // Crop Recommendation
  static async predictCrop(soilData) {
    try {
      const response = await agroService.getCropRecommendation(soilData);
      return {
        success: true,
        data: response.recommendation
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get crop recommendation'
      };
    }
  }

  // Fertilizer Recommendation
  static async predictFertilizer(cropData) {
    try {
      const response = await agroService.getFertilizerRecommendation(cropData);
      return {
        success: true,
        data: response.recommendation
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get fertilizer recommendation'
      };
    }
  }

  // Price Prediction
  static async predictPrice(marketData) {
    try {
      const response = await agroService.getPricePrediction(marketData);
      return {
        success: true,
        data: response.prediction
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get price prediction'
      };
    }
  }

  // Risk Assessment
  static async assessRisk(cropData) {
    try {
      const response = await agroService.getRiskAssessment(cropData);
      return {
        success: true,
        data: {
          yield: response.yield_prediction,
          profit: response.profit_prediction,
          risk: response.risk_assessment,
          conditions: response.growing_conditions
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get risk assessment'
      };
    }
  }

  // Weather Information
  static async getWeather(location) {
    try {
      const response = await agroService.getWeatherInfo(location);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get weather information'
      };
    }
  }
}

export default PredictiveService;