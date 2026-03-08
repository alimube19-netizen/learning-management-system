import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export const MobileSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const signout = () => {
    logout(); 
    navigate("/");
    setIsSidebarOpen(false);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!event.target.closest('.mobile-hamburger')) {
          setIsSidebarOpen(false);
        }
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Auto-expand current section based on route
  useEffect(() => {
    const currentPath = location.pathname;
    const sections = [
      {
        id: "mycourses",
        paths: ["/StudentDashboard/CurrentCourses", "/StudentDashboard/CourseCatalog", "/StudentDashboard/MyGrades"]
      },
      {
        id: "materials",
        paths: ["/StudentDashboard/LectureVideos", "/StudentDashboard/NotesSlides", "/StudentDashboard/DownloadMaterials"]
      },
      {
        id: "assignments",
        paths: ["/StudentDashboard/PendingAssignments", "/StudentDashboard/SubmitAssignment", "/StudentDashboard/GradedAssignments"]
      },
      {
        id: "financial",
        paths: ["/StudentDashboard/PayDues", "/StudentDashboard/FeeStructure", "/StudentDashboard/GenerateChallan", "/StudentDashboard/ScholarshipStatus"]
      },
      {
        id: "profile",
        paths: ["/StudentDashboard/ViewProfile", "/StudentDashboard/EditInformation", "/StudentDashboard/ChangePassword"]
      }
    ];

    const activeSection = sections.find(section => 
      section.paths.some(path => currentPath.includes(path))
    );
    
    if (activeSection) {
      setExpandedSection(activeSection.id);
    }
  }, [location.pathname]);

  // LEARNING MODE ONLY - After student is accepted
  const menuSections = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "fas fa-tachometer-alt",
      isSingle: true,
      path: "/StudentDashboard/Dashboard",
    },
    {
      id: "mycourses",
      title: "My Courses",
      icon: "fas fa-book",
      items: [
        {
          path: "/StudentDashboard/CurrentCourses",
          label: "Current Courses",
          icon: "fas fa-play-circle"
        },
        {
          path: "/StudentDashboard/CourseCatalog",
          label: "Course Catalog",
          icon: "fas fa-plus-circle"
        },
        {
          path: "/StudentDashboard/MyGrades",
          label: "My Grades",
          icon: "fas fa-star"
        }
      ]
    },
    {
      id: "materials",
      title: "Learning Materials",
      icon: "fas fa-book-open",
      items: [
        {
          path: "/StudentDashboard/LectureVideos",
          label: "Lecture Videos",
          icon: "fas fa-video"
        },
        {
          path: "/StudentDashboard/NotesSlides",
          label: "Notes & Slides",
          icon: "fas fa-sticky-note"
        },
        {
          path: "/StudentDashboard/DownloadMaterials",
          label: "Download Materials",
          icon: "fas fa-download"
        }
      ]
    },
    {
      id: "assignments",
      title: "Assignments",
      icon: "fas fa-tasks",
      items: [
        {
          path: "/StudentDashboard/PendingAssignments",
          label: "Pending Assignments",
          icon: "fas fa-clock"
        },
        {
          path: "/StudentDashboard/SubmitAssignment",
          label: "Submit Assignment",
          icon: "fas fa-upload"
        },
        {
          path: "/StudentDashboard/GradedAssignments",
          label: "Graded Assignments",
          icon: "fas fa-check-circle"
        }
      ]
    },
    {
      id: "financial",
      title: "Financial",
      icon: "fas fa-credit-card",
      items: [
        {
          path: "/StudentDashboard/PayDues",
          label: "Pay Dues",
          icon: "fas fa-money-bill-wave"
        },
        {
          path: "/StudentDashboard/FeeStructure",
          label: "Fee Structure",
          icon: "fas fa-receipt"
        },
        {
          path: "/StudentDashboard/GenerateChallan",
          label: "Generate Challan",
          icon: "fas fa-file-invoice-dollar"
        },
        {
          path: "/StudentDashboard/ScholarshipStatus",
          label: "Scholarship Status",
          icon: "fas fa-award"
        }
      ]
    },
    {
      id: "profile",
      title: "My Profile",
      icon: "fas fa-user",
      items: [
        {
          path: "/StudentDashboard/ViewProfile",
          label: "View Profile",
          icon: "fas fa-user"
        },
        {
          path: "/StudentDashboard/EditInformation",
          label: "Edit Information",
          icon: "fas fa-edit"
        },
        {
          path: "/StudentDashboard/ChangePassword",
          label: "Change Password",
          icon: "fas fa-lock"
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="mobile-hamburger"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        <div className="mobile-title">
          <NavLink to="/StudentDashboard/Dashboard" className="mobile-logo">
            <i className="fas fa-user-graduate"></i>
            <span>Student Portal</span>
          </NavLink>
        </div>
        
        <div className="mobile-user-info">
          <div className="mobile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}>
        <div 
          className="mobile-sidebar"
          ref={sidebarRef}
        >
          {/* Header */}
          <div className="mobile-sidebar-header">
            <div className="mobile-sidebar-logo">
              <div className="mobile-logo-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="mobile-logo-text">
                <span className="mobile-logo-title">Virtual University</span>
                <span className="mobile-logo-subtitle">Student Portal</span>
              </div>
            </div>
            <button 
              className="mobile-close-btn"
              onClick={toggleSidebar}
              aria-label="Close menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="mobile-divider"></div>

          {/* Welcome Message */}
          <div className="mobile-welcome-message">
            <div className="mobile-welcome-content">
              <div className="mobile-welcome-avatar">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
              <div className="mobile-welcome-text">
                <div className="mobile-welcome-greeting">Welcome back,</div>
                <div className="mobile-student-name">{user.name || "Student"}</div>
                <div className="mobile-student-id">ID: {user.studentId || "N/A"}</div>
              </div>
            </div>
          </div>

          <div className="mobile-divider"></div>

          {/* Navigation Menu */}
          <div className="mobile-sidebar-menu">
            {menuSections.map((section) => {
              // Single items (Dashboard)
              if (section.isSingle) {
                return (
                  <div key={section.id} className="mobile-sidebar-item">
                    <NavLink
                      to={section.path}
                      className={({ isActive }) => 
                        `mobile-sidebar-single-item ${isActive ? 'active' : ''}`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <i className={`${section.icon} mobile-sidebar-icon`}></i>
                      <span>{section.title}</span>
                    </NavLink>
                  </div>
                );
              }

              // Dropdown sections
              const isExpanded = expandedSection === section.id;
              return (
                <div key={section.id} className="mobile-sidebar-section">
                  <div
                    className={`mobile-section-header ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="mobile-section-title">
                      <i className={`${section.icon} mobile-sidebar-icon`}></i>
                      <span>{section.title}</span>
                    </div>
                    <i className={`fas fa-chevron-down mobile-section-arrow ${isExpanded ? 'expanded' : ''}`}></i>
                  </div>
                  
                  <div className={`mobile-section-content ${isExpanded ? 'expanded' : ''}`}>
                    {section.items.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => 
                          `mobile-section-item ${isActive ? 'active' : ''}`
                        }
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <i className={`${item.icon} mobile-item-icon`}></i>
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mobile-divider"></div>

          {/* Logout Button */}
          <div className="mobile-logout-section">
            <button className="mobile-logout-btn" onClick={signout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        /* Mobile Header */
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 1001;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid #e0e0e0;
        }

        .mobile-hamburger {
          background: none;
          border: none;
          color: #2c3e50;
          font-size: 20px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .mobile-hamburger:hover {
          background: #f8f9fa;
        }

        .mobile-title {
          flex: 1;
          text-align: center;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #2c3e50;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
        }

        .mobile-logo i {
          color: #3498db;
          font-size: 18px;
        }

        .mobile-user-info {
          width: 44px;
        }

        .mobile-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3498db, #2c3e50);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .mobile-avatar i {
          color: white;
          font-size: 16px;
        }

        .mobile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Mobile Sidebar Overlay */
        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1002;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Sidebar */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 85%;
          max-width: 300px;
          background: white;
          display: flex;
          flex-direction: column;
          z-index: 1003;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow: hidden;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
        }

        .mobile-sidebar-overlay.active .mobile-sidebar {
          transform: translateX(0);
        }

        .mobile-sidebar-header {
          padding: 20px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .mobile-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3498db, #2c3e50);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-logo-icon i {
          color: white;
          font-size: 20px;
        }

        .mobile-logo-text {
          display: flex;
          flex-direction: column;
        }

        .mobile-logo-title {
          font-size: 14px;
          font-weight: bold;
          color: #2c3e50;
          line-height: 1.2;
        }

        .mobile-logo-subtitle {
          font-size: 11px;
          color: #7f8c8d;
          line-height: 1.2;
          margin-top: 2px;
        }

        .mobile-close-btn {
          background: none;
          border: none;
          color: #2c3e50;
          font-size: 18px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .mobile-close-btn:hover {
          background: #e9ecef;
        }

        .mobile-divider {
          height: 1px;
          background: #e0e0e0;
          margin: 0;
        }

        /* Welcome Message */
        .mobile-welcome-message {
          padding: 20px 16px;
          background: #f8f9fa;
        }

        .mobile-welcome-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .mobile-welcome-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #3498db, #2c3e50);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .mobile-welcome-avatar i {
          color: white;
          font-size: 24px;
        }

        .mobile-welcome-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mobile-welcome-text {
          flex: 1;
        }

        .mobile-welcome-greeting {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 2px;
        }

        .mobile-student-name {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 2px;
        }

        .mobile-student-id {
          font-size: 11px;
          color: #7f8c8d;
        }

        /* Navigation Menu */
        .mobile-sidebar-menu {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-sidebar-single-item {
          display: flex;
          align-items: center;
          padding: 16px;
          margin: 0 8px;
          border-radius: 8px;
          text-decoration: none;
          color: #34495e;
          transition: all 0.3s ease;
          background: #f8f9fa;
          font-size: 15px;
          min-height: 48px;
        }

        .mobile-sidebar-single-item:hover {
          background: #e9ecef;
          color: #2c3e50;
        }

        .mobile-sidebar-single-item.active {
          background: #3498db;
          color: white;
          font-weight: 600;
        }

        .mobile-sidebar-icon {
          width: 24px;
          margin-right: 12px;
          font-size: 16px;
          text-align: center;
        }

        .mobile-sidebar-section {
          margin: 0 8px;
        }

        .mobile-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8f9fa;
          font-size: 15px;
          min-height: 48px;
        }

        .mobile-section-header:hover {
          background: #e9ecef;
        }

        .mobile-section-header.expanded {
          background: #e9ecef;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .mobile-section-title {
          display: flex;
          align-items: center;
          color: #34495e;
        }

        .mobile-section-arrow {
          transition: transform 0.3s ease;
          font-size: 12px;
          color: #7f8c8d;
        }

        .mobile-section-arrow.expanded {
          transform: rotate(180deg);
        }

        .mobile-section-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          background: #f8f9fa;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        .mobile-section-content.expanded {
          max-height: 500px;
        }

        .mobile-section-item {
          display: flex;
          align-items: center;
          padding: 14px 16px 14px 52px;
          text-decoration: none;
          color: #5d6d7e;
          transition: all 0.3s ease;
          font-size: 14px;
          min-height: 48px;
        }

        .mobile-section-item:hover {
          background: #e9ecef;
          color: #2c3e50;
        }

        .mobile-section-item.active {
          background: #e3f2fd;
          color: #3498db;
          font-weight: 500;
          border-left: 3px solid #3498db;
        }

        .mobile-item-icon {
          margin-right: 12px;
          font-size: 14px;
          width: 20px;
          text-align: center;
        }

        /* Logout Section */
        .mobile-logout-section {
          padding: 16px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        .mobile-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          background: #ffeaea;
          border: none;
          border-radius: 8px;
          color: #e74c3c;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-logout-btn:hover {
          background: #ffd6d6;
        }

        /* Scrollbar */
        .mobile-sidebar-menu::-webkit-scrollbar {
          width: 4px;
        }

        .mobile-sidebar-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .mobile-sidebar-menu::-webkit-scrollbar-thumb {
          background: #bdc3c7;
          border-radius: 2px;
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .mobile-sidebar-single-item,
          .mobile-section-header,
          .mobile-section-item,
          .mobile-hamburger,
          .mobile-close-btn {
            min-height: 44px;
          }
          
          .mobile-sidebar-single-item,
          .mobile-section-header {
            padding: 14px 16px;
          }
          
          .mobile-section-item {
            padding: 14px 16px 14px 52px;
          }
        }

        /* Tablet adjustments */
        @media (min-width: 768px) {
          .mobile-sidebar {
            width: 320px;
          }
        }

        /* Hide on desktop - use original sidebar instead */
        @media (min-width: 1024px) {
          .mobile-header,
          .mobile-sidebar-overlay {
            display: none;
          }
        }
      `}</style>
    </>
  );
};