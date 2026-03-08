import React, { useContext } from 'react'
import Step_5 from './Step_5'
import Step_2 from './Step_2';
import Step_4 from './Step_4';
import Step_7 from './Step_7';
import Step_8 from './Step_8';
import { AuthContext } from './AuthProvider';
import axios from 'axios';

export const AddStudent = () => {

  const { personalInfo, academicInfo, programInfo, documents } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('admin_token');
      
      const formData = new FormData();
      
      // Add data as JSON strings
      formData.append('personalInfo', JSON.stringify(personalInfo));
      formData.append('programInfo', JSON.stringify(programInfo));
      formData.append('academicInfo', JSON.stringify(academicInfo));
      
      // Add files with document types as field names
      Object.entries(documents).forEach(([docType, file]) => {
        if (file) {
          formData.append(docType, file);
        }
      });

      const response = await axios.post('http://localhost:5000/api/AddStudent', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Student added successfully:', response.data);

    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div className='add-student-container'>
      {/* Page Title Heading */}
      <div className="page-title-section mb-4">
        <h1 className="page-title">Add New Student</h1>
        <p className="page-subtitle">
          Complete all sections below to register a new student for the program.
          <span className="form-status">Fill all required fields</span>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Step_2/>
        <Step_4/>
        <Step_7/>
        <Step_5/>
        <Step_8/>
      </form>

      {/* CSS Styles */}
      <style jsx="true">{`
        .add-student-container {
          padding: 20px;
        }
        
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
          color: #3498db;
          border: 1px solid #e3e6f0;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .add-student-container {
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
        }
      `}</style>
    </div>
  )
}