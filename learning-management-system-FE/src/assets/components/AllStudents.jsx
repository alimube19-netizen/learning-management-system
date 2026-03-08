import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      // For testing, use mock data if API is not ready
      const mockStudents = [
        
      ];
      
      // Uncomment when API is ready:
      // const token = localStorage.getItem('adminToken');
      // const response = await axios.get('/api/admin/students/all', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setStudents(Array.isArray(response.data) ? response.data : []);
      
      setStudents(mockStudents); // Using mock data for now
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.registrationNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.cnic || '').includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || student?.status === filterStatus;
    const matchesProgram = filterProgram === 'all' || student?.program === filterProgram;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Get unique programs
  const uniquePrograms = [...new Set(students.map(s => s?.program).filter(Boolean))];

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/admin/students/${studentId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setStudents(students.map(student => 
        student._id === studentId ? { ...student, status: newStatus } : student
      ));
      
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleSendReminder = async (studentId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`/api/admin/students/${studentId}/send-reminder`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Reminder email sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Error sending reminder');
    }
  };

  const exportToCSV = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Program', 'Status', 'Enrollment Date', 'Phone'];
    const csvData = filteredStudents.map(student => [
      student.registrationNo || '',
      student.fullName || '',
      student.email || '',
      student.program || '',
      student.status || '',
      new Date(student.enrollmentDate).toLocaleDateString(),
      student.phone || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="all-students">
      {/* Header */}
      <div className="component-header">
        <div className="header-content">
          <h2>All Students</h2>
          <p>View and manage all registered students</p>
        </div>
        <button className="btn btn-export" onClick={exportToCSV}>
          <i className="fas fa-file-export"></i> Export to CSV
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-filter">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, ID, or CNIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select 
            value={filterProgram} 
            onChange={(e) => setFilterProgram(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Programs</option>
            {uniquePrograms.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">Total Students:</span>
          <span className="stat-value">{students.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value active">
            {students.filter(s => s?.status === 'active').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending:</span>
          <span className="stat-value pending">
            {students.filter(s => s?.status === 'pending').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filtered:</span>
          <span className="stat-value filtered">
            {filteredStudents.length}
          </span>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading student data...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="students-data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Details</th>
                    <th>Program & Batch</th>
                    <th>Status</th>
                    <th>Contact Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="student-id-cell">
                          <strong>{student.registrationNo || 'N/A'}</strong>
                          <small>Enrolled: {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <div className="student-details">
                          <div className="student-name">{student.fullName || 'N/A'}</div>
                          <div className="student-email">{student.email || 'N/A'}</div>
                          {student.fatherName && (
                            <div className="student-father">Father: {student.fatherName}</div>
                          )}
                          {student.cnic && (
                            <div className="student-cnic">CNIC: {student.cnic}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="program-info">
                          <span className="program-badge">{student.program || 'N/A'}</span>
                          {student.batch && (
                            <div className="batch-info">Batch: {student.batch}</div>
                          )}
                          {student.semester && (
                            <div className="semester-info">Semester: {student.semester}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="status-cell">
                          <select
                            value={student.status || 'pending'}
                            onChange={(e) => handleStatusChange(student._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="graduated">Graduated</option>
                            <option value="suspended">Suspended</option>
                          </select>
                          <span className={`status-indicator status-${student.status || 'pending'}`}></span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-item">
                            <i className="fas fa-phone"></i>
                            {student.phone || 'Not provided'}
                          </div>
                          <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            {student.address ? student.address.substring(0, 30) + '...' : 'Address not provided'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-view"
                            onClick={() => setSelectedStudent(student)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn-action btn-email"
                            onClick={() => handleSendReminder(student._id)}
                            title="Send Reminder"
                          >
                            <i className="fas fa-envelope"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}

            {/* No results message */}
            {filteredStudents.length === 0 && (
              <div className="no-results">
                <i className="fas fa-user-slash"></i>
                <h4>No students found</h4>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal student-detail-modal">
            <div className="modal-header">
              <h3>Student Details</h3>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-item">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{selectedStudent.fullName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Father's Name:</span>
                    <span className="detail-value">{selectedStudent.fatherName || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">
                      {selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">CNIC:</span>
                    <span className="detail-value">{selectedStudent.cnic || 'Not provided'}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Academic Information</h4>
                  <div className="detail-item">
                    <span className="detail-label">Student ID:</span>
                    <span className="detail-value">{selectedStudent.registrationNo || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Program:</span>
                    <span className="detail-value program-badge">{selectedStudent.program || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Enrollment Date:</span>
                    <span className="detail-value">
                      {selectedStudent.enrollmentDate ? new Date(selectedStudent.enrollmentDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge status-${selectedStudent.status || 'pending'}`}>
                      {selectedStudent.status || 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="detail-section full-width">
                  <h4>Contact Information</h4>
                  <div className="contact-details">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <div className="contact-label">Email</div>
                        <div className="contact-value">{selectedStudent.email || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <div>
                        <div className="contact-label">Phone</div>
                        <div className="contact-value">{selectedStudent.phone || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <div>
                        <div className="contact-label">Address</div>
                        <div className="contact-value">{selectedStudent.address || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .all-students {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .component-header {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h2 {
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .header-content p {
          color: #7f8c8d;
          margin: 0;
        }

        .btn-export {
          background: #27ae60;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-export:hover {
          background: #219653;
        }

        .filters-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: space-between;
        }

        .search-filter {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .search-filter i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #95a5a6;
        }

        .search-filter input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .filter-group {
          display: flex;
          gap: 15px;
        }

        .filter-select {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          min-width: 150px;
        }

        .stats-summary {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
          border-right: 1px solid #eee;
        }

        .stat-item:last-child {
          border-right: none;
        }

        .stat-label {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #2c3e50;
        }

        .stat-value.active {
          color: #27ae60;
        }

        .stat-value.pending {
          color: #f39c12;
        }

        .stat-value.filtered {
          color: #3498db;
        }

        .table-container {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }

        .loading-state i {
          font-size: 24px;
          margin-bottom: 15px;
        }

        .students-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .students-data-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          color: #2c3e50;
          font-weight: 600;
          border-bottom: 2px solid #e9ecef;
        }

        .students-data-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          vertical-align: top;
        }

        .students-data-table tr:hover {
          background: #f8f9fa;
        }

        .student-id-cell {
          display: flex;
          flex-direction: column;
        }

        .student-id-cell small {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 4px;
        }

        .student-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .student-name {
          font-weight: 600;
          color: #2c3e50;
        }

        .student-email {
          font-size: 13px;
          color: #3498db;
        }

        .student-father,
        .student-cnic {
          font-size: 12px;
          color: #7f8c8d;
        }

        .program-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .program-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
          width: fit-content;
        }

        .status-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-select {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 12px;
          min-width: 120px;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-pending {
          background: #f39c12;
        }

        .status-active {
          background: #27ae60;
        }

        .status-inactive {
          background: #95a5a6;
        }

        .status-graduated {
          background: #9b59b6;
        }

        .status-suspended {
          background: #e74c3c;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #5d6d7e;
        }

        .contact-item i {
          color: #3498db;
          width: 16px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .btn-view {
          background: #3498db;
        }

        .btn-email {
          background: #2ecc71;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 30px;
          padding: 20px 0;
          border-top: 1px solid #eee;
        }

        .page-btn {
          padding: 10px 20px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 8px;
        }

        .page-number {
          width: 40px;
          height: 40px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
        }

        .page-number.active {
          background: #3498db;
          color: white;
          border-color: #3498db;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }

        .no-results i {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .student-detail-modal {
          background: white;
          border-radius: 10px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #7f8c8d;
        }

        .modal-body {
          padding: 20px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .detail-section h4 {
          color: #2c3e50;
          margin: 0 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .detail-label {
          font-weight: 500;
          color: #5d6d7e;
        }

        .detail-value {
          color: #2c3e50;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .contact-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .contact-item i {
          color: #3498db;
          font-size: 18px;
        }

        .contact-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 2px;
        }

        .contact-value {
          color: #2c3e50;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: #3498db;
          color: white;
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
        }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .filters-section {
            flex-direction: column;
          }
          
          .search-filter {
            min-width: 100%;
          }
          
          .filter-group {
            width: 100%;
            flex-direction: column;
          }
          
          .students-data-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AllStudents;