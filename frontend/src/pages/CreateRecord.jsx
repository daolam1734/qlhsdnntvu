// src/pages/CreateRecord.jsx
// Create record page component

import React, { useState } from 'react';
import { Form, Input, Button, Card, DatePicker, Select, InputNumber, Upload, message, Space, Row, Col } from 'antd';
import { ArrowLeftOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { VALIDATION_RULES } from '../constants';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateRecord = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Mock API call - replace with real API
      console.log('Creating record:', values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      message.success('Tạo hồ sơ thành công!');
      navigate('/records');
    } catch (error) {
      message.error('Tạo hồ sơ thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = form.getFieldsValue();
      console.log('Saving draft:', values);
      message.success('Đã lưu nháp!');
    } catch (error) {
      message.error('Lưu nháp thất bại.');
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // Mock upload URL
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} tải lên thành công`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại`);
      }
    },
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/records')}
          style={{ marginBottom: '16px' }}
        >
          Quay lại
        </Button>
        <h1>Tạo hồ sơ công tác mới</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Thông tin cơ bản">
              <Form.Item
                name="title"
                label="Tiêu đề hồ sơ"
                rules={[{ required: true, message: VALIDATION_RULES.REQUIRED }]}
              >
                <Input placeholder="Nhập tiêu đề hồ sơ" />
              </Form.Item>

              <Form.Item
                name="department"
                label="Phòng ban"
                rules={[{ required: true, message: VALIDATION_RULES.REQUIRED }]}
              >
                <Select placeholder="Chọn phòng ban">
                  <Option value="cntt">Khoa CNTT</Option>
                  <Option value="kinhte">Khoa Kinh tế</Option>
                  <Option value="ngoaingu">Khoa Ngoại ngữ</Option>
                  <Option value="ketoan">Khoa Kế toán</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: VALIDATION_RULES.REQUIRED }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Mô tả chi tiết về mục đích công tác"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Chi tiết công tác">
              <Form.Item
                name="destination"
                label="Địa điểm công tác"
                rules={[{ required: true, message: VALIDATION_RULES.REQUIRED }]}
              >
                <Input placeholder="Nhập địa điểm công tác" />
              </Form.Item>

              <Form.Item
                name="dateRange"
                label="Thời gian công tác"
                rules={[{ required: true, message: VALIDATION_RULES.REQUIRED }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                />
              </Form.Item>

              <Form.Item
                name="purpose"
                label="Mục đích công tác"
                rules={[{ required: true, message: VALIDATION_RULES.REQUIRED }]}
              >
                <Select placeholder="Chọn mục đích">
                  <Option value="hoithao">Tham gia hội thảo</Option>
                  <Option value="daotao">Đào tạo</Option>
                  <Option value="hop">Họp tác</Option>
                  <Option value="khac">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="transportation"
                label="Phương tiện di chuyển"
              >
                <Select placeholder="Chọn phương tiện">
                  <Option value="maybay">Máy bay</Option>
                  <Option value="tauhoa">Tàu hỏa</Option>
                  <Option value="xebuyt">Xe buýt</Option>
                  <Option value="oto">Ô tô</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="accommodation"
                label="Nơi lưu trú"
              >
                <Input placeholder="Nhập nơi lưu trú" />
              </Form.Item>

              <Form.Item
                name="budget"
                label="Ngân sách dự kiến (VND)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={100000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card title="Tài liệu đính kèm" style={{ marginTop: '16px' }}>
          <Form.Item name="attachments" label="Upload tài liệu">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                Chọn file để upload
              </Button>
            </Upload>
          </Form.Item>
        </Card>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <Space>
            <Button onClick={handleSaveDraft}>
              Lưu nháp
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              {loading ? 'Đang tạo...' : 'Tạo hồ sơ'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default CreateRecord;