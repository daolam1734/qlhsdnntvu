// src/pages/Approvals.jsx
// Approvals page component

import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RECORD_STATUS } from '../constants';

const { TextArea } = Input;

const Approvals = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [action, setAction] = useState(''); // 'approve' or 'reject'
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Mock data - replace with real data from API
  const mockPendingRecords = [
    {
      id: 1,
      title: 'Hồ sơ công tác Hà Nội',
      employee: 'Nguyễn Văn A',
      department: 'Khoa CNTT',
      createdAt: '2024-01-15',
      description: 'Công tác tại Hà Nội để tham gia hội thảo khoa học',
    },
    {
      id: 2,
      title: 'Hồ sơ công tác TP.HCM',
      employee: 'Trần Thị B',
      department: 'Khoa Kinh tế',
      createdAt: '2024-01-14',
      description: 'Tham gia khóa đào tạo tại TP.HCM',
    },
    {
      id: 3,
      title: 'Hồ sơ công tác Đà Nẵng',
      employee: 'Lê Văn C',
      department: 'Khoa Ngoại ngữ',
      createdAt: '2024-01-13',
      description: 'Họp tác với đối tác tại Đà Nẵng',
    },
  ];

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/records/${record.id}`)}
          >
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => showApprovalModal(record, 'approve')}
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={() => showApprovalModal(record, 'reject')}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  const showApprovalModal = (record, actionType) => {
    setCurrentRecord(record);
    setAction(actionType);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Mock API call - replace with real API
      console.log(`${action} record ${currentRecord.id}:`, values);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const actionText = action === 'approve' ? 'duyệt' : 'từ chối';
      message.success(`Đã ${actionText} hồ sơ thành công!`);

      setIsModalVisible(false);
      setCurrentRecord(null);
      // Refresh data here
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentRecord(null);
    form.resetFields();
  };

  return (
    <div>
      <h1>Duyệt hồ sơ</h1>
      <p style={{ color: '#8c8c8c', marginBottom: '16px' }}>
        Danh sách các hồ sơ đang chờ duyệt
      </p>

      <Table
        columns={columns}
        dataSource={mockPendingRecords}
        rowKey="id"
        pagination={{
          total: mockPendingRecords.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ`,
        }}
      />

      <Modal
        title={`${action === 'approve' ? 'Duyệt' : 'Từ chối'} hồ sơ`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={action === 'approve' ? 'Duyệt' : 'Từ chối'}
        cancelText="Hủy"
        okButtonProps={{
          type: action === 'approve' ? 'primary' : 'danger',
        }}
      >
        {currentRecord && (
          <div style={{ marginBottom: '16px' }}>
            <p><strong>Hồ sơ:</strong> {currentRecord.title}</p>
            <p><strong>Nhân viên:</strong> {currentRecord.employee}</p>
            <p><strong>Phòng ban:</strong> {currentRecord.department}</p>
          </div>
        )}

        <Form form={form} layout="vertical">
          <Form.Item
            name="note"
            label="Ghi chú"
            rules={action === 'reject' ? [{ required: true, message: 'Vui lòng nhập lý do từ chối' }] : []}
          >
            <TextArea
              rows={4}
              placeholder={action === 'approve' ? 'Ghi chú (tùy chọn)' : 'Lý do từ chối'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Approvals;