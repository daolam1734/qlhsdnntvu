import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Login from './components/Login';
import RecordsList from './components/RecordsList';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.sub, email: decoded.email, role: decoded.role });
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.sub, email: decoded.email, role: decoded.role });
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <p>Welcome, {user.email} ({user.role})</p>
            <Routes>
              <Route path="/records" element={<RecordsList user={user} />} />
              <Route path="*" element={<Navigate to="/records" />} />
            </Routes>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
