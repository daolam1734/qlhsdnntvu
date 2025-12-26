import React from 'react';
import './StatsWidget.css';

const StatsWidget = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getChangeColor = () => {
    if (!change) return '';
    if (changeType === 'increase') return 'positive';
    if (changeType === 'decrease') return 'negative';
    return 'neutral';
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return '↗️';
    if (changeType === 'decrease') return '↘️';
    return '➡️';
  };

  return (
    <div className={`stats-widget ${color}`}>
      <div className="stats-header">
        <div className="stats-icon">
          {icon}
        </div>
        <div className="stats-title">{title}</div>
      </div>

      <div className="stats-value">
        {value}
      </div>

      {change && (
        <div className={`stats-change ${getChangeColor()}`}>
          <span className="change-icon">{getChangeIcon()}</span>
          <span className="change-value">{change}</span>
          <span className="change-period">so với tháng trước</span>
        </div>
      )}
    </div>
  );
};

export default StatsWidget;