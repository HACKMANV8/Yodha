import React from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const RiskAssessmentForm = ({ onSubmit, loading }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Card title={t('risk.assessment.form.title')} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          soil_type: 'Loamy',
          state: 'Karnataka',
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Form.Item
            label={t('crop.name')}
            name="crop_name"
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Select>
              <Option value="Rice">Rice</Option>
              <Option value="Wheat">Wheat</Option>
              <Option value="Maize">Maize</Option>
              <Option value="Sugarcane">Sugarcane</Option>
              <Option value="Cotton">Cotton</Option>
            </Select>
          </Form.Item>

          <Space style={{ width: '100%' }} wrap>
            <Form.Item
              label={t('soil.type')}
              name="soil_type"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Select style={{ width: 200 }}>
                <Option value="Loamy">Loamy</Option>
                <Option value="Sandy">Sandy</Option>
                <Option value="Clay">Clay</Option>
                <Option value="Black">Black</Option>
                <Option value="Red">Red</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={t('state')}
              name="state"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Select style={{ width: 200 }}>
                <Option value="Karnataka">Karnataka</Option>
                <Option value="Maharashtra">Maharashtra</Option>
                <Option value="Tamil Nadu">Tamil Nadu</Option>
                <Option value="Andhra Pradesh">Andhra Pradesh</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={t('district')}
              name="district"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Select style={{ width: 200 }}>
                <Option value="Bangalore">Bangalore</Option>
                <Option value="Mysore">Mysore</Option>
                <Option value="Hassan">Hassan</Option>
                <Option value="Mandya">Mandya</Option>
              </Select>
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} wrap>
            <Form.Item
              label={t('temperature')}
              name="temperature"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <InputNumber
                min={0}
                max={50}
                formatter={(value) => `${value}°C`}
                parser={(value) => value.replace('°C', '')}
              />
            </Form.Item>

            <Form.Item
              label={t('humidity')}
              name="humidity"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <InputNumber
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace('%', '')}
              />
            </Form.Item>

            <Form.Item
              label={t('rainfall')}
              name="rainfall"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <InputNumber
                min={0}
                max={5000}
                formatter={(value) => `${value} mm`}
                parser={(value) => value.replace(' mm', '')}
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} wrap>
            <Form.Item
              label={t('nitrogen')}
              name="nitrogen"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <InputNumber min={0} max={200} />
            </Form.Item>

            <Form.Item
              label={t('phosphorus')}
              name="phosphorus"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <InputNumber min={0} max={200} />
            </Form.Item>

            <Form.Item
              label={t('potassium')}
              name="potassium"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <InputNumber min={0} max={200} />
            </Form.Item>

            <Form.Item
              label={t('ph')}
              name="ph"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <InputNumber min={0} max={14} step={0.1} />
            </Form.Item>
          </Space>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t('risk.assessment.analyze')}
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
};

export default RiskAssessmentForm;