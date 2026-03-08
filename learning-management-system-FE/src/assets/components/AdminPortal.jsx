import React, { useEffect, useState } from 'react';
import axios from "axios";
import { AdminSidebar } from './AdminSidebar';
import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { AddStudent } from './AddStudent';
import AllStudents from './Allstudents';
import CourseEnrollment from './CourseEnrollment';
import StudentProgress from './StudentProgress';
import AllCourses from './AllCourses';
import CreateAssignment from './CreateAssignment';
import Deadlines from './Deadlines';
import { MobileAdminSidebar } from './MobileAdminSidebar';
import UploadLectures from './UploadLectures';
import UploadNotes from './UploadNotes';
import ManageResources from './ManageResources';

const AdminPortal = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const token = localStorage.getItem("admin_token");

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/AdminPortal", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [token]);

  // Loading animation component
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f7fb'
      }}>
        {/* Modern loading spinner */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>

          <div style={{
            fontSize: '18px',
            color: '#2c3e50',
            fontWeight: '500'
          }}>
            Loading Admin Portal...
          </div>

          <div style={{
            fontSize: '14px',
            color: '#7f8c8d',
            maxWidth: '300px',
            lineHeight: '1.5'
          }}>
            Please wait while we prepare your dashboard
          </div>
        </div>

        {/* Add CSS animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && <AdminSidebar />}
      
      {/* Mobile Sidebar - Only on Mobile */}
      {isMobile && <MobileAdminSidebar />}
      
      {/* Main Content Area */}
      <div style={{
        marginLeft: isMobile ? '0' : '260px', // Only add margin on desktop
        flex: 1,
        padding: isMobile ? '16px' : '24px',
        backgroundColor: '#f5f7fb',
        minHeight: '100vh',
        width: isMobile ? '100%' : 'calc(100% - 260px)',
        transition: 'all 0.3s ease'
      }}>
        {/* Add padding-top on mobile to prevent content from hiding behind header */}
        {isMobile && (
          <div style={{ height: '60px' }}></div> // Spacer for mobile header
        )}
        
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route index element={<AdminDashboard />} />
          <Route path='addstudent' element={<AddStudent/>}/>
          <Route path='allstudents' element={<AllStudents/>}/>
          <Route path='courseEnrollment' element={<CourseEnrollment/>}/>
          <Route path='studentprogress' element={<StudentProgress/>}/>
          <Route path='/courses/all' element={<AllCourses/>}/>
          <Route path='/assignments/create' element={<CreateAssignment/>}/>
          <Route path='/assignments/deadlines' element={<Deadlines/>}/>
          <Route path='/materials/uploadlectures' element={<UploadLectures/>}/>
          <Route path='/materials/notes' element={<UploadNotes/>}/>
          <Route path='/materials/resources' element={<ManageResources/>}/>
        </Routes>
      </div>

      {/* Global styles */}
      <style>{`
        /* Responsive adjustments for content */
        @media (max-width: 1024px) {
          body {
            overflow-x: hidden;
          }
          
          .admin-content-container {
            padding-top: 60px !important;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AdminPortal;