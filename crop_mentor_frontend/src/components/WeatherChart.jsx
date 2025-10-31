import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import Chart from 'chart.js/auto';
import { useTranslation } from 'react-i18next';

const WeatherChart = ({ weatherData }) => {
  const { t } = useTranslation();
  const temperatureChartRef = useRef(null);
  const rainChartRef = useRef(null);

  useEffect(() => {
    if (!weatherData?.forecast || !temperatureChartRef.current || !rainChartRef.current) return;

    // Destroy existing charts
    const tempChart = Chart.getChart(temperatureChartRef.current);
    const rainChart = Chart.getChart(rainChartRef.current);
    if (tempChart) tempChart.destroy();
    if (rainChart) rainChart.destroy();

    // Prepare data
    const dates = weatherData.forecast.map(day => day.date);
    const maxTemps = weatherData.forecast.map(day => day.max_temp_c);
    const minTemps = weatherData.forecast.map(day => day.min_temp_c);
    const rainfall = weatherData.forecast.map(day => day.total_precip_mm);
    const humidity = weatherData.forecast.map(day => day.humidity);

    // Temperature Chart
    new Chart(temperatureChartRef.current, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: t('weather.maxTemp'),
            data: maxTemps,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          },
          {
            label: t('weather.minTemp'),
            data: minTemps,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: t('weather.temperatureChart')
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: '°C'
            }
          }
        }
      }
    });

    // Rainfall and Humidity Chart
    new Chart(rainChartRef.current, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          {
            label: t('weather.rainfall'),
            data: rainfall,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            yAxisID: 'rainfall'
          },
          {
            label: t('weather.humidity'),
            data: humidity,
            type: 'line',
            borderColor: 'rgb(75, 192, 192)',
            yAxisID: 'humidity'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: t('weather.rainfallHumidityChart')
          }
        },
        scales: {
          rainfall: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: t('weather.rainfallUnit')
            }
          },
          humidity: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: '%'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }, [weatherData, t]);

  return (
    <Card title={t('weather.forecast')}>
      <div style={{ marginBottom: '20px' }}>
        <canvas ref={temperatureChartRef}></canvas>
      </div>
      <div>
        <canvas ref={rainChartRef}></canvas>
      </div>
    </Card>
  );
};

export default WeatherChart;