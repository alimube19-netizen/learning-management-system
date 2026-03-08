import React, { useState, useEffect } from 'react';

const AllCourses = () => {
  // Mock data
  const mockCourses = [
    {
      _id: '1',
      code: 'CS101',
      name: 'Introduction to Programming',
      description: 'Fundamentals of programming using Python',
      program: 'BSCS',
      semester: 1,
      creditHours: 3,
      instructor: 'Dr. Ali Ahmed',
      schedule: 'Mon/Wed 10:00-11:30',
      enrolledStudents: 45,
      maxStudents: 50,
      prerequisites: [],
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      code: 'MATH101',
      name: 'Calculus I',
      description: 'Introduction to differential and integral calculus',
      program: 'BSCS',
      semester: 1,
      creditHours: 3,
      instructor: 'Dr. Sara Khan',
      schedule: 'Tue/Thu 9:00-10:30',
      enrolledStudents: 40,
      maxStudents: 45,
      prerequisites: [],
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      _id: '3',
      code: 'CS201',
      name: 'Data Structures',
      description: 'Study of fundamental data structures and algorithms',
      program: 'BSCS',
      semester: 2,
      creditHours: 3,
      instructor: 'Dr. Usman Malik',
      schedule: 'Mon/Wed 2:00-3:30',
      enrolledStudents: 38,
      maxStudents: 40,
      prerequisites: ['CS101'],
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      _id: '4',
      code: 'BUS101',
      name: 'Introduction to Business',
      description: 'Fundamentals of business administration',
      program: 'BBA',
      semester: 1,
      creditHours: 3,
      instructor: 'Prof. John Smith',
      schedule: 'Mon/Wed 1:00-2:30',
      enrolledStudents: 35,
      maxStudents: 40,
      prerequisites: [],
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      _id: '5',
      code: 'CS301',
      name: 'Database Systems',
      description: 'Introduction to database design and SQL',
      program: 'BSCS',
      semester: 3,
      creditHours: 3,
      instructor: 'Dr. Fatima Riaz',
      schedule: 'Tue/Thu 11:00-12:30',
      enrolledStudents: 32,
      maxStudents: 35,
      prerequisites: ['CS201'],
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      _id: '6',
      code: 'CS401',
      name: 'Software Engineering',
      description: 'Software development methodologies and practices',
      program: 'BSCS',
      semester: 4,
      creditHours: 3,
      instructor: 'Dr. Ahmed Hassan',
      schedule: 'Mon/Wed 3:00-4:30',
      enrolledStudents: 28,
      maxStudents: 30,
      prerequisites: ['CS301'],
      isActive: false,
      createdAt: '2024-01-15'
    }
  ];

  const mockStats = {
    totalCourses: 6,
    activeCourses: 5,
    totalEnrollment: 218,
    averageEnrollment: 36.3,
    popularPrograms: [
      { program: 'BSCS', courses: 5, enrollment: 185 },
      { program: 'BBA', courses: 1, enrollment: 35 }
    ]
  };

  // State
  const [courses, setCourses] = useState(mockCourses);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollmentStats, setEnrollmentStats] = useState(mockStats);

  // Form state for new course
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    description: '',
    program: 'BSCS',
    semester: 1,
    creditHours: 3,
    instructor: '',
    schedule: '',
    maxStudents: 40,
    prerequisites: [],
    isActive: true
  });

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      (course.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = filterProgram === 'all' || course.program === filterProgram;
    const matchesSemester = filterSemester === 'all' || course.semester == filterSemester;
    
    return matchesSearch && matchesProgram && matchesSemester;
  });

  // Get unique programs and semesters for filters
  const uniquePrograms = [...new Set(courses.map(c => c.program).filter(Boolean))];
  const uniqueSemesters = [...new Set(courses.map(c => c.semester).filter(Boolean))].sort((a, b) => a - b);

  // Add course handler
  const handleAddCourse = (e) => {
    e.preventDefault();
    
    // Simulate API delay
    setLoading(true);
    setTimeout(() => {
      const newCourseWithId = {
        ...newCourse,
        _id: `temp_${Date.now()}`,
        enrolledStudents: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setCourses(prev => [...prev, newCourseWithId]);
      
      // Update stats
      setEnrollmentStats(prev => ({
        ...prev,
        totalCourses: prev.totalCourses + 1,
        activeCourses: prev.activeCourses + (newCourse.isActive ? 1 : 0)
      }));
      
      alert('Course added successfully!');
      setShowAddModal(false);
      setNewCourse({
        code: '',
        name: '',
        description: '',
        program: 'BSCS',
        semester: 1,
        creditHours: 3,
        instructor: '',
        schedule: '',
        maxStudents: 40,
        prerequisites: [],
        isActive: true
      });
      setLoading(false);
    }, 800);
  };

  // Update course handler
  const handleUpdateCourse = () => {
    if (!selectedCourse) return;
    
    setLoading(true);
    setTimeout(() => {
      setCourses(prev => prev.map(course => 
        course._id === selectedCourse._id ? selectedCourse : course
      ));
      
      alert('Course updated successfully!');
      setShowEditModal(false);
      setSelectedCourse(null);
      setLoading(false);
    }, 800);
  };

  // Toggle active status
  const handleToggleActive = (courseId, currentStatus) => {
    const newStatus = !currentStatus;
    
    setCourses(prev => prev.map(course => 
      course._id === courseId ? { ...course, isActive: newStatus } : course
    ));
    
    // Update stats
    setEnrollmentStats(prev => ({
      ...prev,
      activeCourses: prev.activeCourses + (newStatus ? 1 : -1)
    }));
    
    alert(`Course ${newStatus ? 'activated' : 'deactivated'} successfully!`);
  };

  // Delete course handler
  const handleDeleteCourse = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    const courseToDelete = courses.find(course => course._id === courseId);
    
    setCourses(prev => prev.filter(course => course._id !== courseId));
    
    // Update stats
    setEnrollmentStats(prev => ({
      ...prev,
      totalCourses: prev.totalCourses - 1,
      activeCourses: prev.activeCourses - (courseToDelete?.isActive ? 1 : 0),
      totalEnrollment: prev.totalEnrollment - (courseToDelete?.enrolledStudents || 0)
    }));
    
    alert('Course deleted successfully!');
  };

  // Edit click handler
  const handleEditClick = (course) => {
    setSelectedCourse({ ...course });
    setShowEditModal(true);
  };

  // Helper functions
  const getEnrollmentPercentage = (enrolled, max) => {
    return (enrolled / max) * 100;
  };

  const getEnrollmentColor = (percentage) => {
    if (percentage >= 90) return '#e74c3c';
    if (percentage >= 70) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div className="all-courses-admin">
      {/* Header */}
      <div className="courses-header">
        <div className="header-content">
          <h2>Course Management</h2>
          <p>Manage all courses, enrollment, and course details</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus-circle"></i> Add New Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-info">
            <h3>{enrollmentStats.totalCourses || 0}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{enrollmentStats.activeCourses || 0}</h3>
            <p>Active Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon enrollment">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{enrollmentStats.totalEnrollment || 0}</h3>
            <p>Total Enrollment</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon average">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="stat-info">
            <h3>{enrollmentStats.averageEnrollment?.toFixed(1) || '0.0'}</h3>
            <p>Avg per Course</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="courses-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search courses by code, name, or instructor..."
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
            value={filterSemester} 
            onChange={(e) => setFilterSemester(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Semesters</option>
            {uniqueSemesters.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="courses-table-container">
        {loading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i> Loading courses...
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Details</th>
                    <th>Program & Semester</th>
                    <th>Enrollment Status</th>
                    <th>Schedule & Instructor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map(course => {
                    const enrollmentPercentage = getEnrollmentPercentage(course.enrolledStudents, course.maxStudents);
                    
                    return (
                      <tr key={course._id} className={course.isActive ? '' : 'inactive'}>
                        <td>
                          <div className="course-code-cell">
                            <strong>{course.code}</strong>
                            <div className="credits-badge">{course.creditHours} Credits</div>
                          </div>
                        </td>
                        <td>
                          <div className="course-details-cell">
                            <div className="course-name">{course.name}</div>
                            <div className="course-description">{course.description}</div>
                            {course.prerequisites && course.prerequisites.length > 0 && (
                              <div className="prerequisites">
                                <i className="fas fa-layer-group"></i>
                                Prerequisites: {course.prerequisites.join(', ')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="program-cell">
                            <span className="program-badge">{course.program}</span>
                            <div className="semester-info">Semester {course.semester}</div>
                          </div>
                        </td>
                        <td>
                          <div className="enrollment-cell">
                            <div className="enrollment-stats">
                              <span>{course.enrolledStudents}/{course.maxStudents}</span>
                              <span>({enrollmentPercentage.toFixed(1)}%)</span>
                            </div>
                            <div className="enrollment-bar">
                              <div 
                                className="enrollment-fill"
                                style={{ 
                                  width: `${enrollmentPercentage}%`,
                                  backgroundColor: getEnrollmentColor(enrollmentPercentage)
                                }}
                              ></div>
                            </div>
                            <div className="enrollment-status">
                              {enrollmentPercentage >= 90 ? 'Full' : 
                               enrollmentPercentage >= 70 ? 'Almost Full' : 'Available'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="schedule-cell">
                            <div className="schedule-info">
                              <i className="fas fa-clock"></i>
                              {course.schedule}
                            </div>
                            <div className="instructor-info">
                              <i className="fas fa-chalkboard-teacher"></i>
                              {course.instructor}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="status-cell">
                            <div 
                              className={`status-badge ${course.isActive ? 'active' : 'inactive'}`}
                              onClick={() => handleToggleActive(course._id, course.isActive)}
                              style={{ cursor: 'pointer' }}
                            >
                              {course.isActive ? (
                                <>
                                  <i className="fas fa-check-circle"></i> Active
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-times-circle"></i> Inactive
                                </>
                              )}
                            </div>
                            <div className="created-date">
                              Created: {new Date(course.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action btn-edit"
                              onClick={() => handleEditClick(course)}
                              title="Edit Course"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn-action btn-students"
                              onClick={() => alert(`View enrolled students for ${course.code}`)}
                              title="View Enrolled Students"
                            >
                              <i className="fas fa-users"></i>
                            </button>
                            <button 
                              className="btn-action btn-content"
                              onClick={() => alert(`Manage content for ${course.code}`)}
                              title="Manage Course Content"
                            >
                              <i className="fas fa-file-alt"></i>
                            </button>
                            <button 
                              className="btn-action btn-delete"
                              onClick={() => handleDeleteCourse(course._id)}
                              title="Delete Course"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {filteredCourses.length === 0 && (
              <div className="no-courses">
                <i className="fas fa-book"></i>
                <h4>No courses found</h4>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal add-course-modal">
            <div className="modal-header">
              <h3>Add New Course</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Course Code *</label>
                    <input
                      type="text"
                      required
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                      placeholder="e.g., CS101"
                    />
                  </div>
                  <div className="form-group">
                    <label>Course Name *</label>
                    <input
                      type="text"
                      required
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                      placeholder="e.g., Introduction to Programming"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      required
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      rows="3"
                      placeholder="Brief description of the course..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Program *</label>
                    <select
                      required
                      value={newCourse.program}
                      onChange={(e) => setNewCourse({...newCourse, program: e.target.value})}
                    >
                      <option value="BSCS">BSCS - Computer Science</option>
                      <option value="BBA">BBA - Business Administration</option>
                      <option value="BSIT">BSIT - Information Technology</option>
                      <option value="BSSE">BSSE - Software Engineering</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Semester *</label>
                    <select
                      required
                      value={newCourse.semester}
                      onChange={(e) => setNewCourse({...newCourse, semester: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Credit Hours *</label>
                    <select
                      required
                      value={newCourse.creditHours}
                      onChange={(e) => setNewCourse({...newCourse, creditHours: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4].map(credits => (
                        <option key={credits} value={credits}>{credits} Credit{credits !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Instructor *</label>
                    <input
                      type="text"
                      required
                      value={newCourse.instructor}
                      onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                      placeholder="e.g., Dr. Ali Ahmed"
                    />
                  </div>
                  <div className="form-group">
                    <label>Schedule *</label>
                    <input
                      type="text"
                      required
                      value={newCourse.schedule}
                      onChange={(e) => setNewCourse({...newCourse, schedule: e.target.value})}
                      placeholder="e.g., Mon/Wed 10:00-11:30"
                    />
                  </div>
                  <div className="form-group">
                    <label>Maximum Students *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={newCourse.maxStudents}
                      onChange={(e) => setNewCourse({...newCourse, maxStudents: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Prerequisites</label>
                    <input
                      type="text"
                      value={newCourse.prerequisites.join(', ')}
                      onChange={(e) => setNewCourse({...newCourse, prerequisites: e.target.value.split(',').map(p => p.trim()).filter(p => p)})}
                      placeholder="e.g., CS101, MATH101"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={newCourse.isActive}
                        onChange={(e) => setNewCourse({...newCourse, isActive: e.target.checked})}
                      />
                      <label htmlFor="isActive">Active Course</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-plus-circle"></i> Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <div className="modal-overlay">
          <div className="modal edit-course-modal">
            <div className="modal-header">
              <h3>Edit Course</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Code *</label>
                  <input
                    type="text"
                    required
                    value={selectedCourse.code}
                    onChange={(e) => setSelectedCourse({...selectedCourse, code: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Course Name *</label>
                  <input
                    type="text"
                    required
                    value={selectedCourse.name}
                    onChange={(e) => setSelectedCourse({...selectedCourse, name: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    required
                    value={selectedCourse.description}
                    onChange={(e) => setSelectedCourse({...selectedCourse, description: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Program *</label>
                  <select
                    required
                    value={selectedCourse.program}
                    onChange={(e) => setSelectedCourse({...selectedCourse, program: e.target.value})}
                  >
                    <option value="BSCS">BSCS - Computer Science</option>
                    <option value="BBA">BBA - Business Administration</option>
                    <option value="BSIT">BSIT - Information Technology</option>
                    <option value="BSSE">BSSE - Software Engineering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Semester *</label>
                  <select
                    required
                    value={selectedCourse.semester}
                    onChange={(e) => setSelectedCourse({...selectedCourse, semester: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Credit Hours *</label>
                  <select
                    required
                    value={selectedCourse.creditHours}
                    onChange={(e) => setSelectedCourse({...selectedCourse, creditHours: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4].map(credits => (
                      <option key={credits} value={credits}>{credits} Credit{credits !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Instructor *</label>
                  <input
                    type="text"
                    required
                    value={selectedCourse.instructor}
                    onChange={(e) => setSelectedCourse({...selectedCourse, instructor: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Schedule *</label>
                  <input
                    type="text"
                    required
                    value={selectedCourse.schedule}
                    onChange={(e) => setSelectedCourse({...selectedCourse, schedule: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Students *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={selectedCourse.maxStudents}
                    onChange={(e) => setSelectedCourse({...selectedCourse, maxStudents: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Prerequisites</label>
                  <input
                    type="text"
                    value={selectedCourse.prerequisites?.join(', ') || ''}
                    onChange={(e) => setSelectedCourse({
                      ...selectedCourse, 
                      prerequisites: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                    })}
                    placeholder="e.g., CS101, MATH101"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      checked={selectedCourse.isActive}
                      onChange={(e) => setSelectedCourse({...selectedCourse, isActive: e.target.checked})}
                    />
                    <label htmlFor="editIsActive">Active Course</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleUpdateCourse}>
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .all-courses-admin {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .courses-header {
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

        .btn-primary {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.3s ease;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
        }

        .stat-icon.total { background: #3498db; }
        .stat-icon.active { background: #27ae60; }
        .stat-icon.enrollment { background: #9b59b6; }
        .stat-icon.average { background: #f39c12; }

        .stat-info h3 {
          margin: 0;
          font-size: 28px;
          color: #2c3e50;
        }

        .stat-info p {
          margin: 5px 0 0 0;
          color: #7f8c8d;
          font-size: 14px;
        }

        .courses-filters {
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

        .courses-table-container {
          background: white;
          padding: 20px;
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

        .courses-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .courses-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          color: #2c3e50;
          font-weight: 600;
          border-bottom: 2px solid #e9ecef;
        }

        .courses-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          vertical-align: top;
        }

        .courses-table tr:hover {
          background: #f8f9fa;
        }

        .courses-table tr.inactive {
          opacity: 0.7;
          background: #f9f9f9;
        }

        .courses-table tr.inactive:hover {
          background: #f0f0f0;
        }

        .course-code-cell {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .course-code-cell strong {
          font-size: 16px;
          color: #2c3e50;
        }

        .credits-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          width: fit-content;
        }

        .course-details-cell {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .course-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 15px;
        }

        .course-description {
          color: #5d6d7e;
          font-size: 13px;
          line-height: 1.4;
        }

        .prerequisites {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #7f8c8d;
        }

        .prerequisites i {
          color: #f39c12;
        }

        .program-cell {
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
          width: fit-content;
        }

        .semester-info {
          font-size: 13px;
          color: #5d6d7e;
        }

        .enrollment-cell {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .enrollment-stats {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #5d6d7e;
        }

        .enrollment-bar {
          height: 6px;
          background: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .enrollment-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .enrollment-status {
          font-size: 12px;
          font-weight: 500;
          text-align: center;
        }

        .schedule-cell {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .schedule-info, .instructor-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #5d6d7e;
        }

        .schedule-info i, .instructor-info i {
          color: #3498db;
          width: 14px;
        }

        .status-cell {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-badge.active {
          background: #d5edda;
          color: #155724;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .created-date {
          font-size: 11px;
          color: #95a5a6;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
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
          transition: all 0.3s ease;
        }

        .btn-edit {
          background: #3498db;
        }

        .btn-edit:hover {
          background: #2980b9;
        }

        .btn-students {
          background: #2ecc71;
        }

        .btn-students:hover {
          background: #27ae60;
        }

        .btn-content {
          background: #9b59b6;
        }

        .btn-content:hover {
          background: #8e44ad;
        }

        .btn-delete {
          background: #e74c3c;
        }

        .btn-delete:hover {
          background: #c0392b;
        }

        .no-courses {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }

        .no-courses i {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-courses h4 {
          margin: 0 0 10px 0;
          color: #2c3e50;
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

        .add-course-modal,
        .edit-course-modal {
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

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-group label {
          margin: 0;
          cursor: pointer;
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
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
        }

        .btn-secondary:hover {
          background: #7f8c8d;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .courses-filters {
            flex-direction: column;
          }
          
          .search-box {
            min-width: 100%;
          }
          
          .filter-group {
            width: 100%;
            flex-direction: column;
          }
          
          .courses-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AllCourses;