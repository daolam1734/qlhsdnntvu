import React from 'react';

const MainContent = ({ children, title }) => {
  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 70px)',
      padding: '2rem',
      width: '100%'
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#1e3a8a',
      marginBottom: '1.5rem',
      borderBottom: '2px solid #e9ecef',
      paddingBottom: '0.5rem'
    },
    content: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      minHeight: '400px'
    }
  };

  return (
    <div style={styles.container}>
      {title && <h1 style={styles.title}>{title}</h1>}
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default MainContent;