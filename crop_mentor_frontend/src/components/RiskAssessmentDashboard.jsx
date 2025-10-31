import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, Table, Space } from 'antd';
import { useApiRequest } from '../api/newAgroService';
import { getRiskAssessment, getPricePrediction, getWeatherInfo } from '../api/newAgroService';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import WeatherChart from './WeatherChart';

const RiskAssessmentDashboard = ({ formData }) => {
  const { data: riskData, loading: riskLoading, error: riskError, execute: executeRiskAssessment } = useApiRequest(getRiskAssessment);
  const { data: priceData, loading: priceLoading, error: priceError, execute: executePricePredict } = useApiRequest(getPricePrediction);
  const { data: weatherData, loading: weatherLoading, error: weatherError, execute: executeWeatherInfo } = useApiRequest(getWeatherInfo);

  // Fetch all data when formData changes
  useEffect(() => {
    if (formData) {
      executeRiskAssessment(formData);
      executePricePredict({
        crop: formData.crop_name,
        state: formData.state,
        district: formData.district,
      });
      executeWeatherInfo({
        location: `${formData.district}, ${formData.state}, India`,
      });
    }
  }, [formData]);

  // Show loading spinner
  if (riskLoading || priceLoading || weatherLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Handle API errors
  if (riskError || priceError || weatherError) {
    return (
      <Alert
        message="Error"
        description="Failed to load assessment data. Please try again."
        type="error"
      />
    );
  }

  // Table columns for risk factors
  const columns = [
    {
      title: 'Risk Factor',
      dataIndex: 'factor',
      key: 'factor',
    },
    {
      title: 'Risk Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        const color = level === 'High' ? 'red' : level === 'Medium' ? 'orange' : 'green';
        return <span style={{ color }}>{level}</span>;
      },
    },
    {
      title: 'Mitigation Strategy',
      dataIndex: 'mitigation',
      key: 'mitigation',
    },
  ];

  // Transform risk data
  const riskFactors =
    riskData?.risk_factors?.map((factor) => ({
      factor: factor.name,
      level: factor.risk_level,
      mitigation: factor.mitigation_strategy,
    })) || [];

  // Render main dashboard
  return (
    <Space direction="vertical" size="large" style={{ width: '100%', padding: '24px' }}>
      {/* Key Stats Section */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Predicted Yield"
              value={riskData?.predicted_yield}
              suffix="kg/hectare"
              precision={2}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Profit Potential"
              value={riskData?.profit_potential}
              precision={2}
              valueStyle={{ color: riskData?.profit_potential > 0 ? '#3f8600' : '#cf1322' }}
              prefix={
                <>
                  {riskData?.profit_potential > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  ₹
                </>
              }
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Market Price Prediction"
              value={priceData?.predicted_price}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Weather Section */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <WeatherChart weatherData={weatherData} />
        </Col>
      </Row>

      {/* Risk Table */}
      <Card title="Overall Risk Assessment">
        <Table columns={columns} dataSource={riskFactors} pagination={false} />
      </Card>

      {/* Recommendations */}
      <Card title="Recommendations">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {riskData?.recommendations?.map((rec, index) => (
            <Alert
              key={index}
              message={rec.title}
              description={rec.description}
              type={rec.priority === 'high' ? 'warning' : 'info'}
              showIcon
            />
          ))}
        </Space>
      </Card>
    </Space>
  );
};

export default RiskAssessmentDashboard;
