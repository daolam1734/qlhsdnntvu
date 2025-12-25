// src/pages/Profile.jsx
// User profile page component

import React, { useState } from 'react';
import { Card, Avatar, Form, Input, Button, message, Divider, Space } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks';
import { VALIDATION_RULES } from '../constants';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  // Mock user data - replace with real user data
  const userData = {
    id: user?.id || 1,
    username: user?.username || 'nguyenvana',
    name: user?.name || 'Nguyễn Văn A',
    email: user?.email || 'nguyenvana@tvun.edu.vn',
    phone: user?.phone || '0123456789',
    department: user?.department || 'Khoa CNTT',
    role: user?.role || 'employee',
    avatar: user?.avatar || null,
  };

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue(userData);
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Mock API call - replace with real API
      console.log('Updating profile:', values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      message.success('Cập nhật thông tin thành công!');
      setEditing(false);
    } catch (error) {
      message.error('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleText = (role) => {
    const roles = {
      admin: 'Quản trị viên',
      manager: 'Quản lý',
      employee: 'Nhân viên',
      viewer: 'Người xem',
    };
    return roles[role] || role;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Thông tin cá nhân</h1>

      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            src={userData.avatar}
            style={{ marginRight: '24px' }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{userData.name}</h2>
            <p style={{ color: '#8c8c8c', margin: '4px 0' }}>{userData.email}</p>
            <p style={{ color: '#8c8c8c', margin: 0 }}>{getRoleText(userData.role)}</p>
          </div>
          {!editing && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              style={{ marginLeft: 'auto' }}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>

        {!editing ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Tên đăng nhập:</strong>
                <p>{userData.username}</p>
              </div>
              <div>
                <strong>Email:</strong>
                <p>{userData.email}</p>
              </div>
              <div>
                <strong>Số điện thoại:</strong>
                <p>{userData.phone}</p>
              </div>
              <div>
                <strong>Phòng ban:</strong>
                <p>{userData.department}</p>
              </div>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: VALIDATION_RULES.REQUIRED }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: VALIDATION_RULES.REQUIRED },
                  { type: 'email', message: VALIDATION_RULES.EMAIL },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: VALIDATION_RULES.REQUIRED },
                  { pattern: /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/, message: 'Số điện thoại không hợp lệ' },
                ]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
              <Form.Item
                name="department"
                label="Phòng ban"
                rules={[{ required: true, message: VALIDATION_RULES.REQUIRED }]}
              >
                <Input />
              </Form.Item>
            </div>

            <Divider />

            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Space>
            </div>
          </Form>
        )}
      </Card>

      <Card title="Thống kê">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>12</div>
            <div style={{ color: '#8c8c8c' }}>Hồ sơ đã tạo</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>8</div>
            <div style={{ color: '#8c8c8c' }}>Hồ sơ đã duyệt</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>3</div>
            <div style={{ color: '#8c8c8c' }}>Hồ sơ chờ duyệt</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>1</div>
            <div style={{ color: '#8c8c8c' }}>Hồ sơ bị từ chối</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;