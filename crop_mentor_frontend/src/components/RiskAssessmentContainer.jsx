import React, { useState } from 'react';
import { Layout, Typography, Space } from 'antd';
import RiskAssessmentForm from './RiskAssessmentForm';
import RiskAssessmentDashboard from './RiskAssessmentDashboard';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { Content } = Layout;

const RiskAssessmentContainer = () => {
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    setFormData(values);
    setShowResults(true);
    setLoading(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {!showResults ? (
            <>
              <Title level={2}>{t('risk.assessment.form.title')}</Title>
              <RiskAssessmentForm onSubmit={handleSubmit} loading={loading} />
            </>
          ) : (
            <>
              <Title level={2}>{t('risk.assessment.result.title')}</Title>
              <RiskAssessmentDashboard formData={formData} />
            </>
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default RiskAssessmentContainer;