import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [instructors, setInstructors] = useState([]);
  
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    description: '',
    program: '',
    semester: 1,
    creditHours: 3,
    instructor: '',
    scheduleType: 'weekly', // weekly, biweekly, flexible
    scheduleDetails: '',
    maxStudents: 40,
    prerequisites: [],
    courseType: 'core', // core, elective, lab
    assessmentBreakdown: [
      { type: 'Assignments', weight: 30 },
      { type: 'Quizzes', weight: 20 },
      { type: 'Midterm', weight: 20 },
      { type: 'Final Exam', weight: 30 }
    ],
    learningObjectives: [''],
    requiredTextbooks: [''],
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Mock data for programs
      const mockPrograms = [
        { _id: '1', code: 'BSCS', name: 'Bachelor of Science in Computer Science' },
        { _id: '2', code: 'BBA', name: 'Bachelor of Business Administration' },
        { _id: '3', code: 'BSIT', name: 'Bachelor of Science in Information Technology' },
        { _id: '4', code: 'BSSE', name: 'Bachelor of Science in Software Engineering' }
      ];
      
      // Mock data for prerequisites (existing courses)
      const mockPrerequisites = [
        { _id: '1', code: 'CS101', name: 'Introduction to Programming' },
        { _id: '2', code: 'MATH101', name: 'Calculus I' },
        { _id: '3', code: 'CS201', name: 'Data Structures' },
        { _id: '4', code: 'CS301', name: 'Database Systems' }
      ];
      
      // Mock data for instructors
      const mockInstructors = [
        { _id: '1', name: 'Dr. Ali Ahmed', email: 'ali.ahmed@university.edu' },
        { _id: '2', name: 'Dr. Sara Khan', email: 'sara.khan@university.edu' },
        { _id: '3', name: 'Dr. Usman Malik', email: 'usman.malik@university.edu' },
        { _id: '4', name: 'Prof. Fatima Riaz', email: 'fatima.riaz@university.edu' }
      ];

      setPrograms(mockPrograms);
      setPrerequisites(mockPrerequisites);
      setInstructors(mockInstructors);
      
      // Set default program if available
      if (mockPrograms.length > 0) {
        setCourseData(prev => ({ ...prev, program: mockPrograms[0]._id }));
      }
      
      // Set default instructor if available
      if (mockInstructors.length > 0) {
        setCourseData(prev => ({ ...prev, instructor: mockInstructors[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch(stepNumber) {
      case 1:
        if (!courseData.code.trim()) newErrors.code = 'Course code is required';
        if (!courseData.name.trim()) newErrors.name = 'Course name is required';
        if (!courseData.description.trim()) newErrors.description = 'Course description is required';
        if (!courseData.program) newErrors.program = 'Program selection is required';
        break;
      
      case 2:
        if (courseData.creditHours < 1 || courseData.creditHours > 4) {
          newErrors.creditHours = 'Credit hours must be between 1 and 4';
        }
        if (!courseData.instructor) newErrors.instructor = 'Instructor selection is required';
        if (!courseData.scheduleDetails.trim()) newErrors.scheduleDetails = 'Schedule details are required';
        if (courseData.maxStudents < 1 || courseData.maxStudents > 100) {
          newErrors.maxStudents = 'Maximum students must be between 1 and 100';
        }
        break;
        
      case 3:
        // Validate assessment breakdown totals 100%
        const totalWeight = courseData.assessmentBreakdown.reduce((sum, item) => sum + (parseInt(item.weight) || 0), 0);
        if (totalWeight !== 100) {
          newErrors.assessmentBreakdown = `Total weight must be 100% (currently ${totalWeight}%)`;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setCourseData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAssessmentChange = (index, field, value) => {
    const updatedBreakdown = [...courseData.assessmentBreakdown];
    updatedBreakdown[index] = {
      ...updatedBreakdown[index],
      [field]: field === 'weight' ? parseInt(value) || 0 : value
    };
    
    setCourseData(prev => ({
      ...prev,
      assessmentBreakdown: updatedBreakdown
    }));
    
    // Clear assessment breakdown error
    if (errors.assessmentBreakdown) {
      setErrors(prev => ({ ...prev, assessmentBreakdown: '' }));
    }
  };

  const addAssessmentItem = () => {
    setCourseData(prev => ({
      ...prev,
      assessmentBreakdown: [...prev.assessmentBreakdown, { type: '', weight: 0 }]
    }));
  };

  const removeAssessmentItem = (index) => {
    if (courseData.assessmentBreakdown.length > 1) {
      const updatedBreakdown = courseData.assessmentBreakdown.filter((_, i) => i !== index);
      setCourseData(prev => ({
        ...prev,
        assessmentBreakdown: updatedBreakdown
      }));
    }
  };

  const handleArrayInputChange = (field, index, value) => {
    const updatedArray = [...courseData[field]];
    updatedArray[index] = value;
    
    setCourseData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = courseData[field].filter((_, i) => i !== index);
    setCourseData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const handlePrerequisiteChange = (courseId) => {
    setCourseData(prev => {
      const isSelected = prev.prerequisites.includes(courseId);
      const updatedPrerequisites = isSelected
        ? prev.prerequisites.filter(id => id !== courseId)
        : [...prev.prerequisites, courseId];
      
      return {
        ...prev,
        prerequisites: updatedPrerequisites
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage('');
      
      const token = localStorage.getItem('adminToken');
      
      // Prepare data for API
      const submitData = {
        ...courseData,
        // Convert IDs to names for display
        program: programs.find(p => p._id === courseData.program)?.code,
        instructor: instructors.find(i => i._id === courseData.instructor)?.name,
        prerequisites: courseData.prerequisites.map(id => 
          prerequisites.find(p => p._id === id)?.code
        ).filter(Boolean)
      };

      // Uncomment for real API
      /*
      const response = await axios.post('/api/admin/courses/create', submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      */

      // Mock success response
      console.log('Course data to submit:', submitData);
      
      // Show success message
      setSuccessMessage(`Course "${courseData.code}: ${courseData.name}" created successfully!`);
      
      // Reset form after delay
      setTimeout(() => {
        setCourseData({
          code: '',
          name: '',
          description: '',
          program: programs.length > 0 ? programs[0]._id : '',
          semester: 1,
          creditHours: 3,
          instructor: instructors.length > 0 ? instructors[0]._id : '',
          scheduleType: 'weekly',
          scheduleDetails: '',
          maxStudents: 40,
          prerequisites: [],
          courseType: 'core',
          assessmentBreakdown: [
            { type: 'Assignments', weight: 30 },
            { type: 'Quizzes', weight: 20 },
            { type: 'Midterm', weight: 20 },
            { type: 'Final Exam', weight: 30 }
          ],
          learningObjectives: [''],
          requiredTextbooks: [''],
          isActive: true
        });
        setStep(1);
        setErrors({});
      }, 3000);
      
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create course. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${step >= 1 ? 'active' : ''}`}>
        <span className="step-number">1</span>
        <span className="step-label">Basic Info</span>
      </div>
      <div className="step-connector"></div>
      <div className={`step ${step >= 2 ? 'active' : ''}`}>
        <span className="step-number">2</span>
        <span className="step-label">Course Details</span>
      </div>
      <div className="step-connector"></div>
      <div className={`step ${step >= 3 ? 'active' : ''}`}>
        <span className="step-number">3</span>
        <span className="step-label">Assessment</span>
      </div>
      <div className="step-connector"></div>
      <div className={`step ${step === 4 ? 'active' : ''}`}>
        <span className="step-number">4</span>
        <span className="step-label">Review & Create</span>
      </div>
    </div>
  );

  return (
    <div className="create-course">
      {/* Header */}
      <div className="create-course-header">
        <h2>Create New Course</h2>
        <p>Add a new course to the Learning Management System</p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <div>
            <h4>Success!</h4>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="form-step">
            <h3>Basic Course Information</h3>
            <p className="step-description">Enter the fundamental details about the course.</p>

            <div className="form-grid">
              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="code"
                  value={courseData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., CS101"
                  className={errors.code ? 'error' : ''}
                />
                {errors.code && <span className="error-text">{errors.code}</span>}
                <small>Unique identifier for the course (letters and numbers)</small>
              </div>

              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="name"
                  value={courseData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to Programming"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
                <small>Full descriptive name of the course</small>
              </div>

              <div className="form-group full-width">
                <label>Course Description *</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the course content, objectives, and topics covered..."
                  rows="4"
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
                <small>Describe what students will learn in this course</small>
              </div>

              <div className="form-group">
                <label>Program *</label>
                <select
                  name="program"
                  value={courseData.program}
                  onChange={handleInputChange}
                  className={errors.program ? 'error' : ''}
                >
                  <option value="">Select a program</option>
                  {programs.map(program => (
                    <option key={program._id} value={program._id}>
                      {program.code} - {program.name}
                    </option>
                  ))}
                </select>
                {errors.program && <span className="error-text">{errors.program}</span>}
                <small>Which degree program this course belongs to</small>
              </div>

              <div className="form-group">
                <label>Semester</label>
                <select
                  name="semester"
                  value={courseData.semester}
                  onChange={handleInputChange}
                >
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                <small>When this course is typically taken</small>
              </div>

              <div className="form-group">
                <label>Course Type</label>
                <select
                  name="courseType"
                  value={courseData.courseType}
                  onChange={handleInputChange}
                >
                  <option value="core">Core Course</option>
                  <option value="elective">Elective Course</option>
                  <option value="lab">Laboratory Course</option>
                  <option value="project">Project Course</option>
                </select>
                <small>Type of course</small>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Course Details */}
        {step === 2 && (
          <div className="form-step">
            <h3>Course Details & Logistics</h3>
            <p className="step-description">Set up the course schedule, instructor, and capacity.</p>

            <div className="form-grid">
              <div className="form-group">
                <label>Credit Hours *</label>
                <select
                  name="creditHours"
                  value={courseData.creditHours}
                  onChange={handleInputChange}
                  className={errors.creditHours ? 'error' : ''}
                >
                  <option value="1">1 Credit</option>
                  <option value="2">2 Credits</option>
                  <option value="3">3 Credits</option>
                  <option value="4">4 Credits</option>
                </select>
                {errors.creditHours && <span className="error-text">{errors.creditHours}</span>}
                <small>Academic weight of the course</small>
              </div>

              <div className="form-group">
                <label>Instructor *</label>
                <select
                  name="instructor"
                  value={courseData.instructor}
                  onChange={handleInputChange}
                  className={errors.instructor ? 'error' : ''}
                >
                  <option value="">Select an instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
                {errors.instructor && <span className="error-text">{errors.instructor}</span>}
                <small>Faculty member teaching the course</small>
              </div>

              <div className="form-group">
                <label>Schedule Type</label>
                <select
                  name="scheduleType"
                  value={courseData.scheduleType}
                  onChange={handleInputChange}
                >
                  <option value="weekly">Weekly Classes</option>
                  <option value="biweekly">Bi-weekly Classes</option>
                  <option value="flexible">Flexible Schedule</option>
                  <option value="intensive">Intensive Course</option>
                </select>
                <small>How the course is scheduled</small>
              </div>

              <div className="form-group full-width">
                <label>Schedule Details *</label>
                <input
                  type="text"
                  name="scheduleDetails"
                  value={courseData.scheduleDetails}
                  onChange={handleInputChange}
                  placeholder="e.g., Monday/Wednesday 10:00-11:30 AM, Room 302"
                  className={errors.scheduleDetails ? 'error' : ''}
                />
                {errors.scheduleDetails && <span className="error-text">{errors.scheduleDetails}</span>}
                <small>Class timings, days, and location</small>
              </div>

              <div className="form-group">
                <label>Maximum Students *</label>
                <input
                  type="number"
                  name="maxStudents"
                  value={courseData.maxStudents}
                  onChange={handleNumberInputChange}
                  min="1"
                  max="100"
                  className={errors.maxStudents ? 'error' : ''}
                />
                {errors.maxStudents && <span className="error-text">{errors.maxStudents}</span>}
                <small>Maximum enrollment capacity</small>
              </div>

              <div className="form-group">
                <label>Course Status</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={courseData.isActive}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isActive">Active Course</label>
                </div>
                <small>Active courses are available for enrollment</small>
              </div>
            </div>

            {/* Prerequisites Section */}
            <div className="prerequisites-section">
              <h4>Prerequisites</h4>
              <p className="section-description">Select courses that must be completed before enrolling in this course.</p>
              
              <div className="prerequisites-grid">
                {prerequisites.map(prereq => (
                  <div key={prereq._id} className="prerequisite-item">
                    <input
                      type="checkbox"
                      id={`prereq-${prereq._id}`}
                      checked={courseData.prerequisites.includes(prereq._id)}
                      onChange={() => handlePrerequisiteChange(prereq._id)}
                    />
                    <label htmlFor={`prereq-${prereq._id}`}>
                      <span className="prereq-code">{prereq.code}</span>
                      <span className="prereq-name">{prereq.name}</span>
                    </label>
                  </div>
                ))}
              </div>
              
              {courseData.prerequisites.length > 0 && (
                <div className="selected-prerequisites">
                  <strong>Selected Prerequisites:</strong>{' '}
                  {courseData.prerequisites.map(id => {
                    const prereq = prerequisites.find(p => p._id === id);
                    return prereq ? prereq.code : '';
                  }).join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Assessment & Content */}
        {step === 3 && (
          <div className="form-step">
            <h3>Assessment & Learning Content</h3>
            <p className="step-description">Define how students will be evaluated and what they will learn.</p>

            {/* Assessment Breakdown */}
            <div className="assessment-section">
              <h4>Assessment Breakdown</h4>
              <p className="section-description">Define how the final grade will be calculated. Total must equal 100%.</p>
              
              {errors.assessmentBreakdown && (
                <div className="error-message-inline">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{errors.assessmentBreakdown}</span>
                </div>
              )}
              
              <div className="assessment-grid">
                {courseData.assessmentBreakdown.map((item, index) => (
                  <div key={index} className="assessment-item">
                    <div className="assessment-type">
                      <input
                        type="text"
                        value={item.type}
                        onChange={(e) => handleAssessmentChange(index, 'type', e.target.value)}
                        placeholder="e.g., Assignments, Quizzes, Exams"
                      />
                    </div>
                    <div className="assessment-weight">
                      <input
                        type="number"
                        value={item.weight}
                        onChange={(e) => handleAssessmentChange(index, 'weight', e.target.value)}
                        min="0"
                        max="100"
                        placeholder="Weight %"
                      />
                      <span className="percent-sign">%</span>
                    </div>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeAssessmentItem(index)}
                      disabled={courseData.assessmentBreakdown.length <= 1}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                className="btn-add"
                onClick={addAssessmentItem}
              >
                <i className="fas fa-plus"></i> Add Assessment Component
              </button>
              
              <div className="assessment-total">
                <strong>Total Weight:</strong>{' '}
                <span className={`total-value ${courseData.assessmentBreakdown.reduce((sum, item) => sum + (parseInt(item.weight) || 0), 0) === 100 ? 'valid' : 'invalid'}`}>
                  {courseData.assessmentBreakdown.reduce((sum, item) => sum + (parseInt(item.weight) || 0), 0)}%
                </span>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="objectives-section">
              <h4>Learning Objectives</h4>
              <p className="section-description">What students should be able to do after completing this course.</p>
              
              {courseData.learningObjectives.map((objective, index) => (
                <div key={index} className="objective-item">
                  <div className="objective-input">
                    <span className="objective-number">{index + 1}.</span>
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayInputChange('learningObjectives', index, e.target.value)}
                      placeholder="e.g., Understand fundamental programming concepts"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeArrayItem('learningObjectives', index)}
                    disabled={courseData.learningObjectives.length <= 1}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                className="btn-add"
                onClick={() => addArrayItem('learningObjectives')}
              >
                <i className="fas fa-plus"></i> Add Learning Objective
              </button>
            </div>

            {/* Required Textbooks */}
            <div className="textbooks-section">
              <h4>Required Textbooks & Materials</h4>
              <p className="section-description">Essential reading materials for the course.</p>
              
              {courseData.requiredTextbooks.map((textbook, index) => (
                <div key={index} className="textbook-item">
                  <input
                    type="text"
                    value={textbook}
                    onChange={(e) => handleArrayInputChange('requiredTextbooks', index, e.target.value)}
                    placeholder="e.g., Introduction to Algorithms by Cormen et al."
                  />
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeArrayItem('requiredTextbooks', index)}
                    disabled={courseData.requiredTextbooks.length <= 1}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                className="btn-add"
                onClick={() => addArrayItem('requiredTextbooks')}
              >
                <i className="fas fa-plus"></i> Add Textbook
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Create */}
        {step === 4 && (
          <div className="form-step">
            <h3>Review & Create Course</h3>
            <p className="step-description">Review all details before creating the course.</p>

            <div className="review-section">
              {/* Basic Information Review */}
              <div className="review-card">
                <h4>Basic Information</h4>
                <div className="review-grid">
                  <div className="review-item">
                    <span className="review-label">Course Code:</span>
                    <span className="review-value">{courseData.code}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Course Name:</span>
                    <span className="review-value">{courseData.name}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Program:</span>
                    <span className="review-value">
                      {programs.find(p => p._id === courseData.program)?.code || 'N/A'}
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Semester:</span>
                    <span className="review-value">Semester {courseData.semester}</span>
                  </div>
                  <div className="review-item full-width">
                    <span className="review-label">Description:</span>
                    <span className="review-value description">{courseData.description}</span>
                  </div>
                </div>
              </div>

              {/* Course Details Review */}
              <div className="review-card">
                <h4>Course Details</h4>
                <div className="review-grid">
                  <div className="review-item">
                    <span className="review-label">Credit Hours:</span>
                    <span className="review-value">{courseData.creditHours}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Instructor:</span>
                    <span className="review-value">
                      {instructors.find(i => i._id === courseData.instructor)?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Schedule:</span>
                    <span className="review-value">{courseData.scheduleDetails}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Max Students:</span>
                    <span className="review-value">{courseData.maxStudents}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Course Type:</span>
                    <span className="review-value badge">{courseData.courseType}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Status:</span>
                    <span className={`review-value badge ${courseData.isActive ? 'active' : 'inactive'}`}>
                      {courseData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prerequisites Review */}
              <div className="review-card">
                <h4>Prerequisites</h4>
                {courseData.prerequisites.length > 0 ? (
                  <div className="prereqs-list">
                    {courseData.prerequisites.map(id => {
                      const prereq = prerequisites.find(p => p._id === id);
                      return prereq ? (
                        <span key={id} className="prereq-badge">
                          {prereq.code}
                        </span>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="no-data">No prerequisites required</p>
                )}
              </div>

              {/* Assessment Review */}
              <div className="review-card">
                <h4>Assessment Breakdown</h4>
                <div className="assessment-review">
                  {courseData.assessmentBreakdown.map((item, index) => (
                    <div key={index} className="assessment-review-item">
                      <span className="assessment-type">{item.type}</span>
                      <span className="assessment-weight">{item.weight}%</span>
                    </div>
                  ))}
                  <div className="assessment-total-review">
                    <strong>Total:</strong>
                    <span className="total-weight">
                      {courseData.assessmentBreakdown.reduce((sum, item) => sum + (parseInt(item.weight) || 0), 0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Learning Objectives Review */}
              <div className="review-card">
                <h4>Learning Objectives</h4>
                <ul className="objectives-list">
                  {courseData.learningObjectives.map((objective, index) => (
                    objective.trim() && (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i>
                        {objective}
                      </li>
                    )
                  ))}
                </ul>
              </div>

              {/* Textbooks Review */}
              <div className="review-card">
                <h4>Required Textbooks</h4>
                <ul className="textbooks-list">
                  {courseData.requiredTextbooks.map((textbook, index) => (
                    textbook.trim() && (
                      <li key={index}>
                        <i className="fas fa-book"></i>
                        {textbook}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {step > 1 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrevStep}
              disabled={loading}
            >
              <i className="fas fa-arrow-left"></i> Previous
            </button>
          )}
          
          {step < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNextStep}
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating Course...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i> Create Course
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* CSS Styles */}
      <style jsx>{`
        .create-course {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .create-course-header {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 25px;
        }

        .create-course-header h2 {
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .create-course-header p {
          color: #7f8c8d;
          margin: 0;
        }

        /* Step Indicator */
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 25px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #95a5a6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: #3498db;
          color: white;
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .step-label {
          font-size: 12px;
          color: #95a5a6;
          font-weight: 500;
          white-space: nowrap;
        }

        .step.active .step-label {
          color: #3498db;
          font-weight: 600;
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e9ecef;
          margin: 0 10px;
        }

        /* Messages */
        .success-message {
          background: #d5edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .success-message i {
          font-size: 20px;
          margin-top: 2px;
        }

        .success-message h4 {
          margin: 0 0 5px 0;
        }

        .success-message p {
          margin: 0;
          font-size: 14px;
        }

        .error-message {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .error-message i {
          font-size: 18px;
        }

        /* Form Styles */
        .course-form {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .form-step h3 {
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .step-description {
          color: #7f8c8d;
          margin: 0 0 25px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
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

        .form-group small {
          font-size: 12px;
          color: #95a5a6;
          margin-top: 5px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #e74c3c;
        }

        .error-text {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
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
          font-weight: normal;
        }

        /* Prerequisites Section */
        .prerequisites-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
        }

        .prerequisites-section h4 {
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .section-description {
          color: #7f8c8d;
          margin: 0 0 15px 0;
          font-size: 14px;
        }

        .prerequisites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 10px;
          margin-bottom: 15px;
        }

        .prerequisite-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .prerequisite-item:hover {
          background: #f0f7ff;
          border-color: #3498db;
        }

        .prerequisite-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .prerequisite-item label {
          display: flex;
          flex-direction: column;
          gap: 2px;
          cursor: pointer;
          margin: 0;
          flex: 1;
        }

        .prereq-code {
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .prereq-name {
          color: #7f8c8d;
          font-size: 12px;
        }

        .selected-prerequisites {
          padding: 10px;
          background: #e3f2fd;
          border-radius: 6px;
          font-size: 14px;
          color: #1976d2;
        }

        /* Assessment Section */
        .assessment-section,
        .objectives-section,
        .textbooks-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .error-message-inline {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 15px;
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 14px;
        }

        .assessment-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 15px;
        }

        .assessment-item {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .assessment-type {
          flex: 2;
        }

        .assessment-weight {
          flex: 1;
          position: relative;
        }

        .percent-sign {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        .assessment-weight input {
          padding-right: 30px;
        }

        .btn-remove {
          width: 36px;
          height: 36px;
          border: none;
          background: #e74c3c;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .btn-remove:hover:not(:disabled) {
          background: #c0392b;
        }

        .btn-remove:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-add {
          background: none;
          border: 2px dashed #ddd;
          color: #3498db;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
          margin-bottom: 15px;
        }

        .btn-add:hover {
          border-color: #3498db;
          background: #f0f7ff;
        }

        .assessment-total {
          text-align: right;
          font-size: 16px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
        }

        .total-value {
          font-size: 18px;
          font-weight: bold;
          margin-left: 10px;
        }

        .total-value.valid {
          color: #27ae60;
        }

        .total-value.invalid {
          color: #e74c3c;
        }

        /* Objectives & Textbooks */
        .objective-item,
        .textbook-item {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
        }

        .objective-input {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .objective-number {
          font-weight: 600;
          color: #3498db;
          min-width: 24px;
        }

        /* Review Section */
        .review-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .review-card h4 {
          color: #2c3e50;
          margin: 0 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .review-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .review-label {
          font-size: 12px;
          color: #7f8c8d;
          font-weight: 500;
        }

        .review-value {
          color: #2c3e50;
          font-weight: 500;
        }

        .review-value.description {
          font-weight: normal;
          line-height: 1.6;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge.active {
          background: #d5edda;
          color: #155724;
        }

        .badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .prereqs-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .prereq-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .no-data {
          color: #95a5a6;
          font-style: italic;
          margin: 0;
        }

        .assessment-review {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .assessment-review-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .assessment-review-item:last-child {
          border-bottom: none;
        }

        .assessment-total-review {
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 2px solid #ddd;
          font-size: 16px;
        }

        .total-weight {
          font-weight: bold;
          color: #2c3e50;
        }

        .objectives-list,
        .textbooks-list {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .objectives-list li,
        .textbooks-list li {
          color: #5d6d7e;
          line-height: 1.5;
        }

        .objectives-list i {
          color: #27ae60;
          margin-right: 10px;
        }

        .textbooks-list i {
          color: #3498db;
          margin-right: 10px;
        }

        /* Navigation Buttons */
        .form-navigation {
          display: flex;
          justify-content: space-between;
          padding-top: 25px;
          border-top: 1px solid #e9ecef;
          margin-top: 30px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .btn-primary {
          background: #3498db;
          color: white;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
        }

        .btn-secondary:hover {
          background: #7f8c8d;
        }

        .btn-success {
          background: #27ae60;
          color: white;
        }

        .btn-success:hover {
          background: #219653;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-grid,
          .review-grid {
            grid-template-columns: 1fr;
          }
          
          .step-indicator {
            flex-wrap: wrap;
            gap: 15px;
          }
          
          .step-connector {
            display: none;
          }
          
          .prerequisites-grid {
            grid-template-columns: 1fr;
          }
          
          .form-navigation {
            flex-direction: column;
            gap: 10px;
          }
          
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateCourse;