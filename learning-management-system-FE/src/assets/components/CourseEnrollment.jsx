// CourseEnrollment.jsx - For enrolling courses into programs
import React, { useState, useEffect } from 'react';

const CourseEnrollment = () => {
  // State management
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    semester: 'Spring 2024',
    year: '2024',
    required: false,
    credits: 3,
    maxCapacity: 50,
    prerequisites: []
  });

  // Sample data - would come from API in real app
  useEffect(() => {
    // Mock programs data
    const mockPrograms = [
      { id: 1, name: 'Computer Science', code: 'CS', duration: '4 years', department: 'Engineering' },
      { id: 2, name: 'Business Administration', code: 'BBA', duration: '3 years', department: 'Business' },
      { id: 3, name: 'Electrical Engineering', code: 'EE', duration: '4 years', department: 'Engineering' },
      { id: 4, name: 'Psychology', code: 'PSY', duration: '3 years', department: 'Arts & Sciences' },
      { id: 5, name: 'Data Science', code: 'DS', duration: '2 years', department: 'Computing' }
    ];

    // Mock courses data
    const mockCourses = [
      { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 3, department: 'Computer Science', level: 'Undergraduate' },
      { id: 2, code: 'CS201', name: 'Data Structures', credits: 4, department: 'Computer Science', level: 'Undergraduate', prerequisites: ['CS101'] },
      { id: 3, code: 'CS301', name: 'Algorithms', credits: 4, department: 'Computer Science', level: 'Undergraduate', prerequisites: ['CS201'] },
      { id: 4, code: 'BBA101', name: 'Principles of Management', credits: 3, department: 'Business', level: 'Undergraduate' },
      { id: 5, code: 'BBA201', name: 'Marketing Fundamentals', credits: 3, department: 'Business', level: 'Undergraduate' },
      { id: 6, code: 'EE101', name: 'Circuit Theory', credits: 4, department: 'Electrical Engineering', level: 'Undergraduate' },
      { id: 7, code: 'PSY101', name: 'Introduction to Psychology', credits: 3, department: 'Psychology', level: 'Undergraduate' },
      { id: 8, code: 'CS401', name: 'Machine Learning', credits: 4, department: 'Computer Science', level: 'Graduate', prerequisites: ['CS301', 'MATH202'] },
      { id: 9, code: 'DS101', name: 'Data Analysis Fundamentals', credits: 3, department: 'Data Science', level: 'Undergraduate' },
      { id: 10, code: 'DS201', name: 'Statistical Computing', credits: 4, department: 'Data Science', level: 'Undergraduate', prerequisites: ['DS101'] }
    ];

    setPrograms(mockPrograms);
    setCourses(mockCourses);
  }, []);

  // Handle program selection
  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
    setSuccessMessage('');
  };

  // Handle course selection
  const handleCourseSelect = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected program details
  const getSelectedProgramDetails = () => {
    return programs.find(p => p.id === parseInt(selectedProgram));
  };

  // Get selected course details
  const getSelectedCourseDetails = () => {
    return selectedCourses.map(id => courses.find(c => c.id === id));
  };

  // Handle enrollment submission
  const handleEnrollCourses = async (e) => {
    e.preventDefault();
    
    if (!selectedProgram) {
      alert('Please select a program first');
      return;
    }

    if (selectedCourses.length === 0) {
      alert('Please select at least one course');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const program = getSelectedProgramDetails();
      const enrolledCourses = getSelectedCourseDetails();
      
      console.log('Enrolling courses:', {
        program,
        courses: enrolledCourses,
        enrollmentDetails: formData
      });

      setLoading(false);
      setSuccessMessage(`Successfully enrolled ${selectedCourses.length} course(s) into ${program.name} program!`);
      
      // Reset selections after successful enrollment
      setSelectedCourses([]);
      setFormData({
        semester: 'Spring 2024',
        year: '2024',
        required: false,
        credits: 3,
        maxCapacity: 50,
        prerequisites: []
      });
    }, 1500);
  };

  // Remove selected course
  const removeSelectedCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(id => id !== courseId));
  };

  // Get course by ID
  const getCourseById = (id) => {
    return courses.find(c => c.id === id);
  };

  return (
    <div className="container-fluid course-enrollment-container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Course Enrollment to Programs</h1>
          <p className="text-muted mb-4">
            Enroll new courses into academic programs. Select a program and choose courses to add.
          </p>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Program Selection & Course List */}
        <div className="col-lg-8">
          {/* Program Selection Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Step 1: Select Program</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {programs.map(program => (
                  <div key={program.id} className="col-md-6 mb-3">
                    <div 
                      className={`program-card card ${selectedProgram === program.id ? 'border-primary border-2' : ''}`}
                      onClick={() => handleProgramSelect(program.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="card-title mb-1">{program.name}</h6>
                            <p className="text-muted small mb-1">Code: {program.code}</p>
                            <p className="small mb-0">Department: {program.department}</p>
                          </div>
                          {selectedProgram === program.id && (
                            <span className="badge bg-primary">Selected</span>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className="badge bg-light text-dark">{program.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProgram && (
                <div className="alert alert-info mt-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Selected: <strong>{getSelectedProgramDetails()?.name}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Course Selection Card */}
          {selectedProgram && (
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Step 2: Select Courses</h5>
              </div>
              <div className="card-body">
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search courses by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Course List */}
                <div className="row">
                  {filteredCourses.map(course => (
                    <div key={course.id} className="col-md-6 mb-3">
                      <div 
                        className={`course-item card ${selectedCourses.includes(course.id) ? 'border-success border-2' : ''}`}
                        onClick={() => handleCourseSelect(course.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="card-title mb-1">{course.code} - {course.name}</h6>
                              <p className="text-muted small mb-1">Department: {course.department}</p>
                              <p className="small mb-1">Credits: {course.credits}</p>
                              {course.prerequisites && course.prerequisites.length > 0 && (
                                <p className="small text-warning mb-0">
                                  <i className="bi bi-exclamation-triangle me-1"></i>
                                  Prerequisites: {course.prerequisites.join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="text-end">
                              <span className="badge bg-secondary">{course.level}</span>
                              {selectedCourses.includes(course.id) && (
                                <div className="mt-2">
                                  <span className="badge bg-success">Selected</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-4">
                    <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mt-2">No courses found matching your search</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Enrollment Details & Summary */}
        <div className="col-lg-4">
          {/* Selected Courses Summary */}
          <div className="card shadow-sm mb-4 sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Selected Courses</h5>
            </div>
            <div className="card-body">
              {selectedCourses.length > 0 ? (
                <>
                  <div className="mb-3">
                    <h6>Courses to Enroll:</h6>
                    <div className="list-group">
                      {selectedCourses.map(courseId => {
                        const course = getCourseById(courseId);
                        return (
                          <div key={courseId} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <small className="fw-bold">{course.code}</small>
                              <br />
                              <small>{course.name}</small>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeSelectedCourse(courseId)}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="alert alert-light border">
                    <div className="d-flex justify-content-between">
                      <span>Total Courses:</span>
                      <strong>{selectedCourses.length}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Total Credits:</span>
                      <strong>
                        {selectedCourses.reduce((total, id) => {
                          const course = getCourseById(id);
                          return total + (course?.credits || 0);
                        }, 0)}
                      </strong>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <i className="bi bi-cart text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="text-muted mt-2">No courses selected yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Enrollment Details Form */}
          {selectedProgram && selectedCourses.length > 0 && (
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">Step 3: Enrollment Details</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleEnrollCourses}>
                  <div className="mb-3">
                    <label className="form-label">Academic Semester</label>
                    <select 
                      className="form-select"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                    >
                      <option value="Spring 2024">Spring 2024</option>
                      <option value="Fall 2024">Fall 2024</option>
                      <option value="Summer 2024">Summer 2024</option>
                      <option value="Winter 2024">Winter 2024</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Academic Year</label>
                    <input
                      type="text"
                      className="form-control"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Credits per Course</label>
                      <input
                        type="number"
                        className="form-control"
                        name="credits"
                        value={formData.credits}
                        onChange={handleInputChange}
                        min="1"
                        max="6"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Max Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        name="maxCapacity"
                        value={formData.maxCapacity}
                        onChange={handleInputChange}
                        min="10"
                        max="200"
                      />
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="requiredCheck"
                      name="required"
                      checked={formData.required}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="requiredCheck">
                      Required Course for Program
                    </label>
                    <small className="d-block text-muted">
                      If checked, this course will be mandatory for all students in the program
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Additional Prerequisites (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Add any additional prerequisites, separated by commas"
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  {/* Success Message */}
                  {successMessage && (
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle me-2"></i>
                      {successMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading || selectedCourses.length === 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enrolling Courses...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        Enroll {selectedCourses.length} Course(s) to Program
                      </>
                    )}
                  </button>

                  <div className="mt-3 text-center">
                    <small className="text-muted">
                      <i className="bi bi-shield-check me-1"></i>
                      This action will make these courses available to all students in the selected program
                    </small>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h6 className="card-title">Quick Stats</h6>
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="p-2 bg-light rounded">
                    <div className="h4 mb-0">{programs.length}</div>
                    <small className="text-muted">Programs</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="p-2 bg-light rounded">
                    <div className="h4 mb-0">{courses.length}</div>
                    <small className="text-muted">Courses</small>
                  </div>
                </div>
                <div className="col-12">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Select a program to enroll courses
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollment;