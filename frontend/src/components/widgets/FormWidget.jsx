import React, { useState } from 'react';
import './FormWidget.css';

const FormWidget = ({
  title,
  fields,
  onSubmit,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
  onCancel,
  initialData = {}
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} là bắt buộc`;
      }

      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Email không hợp lệ';
        }
      }

      if (field.minLength && formData[field.name] && formData[field.name].length < field.minLength) {
        newErrors[field.name] = `${field.label} phải có ít nhất ${field.minLength} ký tự`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const baseProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleInputChange(field.name, e.target.value),
      className: `form-input ${errors[field.name] ? 'error' : ''}`,
      placeholder: field.placeholder || '',
      required: field.required
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...baseProps}
            rows={field.rows || 4}
          />
        );

      case 'select':
        return (
          <select {...baseProps}>
            <option value="">-- Chọn {field.label.toLowerCase()} --</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="checkbox-group">
            {field.options?.map(option => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name]?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = formData[field.name] || [];
                    if (e.target.checked) {
                      handleInputChange(field.name, [...currentValues, option.value]);
                    } else {
                      handleInputChange(field.name, currentValues.filter(v => v !== option.value));
                    }
                  }}
                />
                <span className="checkmark"></span>
                {option.label}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="radio-group">
            {field.options?.map(option => (
              <label key={option.value} className="radio-label">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name] === option.value}
                  onChange={(e) => handleInputChange(field.name, option.value)}
                />
                <span className="radio-checkmark"></span>
                {option.label}
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            {...baseProps}
            type={field.type || 'text'}
          />
        );
    }
  };

  return (
    <div className="form-widget">
      <div className="form-header">
        <h3 className="form-title">{title}</h3>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {fields.map(field => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name} className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>

            {renderField(field)}

            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}

            {field.help && (
              <span className="help-text">{field.help}</span>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>

          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              {cancelLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormWidget;