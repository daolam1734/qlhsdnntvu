import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    FaChartBar,
    FaUsers,
    FaClipboardList,
    FaChartLine,
    FaCog,
    FaCheckCircle,
    FaFileAlt,
    FaPlus,
    FaPen,
    FaBuilding,
    FaChevronLeft,
    FaChevronRight,
    FaSignOutAlt,
    FaTags
} from 'react-icons/fa';

const Sidebar = ({ userRole, isCollapsed, activeMenu, onToggle, onMenuClick }) => {
    const { logout } = useAuth();

    // Detect mobile screen
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Inline styles
    const styles = {
        sidebar: {
            position: 'fixed',
            left: isMobile ? (isCollapsed ? '-280px' : '0') : 0,
            top: 0,
            bottom: 0,
            width: isCollapsed && !isMobile ? 70 : 280,
            background: '#1e3a8a',
            color: 'white',
            transition: 'left 0.3s ease, width 0.3s ease',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: isMobile && !isCollapsed ? '2px 0 20px rgba(0, 0, 0, 0.3)' : '2px 0 10px rgba(0, 0, 0, 0.1)',
        },
        sidebarHeader: {
            padding: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        toggleBtn: {
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderBottom: 'none',
            borderRight: 'none',
            color: 'white',
            fontSize: '1.1rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '4px',
            transition: 'background-color 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
        },
        toggleBtnHover: {
            background: 'rgba(255, 255, 255, 0.1)',
        },
        sidebarTitle: {
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 600,
        },
        sidebarNav: {
            flex: 1,
            padding: '1rem 0',
            overflowY: 'auto',
        },
        menuList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        menuItem: {
            marginBottom: '0.25rem',
        },
        menuLink: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderBottom: 'none',
            borderRight: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            borderRadius: 0,
            textAlign: 'left',
        },
        menuLinkHover: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
        },
        menuLinkActive: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fbbf24',
            borderRight: '3px solid #fbbf24',
        },
        menuIcon: {
            fontSize: '1.2rem',
            marginRight: isCollapsed ? 0 : '1rem',
            width: '20px',
            textAlign: 'center',
        },
        menuLabel: {
            flex: 1,
            fontSize: '0.9rem',
        },
        sidebarFooter: {
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
        },
        logoutBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderTop: 'none',
            borderLeft: 'none',
            borderBottom: 'none',
            borderRight: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        logoutBtnHover: {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-1px)',
        },
        logoutIcon: {
            fontSize: '1.1rem',
        },
        logoutText: {
            fontWeight: 500,
        },
        backdrop: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: isMobile && !isCollapsed ? 'block' : 'none',
        },
    };
    // Menu items theo vai trò
    const menuItems = {
        admin: [
            { id: 'dashboard', label: 'Tổng quan', icon: <FaChartBar />, path: '/dashboard' },
            { id: 'users', label: 'Quản lý người dùng', icon: <FaUsers />, path: '/users' },
            { id: 'categories', label: 'Quản lý danh mục', icon: <FaTags />, path: '/categories' },
            { id: 'applications', label: 'Hồ sơ đi nước ngoài', icon: <FaClipboardList />, path: '/applications' },
            { id: 'reports', label: 'Báo cáo', icon: <FaChartLine />, path: '/reports' },
            { id: 'settings', label: 'Cài đặt hệ thống', icon: <FaCog />, path: '/settings' },
        ],
        manager: [
            { id: 'dashboard', label: 'Tổng quan', icon: <FaChartBar />, path: '/dashboard' },
            { id: 'applications', label: 'Hồ sơ cần duyệt', icon: <FaClipboardList />, path: '/applications' },
            { id: 'approved', label: 'Hồ sơ đã duyệt', icon: <FaCheckCircle />, path: '/approved' },
            { id: 'reports', label: 'Báo cáo', icon: <FaChartLine />, path: '/reports' },
        ],
        user: [
            { id: 'dashboard', label: 'Tổng quan', icon: <FaChartBar />, path: '/dashboard' },
            { id: 'my-applications', label: 'Hồ sơ của tôi', icon: <FaFileAlt />, path: '/my-applications' },
            { id: 'new-application', label: 'Tạo hồ sơ mới', icon: <FaPlus />, path: '/new-application' },
            { id: 'reports', label: 'Báo cáo chuyến đi', icon: <FaPen />, path: '/reports' },
        ],
        party: [
            { id: 'dashboard', label: 'Tổng quan', icon: <FaChartBar />, path: '/dashboard' },
            { id: 'party-applications', label: 'Hồ sơ Đảng', icon: <FaBuilding />, path: '/party-applications' },
            { id: 'party-reports', label: 'Báo cáo Đảng', icon: <FaClipboardList />, path: '/party-reports' },
        ]
    };

    const normalizedRole = (() => {
        const r = (userRole || '').toUpperCase();
        const roleMap = {
            'BGH': 'admin',
            'TCHC': 'admin',
            'ADMIN': 'admin',
            'TRUONG_DON_VI': 'manager',
            'VIEN_CHUC': 'user',
            'CHI_BO': 'party',
            'DANG_UY': 'party'
        };

        if (roleMap[r]) return roleMap[r];
        const lower = r.toLowerCase();
        if (menuItems[lower]) return lower;
        return 'user';
    })();

    const currentMenu = menuItems[normalizedRole] || menuItems.user;

    const handleMenuClick = (itemId) => {
        onMenuClick(itemId);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {isMobile && !isCollapsed && (
                <div
                    style={styles.backdrop}
                    onClick={onToggle}
                />
            )}
            <aside style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <button
                        style={styles.toggleBtn}
                        onClick={onToggle}
                        onMouseEnter={(e) => e.target.style.background = styles.toggleBtnHover.background}
                        onMouseLeave={(e) => e.target.style.background = styles.toggleBtn.background}
                    >
                        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>
                    {!isCollapsed && <h3 style={styles.sidebarTitle}></h3>}
                </div>

                <nav style={styles.sidebarNav}>
                    <ul style={styles.menuList}>
                        {currentMenu.map((item) => (
                            <li key={item.id} style={styles.menuItem}>
                                <button
                                    style={activeMenu === item.id ? { ...styles.menuLink, ...styles.menuLinkActive } : styles.menuLink}
                                    onClick={() => handleMenuClick(item.id)}
                                    onMouseEnter={(e) => {
                                        if (activeMenu !== item.id) {
                                            e.target.style.background = styles.menuLinkHover.background;
                                            e.target.style.color = styles.menuLinkHover.color;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeMenu !== item.id) {
                                            e.target.style.background = styles.menuLink.background;
                                            e.target.style.color = styles.menuLink.color;
                                        }
                                    }}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <span style={styles.menuIcon}>{item.icon}</span>
                                    {!isCollapsed && <span style={styles.menuLabel}>{item.label}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={styles.sidebarFooter}>
                    <button
                        style={styles.logoutBtn}
                        onClick={handleLogout}
                        onMouseEnter={(e) => {
                            e.target.style.background = styles.logoutBtnHover.background;
                            e.target.style.transform = styles.logoutBtnHover.transform;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = styles.logoutBtn.background;
                            e.target.style.transform = 'none';
                        }}
                        title={isCollapsed ? 'Đăng xuất' : ''}
                    >
                        <span style={styles.logoutIcon}><FaSignOutAlt /></span>
                        {!isCollapsed && <span style={styles.logoutText}>Đăng xuất</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;