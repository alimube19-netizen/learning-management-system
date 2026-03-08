// UploadLectures.jsx
import React, { useState } from 'react';

const UploadLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    week: '1',
    topic: '',
    instructor: '',
    visibility: 'public'
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const videoFiles = files.filter(file => 
      file.type.startsWith('video/') || 
      file.name.match(/\.(mp4|avi|mov|wmv|flv|mkv|webm)$/i)
    );
    
    setSelectedFiles(prev => [...prev, ...videoFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Add uploaded lectures to list
          const newLectures = selectedFiles.map((file, index) => ({
            id: Date.now() + index,
            title: formData.title || file.name,
            description: formData.description,
            filename: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            courseId: formData.courseId,
            week: formData.week,
            topic: formData.topic,
            instructor: formData.instructor,
            visibility: formData.visibility,
            uploadDate: new Date().toISOString(),
            duration: '--:--',
            views: 0
          }));
          
          setLectures(prev => [...prev, ...newLectures]);
          setUploading(false);
          setSelectedFiles([]);
          setFormData({
            title: '',
            description: '',
            courseId: '',
            week: '1',
            topic: '',
            instructor: '',
            visibility: 'public'
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select at least one lecture file to upload');
      return;
    }
    
    simulateUpload();
  };

  const deleteLecture = (id) => {
    setLectures(prev => prev.filter(lecture => lecture.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container-fluid upload-lectures py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-3">Upload Lectures</h1>
          <p className="text-muted mb-4">
            Upload video lectures and course materials for students
          </p>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Upload Form */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-camera-video me-2"></i>
                Upload New Lectures
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Lecture Details */}
                <div className="mb-3">
                  <label className="form-label">Lecture Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter lecture title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Brief description of the lecture"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Course ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      placeholder="e.g., CS101"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Week Number</label>
                    <select
                      className="form-select"
                      name="week"
                      value={formData.week}
                      onChange={handleInputChange}
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(num => (
                        <option key={num} value={num}>Week {num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Topic</label>
                    <input
                      type="text"
                      className="form-control"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to React"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Instructor</label>
                    <input
                      type="text"
                      className="form-control"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      placeholder="Instructor name"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Visibility</label>
                  <select
                    className="form-select"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                  >
                    <option value="public">Public (All Students)</option>
                    <option value="private">Private (Selected Students)</option>
                    <option value="draft">Draft (Not Published)</option>
                  </select>
                </div>

                {/* File Upload Section */}
                <div className="mb-4">
                  <label className="form-label">Select Lecture Files *</label>
                  <div className="border rounded p-4 text-center bg-light">
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="video/*,.mp4,.avi,.mov,.wmv,.flv,.mkv,.webm"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                    <small className="d-block text-muted mt-2">
                      Supported formats: MP4, AVI, MOV, WMV, FLV, MKV, WebM
                    </small>
                  </div>

                  {/* Selected Files List */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3">
                      <h6>Selected Files ({selectedFiles.length})</h6>
                      <div className="list-group">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <i className="bi bi-file-earmark-play text-primary me-2"></i>
                              {file.name} ({formatFileSize(file.size)})
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile(index)}
                              disabled={uploading}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Uploading...</small>
                      <small>{uploadProgress}%</small>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={uploading || selectedFiles.length === 0}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Uploading Lectures...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload {selectedFiles.length} Lecture(s)
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h6 className="card-title mb-3">Upload Statistics</h6>
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-primary">{lectures.length}</div>
                    <small className="text-muted">Total Lectures</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-success">
                      {lectures.filter(l => l.visibility === 'public').length}
                    </div>
                    <small className="text-muted">Public</small>
                  </div>
                </div>
                <div className="col-12">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Max file size: 2GB per lecture
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Uploaded Lectures List */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Uploaded Lectures</h5>
              <span className="badge bg-primary">{lectures.length} lectures</span>
            </div>
            
            <div className="card-body">
              {lectures.length > 0 ? (
                <div className="lectures-list">
                  {lectures.map(lecture => (
                    <div key={lecture.id} className="lecture-item card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-camera-video text-primary me-2"></i>
                              <h6 className="mb-0">{lecture.title}</h6>
                              <span className={`badge ms-2 bg-${lecture.visibility === 'public' ? 'success' : 'warning'}`}>
                                {lecture.visibility}
                              </span>
                            </div>
                            
                            <div className="row">
                              <div className="col-md-6">
                                <small className="text-muted d-block">
                                  <i className="bi bi-file-earmark me-1"></i>
                                  {lecture.filename}
                                </small>
                                <small className="text-muted d-block">
                                  <i className="bi bi-calendar me-1"></i>
                                  {new Date(lecture.uploadDate).toLocaleDateString()}
                                </small>
                              </div>
                              <div className="col-md-6">
                                <small className="text-muted d-block">
                                  <i className="bi bi-clock me-1"></i>
                                  Week {lecture.week}
                                </small>
                                <small className="text-muted d-block">
                                  <i className="bi bi-person me-1"></i>
                                  {lecture.instructor || 'Not specified'}
                                </small>
                              </div>
                            </div>
                            
                            {lecture.description && (
                              <small className="d-block mt-2">{lecture.description}</small>
                            )}
                          </div>
                          
                          <div className="dropdown">
                            <button 
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="bi bi-three-dots"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button className="dropdown-item">
                                  <i className="bi bi-eye me-2"></i>
                                  Preview
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item">
                                  <i className="bi bi-pencil me-2"></i>
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger"
                                  onClick={() => deleteLecture(lecture.id)}
                                >
                                  <i className="bi bi-trash me-2"></i>
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className="text-muted">{lecture.size}</small>
                          <div>
                            <small className="text-muted me-3">
                              <i className="bi bi-play-circle me-1"></i>
                              {lecture.views} views
                            </small>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {lecture.duration}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-camera-video text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">No Lectures Uploaded</h5>
                  <p className="text-muted">Upload your first lecture using the form on the left.</p>
                </div>
              )}
            </div>
            
            <div className="card-footer bg-white">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Lectures are automatically organized by week and course
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadLectures;