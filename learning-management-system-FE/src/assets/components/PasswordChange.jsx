import React, { useState } from 'react';
import axios from 'axios';

const PasswordChange = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push('One uppercase letter');
    if (!hasLowerCase) errors.push('One lowercase letter');
    if (!hasNumbers) errors.push('One number');
    if (!hasSpecialChar) errors.push('One special character');

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const changePassword = async () => {
    // Validation
    if (!formData.currentPassword) {
      showMessage('error', 'Please enter your current password');
      return;
    }

    if (!formData.newPassword) {
      showMessage('error', 'Please enter a new password');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      showMessage('error', `Password must contain: ${validation.errors.join(', ')}`);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      showMessage('error', 'New password must be different from current password');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('student_token');
      await axios.post('http://localhost:5000/api/student/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showMessage('success', 'Password changed successfully!');
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-change">
      {/* Page Title Heading */}
      <div className="page-title-section mb-4">
        <h1 className="page-title">Change Password</h1>
        <p className="page-subtitle">
          Update your account password to keep your account secure
          <span className="form-status">Follow the password requirements</span>
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`}>
          {message.text}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage({ type: '', text: '' })}
          ></button>
        </div>
      )}

      <div className="password-container">
        <div className="password-grid">
          {/* Left Column - Form */}
          <div className="password-form-section">
            <div className="password-card">
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-lock me-2"></i>
                  Current Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={formData.showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    className="form-control"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter your current password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility('showCurrentPassword')}
                    disabled={loading}
                  >
                    <i className={`fas ${formData.showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-key me-2"></i>
                  New Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={formData.showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    className="form-control"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility('showNewPassword')}
                    disabled={loading}
                  >
                    <i className={`fas ${formData.showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-check-circle me-2"></i>
                  Confirm New Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={formData.showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility('showConfirmPassword')}
                    disabled={loading}
                  >
                    <i className={`fas ${formData.showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.newPassword && formData.confirmPassword && (
                  <div className={`password-match-indicator ${formData.newPassword === formData.confirmPassword ? 'valid' : 'invalid'}`}>
                    <i className={`fas fa-${formData.newPassword === formData.confirmPassword ? 'check' : 'times'}`}></i>
                    {formData.newPassword === formData.confirmPassword 
                      ? 'Passwords match' 
                      : 'Passwords do not match'
                    }
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={changePassword}
                  disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt me-2"></i>
                      Change Password
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFormData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                      showCurrentPassword: false,
                      showNewPassword: false,
                      showConfirmPassword: false
                    });
                    setMessage({ type: '', text: '' });
                  }}
                  disabled={loading}
                >
                  <i className="fas fa-eraser me-2"></i>
                  Clear Form
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Requirements & Tips */}
          <div className="password-info-section">
            {/* Password Requirements */}
            <div className="requirements-card">
              <div className="card-header">
                <i className="fas fa-clipboard-check me-2"></i>
                <h5>Password Requirements</h5>
              </div>
              <div className="card-body">
                <ul className="requirements-list">
                  <li className={formData.newPassword.length >= 8 ? 'met' : ''}>
                    <i className={`fas ${formData.newPassword.length >= 8 ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    <span>At least 8 characters</span>
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                    <i className={`fas ${/[A-Z]/.test(formData.newPassword) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    <span>One uppercase letter (A-Z)</span>
                  </li>
                  <li className={/[a-z]/.test(formData.newPassword) ? 'met' : ''}>
                    <i className={`fas ${/[a-z]/.test(formData.newPassword) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    <span>One lowercase letter (a-z)</span>
                  </li>
                  <li className={/\d/.test(formData.newPassword) ? 'met' : ''}>
                    <i className={`fas ${/\d/.test(formData.newPassword) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    <span>One number (0-9)</span>
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'met' : ''}>
                    <i className={`fas ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    <span>One special character (!@#$%...)</span>
                  </li>
                </ul>
                
                <div className="password-strength mt-4">
                  <div className="strength-label">
                    <i className="fas fa-chart-line me-2"></i>
                    Password Strength
                  </div>
                  <div className="strength-meter">
                    <div className="strength-bar"></div>
                  </div>
                  <div className="strength-text mt-2">
                    {formData.newPassword.length === 0 ? 'No password entered' : 
                     formData.newPassword.length < 4 ? 'Weak' :
                     formData.newPassword.length < 8 ? 'Fair' :
                     validatePassword(formData.newPassword).isValid ? 'Strong' : 'Good'}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="security-tips-card">
              <div className="card-header">
                <i className="fas fa-shield-alt me-2"></i>
                <h5>Security Tips</h5>
              </div>
              <div className="card-body">
                <div className="tip-item">
                  <i className="fas fa-user-secret tip-icon"></i>
                  <div className="tip-content">
                    <h6>Use Unique Passwords</h6>
                    <p>Don't reuse passwords across different accounts</p>
                  </div>
                </div>
                <div className="tip-item">
                  <i className="fas fa-brain tip-icon"></i>
                  <div className="tip-content">
                    <h6>Avoid Personal Info</h6>
                    <p>Don't use birthdays, names, or common words</p>
                  </div>
                </div>
                <div className="tip-item">
                  <i className="fas fa-history tip-icon"></i>
                  <div className="tip-content">
                    <h6>Update Regularly</h6>
                    <p>Change your password every 90 days</p>
                  </div>
                </div>
                <div className="tip-item">
                  <i className="fas fa-lock tip-icon"></i>
                  <div className="tip-content">
                    <h6>Consider Password Manager</h6>
                    <p>Use tools like LastPass or 1Password</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .password-change {
          padding: 20px;
          background: #f8f9fa;
          min-height: calc(100vh - 80px);
        }

        /* Page Title Section */
        .page-title-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #3498db;
          margin-bottom: 30px;
        }

        .page-title {
          color: #2c3e50;
          font-weight: 700;
          font-size: 1.8rem;
          margin: 0 0 10px 0;
        }

        .page-subtitle {
          color: #7f8c8d;
          font-size: 1rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .form-status {
          background: #f8f9fa;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #e74c3c;
          border: 1px solid #e3e6f0;
          font-weight: 500;
        }

        /* Main Container */
        .password-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .password-grid {
          display: grid;
          gap: 30px;
          min-height: auto;
        }

        /* Form Section */
        .password-form-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .password-card {
          display: flex;
          flex-direction: column;
          gap: 25px;
          flex: 1;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          font-size: 0.95rem;
        }

        .form-label i {
          color: #3498db;
        }

        .password-input-wrapper {
          position: relative;
          margin-bottom: 5px;
        }

        .form-control {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 12px 15px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #fdfdfd;
          width: 100%;
        }

        .form-control:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          background: white;
          outline: none;
        }

        .form-control::placeholder {
          color: #adb5bd;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .password-toggle-btn:hover:not(:disabled) {
          background: #f1f3f4;
          color: #3498db;
        }

        .password-toggle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-match-indicator {
          margin-top: 10px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .password-match-indicator.valid {
          background: rgba(25, 135, 84, 0.1);
          color: #198754;
          border: 1px solid rgba(25, 135, 84, 0.2);
        }

        .password-match-indicator.invalid {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
          border: none;
          padding: 14px 30px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          flex: 1;
          color: white;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
        }

        .btn-primary:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .btn-outline-secondary {
          border: 1px solid #dee2e6;
          padding: 14px 20px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          background: white;
          color: #495057;
          cursor: pointer;
          flex: 1;
        }

        .btn-outline-secondary:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #adb5bd;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn-outline-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        /* Info Section */
        .password-info-section {
          display: flex;
          flex-direction: column;
          gap: 25px;
          min-height: 100%;
        }

        .requirements-card,
        .security-tips-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 20px;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          align-items: center;
        }

        .card-header h5 {
          margin: 0;
          color: #2c3e50;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .card-header i {
          color: #3498db;
          font-size: 1.2rem;
        }

        .card-body {
          padding: 25px;
          flex: 1;
        }

        .requirements-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .requirements-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .requirements-list li:hover {
          background: #f8f9fa;
        }

        .requirements-list li.met {
          color: #198754;
        }

        .requirements-list li:not(.met) {
          color: #6c757d;
        }

        .requirements-list li i {
          font-size: 14px;
          width: 20px;
        }

        .password-strength {
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #f1f3f5;
        }

        .strength-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
        }

        .strength-meter {
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .strength-bar {
          height: 100%;
          background: linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71);
          width: ${formData.newPassword.length === 0 ? '0%' : 
                   formData.newPassword.length < 4 ? '25%' :
                   formData.newPassword.length < 8 ? '50%' :
                   validatePassword(formData.newPassword).isValid ? '100%' : '75%'};
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .strength-text {
          font-size: 12px;
          font-weight: 600;
          color: ${formData.newPassword.length === 0 ? '#6c757d' : 
                  formData.newPassword.length < 4 ? '#e74c3c' :
                  formData.newPassword.length < 8 ? '#f39c12' :
                  validatePassword(formData.newPassword).isValid ? '#2ecc71' : '#f39c12'};
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Security Tips */
        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f1f3f5;
        }

        .tip-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .tip-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .tip-content h6 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .tip-content p {
          margin: 0;
          color: #6c757d;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .password-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }
          
          .password-form-section {
            min-height: auto;
          }
        }

        @media (max-width: 768px) {
          .password-change {
            padding: 15px;
          }
          
          .page-title-section {
            padding: 15px;
            margin-bottom: 20px;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .page-subtitle {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .password-form-section {
            padding: 20px;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 576px) {
          .password-container {
            padding: 0;
          }
          
          .password-form-section,
          .requirements-card,
          .security-tips-card {
            padding: 15px;
          }
          
          .card-body {
            padding: 20px;
          }
          
          .btn-primary,
          .btn-outline-secondary {
            padding: 12px 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default PasswordChange;