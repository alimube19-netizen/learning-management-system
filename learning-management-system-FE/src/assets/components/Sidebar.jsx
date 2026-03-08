import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  const signout = () => {
    logout(); 
    navigate("/");
  };

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
        // {
        //   path: "/StudentDashboard/EditInformation",
        //   label: "Edit Information",
        //   icon: "fas fa-edit"
        // },
        {
          path: "/StudentDashboard/PasswordChange",
          label: "Change Password",
          icon: "fas fa-lock"
        }
      ]
    }
  ];

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <NavLink to="/StudentDashboard/Dashboard" className="sidebar-logo">
          <div className="logo-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="logo-text">
            <span className="logo-title">Univeristy LMS</span>
            <span className="logo-subtitle">Student Learning Portal</span>
          </div>
        </NavLink>
      </div>

      <div className="sidebar-divider"></div>

      {/* Welcome Message */}
      <div className="welcome-message">
        <div className="welcome-content">
          <i className="fas fa-user-circle welcome-icon"></i>
          <div className="welcome-text">
            <div className="welcome-greeting">Welcome back,</div>
            <div className="student-name">{user.fullname || "Student"}</div>
          </div>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      {/* Navigation Menu */}
      <div className="sidebar-menu">
        {menuSections.map((section) => {
          // Single items (Dashboard)
          if (section.isSingle) {
            return (
              <div key={section.id} className="sidebar-item">
                <NavLink
                  to={section.path}
                  className={({ isActive }) => 
                    `sidebar-single-item ${isActive ? 'active' : ''}`
                  }
                >
                  <i className={`${section.icon} sidebar-icon`}></i>
                  <span>{section.title}</span>
                </NavLink>
              </div>
            );
          }

          // Dropdown sections
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id} className="sidebar-section">
              <div
                className={`section-header ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="section-title">
                  <i className={`${section.icon} sidebar-icon`}></i>
                  <span>{section.title}</span>
                </div>
                <i className={`fas fa-chevron-down section-arrow ${isExpanded ? 'expanded' : ''}`}></i>
              </div>
              
              <div className={`section-content ${isExpanded ? 'expanded' : ''}`}>
                {section.items.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) => 
                      `section-item ${isActive ? 'active' : ''}`
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className={`${item.icon} item-icon`}></i>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-divider"></div>

      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="profile-img" />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          <div className="profile-details">
            <div className="profile-name">{user.fullname || "Student"}</div>
            <div className="profile-id">{user.registration_no || "N/A"}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={signout} title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: #f1f5f9;
          padding: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.25);
          border-right: 1px solid #334155;
          z-index: 1000;
        }

        .sidebar-header {
          margin-bottom: 20px;
        }

        .sidebar-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: #ffffff;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .logo-icon i {
          color: white;
          font-size: 24px;
        }

        .logo-text {
          text-align: center;
        }

        .logo-title {
          font-size: 16px;
          font-weight: bold;
          display: block;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .logo-subtitle {
          font-size: 11px;
          color: #94a3b8;
          display: block;
          margin-top: 2px;
          letter-spacing: 0.3px;
        }

        .sidebar-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #475569, transparent);
          margin: 15px 0;
        }

        /* Welcome Message */
        .welcome-message {
          background: rgba(30, 41, 59, 0.6);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          backdrop-filter: blur(10px);
        }

        .welcome-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .welcome-icon {
          color: #3b82f6;
          font-size: 24px;
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
        }

        .welcome-text {
          flex: 1;
        }

        .welcome-greeting {
          font-size: 12px;
          color: #94a3b8;
        }

        .student-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }

        .sidebar-menu {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
        }

        .sidebar-menu::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-menu::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .sidebar-menu::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 10px;
        }

        .sidebar-menu::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }

        /* Single Item Styles */
        .sidebar-single-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin: 6px 0;
          border-radius: 10px;
          text-decoration: none;
          color: #cbd5e1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid transparent;
        }

        .sidebar-single-item:hover {
          background: rgba(59, 130, 246, 0.15);
          color: #ffffff;
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateX(4px);
        }

        .sidebar-single-item.active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
          border: none;
        }

        .sidebar-single-item.active .sidebar-icon {
          color: white;
        }

        /* Section Styles */
        .sidebar-section {
          margin: 6px 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid transparent;
        }

        .section-header:hover {
          background: rgba(59, 130, 246, 0.15);
          color: #ffffff;
          border-color: rgba(59, 130, 246, 0.2);
        }

        .section-header.expanded {
          background: rgba(59, 130, 246, 0.2);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          border-color: rgba(59, 130, 246, 0.3);
          color: #ffffff;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          color: #cbd5e1;
        }

        .section-header:hover .section-title,
        .section-header.expanded .section-title {
          color: #ffffff;
        }

        .section-arrow {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 12px;
          color: #94a3b8;
        }

        .section-arrow.expanded {
          transform: rotate(180deg);
          color: #3b82f6;
        }

        .section-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(15, 23, 42, 0.7);
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-top: none;
        }

        .section-content.expanded {
          max-height: 500px;
        }

        .section-item {
          display: flex;
          align-items: center;
          padding: 10px 16px 10px 40px;
          text-decoration: none;
          color: #94a3b8;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 14px;
          border-left: 3px solid transparent;
        }

        .section-item:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #ffffff;
          padding-left: 44px;
        }

        .section-item.active {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          font-weight: 500;
          border-left: 3px solid #3b82f6;
        }

        .section-item .item-icon {
          margin-right: 12px;
          font-size: 14px;
          width: 20px;
          text-align: center;
        }

        /* Profile Styles */
        .sidebar-profile {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: rgba(30, 41, 59, 0.6);
          border-radius: 10px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          backdrop-filter: blur(10px);
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .profile-avatar i {
          color: white;
          font-size: 18px;
        }

        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .profile-details {
          flex: 1;
        }

        .profile-name {
          font-weight: 600;
          font-size: 14px;
          color: #ffffff;
        }

        .profile-id {
          font-size: 11px;
          color: #94a3b8;
        }

        .logout-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        /* Icon Styles */
        .sidebar-icon {
          margin-right: 12px;
          font-size: 16px;
          width: 24px;
          text-align: center;
          transition: color 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .sidebar {
            width: 240px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1000;
          }
          
          .sidebar.mobile-open {
            transform: translateX(0);
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 220px;
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};