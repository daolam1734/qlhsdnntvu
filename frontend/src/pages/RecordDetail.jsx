// src/pages/RecordDetail.jsx
// Record detail page component

import React from 'react';
import { Card, Descriptions, Tag, Button, Space, Steps, Row, Col } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { RECORD_STATUS, USER_ROLES } from '../constants';
import { useAuth } from '../hooks';

const { Step } = Steps;

const RecordDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  // Mock data - replace with real data from API
  const record = {
    id: parseInt(id),
    title: 'Hồ sơ công tác Hà Nội',
    employee: 'Nguyễn Văn A',
    department: 'Khoa CNTT',
    status: 'approved',
    createdAt: '2024-01-15',
    approvedAt: '2024-01-16',
    description: 'Công tác tại Hà Nội để tham gia hội thảo khoa học',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    destination: 'Hà Nội',
    purpose: 'Tham gia hội thảo khoa học',
    transportation: 'Máy bay',
    accommodation: 'Khách sạn 4 sao',
    budget: 15000000,
    approver: 'Trần Thị B',
    approvalNote: 'Đã duyệt hồ sơ',
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      submitted: 'processing',
      approved: 'success',
      rejected: 'error',
      cancelled: 'warning',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      draft: 'Nháp',
      submitted: 'Đã nộp',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      cancelled: 'Hủy',
    };
    return texts[status] || status;
  };

  const getCurrentStep = (status) => {
    const steps = ['draft', 'submitted', 'approved'];
    return steps.indexOf(status);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/records')}
          style={{ marginBottom: '16px' }}
        >
          Quay lại danh sách
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{record.title}</h1>
          <Space>
            <Tag color={getStatusColor(record.status)} size="large">
              {getStatusText(record.status)}
            </Tag>
            {(user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.MANAGER) && (
              <Button icon={<EditOutlined />}>
                Chỉnh sửa
              </Button>
            )}
            <Button icon={<DownloadOutlined />}>
              Tải xuống
            </Button>
          </Space>
        </div>
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <Steps current={getCurrentStep(record.status)} size="small">
          <Step title="Tạo hồ sơ" description={record.createdAt} />
          <Step title="Nộp hồ sơ" description={record.createdAt} />
          <Step title="Duyệt hồ sơ" description={record.approvedAt || 'Chưa duyệt'} />
        </Steps>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Thông tin cơ bản">
            <Descriptions column={1}>
              <Descriptions.Item label="Mã hồ sơ">{record.id}</Descriptions.Item>
              <Descriptions.Item label="Nhân viên">{record.employee}</Descriptions.Item>
              <Descriptions.Item label="Phòng ban">{record.department}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{record.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Ngày duyệt">{record.approvedAt || 'Chưa duyệt'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Chi tiết công tác">
            <Descriptions column={1}>
              <Descriptions.Item label="Địa điểm">{record.destination}</Descriptions.Item>
              <Descriptions.Item label="Mục đích">{record.purpose}</Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {record.startDate} - {record.endDate}
              </Descriptions.Item>
              <Descriptions.Item label="Phương tiện">{record.transportation}</Descriptions.Item>
              <Descriptions.Item label="Nơi lưu trú">{record.accommodation}</Descriptions.Item>
              <Descriptions.Item label="Ngân sách">
                {record.budget.toLocaleString('vi-VN')} VND
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Mô tả" style={{ marginTop: '16px' }}>
        <p>{record.description}</p>
      </Card>

      {record.approver && (
        <Card title="Thông tin duyệt" style={{ marginTop: '16px' }}>
          <Descriptions column={1}>
            <Descriptions.Item label="Người duyệt">{record.approver}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{record.approvalNote}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default RecordDetail;