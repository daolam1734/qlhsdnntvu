import React from 'react';
import { FaBell, FaUser } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

// Styles object
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '70px',
    background: '#1e3a8a',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: '2px solid #fbbf24',
    transition: 'left 0.3s ease'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: '#fbbf24',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1e3a8a',
    fontSize: '1.1rem'
  },
  logoImage: {
    height: '40px',
    width: '40px',
    borderRadius: '8px',
    objectFit: 'contain'
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 600,
    color: 'white'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  notificationBtn: {
    position: 'relative',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    color: 'white'
  },
  notificationBtnHover: {
    background: 'rgba(255, 255, 255, 0.1)'
  },
  notificationIcon: {
    fontSize: '1.1rem'
  },
  notificationBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 600
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  userName: {
    fontWeight: 500,
    fontSize: '0.9rem',
    color: 'white'
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#d1d5db'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  // Responsive styles
  responsiveHeader: {
    padding: '0 1rem'
  },
  responsiveLogoText: {
    display: 'none'
  },
  responsiveUserDetails: {
    display: 'none'
  },
  responsiveHeaderRight: {
    gap: '1rem'
  },
  responsiveNotificationBtn: {
    width: '36px',
    height: '36px'
  },
  responsiveUserAvatar: {
    width: '32px',
    height: '32px'
  }
};

const Header = ({ sidebarCollapsed = false }) => {
    const { user } = useAuth();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = sidebarCollapsed ? 70 : 280; // Match CSS values

    return (
        <header style={{
            ...styles.header,
            left: isMobile ? 0 : sidebarWidth,
            ...(isMobile ? styles.responsiveHeader : {})
        }}>
            <div style={styles.headerLeft}>
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>
                        <FaUser />
                    </div>
                    <span style={{
                        ...styles.logoText,
                        ...(isMobile ? styles.responsiveLogoText : {})
                    }}>
                        Quản lý hồ sơ đi nước ngoài
                    </span>
                </div>
            </div>

            <div style={{
                ...styles.headerRight,
                ...(isMobile ? styles.responsiveHeaderRight : {})
            }}>
                <button
                    style={{
                        ...styles.notificationBtn,
                        ...(isMobile ? styles.responsiveNotificationBtn : {})
                    }}
                    onMouseEnter={(e) => e.target.style.background = styles.notificationBtnHover.background}
                    onMouseLeave={(e) => e.target.style.background = styles.notificationBtn.background}
                >
                    <FaBell style={styles.notificationIcon} />
                    <span style={styles.notificationBadge}>3</span>
                </button>

                <div style={styles.userInfo}>
                    <div style={{
                        ...styles.userDetails,
                        ...(isMobile ? styles.responsiveUserDetails : {})
                    }}>
                        <span style={styles.userName}>{user?.ho_ten || user?.ten_dang_nhap || 'Người dùng'}</span>
                        <span style={styles.userRole}>{user?.chuc_vu || 'Chức vụ'}</span>
                    </div>
                    <div style={{
                        ...styles.userAvatar,
                        ...(isMobile ? styles.responsiveUserAvatar : {})
                    }}>
                        <img
                            src={user?.avatar || '/default-avatar.png'}
                            alt="Avatar"
                            style={styles.avatarImage}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;