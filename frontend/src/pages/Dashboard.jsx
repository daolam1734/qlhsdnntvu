import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import StatsWidget from '../components/widgets/StatsWidget';
import ListWidget from '../components/widgets/ListWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import FormWidget from '../components/widgets/FormWidget';
import CategoryManagement from './admin/CategoryManagement';
import UserManagement from './admin/UserManagement';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample data for widgets
  const statsData = [
    {
      title: 'Tổng đơn xin phép',
      value: 156,
      change: 12,
      changeType: 'increase',
      icon: '📋',
      color: '#3498db'
    },
    {
      title: 'Đơn đang xử lý',
      value: 23,
      change: -5,
      changeType: 'decrease',
      icon: '⏳',
      color: '#e67e22'
    },
    {
      title: 'Đơn đã duyệt',
      value: 89,
      change: 8,
      changeType: 'increase',
      icon: '✅',
      color: '#27ae60'
    },
    {
      title: 'Đơn từ chối',
      value: 12,
      change: -2,
      changeType: 'decrease',
      icon: '❌',
      color: '#e74c3c'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      applicant: 'Nguyễn Văn A',
      department: 'Công nghệ thông tin',
      destination: 'Nhật Bản',
      status: 'Đang xử lý',
      submittedDate: '2024-01-15'
    },
    {
      id: 2,
      applicant: 'Trần Thị B',
      department: 'Kinh tế',
      destination: 'Hàn Quốc',
      status: 'Đã duyệt',
      submittedDate: '2024-01-14'
    },
    {
      id: 3,
      applicant: 'Lê Văn C',
      department: 'Ngoại ngữ',
      destination: 'Đức',
      status: 'Từ chối',
      submittedDate: '2024-01-13'
    }
  ];

  const chartData = [
    { label: 'Tháng 1', value: 45, color: '#3498db' },
    { label: 'Tháng 2', value: 52, color: '#e67e22' },
    { label: 'Tháng 3', value: 38, color: '#27ae60' },
    { label: 'Tháng 4', value: 61, color: '#e74c3c' },
    { label: 'Tháng 5', value: 49, color: '#9b59b6' },
    { label: 'Tháng 6', value: 73, color: '#1abc9c' }
  ];

  const pieData = [
    { label: 'Nhật Bản', value: 35, color: '#3498db' },
    { label: 'Hàn Quốc', value: 28, color: '#e67e22' },
    { label: 'Đức', value: 18, color: '#27ae60' },
    { label: 'Pháp', value: 12, color: '#e74c3c' },
    { label: 'Khác', value: 7, color: '#9b59b6' }
  ];

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const renderMainContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <StatsWidget key={index} {...stat} />
              ))}
            </div>

            <div className="widgets-row">
              <div className="widget-container">
                <ListWidget
                  title="Đơn xin phép gần đây"
                  items={recentApplications}
                  columns={[
                    { key: 'applicant', label: 'Người xin phép', width: '20%' },
                    { key: 'department', label: 'Khoa/Ban', width: '20%' },
                    { key: 'destination', label: 'Điểm đến', width: '20%' },
                    { key: 'status', label: 'Trạng thái', width: '15%' },
                    { key: 'submittedDate', label: 'Ngày nộp', width: '15%' }
                  ]}
                  actions={[
                    { label: 'Xem chi tiết', action: 'view' },
                    { label: 'Duyệt', action: 'approve' },
                    { label: 'Từ chối', action: 'reject' }
                  ]}
                />
              </div>

              <div className="widget-container">
                <ChartWidget
                  title="Thống kê đơn xin phép theo tháng"
                  data={chartData}
                  type="bar"
                />
              </div>
            </div>

            <div className="widgets-row">
              <div className="widget-container">
                <ChartWidget
                  title="Phân bố điểm đến"
                  data={pieData}
                  type="pie"
                />
              </div>

              <div className="widget-container">
                <FormWidget
                  title="Tạo đơn xin phép mới"
                  fields={[
                    {
                      name: 'applicantName',
                      label: 'Họ và tên',
                      type: 'text',
                      required: true,
                      placeholder: 'Nhập họ và tên đầy đủ'
                    },
                    {
                      name: 'department',
                      label: 'Khoa/Ban',
                      type: 'select',
                      required: true,
                      options: [
                        { value: 'cntt', label: 'Công nghệ thông tin' },
                        { value: 'kinhte', label: 'Kinh tế' },
                        { value: 'ngoaingu', label: 'Ngoại ngữ' },
                        { value: 'ketoan', label: 'Kế toán' }
                      ]
                    },
                    {
                      name: 'destination',
                      label: 'Điểm đến',
                      type: 'select',
                      required: true,
                      options: [
                        { value: 'japan', label: 'Nhật Bản' },
                        { value: 'korea', label: 'Hàn Quốc' },
                        { value: 'germany', label: 'Đức' },
                        { value: 'france', label: 'Pháp' },
                        { value: 'other', label: 'Khác' }
                      ]
                    },
                    {
                      name: 'purpose',
                      label: 'Mục đích',
                      type: 'textarea',
                      required: true,
                      placeholder: 'Mô tả mục đích chuyến đi',
                      rows: 3
                    },
                    {
                      name: 'startDate',
                      label: 'Ngày bắt đầu',
                      type: 'date',
                      required: true
                    },
                    {
                      name: 'endDate',
                      label: 'Ngày kết thúc',
                      type: 'date',
                      required: true
                    }
                  ]}
                  onSubmit={handleFormSubmit}
                  submitLabel="Tạo đơn"
                />
              </div>
            </div>
          </div>
        );

      case 'users':
        return <UserManagement />;

      case 'categories':
        return <CategoryManagement />;

      case 'applications':
        return (
          <MainContent title="Danh sách đơn xin phép">
            <ListWidget
              title="Tất cả đơn xin phép"
              items={recentApplications}
              columns={[
                { key: 'applicant', label: 'Người xin phép', width: '20%' },
                { key: 'department', label: 'Khoa/Ban', width: '20%' },
                { key: 'destination', label: 'Điểm đến', width: '20%' },
                { key: 'status', label: 'Trạng thái', width: '15%' },
                { key: 'submittedDate', label: 'Ngày nộp', width: '15%' }
              ]}
              actions={[
                { label: 'Xem chi tiết', action: 'view' },
                { label: 'Duyệt', action: 'approve' },
                { label: 'Từ chối', action: 'reject' }
              ]}
            />
          </MainContent>
        );

      case 'reports':
        return (
          <MainContent title="Báo cáo thống kê">
            <div className="widgets-row">
              <ChartWidget
                title="Thống kê theo tháng"
                data={chartData}
                type="line"
              />
              <ChartWidget
                title="Phân bố theo điểm đến"
                data={pieData}
                type="pie"
              />
            </div>
          </MainContent>
        );

      default:
        return (
          <MainContent title="Chức năng đang phát triển">
            <p>Chức năng này sẽ được cập nhật trong phiên bản tiếp theo.</p>
          </MainContent>
        );
    }
  };

  return (
    <div className="dashboard">
      <Header sidebarCollapsed={sidebarCollapsed} />

      <div className="dashboard-body">
        <Sidebar
          userRole={user?.vai_tro || 'user'}
          isCollapsed={sidebarCollapsed}
          activeMenu={activeMenu}
          onToggle={handleToggleSidebar}
          onMenuClick={handleMenuClick}
        />

        <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{
          marginLeft: isMobile ? 0 : (sidebarCollapsed ? '70px' : '280px'),
          marginTop: '70px',
          transition: 'margin-left 0.3s ease'
        }}>
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;