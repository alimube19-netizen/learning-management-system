import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    totalMarks: 100,
    submissionType: 'file',
    allowedFileTypes: ['pdf', 'doc', 'docx'],
    maxFileSize: 10, // in MB
    instructions: '',
    isPublished: true
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Mock data - replace with API call
      const mockCourses = [
        { _id: '1', code: 'CS101', title: 'Introduction to Programming' },
        { _id: '2', code: 'MATH201', title: 'Calculus II' },
        { _id: '3', code: 'PHY101', title: 'Physics Fundamentals' },
        { _id: '4', code: 'ENG101', title: 'English Composition' },
        { _id: '5', code: 'BIO101', title: 'Biology Basics' },
      ];
      
      // Uncomment for API call:
      // const token = localStorage.getItem('adminToken');
      // const response = await axios.get('/api/admin/courses', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setCourses(response.data);
      
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setErrorMessage('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileTypeChange = (e) => {
    const { value, checked } = e.target;
    let updatedFileTypes;
    
    if (checked) {
      updatedFileTypes = [...formData.allowedFileTypes, value];
    } else {
      updatedFileTypes = formData.allowedFileTypes.filter(type => type !== value);
    }
    
    setFormData(prev => ({
      ...prev,
      allowedFileTypes: updatedFileTypes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Assignment title is required');
      setSubmitting(false);
      return;
    }

    if (!formData.courseId) {
      setErrorMessage('Please select a course');
      setSubmitting(false);
      return;
    }

    if (!formData.dueDate) {
      setErrorMessage('Due date is required');
      setSubmitting(false);
      return;
    }

    // Check if due date is in the future
    const dueDate = new Date(formData.dueDate);
    const now = new Date();
    if (dueDate <= now) {
      setErrorMessage('Due date must be in the future');
      setSubmitting(false);
      return;
    }

    try {
      // API call to create assignment
      const token = localStorage.getItem('adminToken');
      
      // Mock API response - replace with actual API call
      console.log('Submitting assignment:', formData);
      
      // Uncomment for actual API call:
      // const response = await axios.post('/api/admin/assignments', formData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSuccessMessage('Assignment created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        courseId: '',
        dueDate: '',
        totalMarks: 100,
        submissionType: 'file',
        allowedFileTypes: ['pdf', 'doc', 'docx'],
        maxFileSize: 10,
        instructions: '',
        isPublished: true
      });
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error('Error creating assignment:', error);
      setErrorMessage('Failed to create assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      courseId: '',
      dueDate: '',
      totalMarks: 100,
      submissionType: 'file',
      allowedFileTypes: ['pdf', 'doc', 'docx'],
      maxFileSize: 10,
      instructions: '',
      isPublished: true
    });
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Create Assignment</h2>
          <p className="text-muted mb-0">Create a new assignment for students</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div className="mb-4">
                  <h5 className="card-title mb-3">
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    Basic Information
                  </h5>
                  
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Assignment Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter assignment title"
                      required
                    />
                    <div className="form-text">
                      Give your assignment a clear, descriptive title
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Provide assignment description and objectives"
                    ></textarea>
                    <div className="form-text">
                      Optional: Describe what students need to accomplish
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="courseId" className="form-label">
                        Course <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="courseId"
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                          <option key={course._id} value={course._id}>
                            {course.code} - {course.title}
                          </option>
                        ))}
                      </select>
                      {loading && (
                        <div className="form-text">
                          <i className="fas fa-spinner fa-spin me-1"></i>
                          Loading courses...
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="totalMarks" className="form-label">
                        Total Marks
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="totalMarks"
                        name="totalMarks"
                        min="1"
                        max="1000"
                        value={formData.totalMarks}
                        onChange={handleInputChange}
                      />
                      <div className="form-text">Maximum marks for this assignment</div>
                    </div>
                  </div>
                </div>

                {/* Submission Details Section */}
                <div className="mb-4">
                  <h5 className="card-title mb-3">
                    <i className="fas fa-upload me-2 text-primary"></i>
                    Submission Details
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="dueDate" className="form-label">
                        Due Date & Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="form-text">
                        Set deadline for assignment submission
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="submissionType" className="form-label">
                        Submission Type
                      </label>
                      <select
                        className="form-select"
                        id="submissionType"
                        name="submissionType"
                        value={formData.submissionType}
                        onChange={handleInputChange}
                      >
                        <option value="file">File Upload</option>
                        <option value="text">Text Entry</option>
                        <option value="both">Both File and Text</option>
                      </select>
                      <div className="form-text">
                        Choose how students will submit their work
                      </div>
                    </div>
                  </div>

                  {/* File Upload Settings (Conditional) */}
                  {(formData.submissionType === 'file' || formData.submissionType === 'both') && (
                    <div className="border rounded p-3 mb-3">
                      <h6 className="mb-3">File Upload Settings</h6>
                      
                      <div className="mb-3">
                        <label className="form-label">Allowed File Types</label>
                        <div className="d-flex flex-wrap gap-3">
                          {['pdf', 'doc', 'docx', 'txt', 'zip', 'jpg', 'png'].map(type => (
                            <div key={type} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`fileType-${type}`}
                                value={type}
                                checked={formData.allowedFileTypes.includes(type)}
                                onChange={handleFileTypeChange}
                              />
                              <label className="form-check-label" htmlFor={`fileType-${type}`}>
                                .{type.toUpperCase()}
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="form-text">
                          Select file types students can upload
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="maxFileSize" className="form-label">
                          Maximum File Size (MB)
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          id="maxFileSize"
                          name="maxFileSize"
                          min="1"
                          max="50"
                          step="1"
                          value={formData.maxFileSize}
                          onChange={handleInputChange}
                        />
                        <div className="d-flex justify-content-between">
                          <small>1 MB</small>
                          <span className="fw-medium">{formData.maxFileSize} MB</span>
                          <small>50 MB</small>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="instructions" className="form-label">
                      Additional Instructions
                    </label>
                    <textarea
                      className="form-control"
                      id="instructions"
                      name="instructions"
                      rows="4"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      placeholder="Provide any special instructions, grading criteria, or submission guidelines..."
                    ></textarea>
                    <div className="form-text">
                      This will be displayed to students along with the assignment
                    </div>
                  </div>
                </div>

                {/* Publish Settings */}
                <div className="mb-4">
                  <h5 className="card-title mb-3">
                    <i className="fas fa-cog me-2 text-primary"></i>
                    Publish Settings
                  </h5>
                  
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isPublished"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isPublished">
                      Publish immediately
                    </label>
                    <div className="form-text">
                      If checked, assignment will be visible to students right away
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleReset}
                    disabled={submitting}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus-circle me-2"></i>
                        Create Assignment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar with Help/Info */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-lightbulb me-2 text-warning"></i>
                Tips for Creating Assignments
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  Use clear and descriptive titles
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  Set realistic due dates
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  Specify allowed file formats
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  Include detailed instructions
                </li>
                <li>
                  <i className="fas fa-check text-success me-2"></i>
                  Preview before publishing
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-history me-2 text-info"></i>
                Quick Stats
              </h5>
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="bg-light rounded p-3">
                    <h3 className="text-primary mb-1">12</h3>
                    <small className="text-muted">Active Courses</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="bg-light rounded p-3">
                    <h3 className="text-success mb-1">45</h3>
                    <small className="text-muted">Total Assignments</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="bg-light rounded p-3">
                    <p className="mb-1 small text-muted">Last created assignment:</p>
                    <p className="mb-0 fw-medium">"Web Development Project"</p>
                    <small className="text-muted">2 days ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;