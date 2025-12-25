// src/pages/RecordsList.jsx
// Records list page component

import React, { useState } from 'react';
import { Table, Button, Input, Select, Space, Tag, Modal, Form, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RECORD_STATUS, USER_ROLES } from '../constants';
import { useAuth } from '../hooks';

const { Option } = Select;
const { RangePicker } = DatePicker;

const RecordsList = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - replace with real data from API
  const mockRecords = [
    {
      id: 1,
      title: 'Hồ sơ công tác Hà Nội',
      employee: 'Nguyễn Văn A',
      department: 'Khoa CNTT',
      status: 'approved',
      createdAt: '2024-01-15',
      approvedAt: '2024-01-16',
    },
    {
      id: 2,
      title: 'Hồ sơ công tác TP.HCM',
      employee: 'Trần Thị B',
      department: 'Khoa Kinh tế',
      status: 'pending',
      createdAt: '2024-01-14',
      approvedAt: null,
    },
    {
      id: 3,
      title: 'Hồ sơ công tác Đà Nẵng',
      employee: 'Lê Văn C',
      department: 'Khoa Ngoại ngữ',
      status: 'rejected',
      createdAt: '2024-01-13',
      approvedAt: null,
    },
  ];

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

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
      sorter: true,
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: Object.keys(RECORD_STATUS).map(key => ({
        text: getStatusText(RECORD_STATUS[key]),
        value: RECORD_STATUS[key],
      })),
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
            Xem
          </Button>
          {(user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.MANAGER) && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/records/${record.id}/edit`)}
            >
              Sửa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const showFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterOk = () => {
    setIsFilterModalVisible(false);
  };

  const handleFilterCancel = () => {
    setIsFilterModalVisible(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Danh sách hồ sơ</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/records/create')}
        >
          Tạo hồ sơ mới
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <Input
          placeholder="Tìm kiếm hồ sơ..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          value={statusFilter}
          onChange={handleStatusFilter}
          style={{ width: 150 }}
          allowClear
        >
          {Object.keys(RECORD_STATUS).map(key => (
            <Option key={RECORD_STATUS[key]} value={RECORD_STATUS[key]}>
              {getStatusText(RECORD_STATUS[key])}
            </Option>
          ))}
        </Select>
        <Button icon={<FilterOutlined />} onClick={showFilterModal}>
          Bộ lọc nâng cao
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={mockRecords}
        rowKey="id"
        pagination={{
          total: mockRecords.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ`,
        }}
      />

      <Modal
        title="Bộ lọc nâng cao"
        open={isFilterModalVisible}
        onOk={handleFilterOk}
        onCancel={handleFilterCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Khoảng thời gian">
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="Phòng ban">
            <Select placeholder="Chọn phòng ban" allowClear>
              <Option value="cntt">Khoa CNTT</Option>
              <Option value="kinhte">Khoa Kinh tế</Option>
              <Option value="ngoaingu">Khoa Ngoại ngữ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RecordsList;