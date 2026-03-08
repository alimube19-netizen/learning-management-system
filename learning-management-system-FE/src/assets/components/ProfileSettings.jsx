import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profilePicture: '',
    studentId: '',
    department: '',
    enrollmentDate: ''
  });

  // Load user profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('student_token');
      const response = await axios.get('http://localhost:5000/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      showMessage('error', 'Failed to load profile data');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('student_token');
      const response = await axios.post('http://localhost:5000/api/student/upload-avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(prev => ({ ...prev, profilePicture: response.data.avatarUrl }));
      showMessage('success', 'Profile picture updated!');
    } catch (error) {
      showMessage('error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('student_token');
      await axios.put('http://localhost:5000/api/student/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      {/* Page Title Heading */}
      <div className="page-title-section mb-4">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">
          Update your personal information and profile details
          <span className="form-status">All changes are saved automatically</span>
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div className="settings-content">
        <div className="row">
          {/* Left Column - Profile Picture */}
          <div className="col-md-4 mb-4">
            <div className="profile-picture-section">
              <div className="profile-picture-container">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="profile-picture"
                  />
                ) : (
                  <div className="profile-picture-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                )}
                <div className="upload-overlay">
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="d-none"
                    disabled={loading}
                  />
                  <label htmlFor="profilePicture" className="upload-btn" title="Change photo">
                    <i className="fas fa-camera"></i>
                  </label>
                </div>
              </div>
              <p className="text-muted small mt-2 text-center">
                Click camera icon to upload
                <br />
                <small>Max 5MB • JPG, PNG, GIF</small>
              </p>
            </div>

            {/* Read-only Information */}
            <div className="read-only-info">
              <div className="info-item">
                <label>Student ID</label>
                <div className="info-value">{profile.studentId || 'N/A'}</div>
              </div>
              <div className="info-item">
                <label>Department</label>
                <div className="info-value">{profile.department || 'N/A'}</div>
              </div>
              <div className="info-item">
                <label>Enrollment Date</label>
                <div className="info-value">{profile.enrollmentDate || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Editable Information */}
          <div className="col-md-8">
            <div className="profile-form">
              <div className="mb-3">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
                <small className="text-muted">This is also your login email</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Bio / About Me</label>
                <textarea
                  name="bio"
                  className="form-control"
                  rows="4"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself, your interests, or goals..."
                  maxLength="300"
                />
                <div className="d-flex justify-content-between mt-1">
                  <small className="text-muted">Optional, max 300 characters</small>
                  <small className="text-muted">{profile.bio.length}/300</small>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={saveProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={fetchProfileData}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-settings {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
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
          color: #27ae60;
          border: 1px solid #e3e6f0;
          font-weight: 500;
        }

        .settings-header {
          margin-bottom: 30px;
        }

        .settings-header h1 {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .settings-content {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        /* Profile Picture Styles */
        .profile-picture-container {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 15px;
        }

        .profile-picture {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .profile-picture-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 60px;
          border: 4px solid #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .upload-overlay {
          position: absolute;
          bottom: 10px;
          right: 10px;
        }

        .upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: #1976d2;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 3px solid white;
          font-size: 18px;
        }

        .upload-btn:hover {
          background: #1565c0;
          transform: scale(1.1);
        }

        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Read-only Information */
        .read-only-info {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .info-item {
          margin-bottom: 15px;
        }

        .info-item label {
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
          display: block;
        }

        .info-value {
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        /* Form Styles */
        .form-label {
          font-weight: 500;
          color: #495057;
          margin-bottom: 8px;
          display: block;
        }

        .form-control {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 10px 15px;
          transition: all 0.2s ease;
        }

        .form-control:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        textarea.form-control {
          resize: vertical;
        }

        /* Button Styles */
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 10px 25px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          min-width: 120px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-outline-secondary {
          border: 1px solid #dee2e6;
          padding: 10px 25px;
          border-radius: 8px;
          font-weight: 500;
          min-width: 100px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-settings {
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
          
          .settings-content {
            padding: 20px;
          }
          
          .profile-picture-container {
            width: 120px;
            height: 120px;
          }
          
          .upload-btn {
            width: 40px;
            height: 40px;
          }
          
          .read-only-info {
            margin-top: 20px;
            padding: 15px;
          }
        }

        @media (max-width: 576px) {
          .settings-content {
            padding: 15px;
          }
          
          .d-flex.gap-2 {
            flex-direction: column;
            gap: 10px !important;
          }
          
          .btn-primary, .btn-outline-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileSettings;