import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from './Sidebar';
import { Routes, Route } from "react-router-dom";
import { Dashboard } from './Dashboard';
import { Admission_Form } from './Admission_Form';
import Application_Status from './Application_Status';
import Documents from './Documents';
import FeeStructure from './FeeStructure';
import DocumentUpload from './DocumentUpload';
import ProfileSettings from './ProfileSettings';
import PasswordChange from './PasswordChange';
import { MobileSidebar } from './MobileSidebar';
import ViewProfile from './ViewProfile';
import { CurrentCourses } from './CurrentCourses';
import { CourseCatalog } from './CourseCatalog';
import { MyGrades } from './MyGrades';

export const StudentDashboard = () => {
  const { user, token, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) { 
        logout(); 
        navigate("/"); 
        return; 
      }
      try {
        const res = await axios.get("http://localhost:5000/api/StudentDashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        logout();
        navigate("/");
      } 
    };
    
    fetchUser();
  }, [token, setUser, navigate, logout]);

  if (!user) return <Navigate to="/" />;

  const handleLogout = () => { 
    logout(); 
    navigate("/"); 
  };

  return (
    <div className="student-dashboard-wrapper">
      {/* Desktop Sidebar - Only show on large screens */}
      {!isMobile && <Sidebar />}
      
      {/* Mobile Sidebar - Only show on small screens */}
      {isMobile && <MobileSidebar />}
      
      {/* Main Content Area */}
      <div className={`student-main-content ${isMobile ? 'mobile' : 'desktop'}`}>
        {/* Add mobile header spacer */}
        {isMobile && <div className="mobile-header-spacer"></div>}

        {/* Page Content */}
        <div className="dashboard-content">
          <Routes>
            <Route path="Dashboard" element={<Dashboard user={user} />} />
            <Route path='Application_Status' element={<Application_Status/>}/>
            <Route path='CurrentCourses' element={<CurrentCourses/>}/>
            <Route path='CourseCatalog' element={<CourseCatalog/>}/>
            <Route path='MyGrades' element={<MyGrades/>}/>
            <Route path='DocumentUpload' element={<DocumentUpload/>}/>
            <Route path='Documents' element={<Documents/>}/>
            <Route path='FeeStructure' element={<FeeStructure/>}/>
            <Route path='ProfileSettings' element={<ProfileSettings/>}/>
            <Route path='ViewProfile' element={<ViewProfile/>}/>
            <Route path='PasswordChange' element={<PasswordChange/>}/>
            {/* Redirect to Dashboard if no route matches */}
            <Route path="/" element={<Navigate to="Dashboard" replace />} />
            <Route path="*" element={<Navigate to="Dashboard" replace />} />
          </Routes>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx="true">{`
        .student-dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        /* Main Content Area */
        .student-main-content.desktop {
          margin-left: 260px;
          flex: 1;
          min-height: 100vh;
          width: calc(100% - 260px);
          background-color: #f5f7fb;
          transition: all 0.3s ease;
        }

        .student-main-content.mobile {
          flex: 1;
          min-height: 100vh;
          width: 100%;
          background-color: #f5f7fb;
          padding-top: 60px; /* Space for fixed mobile header */
        }

        /* Mobile header spacer */
        .mobile-header-spacer {
          height: 0;
        }

        /* Header Styles */
        .dashboard-header {
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 0 30px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          max-width: 100%;
        }

        .header-left {
          flex: 1;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .welcome-title {
          display: flex;
          align-items: center;
          margin: 0;
          color: white;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .header-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }

        .header-icon i {
          color: #3498db;
          font-size: 1.5rem;
        }

        .header-text {
          display: flex;
          flex-direction: column;
        }

        .header-subtitle {
          font-size: 0.85rem;
          font-weight: normal;
          opacity: 0.9;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.8);
        }

        .header-user-info {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          padding: 8px 15px;
          min-width: 200px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }

        .user-avatar i {
          color: #3498db;
          font-size: 1rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: white;
          line-height: 1.2;
        }

        .user-program {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-weight: 500;
          padding: 0.5rem 1.2rem;
          border-radius: 50px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* Content Area */
        .dashboard-content {
          padding: 30px;
          min-height: calc(100vh - 80px); /* Subtract header height */
          box-sizing: border-box;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .student-main-content.desktop {
            margin-left: 0;
            width: 100%;
          }
          
          .dashboard-content {
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 15px;
          }
          
          .student-main-content.mobile {
            padding-top: 60px; /* Adjust for mobile header */
          }
        }

        @media (max-width: 480px) {
          .dashboard-content {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};