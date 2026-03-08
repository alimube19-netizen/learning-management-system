import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export const MobileAdminSidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Auto-expand section based on current route
  useEffect(() => {
    const activeSection = getMenuSections().find(section => 
      section.items && section.items.some(item => location.pathname.includes(item.path))
    );
    
    if (activeSection && activeSection.id !== "dashboard") {
      setExpandedSection(activeSection.id);
    }
  }, [location.pathname]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Check if the click is not on the hamburger button
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

  const toggleSection = (sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define menu sections (same as original)
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
          }
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
    <>
      {/* Mobile Header with Hamburger */}
      <div className="mobile-header">
        <button 
          className="mobile-hamburger"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <div className="mobile-title">
          <NavLink to="/AdminPortal/dashboard" className="mobile-logo">
            <i className="fas fa-graduation-cap"></i>
            <span>Admin Portal</span>
          </NavLink>
        </div>
        <div className="mobile-profile-icon">
          <div className="mobile-avatar">
            {user?.name?.charAt(0) || 'A'}
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
              <div className="logo-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="logo-text">
                <span className="logo-title">University LMS</span>
                <span className="logo-subtitle">Admin Portal</span>
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

          {/* Navigation Menu */}
          <div className="mobile-sidebar-menu">
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
                      `mobile-sidebar-single-item ${isActive ? 'active' : ''}`
                    }
                    end
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <i className={`${section.icon} mobile-sidebar-icon`}></i>
                    <span>{section.title}</span>
                    {isActive && (
                      <span className="mobile-active-dot"></span>
                    )}
                  </NavLink>
                );
              }

              // For multi-item sections
              return (
                <div key={section.id} className="mobile-sidebar-section">
                  <div
                    className={`mobile-section-header ${isActive ? 'has-active' : ''} ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="mobile-section-title">
                      <i className={`${section.icon} mobile-sidebar-icon`}></i>
                      <span>{section.title}</span>
                      {isActive && <span className="mobile-active-dot"></span>}
                    </div>
                    <i className={`fas fa-chevron-right mobile-section-arrow ${isExpanded ? 'expanded' : ''}`}></i>
                  </div>
                  
                  {/* Accordion Content */}
                  <div className={`mobile-section-content ${isExpanded ? 'expanded' : ''}`}>
                    {section.items.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => 
                          `mobile-section-item ${isActive ? 'active' : ''}`
                        }
                        end
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <div className="mobile-item-left">
                          <i className={`${item.icon} mobile-item-icon`}></i>
                          <span>{item.label}</span>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mobile-divider"></div>

          {/* Admin Profile */}
          <div className="mobile-sidebar-profile">
            <div className="mobile-profile-info">
              <div className="mobile-profile-avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="mobile-profile-details">
                <div className="mobile-profile-name">
                  {user?.name || "System Administrator"}
                </div>
                <div className="mobile-profile-role">
                  University Admin
                </div>
              </div>
            </div>
            <NavLink 
              to="/AdminSignin" 
              className="mobile-logout-btn" 
              title="Logout"
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-sign-out-alt"></i>
            </NavLink>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx="true">{`
        /* Mobile Header */
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 1001;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .mobile-hamburger {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .mobile-hamburger:hover {
          background: rgba(255, 255, 255, 0.1);
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
          color: white;
          text-decoration: none;
          font-size: 18px;
          font-weight: 600;
        }

        .mobile-logo i {
          font-size: 20px;
          color: #4dabf7;
        }

        .mobile-profile-icon {
          width: 40px;
        }

        .mobile-avatar {
          width: 36px;
          height: 36px;
          background: #4dabf7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
          font-size: 14px;
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
          max-width: 320px;
          background: linear-gradient(180deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          display: flex;
          flex-direction: column;
          z-index: 1003;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow: hidden;
        }

        .mobile-sidebar-overlay.active .mobile-sidebar {
          transform: translateX(0);
        }

        .mobile-sidebar-header {
          padding: 20px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .mobile-sidebar-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: white;
          gap: 12px;
        }

        .logo-icon {
          font-size: 24px;
          color: #4dabf7;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        }

        .logo-subtitle {
          font-size: 11px;
          opacity: 0.8;
          line-height: 1.2;
        }

        .mobile-close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
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
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 16px;
          flex-shrink: 0;
        }

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
          padding: 14px 16px;
          margin: 0 4px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s;
          position: relative;
          border-radius: 8px;
          font-size: 14px;
        }

        .mobile-sidebar-single-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .mobile-sidebar-single-item.active {
          background: rgba(77, 171, 247, 0.2);
          color: white;
          border-left: 3px solid #4dabf7;
        }

        .mobile-sidebar-icon {
          width: 24px;
          margin-right: 12px;
          font-size: 16px;
          text-align: center;
        }

        .mobile-sidebar-section {
          margin: 0 4px;
        }

        .mobile-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s;
          border-radius: 8px;
          font-size: 14px;
        }

        .mobile-section-header:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .mobile-section-header.has-active {
          background: rgba(77, 171, 247, 0.1);
          color: white;
        }

        .mobile-section-title {
          display: flex;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .mobile-active-dot {
          position: absolute;
          right: -3px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background: #4dabf7;
          border-radius: 50%;
        }

        .mobile-section-arrow {
          transition: transform 0.3s;
          font-size: 12px;
          margin-left: 8px;
        }

        .mobile-section-arrow.expanded {
          transform: rotate(90deg);
        }

        .mobile-section-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          margin-left: 8px;
        }

        .mobile-section-content.expanded {
          max-height: 500px;
        }

        .mobile-section-item {
          display: flex;
          align-items: center;
          padding: 12px 16px 12px 52px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s;
          margin: 2px 0;
          border-radius: 6px;
          font-size: 13px;
        }

        .mobile-section-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .mobile-section-item.active {
          background: rgba(77, 171, 247, 0.15);
          color: white;
          border-left: 3px solid #4dabf7;
        }

        .mobile-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-item-icon {
          font-size: 13px;
          width: 20px;
          text-align: center;
        }

        .mobile-sidebar-profile {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
          margin-top: auto;
        }

        .mobile-profile-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .mobile-profile-avatar {
          width: 36px;
          height: 36px;
          background: #4dabf7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
          font-size: 14px;
        }

        .mobile-profile-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .mobile-profile-name {
          font-weight: 600;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-profile-role {
          font-size: 11px;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-logout-btn {
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

        .mobile-logout-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Scrollbar styling for mobile */
        .mobile-sidebar-menu::-webkit-scrollbar {
          width: 3px;
        }

        .mobile-sidebar-menu::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 1.5px;
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .mobile-sidebar-single-item,
          .mobile-section-header,
          .mobile-section-item {
            min-height: 44px; /* Apple's recommended minimum touch target size */
          }
          
          .mobile-hamburger,
          .mobile-close-btn {
            min-width: 44px;
            min-height: 44px;
          }
        }

        /* Tablet adjustments */
        @media (min-width: 768px) {
          .mobile-sidebar {
            width: 70%;
            max-width: 280px;
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