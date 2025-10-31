import React, { useState } from 'react';
import { Card, Select, Space, Typography, Alert, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { getWeatherInfo } from '../api/newAgroService';
import { useApiRequest } from '../api/newAgroService';
import WeatherChart from './WeatherChart';

const { Title } = Typography;
const { Option } = Select;

const WeatherDashboard = ({ defaultLocation, onWeatherDataChange }) => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const { data: weatherData, loading, error, execute: fetchWeather } = useApiRequest(getWeatherInfo);

  // Load initial weather data
  React.useEffect(() => {
    if (selectedLocation) {
      fetchWeather({ location: selectedLocation });
    }
  }, [selectedLocation]);

  // Notify parent of weather data changes
  React.useEffect(() => {
    if (weatherData && onWeatherDataChange) {
      onWeatherDataChange(weatherData);
    }
  }, [weatherData]);

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load weather data. Please try again."
        type="error"
      />
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={3}>{t('weather.forecast')}</Title>
          <Select
            style={{ width: 200 }}
            placeholder={t('weather.selectLocation')}
            onChange={handleLocationChange}
            value={selectedLocation}
          >
            <Option value="Bangalore, Karnataka">Bangalore</Option>
            <Option value="Mumbai, Maharashtra">Mumbai</Option>
            <Option value="Chennai, Tamil Nadu">Chennai</Option>
            <Option value="Hyderabad, Telangana">Hyderabad</Option>
            <Option value="Delhi">Delhi</Option>
          </Select>
        </Space>
      </Card>

      {weatherData && <WeatherChart weatherData={weatherData} />}

      {weatherData?.current && (
        <Card title={t('weather.currentConditions')}>
          <Space wrap size="large">
            <Statistic
              title={t('weather.temperature')}
              value={weatherData.current.temp_c}
              suffix="°C"
            />
            <Statistic
              title={t('weather.humidity')}
              value={weatherData.current.humidity}
              suffix="%"
            />
            <Statistic
              title={t('weather.windSpeed')}
              value={weatherData.current.wind_kph}
              suffix="km/h"
            />
            <Statistic
              title={t('weather.precipitation')}
              value={weatherData.current.precip_mm}
              suffix="mm"
            />
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default WeatherDashboard;