import React from 'react';
import './ChartWidget.css';

const ChartWidget = ({ title, data, type = 'bar', height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const chartWidth = 100; // percentage

  const renderBarChart = () => (
    <svg className="chart-svg" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 20);
        const barWidth = chartWidth / data.length * 0.8;
        const barX = (chartWidth / data.length) * index + (chartWidth / data.length * 0.1);
        const barY = height - barHeight - 10;

        return (
          <g key={index}>
            <rect
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={item.color || '#3498db'}
              className="chart-bar"
            />
            <text
              x={barX + barWidth / 2}
              y={barY - 5}
              textAnchor="middle"
              className="chart-value"
            >
              {item.value}
            </text>
            <text
              x={barX + barWidth / 2}
              y={height}
              textAnchor="middle"
              className="chart-label"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x = (chartWidth / (data.length - 1)) * index;
      const y = height - 10 - (item.value / maxValue) * (height - 20);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="chart-svg" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#3498db"
          strokeWidth="2"
          className="chart-line"
        />
        {data.map((item, index) => {
          const x = (chartWidth / (data.length - 1)) * index;
          const y = height - 10 - (item.value / maxValue) * (height - 20);

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="3"
                fill="#3498db"
                className="chart-point"
              />
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                className="chart-value"
              >
                {item.value}
              </text>
              <text
                x={x}
                y={height}
                textAnchor="middle"
                className="chart-label"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top

    return (
      <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;

          const x1 = 50 + 40 * Math.cos(startAngleRad);
          const y1 = 50 + 40 * Math.sin(startAngleRad);
          const x2 = 50 + 40 * Math.cos(endAngleRad);
          const y2 = 50 + 40 * Math.sin(endAngleRad);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');

          currentAngle = endAngle;

          return (
            <g key={index}>
              <path
                d={pathData}
                fill={item.color || `hsl(${index * 360 / data.length}, 70%, 50%)`}
                className="chart-slice"
              />
              <text
                x={50 + 25 * Math.cos((startAngle + angle / 2) * Math.PI / 180)}
                y={50 + 25 * Math.sin((startAngle + angle / 2) * Math.PI / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="chart-label"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="chart-widget">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
      </div>

      <div className="chart-content">
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
      </div>

      {type !== 'pie' && (
        <div className="chart-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: item.color || '#3498db' }}
              ></span>
              <span className="legend-label">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartWidget;