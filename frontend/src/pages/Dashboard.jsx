// src/pages/Dashboard.jsx
// Dashboard page component

import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const Dashboard = () => {
  // Mock data - replace with real data from API
  const stats = {
    totalRecords: 156,
    pendingApprovals: 23,
    approvedToday: 12,
    totalUsers: 89,
  };

  const recentActivities = [
    { id: 1, action: 'Tạo hồ sơ mới', user: 'Nguyễn Văn A', time: '2 phút trước' },
    { id: 2, action: 'Duyệt hồ sơ', user: 'Trần Thị B', time: '15 phút trước' },
    { id: 3, action: 'Từ chối hồ sơ', user: 'Lê Văn C', time: '1 giờ trước' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Bảng điều khiển</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng hồ sơ"
              value={stats.totalRecords}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={stats.pendingApprovals}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Duyệt hôm nay"
              value={stats.approvedToday}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tiến độ xử lý hồ sơ" style={{ height: '300px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Hồ sơ đã duyệt</span>
                  <span>75%</span>
                </div>
                <Progress percent={75} status="active" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Hồ sơ chờ duyệt</span>
                  <span>25%</span>
                </div>
                <Progress percent={25} status="exception" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây" style={{ height: '300px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivities.map((activity) => (
                <div key={activity.id} style={{ padding: '8px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 'bold' }}>{activity.action}</div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                    {activity.user} • {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;