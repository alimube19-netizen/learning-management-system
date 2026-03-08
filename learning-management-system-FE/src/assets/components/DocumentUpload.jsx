import React, { useState, useRef } from 'react';
import axios from 'axios';

const DocumentUpload = ({ studentId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('pdf');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Supported file types and their icons
  const documentTypes = [
    { value: 'pdf', label: 'PDF Document', icon: 'fa-file-pdf' },
    { value: 'image', label: 'Image (JPG, PNG, GIF)', icon: 'fa-file-image' },
    { value: 'word', label: 'Word Document', icon: 'fa-file-word' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: 'fa-file-excel' },
    { value: 'ppt', label: 'Presentation', icon: 'fa-file-powerpoint' },
    { value: 'video', label: 'Video', icon: 'fa-file-video' },
    { value: 'audio', label: 'Audio', icon: 'fa-file-audio' },
    { value: 'text', label: 'Text File', icon: 'fa-file-alt' },
    { value: 'archive', label: 'Archive (ZIP, RAR)', icon: 'fa-file-archive' },
    { value: 'code', label: 'Code File', icon: 'fa-file-code' },
  ];

  // File size limit (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess('');

    if (!selectedFile) {
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
      return;
    }

    // Auto-detect document type based on file extension
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    const detectedType = detectDocumentType(fileExtension);
    setDocumentType(detectedType);

    // Auto-suggest document name
    if (!documentName) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setDocumentName(nameWithoutExt);
    }

    setFile(selectedFile);
  };

  const detectDocumentType = (extension) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const pdfExtensions = ['pdf'];
    const wordExtensions = ['doc', 'docx'];
    const excelExtensions = ['xls', 'xlsx', 'csv'];
    const pptExtensions = ['ppt', 'pptx'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
    const audioExtensions = ['mp3', 'wav', 'aac', 'ogg'];
    const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
    const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php', 'json', 'xml'];

    if (imageExtensions.includes(extension)) return 'image';
    if (pdfExtensions.includes(extension)) return 'pdf';
    if (wordExtensions.includes(extension)) return 'word';
    if (excelExtensions.includes(extension)) return 'excel';
    if (pptExtensions.includes(extension)) return 'ppt';
    if (videoExtensions.includes(extension)) return 'video';
    if (audioExtensions.includes(extension)) return 'audio';
    if (archiveExtensions.includes(extension)) return 'archive';
    if (codeExtensions.includes(extension)) return 'code';
    
    return 'text';
  };

  const getFileIcon = (type) => {
    const typeObj = documentTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : 'fa-file';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentName', documentName);
    formData.append('documentType', documentType);
    formData.append('studentId', studentId);

    try {
      setUploading(true);
      setError('');
      setProgress(0);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/documents/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      setSuccess('Document uploaded successfully!');
      setFile(null);
      setDocumentName('');
      setProgress(0);
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data.document);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to upload document. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setDocumentName('');
    setError('');
    setSuccess('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="document-upload-container">
      <div className="shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="fas fa-cloud-upload-alt me-2"></i>
            Upload Document
          </h4>
        </div>
        
        <div className="card-body">
          {/* Success Message */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          {/* File Drop Zone */}
          <div
            className={`file-drop-zone ${file ? 'file-selected' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="d-none"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.mp4,.mp3"
            />
            
            {file ? (
              <div className="file-preview">
                <div className="file-icon">
                  <i className={`fas ${getFileIcon(documentType)} fa-4x text-primary`}></i>
                </div>
                <div className="file-info">
                  <h6 className="file-name">{file.name}</h6>
                  <p className="file-size text-muted mb-1">
                    Size: {formatFileSize(file.size)}
                  </p>
                  <p className="file-type mb-0">
                    <span className="badge bg-info">
                      <i className={`fas ${getFileIcon(documentType)} me-1`}></i>
                      {documentType.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="file-drop-content">
                <i className="fas fa-cloud-upload-alt fa-4x text-muted mb-3"></i>
                <h5>Drag & Drop your file here</h5>
                <p className="text-muted">or click to browse</p>
                <p className="text-muted small mt-2">
                  Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                </p>
                <div className="supported-formats">
                  <small className="text-muted">
                    Supported: PDF, Images, Word, Excel, PowerPoint, Video, Audio, Archives
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-3">
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {progress}%
                </div>
              </div>
              <small className="text-muted d-block mt-1 text-center">
                Uploading... Please wait
              </small>
            </div>
          )}

          {/* Document Name Input */}
          <div className="form-group mt-3">
            <label htmlFor="documentName" className="form-label">
              <i className="fas fa-file-signature me-2"></i>
              Document Name
            </label>
            <input
              type="text"
              id="documentName"
              className="form-control"
              placeholder="Enter document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              disabled={uploading}
            />
            <small className="form-text text-muted">
              Give a meaningful name to your document
            </small>
          </div>

          {/* Document Type Selection */}
          <div className="form-group mt-3">
            <label htmlFor="documentType" className="form-label">
              <i className="fas fa-file-alt me-2"></i>
              Document Type
            </label>
            <select
              id="documentType"
              className="form-select"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              disabled={uploading}
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  <i className={`fas ${type.icon} me-2`}></i>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}
              disabled={uploading || !file}
            >
              <i className="fas fa-times me-2"></i>
              Cancel
            </button>
            
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading || !file}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-2"></i>
                  Upload Document
                </>
              )}
            </button>
          </div>

          {/* Student Info */}
          <div className="mt-3 pt-3 border-top">
            <small className="text-muted">
              <i className="fas fa-user-graduate me-1"></i>
              Student ID: <strong>{studentId}</strong>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;