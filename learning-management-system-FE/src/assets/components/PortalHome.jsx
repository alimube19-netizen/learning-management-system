// HomePortal.jsx
import React, { useState } from 'react';
import AdminSignin from './AdminSignin';
import Signin from './Signin';
import { Link } from 'react-router-dom';

const HomePortal = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  const navItems = [
    { id: 'home', label: 'Home', icon: 'bi-house' },
    { id: 'services', label: 'Services', icon: 'bi-list-check' },
    { id: 'courses', label: 'Courses', icon: 'bi-book' },
    { id: 'about', label: 'About', icon: 'bi-info-circle' },
    { id: 'contact', label: 'Contact', icon: 'bi-telephone' }
  ];

  return (
    <>
      {/* Inline Styles */}
      <style jsx>{`
        .home-portal {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        /* Navigation */
        .navbar-custom {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        
        .nav-link-custom {
          color: #495057;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          margin: 0 2px;
        }
        
        .nav-link-custom:hover {
          color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.1);
        }
        
        .nav-link-custom.active {
          color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.15);
        }
        
        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 5rem 0;
          position: relative;
          overflow: hidden;
        }
        
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          color: #6c757d;
          max-width: 600px;
          margin-bottom: 2rem;
        }
        
        .hero-illustration {
          max-width: 100%;
          height: auto;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
        }
        
        /* Portal Cards */
        .portal-cards-container {
          padding: 5rem 0;
        }
        
        .portal-card {
          border-radius: 15px;
          border: none;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
          overflow: hidden;
          background: white;
        }
        
        .portal-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .admin-card {
          border-top: 4px solid #0d6efd;
        }
        
        .student-card {
          border-top: 4px solid #198754;
        }
        
        .portal-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
        }
        
        .admin-icon {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          color: white;
        }
        
        .student-icon {
          background: linear-gradient(135deg, #198754 0%, #157347 100%);
          color: white;
        }
        
        /* Features */
        .features-section {
          background: #f8f9fa;
          padding: 5rem 0;
        }
        
        .feature-card {
          background: white;
          border-radius: 10px;
          padding: 2rem;
          text-align: center;
          height: 100%;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
        }
        
        /* Stats */
        .stats-section {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          color: white;
          padding: 3rem 0;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        /* Footer */
        .footer {
          background: #212529;
          color: white;
          padding: 3rem 0 1.5rem;
        }
        
        .footer-link {
          color: #adb5bd;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .footer-link:hover {
          color: white;
        }
        
        /* Buttons */
        .btn-custom-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          border: none;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-custom-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
        }
        
        .btn-custom-outline {
          border: 2px solid #0d6efd;
          color: #0d6efd;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-custom-outline:hover {
          background: #0d6efd;
          color: white;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.25rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .portal-cards-container {
            padding: 3rem 0;
          }
          
          .portal-card {
            margin-bottom: 2rem;
          }
        }
        
        /* Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.6s ease;
        }
        
        .animate-delay-1 {
          animation-delay: 0.2s;
        }
        
        .animate-delay-2 {
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="home-portal">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-custom">
          <div className="container">
            {/* Logo */}
            <a className="navbar-brand fw-bold fs-3" href="/">
              <i className="bi bi-mortarboard-fill" style={{ color: '#0d6efd' }}></i>
              <span className="ms-2">EduPortal</span>
            </a>

            {/* Mobile Toggle */}
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#mainNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Navigation Items */}
            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav mx-auto">
                {navItems.map(item => (
                  <li className="nav-item" key={item.id}>
                    <a 
                      className={`nav-link-custom ${activeTab === item.id ? 'active' : ''}`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(item.id);
                      }}
                    >
                      <i className={`${item.icon} me-1`}></i>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Portal Access Buttons */}
              <div className="d-flex gap-2">
                <Link 
                  to="/AdminSignin" 
                  className="btn-custom-outline"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="bi bi-shield-lock me-1"></i>
                  Admin Portal
                </Link>
                <Link
                  to="/Signin" 
                  className="btn-custom-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="bi bi-person-video3 me-1"></i>
                  Student Portal
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 animate-fade-in">
                <h1 className="hero-title">
                  Modern Learning Management System
                </h1>
                <p className="hero-subtitle">
                  Streamline education management for administrators and enhance 
                  learning experiences for students with our comprehensive platform.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <a 
                    href="/student/dashboard" 
                    className="btn-custom-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    <i className="bi bi-play-circle me-2"></i>
                    Start Learning Now
                  </a>
                  <a 
                    href="#features" 
                    className="btn-custom-outline"
                    style={{ textDecoration: 'none' }}
                  >
                    <i className="bi bi-arrow-down-circle me-2"></i>
                    Explore Features
                  </a>
                </div>
              </div>
              <div className="col-lg-6 text-center animate-fade-in animate-delay-1">
                <img 
                  src="/BG2.png" 
                  alt="Learning Illustration" 
                  className="hero-illustration"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Portal Access Cards */}
        <section className="portal-cards-container">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold mb-3">Choose Your Portal</h2>
              <p className="text-muted fs-5">Access the system based on your role</p>
            </div>

            <div className="row justify-content-center">
              {/* Admin Portal Card */}
              <div className="col-lg-5 mb-4 animate-fade-in">
                <div className="portal-card admin-card">
                  <div className="card-body p-5">
                    <div className="portal-icon admin-icon">
                      <i className="bi bi-shield-lock"></i>
                    </div>
                    <h3 className="text-center mb-3">Administrator Portal</h3>
                    <p className="text-center text-muted mb-4">
                      Manage courses, users, content, and system configurations 
                      with powerful administrative tools.
                    </p>
                    
                    <div className="mb-4">
                      <h6 className="text-center mb-3">Key Features:</h6>
                      <div className="row">
                        <div className="col-6">
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Course Management
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              User Administration
                            </li>
                          </ul>
                        </div>
                        <div className="col-6">
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Analytics Dashboard
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              System Settings
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="AdminSignin" 
                      className="btn btn-primary w-100 py-3"
                      style={{ 
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                        border: 'none'
                      }}
                    >
                      <i className="bi bi-door-open me-2"></i>
                      Enter Admin Portal
                    </Link>
                  </div>
                </div>
              </div>

              {/* Student Portal Card */}
              <div className="col-lg-5 mb-4 animate-fade-in animate-delay-1">
                <div className="portal-card student-card">
                  <div className="card-body p-5">
                    <div className="portal-icon student-icon">
                      <i className="bi bi-person-video3"></i>
                    </div>
                    <h3 className="text-center mb-3">Student Portal</h3>
                    <p className="text-center text-muted mb-4">
                      Access courses, submit assignments, track progress, 
                      and engage with learning materials.
                    </p>
                    
                    <div className="mb-4">
                      <h6 className="text-center mb-3">Key Features:</h6>
                      <div className="row">
                        <div className="col-6">
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Course Enrollment
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Assignment Submission
                            </li>
                          </ul>
                        </div>
                        <div className="col-6">
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Grade Tracking
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              Learning Resources
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="Signin" 
                      className="btn btn-success w-100 py-3"
                      style={{ 
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #198754 0%, #157347 100%)',
                        border: 'none'
                      }}
                    >
                      <i className="bi bi-door-open me-2"></i>
                      Enter Student Portal
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold mb-3">Core Features</h2>
              <p className="text-muted fs-5">Everything you need for effective learning management</p>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-3 animate-fade-in">
                <div className="feature-card">
                  <div 
                    className="feature-icon"
                    style={{ background: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd' }}
                  >
                    <i className="bi bi-journal-bookmark"></i>
                  </div>
                  <h5 className="mb-3">Course Management</h5>
                  <p className="text-muted mb-0">
                    Create, organize, and manage courses with comprehensive tools
                  </p>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3 animate-fade-in animate-delay-1">
                <div className="feature-card">
                  <div 
                    className="feature-icon"
                    style={{ background: 'rgba(25, 135, 84, 0.1)', color: '#198754' }}
                  >
                    <i className="bi bi-clipboard-check"></i>
                  </div>
                  <h5 className="mb-3">Assignment System</h5>
                  <p className="text-muted mb-0">
                    Upload, submit, and grade assignments seamlessly
                  </p>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3 animate-fade-in animate-delay-2">
                <div className="feature-card">
                  <div 
                    className="feature-icon"
                    style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}
                  >
                    <i className="bi bi-bar-chart"></i>
                  </div>
                  <h5 className="mb-3">Analytics & Reports</h5>
                  <p className="text-muted mb-0">
                    Track performance with detailed analytics and reports
                  </p>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3 animate-fade-in animate-delay-1">
                <div className="feature-card">
                  <div 
                    className="feature-icon"
                    style={{ background: 'rgba(13, 202, 240, 0.1)', color: '#0dcaf0' }}
                  >
                    <i className="bi bi-chat-dots"></i>
                  </div>
                  <h5 className="mb-3">Communication Tools</h5>
                  <p className="text-muted mb-0">
                    Connect with instructors and peers through integrated messaging
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="row text-center">
              <div className="col-md-3 col-6 mb-4">
                <div className="stat-number">2,500+</div>
                <div>Active Students</div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="stat-number">100+</div>
                <div>Courses Available</div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="stat-number">50+</div>
                <div>Expert Instructors</div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="stat-number">99.9%</div>
                <div>System Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 mb-4">
                <h4 className="mb-3">
                  <i className="bi bi-mortarboard-fill me-2"></i>
                  EduPortal LMS
                </h4>
                <p className="text-light opacity-75">
                  A comprehensive learning management system designed 
                  to streamline education for institutions and students.
                </p>
              </div>
              
              <div className="col-lg-4 mb-4">
                <h5 className="mb-3">Quick Links</h5>
                <div className="d-flex flex-column">
                  <a href="#" className="footer-link mb-2">
                    <i className="bi bi-house me-1"></i>
                    Home
                  </a>
                  <a href="#features" className="footer-link mb-2">
                    <i className="bi bi-list-check me-1"></i>
                    Features
                  </a>
                  <a href="#" className="footer-link mb-2">
                    <i className="bi bi-book me-1"></i>
                    Courses
                  </a>
                  <a href="#" className="footer-link mb-2">
                    <i className="bi bi-telephone me-1"></i>
                    Contact
                  </a>
                </div>
              </div>
              
              <div className="col-lg-4 mb-4">
                <h5 className="mb-3">Contact Info</h5>
                <div className="d-flex flex-column">
                  <span className="text-light opacity-75 mb-2">
                    <i className="bi bi-envelope me-2"></i>
                    support@eduportal.com
                  </span>
                  <span className="text-light opacity-75 mb-2">
                    <i className="bi bi-telephone me-2"></i>
                    +1 (555) 123-4567
                  </span>
                  <span className="text-light opacity-75">
                    <i className="bi bi-geo-alt me-2"></i>
                    123 Education Street, City
                  </span>
                </div>
              </div>
            </div>
            
            <hr className="my-4 opacity-25" />
            
            <div className="text-center">
              <p className="text-light opacity-75 mb-0">
                © 2024 EduPortal Learning Management System. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePortal;