import React from 'react';
import './ListWidget.css';

const ListWidget = ({ title, items, maxItems = 5, showMore = false, onItemClick }) => {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div className="list-widget">
      <div className="list-header">
        <h3 className="list-title">{title}</h3>
        {showMore && items.length > maxItems && (
          <button className="show-more-btn">Xem tất cả</button>
        )}
      </div>

      <div className="list-content">
        {displayItems.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <ul className="list-items">
            {displayItems.map((item, index) => (
              <li
                key={item.id || index}
                className={`list-item ${item.status ? `status-${item.status}` : ''}`}
                onClick={() => onItemClick && onItemClick(item)}
              >
                <div className="item-content">
                  <div className="item-primary">
                    <span className="item-title">{item.title}</span>
                    {item.subtitle && (
                      <span className="item-subtitle">{item.subtitle}</span>
                    )}
                  </div>
                  <div className="item-meta">
                    {item.date && (
                      <span className="item-date">{item.date}</span>
                    )}
                    {item.status && (
                      <span className={`item-status status-${item.status}`}>
                        {item.status === 'pending' && '⏳'}
                        {item.status === 'approved' && '✅'}
                        {item.status === 'rejected' && '❌'}
                        {item.status === 'draft' && '📝'}
                      </span>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <div className="item-badge">
                    {item.badge}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListWidget;