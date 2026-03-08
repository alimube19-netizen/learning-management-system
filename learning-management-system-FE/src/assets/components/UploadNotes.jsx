// UploadNotes.jsx
import React, { useState } from 'react';

const UploadNotes = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    category: 'notes',
    tags: '',
    accessLevel: 'all'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const validFiles = files.filter(file => 
      allowedTypes.includes(file.type) ||
      file.name.match(/\.(pdf|doc|docx|txt|ppt|pptx|xls|xlsx)$/i)
    );
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf':
        return 'bi-file-earmark-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'bi-file-earmark-word text-primary';
      case 'ppt':
      case 'pptx':
        return 'bi-file-earmark-ppt text-warning';
      case 'xls':
      case 'xlsx':
        return 'bi-file-earmark-excel text-success';
      case 'txt':
        return 'bi-file-earmark-text text-secondary';
      default:
        return 'bi-file-earmark text-muted';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to upload');
      return;
    }
    
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newDocuments = selectedFiles.map((file, index) => ({
        id: Date.now() + index,
        title: formData.title || file.name.replace(/\.[^/.]+$/, ""),
        description: formData.description,
        filename: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        courseId: formData.courseId,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        accessLevel: formData.accessLevel,
        uploadDate: new Date().toISOString(),
        downloads: 0,
        version: '1.0'
      }));
      
      setDocuments(prev => [...prev, ...newDocuments]);
      setSelectedFiles([]);
      setFormData({
        title: '',
        description: '',
        courseId: '',
        category: 'notes',
        tags: '',
        accessLevel: 'all'
      });
      setUploading(false);
    }, 1500);
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const downloadDocument = (id) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      // In real app, this would trigger actual download
      alert(`Downloading: ${doc.filename}`);
    }
  };

  const [filterCategory, setFilterCategory] = useState('all');

  const filteredDocuments = filterCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === filterCategory);

  return (
    <div className="container-fluid upload-notes py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-3">Upload Notes & Documents</h1>
          <p className="text-muted mb-4">
            Upload study materials, lecture notes, and course documents
          </p>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Upload Form */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-file-earmark-plus me-2"></i>
                Upload Documents
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Document Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Optional - defaults to filename"
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
                    placeholder="Describe the document content"
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
                      placeholder="e.g., MATH101"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="notes">Lecture Notes</option>
                      <option value="slides">Presentation Slides</option>
                      <option value="assignment">Assignment</option>
                      <option value="syllabus">Syllabus</option>
                      <option value="reference">Reference Material</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., chapter1, quiz, important"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Access Level</label>
                    <select
                      className="form-select"
                      name="accessLevel"
                      value={formData.accessLevel}
                      onChange={handleInputChange}
                    >
                      <option value="all">All Students</option>
                      <option value="registered">Registered Students Only</option>
                      <option value="premium">Premium Students Only</option>
                    </select>
                  </div>
                </div>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="form-label">Select Files *</label>
                  <div className="border rounded p-4 text-center bg-light">
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                    <small className="d-block text-muted mt-2">
                      Supported: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT
                    </small>
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3">
                      <h6>Selected Files ({selectedFiles.length})</h6>
                      <div className="list-group">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <i className={`bi ${getFileIcon(file.name)} me-2`}></i>
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

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={uploading || selectedFiles.length === 0}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Uploading Documents...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up me-2"></i>
                      Upload {selectedFiles.length} Document(s)
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Categories Summary */}
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h6 className="card-title mb-3">Documents by Category</h6>
              <div className="categories-list">
                {['notes', 'slides', 'assignment', 'syllabus', 'reference', 'other'].map(category => {
                  const count = documents.filter(d => d.category === category).length;
                  if (count === 0) return null;
                  
                  return (
                    <div key={category} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-capitalize">{category}</span>
                      <span className="badge bg-secondary">{count}</span>
                    </div>
                  );
                })}
                {documents.length === 0 && (
                  <small className="text-muted">No documents uploaded yet</small>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Documents List */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-0">Uploaded Documents</h5>
                <div className="d-flex gap-2 mt-2 mt-sm-0">
                  <select
                    className="form-select form-select-sm"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="all">All Categories</option>
                    <option value="notes">Lecture Notes</option>
                    <option value="slides">Slides</option>
                    <option value="assignment">Assignments</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="reference">Reference</option>
                    <option value="other">Other</option>
                  </select>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setDocuments([])}
                    disabled={documents.length === 0}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {filteredDocuments.length > 0 ? (
                <div className="documents-list">
                  {filteredDocuments.map(doc => (
                    <div key={doc.id} className="document-item card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1 me-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className={`bi ${getFileIcon(doc.filename)} me-2`}></i>
                              <h6 className="mb-0">{doc.title}</h6>
                              <span className="badge ms-2 bg-info">{doc.category}</span>
                              <span className={`badge ms-2 bg-${doc.accessLevel === 'all' ? 'success' : 'warning'}`}>
                                {doc.accessLevel}
                              </span>
                            </div>
                            
                            <small className="text-muted d-block">
                              <i className="bi bi-file-earmark me-1"></i>
                              {doc.filename} • {doc.size}
                            </small>
                            
                            {doc.description && (
                              <small className="d-block mt-2">{doc.description}</small>
                            )}
                            
                            {doc.tags.length > 0 && (
                              <div className="mt-2">
                                {doc.tags.map((tag, index) => (
                                  <span key={index} className="badge bg-light text-dark me-1 mb-1">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                              </small>
                              <small className="text-muted">
                                <i className="bi bi-download me-1"></i>
                                {doc.downloads} downloads
                              </small>
                            </div>
                          </div>
                          
                          <div className="btn-group btn-group-sm flex-shrink-0">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => downloadDocument(doc.id)}
                              title="Download"
                            >
                              <i className="bi bi-download"></i>
                            </button>
                            <button
                              className="btn btn-outline-warning"
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => deleteDocument(doc.id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-folder text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">No Documents Found</h5>
                  <p className="text-muted">
                    {filterCategory === 'all' 
                      ? 'Upload your first document using the form on the left.'
                      : `No ${filterCategory} documents found.`}
                  </p>
                </div>
              )}
            </div>

            <div className="card-footer bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {filteredDocuments.length} of {documents.length} documents
                </small>
                <small className="text-muted">
                  Total size: {formatFileSize(
                    documents.reduce((total, doc) => {
                      const size = parseInt(doc.size);
                      return total + (isNaN(size) ? 0 : size);
                    }, 0)
                  )}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;