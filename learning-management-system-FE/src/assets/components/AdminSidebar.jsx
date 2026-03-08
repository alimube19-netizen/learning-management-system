import React, { useContext, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export const AdminSidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState("dashboard");

  // Auto-expand section based on current route
  useEffect(() => {
    const activeSection = getMenuSections().find(section => 
      section.items && section.items.some(item => location.pathname.includes(item.path))
    );
    
    if (activeSection && activeSection.id !== "dashboard") {
      setExpandedSection(activeSection.id);
    }
  }, [location.pathname]);

  const toggleSection = (sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  // Define menu sections according to project proposal
  const getMenuSections = () => {
    return [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: "fas fa-tachometer-alt",
        path: "/AdminPortal/dashboard",
        isSingle: true
      },
      {
        id: "students",
        title: "Student Management",
        icon: "fas fa-user-graduate",
        items: [
          {
            path: "/AdminPortal/allstudents",
            label: "All Students",
            icon: "fas fa-users"
          },
          {
            path: "/AdminPortal/addstudent",
            label: "Add New Student",
            icon: "fas fa-user-plus"
          },
          // {
          //   path: "/AdminPortal/courseEnrollment",
          //   label: "Course Enrollment",
          //   icon: "fas fa-user-check"
          // }
          // {
          //   path: "/AdminPortal/studentprogress",
          //   label: "Student Progress",
          //   icon: "fas fa-chart-line"
          // }
        ]
      },
      {
        id: "courses",
        title: "Course Management",
        icon: "fas fa-book",
        items: [
          {
            path: "/AdminPortal/courses/all",
            label: "All Courses",
            icon: "fas fa-list"
          },
          // {
          //   path: "/AdminPortal/courses/create",
          //   label: "Create Course",
          //   icon: "fas fa-plus-circle"
          // },
          {
            path: "/AdminPortal/courseEnrollment",
            label: "Course Enrollment",
            icon: "fas fa-clipboard-check"
          }
        ]
      },
      {
        id: "assignments",
        title: "Assignments",
        icon: "fas fa-tasks",
        items: [
          {
            path: "/AdminPortal/assignments/create",
            label: "Create Assignment",
            icon: "fas fa-plus"
          },
          {
            path: "/AdminPortal/assignments/grade",
            label: "Grade Submissions",
            icon: "fas fa-check-square"
          },
          {
            path: "/AdminPortal/assignments/deadlines",
            label: "Deadlines",
            icon: "fas fa-calendar-times"
          }
        ]
      },
      {
        id: "materials",
        title: "Course Materials",
        icon: "fas fa-file-upload",
        items: [
          {
            path: "/AdminPortal/materials/uploadlectures",
            label: "Upload Lectures",
            icon: "fas fa-video"
          },
          {
            path: "/AdminPortal/materials/notes",
            label: "Upload Notes/Docs",
            icon: "fas fa-file-alt"
          },
          {
            path: "/AdminPortal/materials/resources",
            label: "Manage Resources",
            icon: "fas fa-folder-open"
          }
        ]
      },
      {
        id: "fees",
        title: "Fee Management",
        icon: "fas fa-money-check-alt",
        items: [
          {
            path: "/AdminPortal/fees/challan",
            label: "Generate Challan",
            icon: "fas fa-file-invoice-dollar"
          },
          {
            path: "/AdminPortal/fees/payments",
            label: "View Payments",
            icon: "fas fa-receipt"
          },
          {
            path: "/AdminPortal/fees/scholarships",
            label: "Scholarships",
            icon: "fas fa-award"
          }
        ]
      },
      {
        id: "system",
        title: "System",
        icon: "fas fa-cog",
        items: [
          {
            path: "/AdminPortal/system/users",
            label: "User Management",
            icon: "fas fa-user-cog"
          },
          {
            path: "/AdminPortal/system/logs",
            label: "System Logs",
            icon: "fas fa-clipboard-list"
          },
          {
            path: "/AdminPortal/system/settings",
            label: "Settings",
            icon: "fas fa-sliders-h"
          }
        ]
      }
    ];
  };

  const menuSections = getMenuSections();

  return (
    <div className="admin-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <NavLink to="/AdminPortal/dashboard" className="sidebar-logo">
          <div className="logo-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="logo-text">
            <span className="logo-title">University LMS</span>
            <span className="logo-subtitle">Admin Portal</span>
          </div>
        </NavLink>
      </div>

      <div className="sidebar-divider"></div>

      {/* Navigation Menu */}
      <div className="sidebar-menu">
        {menuSections.map((section) => {
          const isExpanded = expandedSection === section.id;
          const isActive = location.pathname === section.path || 
            location.pathname.startsWith(section.path) ||
            (section.items && section.items.some(item => location.pathname === item.path));
          
          // For single-item sections
          if (section.isSingle) {
            return (
              <NavLink
                key={section.id}
                to={section.path}
                className={({ isActive }) => 
                  `sidebar-single-item ${isActive ? 'active' : ''}`
                }
                end
              >
                <i className={`${section.icon} sidebar-icon`}></i>
                <span>{section.title}</span>
                {isActive && (
                  <span className="active-dot"></span>
                )}
              </NavLink>
            );
          }

          // For multi-item sections
          return (
            <div key={section.id} className="sidebar-section">
              <div
                className={`section-header ${isActive ? 'has-active' : ''} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="section-title">
                  <i className={`${section.icon} sidebar-icon`}></i>
                  <span>{section.title}</span>
                  {isActive && <span className="active-dot"></span>}
                </div>
                <i className={`fas fa-chevron-right section-arrow ${isExpanded ? 'expanded' : ''}`}></i>
              </div>
              
              {/* Accordion Content */}
              <div className={`section-content ${isExpanded ? 'expanded' : ''}`}>
                {section.items.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) => 
                      `section-item ${isActive ? 'active' : ''}`
                    }
                    end
                  >
                    <div className="item-left">
                      <i className={`${item.icon} item-icon`}></i>
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-divider"></div>

      {/* Admin Profile */}
      <div className="sidebar-profile">
        <div className="profile-info">
          <div className="profile-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="profile-details">
            <div className="profile-name">
              {user?.name || "System Administrator"}
            </div>
            <div className="profile-role">
              University Admin
            </div>
          </div>
        </div>
        <NavLink to="/AdminSignin" className="logout-btn" title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </NavLink>
      </div>

      {/* CSS Styles */}
      <style jsx="true">{`
        .admin-sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          background: linear-gradient(180deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .sidebar-header {
          padding: 24px 20px;
          flex-shrink: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: white;
          gap: 12px;
        }

        .logo-icon {
          font-size: 28px;
          color: #4dabf7;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.2;
        }

        .logo-subtitle {
          font-size: 12px;
          opacity: 0.8;
          line-height: 1.2;
        }

        .sidebar-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 20px;
          flex-shrink: 0;
        }

        .sidebar-menu {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-menu::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-menu::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .sidebar-single-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          margin: 0 4px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s;
          position: relative;
          border-radius: 8px;
        }

        .sidebar-single-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .sidebar-single-item.active {
          background: rgba(77, 171, 247, 0.2);
          color: white;
          border-left: 3px solid #4dabf7;
        }

        .sidebar-icon {
          width: 24px;
          margin-right: 12px;
          font-size: 16px;
          text-align: center;
        }

        .sidebar-section {
          margin: 0 4px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s;
          border-radius: 8px;
        }

        .section-header:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .section-header.has-active {
          background: rgba(77, 171, 247, 0.1);
          color: white;
        }

        .section-title {
          display: flex;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .active-dot {
          position: absolute;
          right: -3px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background: #4dabf7;
          border-radius: 50%;
        }

        .section-arrow {
          transition: transform 0.3s;
          font-size: 12px;
          margin-left: 8px;
        }

        .section-arrow.expanded {
          transform: rotate(90deg);
        }

        .section-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          margin-left: 8px;
        }

        .section-content.expanded {
          max-height: 300px;
        }

        .section-item {
          display: flex;
          align-items: center;
          padding: 10px 20px 10px 52px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s;
          margin: 2px 0;
          border-radius: 6px;
        }

        .section-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .section-item.active {
          background: rgba(77, 171, 247, 0.15);
          color: white;
          border-left: 3px solid #4dabf7;
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .item-icon {
          font-size: 14px;
          width: 20px;
          text-align: center;
        }

        .sidebar-profile {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
          margin-top: auto;
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          background: #4dabf7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .profile-name {
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-role {
          font-size: 12px;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          color: rgba(255, 255, 255, 0.7);
          font-size: 18px;
          transition: color 0.3s;
          text-decoration: none;
          padding: 8px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Responsive adjustments */
        @media (max-height: 700px) {
          .sidebar-menu {
            padding: 10px 0;
          }
          
          .sidebar-single-item,
          .section-header {
            padding: 10px 16px;
          }
          
          .section-item {
            padding: 8px 16px 8px 48px;
          }
        }
      `}</style>
    </div>
  );
};