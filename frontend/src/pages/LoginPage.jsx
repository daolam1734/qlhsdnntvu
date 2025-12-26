import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: '' });
    setLoginError('');
    if (error) clearError();
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Vui lòng nhập tên đăng nhập hoặc email';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await login(formData);
    if (!result.success) {
      setLoginError(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem 2.25rem',
        borderRadius: '10px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        width: '100%',
        maxWidth: '360px',
        border: '1px solid #e3e3e3',
        minWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333', fontSize: '1.7rem', fontWeight: 600 }}>Đăng nhập hệ thống</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {(loginError || error) && (
            <div style={{ background: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #f5c6cb', fontSize: '0.95rem' }}>
              {loginError || error}
            </div>
          )}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 500, textAlign: 'left' }}>Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.username ? '1.5px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none'
              }}
              placeholder="Nhập tên đăng nhập hoặc email"
              disabled={loading}
              autoFocus
            />
            {errors.username && <span style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.25rem', display: 'block' }}>{errors.username}</span>}
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 500, textAlign: 'left' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.password ? '1.5px solid #dc3545' : '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="Nhập mật khẩu"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
                tabIndex={-1}
              >{showPassword ? 'Ẩn' : 'Hiện'}</button>
            </div>
            {errors.password && <span style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.25rem', display: 'block' }}>{errors.password}</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.95rem', color: '#555' }}>
              <input type="checkbox" style={{ marginRight: '0.5rem' }} /> Ghi nhớ đăng nhập
            </label>
            <a href="#" style={{ color: '#0d6efd', textDecoration: 'none', fontSize: '0.95rem' }}>Quên mật khẩu?</a>
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#6c757d' : '#0d6efd',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '1.05rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem',
              transition: 'background 0.2s'
            }}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div style={{ textAlign: 'center', fontSize: '0.95rem', color: '#555' }}>
          Chưa có tài khoản? <a href="#" style={{ color: '#0d6efd', textDecoration: 'none' }}>Đăng ký</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
