import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // API base URL
  const API_BASE_URL = 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    if (!username || !password) {
      setErr(
        <div className="alert alert-danger p-2 py-1 mt-2 mb-2 text-center" role="alert">
          Both fields are required
        </div>
      );
      setLoading(false);
      return;
    }

    try {
      // Send login request to backend
      const response = await axios.post(`${API_BASE_URL}/api/AdminSignin`, {
        username,
        password
      });

      console.log(response.data)

      if (response.data.success) {
        // Store token and admin info
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_info', JSON.stringify(response.data.admin));
        
        // Set default auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Redirect to admin dashboard
        navigate('/AdminPortal');
      } else {
        setErr(
          <div className="alert alert-danger p-2 py-1 mt-2 mb-2 text-center" role="alert">
            {response.data.message || 'Login failed'}
          </div>
        );
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Backend responded with error
        switch (error.response.status) {
          case 401:
            errorMessage = 'Invalid username or password';
            break;
          case 400:
            errorMessage = error.response.data.message || 'Bad request';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || 'Login failed';
        }
      } else if (error.request) {
        // No response from server
        errorMessage = 'No response from server. Check your connection.';
      }
      
      setErr(
        <div className="alert alert-danger p-2 py-1 mt-2 mb-2 text-center" role="alert">
          {errorMessage}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 position-relative px-3"
      style={{
        backgroundImage: "url('/banner-bg.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        zIndex: 2,
      }}
    >

      {/* Top-right buttons */}
      <div className="position-absolute top-0 end-0 p-3 d-flex align-items-center gap-2">
        <button 
          onClick={() => navigate("/Signin")}
          className="btn btn-sm d-flex align-items-center gap-2"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            color: '#306AE4',
            padding: '6px 12px',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <i className="fas fa-user-graduate" style={{ fontSize: '14px' }}></i>
          <span>Student</span>
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow-sm p-3 w-100" style={{ maxWidth: '360px', backdropFilter: 'blur(3px)' }}>
          <h3 className="text-center text-dark mb-4">Admin Login</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="username"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small" htmlFor="password">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-sm"
                id="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Checkbox for show password */}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPasswordCheck"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                disabled={loading}
              />
              <label className="form-check-label small" htmlFor="showPasswordCheck">
                Show password
              </label>
            </div>

            {err}

            <div className="d-grid">
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: '#306AE4' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            {/* Default credentials hint (remove in production) */}
            <div className="mt-3 text-center small text-muted">
              <small>Default: admin / admin123</small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignin;