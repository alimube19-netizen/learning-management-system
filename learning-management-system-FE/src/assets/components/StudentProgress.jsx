import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStudentsProgress();
  }, []);

  const fetchStudentsProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Mock data for demonstration
      const mockStudents = [
        {
          _id: '1',
          registrationNo: 'STU2024001',
          fullName: 'Ali Khan',
          email: 'ali@example.com',
          program: 'BSCS',
          currentSemester: 3,
          enrollmentDate: '2024-01-15',
          status: 'active',
          cgpa: 3.45,
          attendance: 92,
          creditsEarned: 46,
          creditsRequired: 136,
          academicStanding: 'Good Standing',
          semesters: [
            {
              semester: 1,
              gpa: 3.2,
              creditsEarned: 15,
              status: 'Completed'
            },
            {
              semester: 2,
              gpa: 3.5,
              creditsEarned: 16,
              status: 'Completed'
            },
            {
              semester: 3,
              gpa: 3.65,
              creditsEarned: 15,
              status: 'In Progress'
            }
          ]
        },
        {
          _id: '2',
          registrationNo: 'STU2024002',
          fullName: 'Sara Ahmed',
          email: 'sara@example.com',
          program: 'BBA',
          currentSemester: 2,
          enrollmentDate: '2024-02-20',
          status: 'active',
          cgpa: 3.8,
          attendance: 95,
          creditsEarned: 30,
          creditsRequired: 130,
          academicStanding: 'Excellent',
          semesters: [
            {
              semester: 1,
              gpa: 3.9,
              creditsEarned: 15,
              status: 'Completed'
            },
            {
              semester: 2,
              gpa: 3.7,
              creditsEarned: 15,
              status: 'In Progress'
            }
          ]
        },
        {
          _id: '3',
          registrationNo: 'STU2024003',
          fullName: 'Usman Malik',
          email: 'usman@example.com',
          program: 'BSCS',
          currentSemester: 4,
          enrollmentDate: '2023-09-01',
          status: 'warning',
          cgpa: 2.1,
          attendance: 75,
          creditsEarned: 60,
          creditsRequired: 136,
          academicStanding: 'Academic Warning',
          semesters: [
            {
              semester: 1,
              gpa: 2.5,
              creditsEarned: 12,
              status: 'Completed'
            },
            {
              semester: 2,
              gpa: 2.0,
              creditsEarned: 15,
              status: 'Completed'
            },
            {
              semester: 3,
              gpa: 1.8,
              creditsEarned: 15,
              status: 'Completed'
            },
            {
              semester: 4,
              gpa: 2.0,
              creditsEarned: 18,
              status: 'In Progress'
            }
          ]
        }
      ];

      // Uncomment for real API
      // const response = await axios.get('/api/admin/students/progress', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setStudents(response.data);

      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students progress:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.registrationNo || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesProgram && matchesStatus;
  });

  // Get unique programs for filter
  const uniquePrograms = [...new Set(students.map(s => s.program).filter(Boolean))];

  // Get color for CGPA
  const getCGPAColor = (cgpa) => {
    if (cgpa >= 3.5) return '#27ae60';
    if (cgpa >= 2.5) return '#f39c12';
    return '#e74c3c';
  };

  // Get color for academic standing
  const getStandingColor = (standing) => {
    if (standing.includes('Excellent') || standing.includes('Good')) return '#27ae60';
    if (standing.includes('Warning') || standing.includes('Probation')) return '#e74c3c';
    return '#f39c12';
  };

  const sendProgressReport = async (studentId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`/api/admin/students/${studentId}/progress-report`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Progress report sent successfully!');
    } catch (error) {
      alert('Error sending progress report: ' + error.message);
    }
  };

  const markForReview = async (studentId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`/api/admin/students/${studentId}/mark-review`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStudents(students.map(student => 
        student._id === studentId ? { ...student, status: 'review' } : student
      ));
      
      alert('Student marked for academic review');
    } catch (error) {
      alert('Error marking student: ' + error.message);
    }
  };

  return (
    <div className="student-progress-admin">
      {/* Header */}
      <div className="admin-progress-header">
        <div className="header-content">
          <h2>Student Progress Monitoring</h2>
          <p>Track and monitor student academic performance across all programs</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat">
            <div className="stat-value">{students.filter(s => s.cgpa >= 3.0).length}</div>
            <div className="stat-label">Above 3.0 GPA</div>
          </div>
          <div className="stat">
            <div className="stat-value">{students.filter(s => s.status === 'warning').length}</div>
            <div className="stat-label">At Risk</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="progress-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search students by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
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
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="warning">At Risk</option>
            <option value="review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-progress-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-chart-bar"></i> Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'detailed' ? 'active' : ''}`}
          onClick={() => setActiveTab('detailed')}
        >
          <i className="fas fa-list"></i> Detailed View
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <i className="fas fa-file-alt"></i> Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-tab-content">
        {loading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i> Loading student progress data...
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-grid">
                {filteredStudents.map(student => {
                  const completionPercentage = (student.creditsEarned / student.creditsRequired) * 100;
                  
                  return (
                    <div key={student._id} className="student-progress-card">
                      <div className="student-header">
                        <div className="student-info">
                          <div className="student-name">{student.fullName}</div>
                          <div className="student-id">{student.registrationNo}</div>
                          <div className="student-program">{student.program}</div>
                        </div>
                        <div className="student-status">
                          <span 
                            className={`status-badge status-${student.status}`}
                            style={{ backgroundColor: getStandingColor(student.academicStanding) }}
                          >
                            {student.academicStanding}
                          </span>
                        </div>
                      </div>

                      <div className="progress-stats">
                        <div className="stat-row">
                          <div className="stat-item">
                            <div className="stat-label">CGPA</div>
                            <div 
                              className="stat-value cgpa"
                              style={{ color: getCGPAColor(student.cgpa) }}
                            >
                              {student.cgpa.toFixed(2)}
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-label">Attendance</div>
                            <div className="stat-value">{student.attendance}%</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-label">Semester</div>
                            <div className="stat-value">{student.currentSemester}</div>
                          </div>
                        </div>

                        <div className="progress-section">
                          <div className="progress-header">
                            <span>Credits Progress</span>
                            <span>{student.creditsEarned}/{student.creditsRequired}</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="semester-progress">
                          <div className="semester-header">Semester Performance</div>
                          <div className="semester-bars">
                            {student.semesters.map(sem => (
                              <div key={sem.semester} className="semester-bar">
                                <div className="semester-label">S{sem.semester}</div>
                                <div className="gpa-bar">
                                  <div 
                                    className="gpa-fill"
                                    style={{ 
                                      width: `${(sem.gpa / 4) * 100}%`,
                                      backgroundColor: sem.gpa >= 3.5 ? '#27ae60' : 
                                                     sem.gpa >= 2.5 ? '#f39c12' : '#e74c3c'
                                    }}
                                  ></div>
                                </div>
                                <div className="gpa-value">{sem.gpa.toFixed(1)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="student-actions">
                        <button 
                          className="btn btn-view"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <i className="fas fa-eye"></i> View Details
                        </button>
                        <button 
                          className="btn btn-report"
                          onClick={() => sendProgressReport(student._id)}
                        >
                          <i className="fas fa-envelope"></i> Send Report
                        </button>
                        {student.status !== 'review' && (
                          <button 
                            className="btn btn-review"
                            onClick={() => markForReview(student._id)}
                          >
                            <i className="fas fa-flag"></i> Mark Review
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Detailed View Tab */}
            {activeTab === 'detailed' && (
              <div className="detailed-view">
                <div className="table-container">
                  <table className="progress-table">
                    <thead>
                      <tr>
                        <th>Student Info</th>
                        <th>Academic Details</th>
                        <th>Performance</th>
                        <th>Progress</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => {
                        const completionPercentage = (student.creditsEarned / student.creditsRequired) * 100;
                        const avgSemesterGPA = student.semesters.reduce((sum, sem) => sum + sem.gpa, 0) / student.semesters.length;
                        
                        return (
                          <tr key={student._id}>
                            <td>
                              <div className="student-cell">
                                <div className="student-name">{student.fullName}</div>
                                <div className="student-details">
                                  <span className="student-id">{student.registrationNo}</span>
                                  <span className="student-program">{student.program}</span>
                                  <span className="student-semester">Sem {student.currentSemester}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="academic-cell">
                                <div className="detail-item">
                                  <span className="label">Enrolled:</span>
                                  <span className="value">{new Date(student.enrollmentDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="label">Credits:</span>
                                  <span className="value">{student.creditsEarned}/{student.creditsRequired}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="label">Attendance:</span>
                                  <span className="value">{student.attendance}%</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="performance-cell">
                                <div className="cgpa-display">
                                  <span className="cgpa-value" style={{ color: getCGPAColor(student.cgpa) }}>
                                    {student.cgpa.toFixed(2)}
                                  </span>
                                  <span className="cgpa-label">CGPA</span>
                                </div>
                                <div className="avg-gpa">
                                  <span className="avg-label">Avg Semester GPA:</span>
                                  <span className="avg-value">{avgSemesterGPA.toFixed(2)}</span>
                                </div>
                                <div className="standing">
                                  <span 
                                    className="standing-badge"
                                    style={{ backgroundColor: getStandingColor(student.academicStanding) }}
                                  >
                                    {student.academicStanding}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="progress-cell">
                                <div className="progress-bar">
                                  <div 
                                    className="progress-fill"
                                    style={{ width: `${completionPercentage}%` }}
                                  ></div>
                                </div>
                                <div className="progress-text">
                                  {completionPercentage.toFixed(1)}% Complete
                                </div>
                                <div className="semester-count">
                                  {student.semesters.length} semesters completed
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="action-cell">
                                <button 
                                  className="btn-icon btn-view"
                                  onClick={() => setSelectedStudent(student)}
                                  title="View Details"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn-icon btn-report"
                                  onClick={() => sendProgressReport(student._id)}
                                  title="Send Progress Report"
                                >
                                  <i className="fas fa-envelope"></i>
                                </button>
                                <button 
                                  className="btn-icon btn-review"
                                  onClick={() => markForReview(student._id)}
                                  title="Mark for Review"
                                >
                                  <i className="fas fa-flag"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="reports-tab">
                <div className="reports-header">
                  <h3>Academic Reports & Analytics</h3>
                  <div className="report-actions">
                    <button className="btn btn-export">
                      <i className="fas fa-file-export"></i> Export All Reports
                    </button>
                    <button className="btn btn-generate">
                      <i className="fas fa-file-alt"></i> Generate Summary Report
                    </button>
                  </div>
                </div>

                <div className="reports-grid">
                  <div className="report-card">
                    <div className="report-header">
                      <i className="fas fa-chart-line"></i>
                      <h4>Performance Overview</h4>
                    </div>
                    <div className="report-content">
                      <div className="metric">
                        <div className="metric-label">Average CGPA</div>
                        <div className="metric-value">
                          {(students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)}
                        </div>
                      </div>
                      <div className="metric">
                        <div className="metric-label">At Risk Students</div>
                        <div className="metric-value">{students.filter(s => s.cgpa < 2.5).length}</div>
                      </div>
                      <div className="metric">
                        <div className="metric-label">Excellent Students</div>
                        <div className="metric-value">{students.filter(s => s.cgpa >= 3.5).length}</div>
                      </div>
                    </div>
                  </div>

                  <div className="report-card">
                    <div className="report-header">
                      <i className="fas fa-graduation-cap"></i>
                      <h4>Program Performance</h4>
                    </div>
                    <div className="report-content">
                      {uniquePrograms.map(program => {
                        const programStudents = students.filter(s => s.program === program);
                        const avgGPA = programStudents.reduce((sum, s) => sum + s.cgpa, 0) / programStudents.length;
                        
                        return (
                          <div key={program} className="program-metric">
                            <div className="program-name">{program}</div>
                            <div className="program-stats">
                              <span>{programStudents.length} students</span>
                              <span>Avg GPA: {avgGPA.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="report-card wide">
                    <div className="report-header">
                      <i className="fas fa-exclamation-triangle"></i>
                      <h4>Students Needing Attention</h4>
                    </div>
                    <div className="report-content">
                      {students
                        .filter(s => s.cgpa < 2.5)
                        .map(student => (
                          <div key={student._id} className="attention-student">
                            <div className="student-info">
                              <div className="student-name">{student.fullName}</div>
                              <div className="student-details">
                                {student.registrationNo} • {student.program} • Sem {student.currentSemester}
                              </div>
                            </div>
                            <div className="student-stats">
                              <span className="cgpa" style={{ color: getCGPAColor(student.cgpa) }}>
                                CGPA: {student.cgpa.toFixed(2)}
                              </span>
                              <span className="standing">{student.academicStanding}</span>
                            </div>
                            <div className="student-actions">
                              <button 
                                className="btn btn-small"
                                onClick={() => setSelectedStudent(student)}
                              >
                                View
                              </button>
                              <button 
                                className="btn btn-small btn-review"
                                onClick={() => markForReview(student._id)}
                              >
                                Review
                              </button>
                            </div>
                          </div>
                        ))}
                      
                      {students.filter(s => s.cgpa < 2.5).length === 0 && (
                        <div className="no-attention">
                          <i className="fas fa-check-circle"></i>
                          <p>No students currently need attention</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && filteredStudents.length === 0 && (
          <div className="no-results">
            <i className="fas fa-user-slash"></i>
            <h4>No students found</h4>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal student-detail-modal">
            <div className="modal-header">
              <h3>Student Progress Details</h3>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="student-detail-header">
                <div className="student-main-info">
                  <h4>{selectedStudent.fullName}</h4>
                  <div className="student-details">
                    <span>{selectedStudent.registrationNo}</span>
                    <span>{selectedStudent.program}</span>
                    <span>Semester {selectedStudent.currentSemester}</span>
                    <span>Enrolled: {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="student-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStandingColor(selectedStudent.academicStanding) }}
                  >
                    {selectedStudent.academicStanding}
                  </span>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-section">
                  <h5>Academic Performance</h5>
                  <div className="performance-metrics">
                    <div className="metric">
                      <div className="metric-label">Current CGPA</div>
                      <div 
                        className="metric-value"
                        style={{ color: getCGPAColor(selectedStudent.cgpa) }}
                      >
                        {selectedStudent.cgpa.toFixed(2)}
                      </div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Attendance</div>
                      <div className="metric-value">{selectedStudent.attendance}%</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Credits Earned</div>
                      <div className="metric-value">
                        {selectedStudent.creditsEarned}/{selectedStudent.creditsRequired}
                      </div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Completion</div>
                      <div className="metric-value">
                        {((selectedStudent.creditsEarned / selectedStudent.creditsRequired) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h5>Semester History</h5>
                  <div className="semester-history">
                    {selectedStudent.semesters.map(sem => (
                      <div key={sem.semester} className="semester-item">
                        <div className="semester-header">
                          <span>Semester {sem.semester}</span>
                          <span className={`semester-status status-${sem.status.toLowerCase().replace(' ', '-')}`}>
                            {sem.status}
                          </span>
                        </div>
                        <div className="semester-details">
                          <span>GPA: {sem.gpa.toFixed(2)}</span>
                          <span>Credits: {sem.creditsEarned}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="actions-section">
                <button 
                  className="btn btn-primary"
                  onClick={() => sendProgressReport(selectedStudent._id)}
                >
                  <i className="fas fa-envelope"></i> Send Progress Report
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    markForReview(selectedStudent._id);
                    setSelectedStudent(null);
                  }}
                >
                  <i className="fas fa-flag"></i> Mark for Academic Review
                </button>
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
        .student-progress-admin {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .admin-progress-header {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-content h2 {
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .header-content p {
          color: #7f8c8d;
          margin: 0;
        }

        .header-stats {
          display: flex;
          gap: 30px;
        }

        .header-stats .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header-stats .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #3498db;
        }

        .header-stats .stat-label {
          font-size: 14px;
          color: #7f8c8d;
        }

        .progress-filters {
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

        .search-box {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .search-box i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #95a5a6;
        }

        .search-box input {
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

        .admin-progress-tabs {
          display: flex;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 25px;
          overflow: hidden;
        }

        .admin-progress-tabs .tab-btn {
          flex: 1;
          padding: 18px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 600;
          color: #5d6d7e;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .admin-progress-tabs .tab-btn:hover {
          background: #f8f9fa;
          color: #3498db;
        }

        .admin-progress-tabs .tab-btn.active {
          color: #3498db;
          border-bottom-color: #3498db;
          background: #f0f7ff;
        }

        .admin-tab-content {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }

        .loading i {
          margin-right: 10px;
        }

        /* Overview Tab Styles */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 25px;
        }

        .student-progress-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 25px;
          transition: all 0.3s ease;
        }

        .student-progress-card:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .student-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .student-info .student-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .student-info .student-id {
          color: #3498db;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .student-info .student-program {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }

        .progress-stats {
          margin-bottom: 25px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #2c3e50;
        }

        .stat-value.cgpa {
          font-size: 24px;
        }

        .progress-section {
          margin-bottom: 25px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #5d6d7e;
        }

        .progress-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #2980b9);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .semester-progress {
          margin-top: 20px;
        }

        .semester-header {
          font-size: 14px;
          color: #5d6d7e;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .semester-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .semester-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .semester-label {
          min-width: 40px;
          font-size: 12px;
          color: #5d6d7e;
        }

        .gpa-bar {
          flex: 1;
          height: 6px;
          background: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .gpa-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .gpa-value {
          min-width: 40px;
          text-align: right;
          font-size: 12px;
          font-weight: 600;
          color: #2c3e50;
        }

        .student-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-view {
          background: #3498db;
          color: white;
        }

        .btn-view:hover {
          background: #2980b9;
        }

        .btn-report {
          background: #2ecc71;
          color: white;
        }

        .btn-report:hover {
          background: #27ae60;
        }

        .btn-review {
          background: #f39c12;
          color: white;
        }

        .btn-review:hover {
          background: #d68910;
        }

        /* Detailed View Tab Styles */
        .detailed-view {
          overflow-x: auto;
        }

        .progress-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .progress-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          color: #2c3e50;
          font-weight: 600;
          border-bottom: 2px solid #e9ecef;
        }

        .progress-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          vertical-align: top;
        }

        .student-cell .student-name {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 5px;
        }

        .student-cell .student-details {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #7f8c8d;
        }

        .academic-cell .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .academic-cell .label {
          color: #7f8c8d;
        }

        .academic-cell .value {
          color: #2c3e50;
          font-weight: 500;
        }

        .performance-cell .cgpa-display {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .performance-cell .cgpa-value {
          font-size: 20px;
          font-weight: bold;
        }

        .performance-cell .cgpa-label {
          font-size: 12px;
          color: #7f8c8d;
        }

        .performance-cell .avg-gpa {
          font-size: 12px;
          color: #5d6d7e;
          margin-bottom: 8px;
        }

        .performance-cell .avg-label {
          margin-right: 5px;
        }

        .performance-cell .avg-value {
          font-weight: 600;
        }

        .standing-badge {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 11px;
          font-weight: 500;
        }

        .progress-cell .progress-bar {
          height: 6px;
          background: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .progress-cell .progress-text {
          font-size: 12px;
          color: #5d6d7e;
          margin-bottom: 3px;
        }

        .progress-cell .semester-count {
          font-size: 11px;
          color: #95a5a6;
        }

        .action-cell {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
        }

        .btn-icon.btn-view {
          background: #3498db;
        }

        .btn-icon.btn-report {
          background: #2ecc71;
        }

        .btn-icon.btn-review {
          background: #f39c12;
        }

        /* Reports Tab Styles */
        .reports-tab {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .reports-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .report-actions {
          display: flex;
          gap: 15px;
        }

        .btn-export {
          background: #9b59b6;
          color: white;
        }

        .btn-export:hover {
          background: #8e44ad;
        }

        .btn-generate {
          background: #3498db;
          color: white;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }

        .report-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 25px;
        }

        .report-card.wide {
          grid-column: 1 / -1;
        }

        .report-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .report-header i {
          color: #3498db;
          font-size: 20px;
        }

        .report-header h4 {
          margin: 0;
          color: #2c3e50;
        }

        .report-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metric-label {
          color: #5d6d7e;
          font-size: 14px;
        }

        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
        }

        .program-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .program-metric:last-child {
          border-bottom: none;
        }

        .program-name {
          font-weight: 500;
          color: #2c3e50;
        }

        .program-stats {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #7f8c8d;
        }

        .attention-student {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #fff8e1;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .attention-student:last-child {
          margin-bottom: 0;
        }

        .student-info .student-name {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 3px;
        }

        .student-info .student-details {
          font-size: 12px;
          color: #7f8c8d;
        }

        .student-stats {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .student-stats .cgpa {
          font-weight: 600;
        }

        .student-stats .standing {
          background: #ffebee;
          color: #e74c3c;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .student-actions {
          display: flex;
          gap: 8px;
        }

        .btn-small {
          padding: 6px 12px;
          font-size: 12px;
        }

        .no-attention {
          text-align: center;
          padding: 30px;
          color: #95a5a6;
        }

        .no-attention i {
          font-size: 36px;
          margin-bottom: 15px;
          color: #27ae60;
        }

        /* Modal Styles */
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

        .student-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .student-main-info h4 {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 20px;
        }

        .student-details {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #7f8c8d;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .detail-section h5 {
          color: #2c3e50;
          margin: 0 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .performance-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .performance-metrics .metric {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .performance-metrics .metric-label {
          font-size: 12px;
          color: #7f8c8d;
        }

        .performance-metrics .metric-value {
          font-size: 20px;
          font-weight: bold;
        }

        .semester-history {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .semester-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .semester-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .semester-header span:first-child {
          font-weight: 500;
          color: #2c3e50;
        }

        .semester-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .status-completed {
          background: #d5edda;
          color: #155724;
        }

        .status-in-progress {
          background: #e3f2fd;
          color: #1976d2;
        }

        .semester-details {
          display: flex;
          gap: 20px;
          font-size: 13px;
          color: #5d6d7e;
        }

        .actions-section {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .btn-primary {
          background: #3498db;
          color: white;
        }

        .btn-warning {
          background: #f39c12;
          color: white;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .reports-grid {
            grid-template-columns: 1fr;
          }
          
          .student-detail-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .student-details {
            flex-wrap: wrap;
            gap: 10px;
          }
          
          .progress-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentProgress;