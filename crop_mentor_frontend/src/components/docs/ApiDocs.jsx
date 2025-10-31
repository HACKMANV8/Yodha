// src/components/docs/ApiDocs.jsx
import React from 'react';
import { Card, Typography, Divider, Space } from 'antd';
import { BookOutlined, ApiOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ApiEndpoint = ({ method, path, description, example }) => (
  <Card size="small" style={{ marginBottom: '1rem' }}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Text strong style={{ color: method === 'POST' ? '#52c41a' : '#1890ff' }}>
          {method}
        </Text>
        <Text code>{path}</Text>
      </Space>
      <Text type="secondary">{description}</Text>
      {example && (
        <>
          <Text strong>Example:</Text>
          <pre style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px' }}>
            {JSON.stringify(example, null, 2)}
          </pre>
        </>
      )}
    </Space>
  </Card>
);

const ApiDocs = () => {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/get_recommendation',
      description: 'Get crop recommendations based on soil and climate conditions',
      example: {
        N: 50,
        P: 30,
        K: 20,
        temperature: 25,
        humidity: 60,
        ph: 6.5,
        rainfall: 1000
      }
    },
    {
      method: 'POST',
      path: '/api/v1/get_fertilizer',
      description: 'Get fertilizer recommendations for specific crops',
      example: {
        crop_name: "Rice",
        soil_type: "Loamy",
        temperature: 25,
        humidity: 60,
        ph: 6.5,
        rainfall: 1000
      }
    },
    {
      method: 'POST',
      path: '/api/v1/predict_price',
      description: 'Predict crop prices based on market data',
      example: {
        crop: "Rice",
        state: "Karnataka",
        district: "Bangalore",
        date: "2025-11-01"
      }
    },
    {
      method: 'POST',
      path: '/api/v1/assess_risk',
      description: 'Get comprehensive risk assessment including yield and profit predictions',
      example: {
        crop_name: "Rice",
        soil_type: "Loamy",
        temperature: 25,
        humidity: 60,
        ph: 6.5,
        rainfall: 1000,
        nitrogen: 50,
        phosphorus: 30,
        potassium: 20
      }
    }
  ];

  return (
    <Space direction="vertical" style={{ width: '100%', padding: '2rem' }}>
      <Title level={2}>
        <BookOutlined /> API Documentation
      </Title>
      <Paragraph>
        The Crop Mentor AI API provides comprehensive agricultural insights and recommendations
        through machine learning models. Use these endpoints to access various predictions and
        recommendations for optimal farming decisions.
      </Paragraph>
      <Divider />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={3}>
          <ApiOutlined /> Endpoints
        </Title>
        {endpoints.map((endpoint, index) => (
          <ApiEndpoint key={index} {...endpoint} />
        ))}
      </Space>
    </Space>
  );
};

export default ApiDocs;