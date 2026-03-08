import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    program: '', 
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const output = await fetch("http://localhost:5000/api/Signup", {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(formData),
      });

      const dt = await output.json();
      console.log(dt);
      
      if (dt.success || dt.message) {
        setSubmitted(true);
      } else {
        setSubmitted(false);
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 position-relative px-3" style={{
      backgroundImage: "url('/banner-bg.svg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Admin Access Button in Top Right - HIGHER Z-INDEX */}
      <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 1000 }}>
        <Link 
          to="/AdminSignin" 
          className="btn btn-sm d-flex align-items-center gap-1"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            color: '#306AE4',
            padding: '6px 12px',
            fontSize: '14px'
          }}
        >
          <FaUserShield />
          <span>Admin</span>
        </Link>
      </div>

      {/* Semi-transparent overlay - LOWER Z-INDEX */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
      ></div>

      {/* Content Card - MEDIUM Z-INDEX */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 position-relative" style={{ zIndex: 2 }}>
        <div className="card shadow-sm p-3 w-100" style={{ 
          maxWidth: '400px', 
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)"
        }}>
          <div className="card-body">
            {submitted ? (
              <div className="text-center">
                <div className="mb-3">
                  <div className="d-inline-flex align-items-center justify-content-center" style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#3BBCA2",
                    borderRadius: "50%",
                    color: "white",
                    fontSize: "28px"
                  }}>
                    ✓
                  </div>
                </div>
                <h5 className="text-success mb-2">Registration Submitted!</h5>
                <p className="text-muted small mb-3">Your information has been submitted successfully.</p>
                <Link 
                  to="/" 
                  className="btn btn-sm"
                  style={{ 
                    backgroundColor: "#306AE4",
                    color: "white"
                  }}
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <h5 className="card-title text-center text-dark mb-3">Student Registration</h5>

                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label small" htmlFor="program">Program</label>
                    <select
                      className="form-select form-select-sm"
                      name="program"
                      id="program"
                      value={formData.program}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Program</option>
                      <option value="BS">Bachelor's (BS)</option>
                      <option value="MS">Master's (MS)</option>
                      <option value="PhD">Doctorate (PhD)</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small" htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="fullName"
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small" htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="username"
                      id="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small" htmlFor="password">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-sm"
                        name="password"
                        id="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button 
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={togglePassword}
                        style={{
                          border: "1px solid #dee2e6",
                          borderLeft: "none"
                        }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-control-sm"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button 
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={toggleConfirmPassword}
                        style={{
                          border: "1px solid #dee2e6",
                          borderLeft: "none"
                        }}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="d-grid mb-3">
                    <button type="submit" className="btn text-white btn-sm" style={{backgroundColor: "#306AE4"}}>
                      Create Account
                    </button>
                  </div>
                </form>

                {/* Login Link */}
                <div className="text-center border-top pt-3">
                  <p className="text-muted small mb-2">Already have an account?</p>
                  <Link 
                    to="/" 
                    className="btn btn-sm d-flex align-items-center justify-content-center gap-1"
                    style={{ 
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      color: '#306AE4',
                      padding: '6px 12px'
                    }}
                  >
                    ← Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;