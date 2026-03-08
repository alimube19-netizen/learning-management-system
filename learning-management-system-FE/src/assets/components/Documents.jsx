import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthProvider";
import axios from "axios";

// Custom Document Card Component
const DocumentCard = ({ document, onView, onDownload, onDelete, onShare }) => {
  const getFileIcon = () => {
    const mime = document.mime_type?.toLowerCase() || "";
    if (mime.startsWith("image/")) return "🖼️";
    if (mime.includes("pdf")) return "📄";
    if (mime.includes("word") || mime.includes("document")) return "📝";
    if (mime.includes("spreadsheet") || mime.includes("excel")) return "📊";
    return "📁";
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card h-100 shadow-sm border-hover">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="file-icon-wrapper bg-primary bg-opacity-10 rounded p-2">
            <span style={{ fontSize: '24px' }}>{getFileIcon()}</span>
          </div>
          <div>
            <span className="badge bg-success me-1">Uploaded</span>
            {document.mime_type?.startsWith("image/") && (
              <span className="badge bg-info ms-1">Image</span>
            )}
          </div>
        </div>

        <h6 className="card-title fs-6 text-truncate" title={document.file_name}>
          {document.file_name}
        </h6>
        
        <div className="text-muted small mb-3">
          <div className="d-flex align-items-center gap-2 mb-1">
            <i className="bi bi-file-earmark-text"></i>
            <span>{document.document_type}</span>
          </div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <i className="bi bi-calendar"></i>
            <span>{formatDate(document.upload_date)}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-info-circle"></i>
            <span>{formatSize(document.file_size)}</span>
          </div>
        </div>

        {document.mime_type?.startsWith("image/") && (
          <div className="mb-3">
            <img
              src={`data:${document.mime_type};base64,${document.file_data}`}
              alt={document.file_name}
              className="img-fluid rounded cursor-pointer"
              onClick={() => onView(document)}
              style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
            />
          </div>
        )}

        <div className="mt-auto pt-3 border-top">
          <div className="btn-group w-100" role="group">
            <button
              className="btn btn-outline-primary rounded-start"
              onClick={() => onView(document)}
              title="Preview"
            >
              <i className="bi bi-eye"></i>
            </button>
            
            <button
              className="btn btn-outline-success"
              onClick={() => onDownload(document)}
              title="Download"
            >
              <i className="bi bi-download"></i>
            </button>
            
            <button
              className="btn btn-outline-info"
              onClick={() => onShare(document)}
              title="Share"
            >
              <i className="bi bi-share"></i>
            </button>
            
            <button
              className="btn btn-outline-danger rounded-end"
              onClick={() => onDelete(document)}
              title="Delete"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Document Preview Modal
const DocumentPreviewModal = ({ show, document, onHide }) => {
  const isImage = document?.mime_type?.startsWith("image/");
  const isPDF = document?.mime_type?.includes("pdf");

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-file-earmark-text me-2"></i>
              {document?.file_name}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body text-center">
            {isImage ? (
              <img
                src={`data:${document.mime_type};base64,${document.file_data}`}
                alt={document.file_name}
                className="img-fluid"
                style={{ maxHeight: '70vh' }}
              />
            ) : isPDF ? (
              <iframe
                src={`data:${document.mime_type};base64,${document.file_data}`}
                title={document.file_name}
                className="w-100"
                style={{ height: '70vh' }}
              />
            ) : (
              <div className="py-5">
                <i className="bi bi-file-earmark-text" style={{ fontSize: '64px' }}></i>
                <h5 className="mt-3">Preview not available</h5>
                <p className="text-muted">Download the file to view its contents</p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => window.open(`data:${document.mime_type};base64,${document.file_data}`, '_blank')}
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Documents Component
const Documents = () => {
  const { token } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/Documents/all",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setDocuments(response.data.documents || []);
      }
    } catch (err) {
      setError("Failed to load documents. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...documents];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doc => 
        doc.document_type?.toLowerCase().includes(term) ||
        doc.file_name?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter(doc => 
        doc.mime_type?.toLowerCase().includes(filterType)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch(sortBy) {
        case "name":
          return (a.file_name || "").localeCompare(b.file_name || "");
        case "size":
          return (b.file_size || 0) - (a.file_size || 0);
        case "type":
          return (a.document_type || "").localeCompare(b.document_type || "");
        case "date":
        default:
          return new Date(b.upload_date || 0) - new Date(a.upload_date || 0);
      }
    });

    return result;
  }, [documents, searchTerm, filterType, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedDocuments.length / pageSize);
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedDocuments.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedDocuments, currentPage, pageSize]);

  // Document operations
  const handleView = (doc) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };

  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = `data:${doc.mime_type};base64,${doc.file_data}`;
    link.download = doc.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`Are you sure you want to delete "${doc.file_name}"?`)) {
      try {
        // API call to delete document
        await axios.delete(`http://localhost:5000/api/Documents/${doc.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
        showToastMessage("Document deleted successfully");
      } catch (err) {
        setError("Failed to delete document");
        console.error(err);
      }
    }
  };

  const handleShare = (doc) => {
    if (navigator.share) {
      navigator.share({
        title: doc.file_name,
        text: `Check out this document: ${doc.document_type}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(doc.file_name);
      showToastMessage("Document name copied to clipboard!");
    }
  };

  const handleBulkDownload = () => {
    paginatedDocuments.forEach((doc, index) => {
      setTimeout(() => handleDownload(doc), index * 500);
    });
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-warning text-center py-5">
              <i className="bi bi-exclamation-triangle" style={{ fontSize: '48px' }}></i>
              <h4 className="mt-3">Authentication Required</h4>
              <p>Please log in to view your documents</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Toast Notification */}
      {showToast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show" role="alert">
            <div className="toast-header bg-success text-white">
              <i className="bi bi-check-circle me-2"></i>
              <strong className="me-auto">Success</strong>
              <button 
                type="button" 
                className="btn-close btn-close-white"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body">
              {toastMessage}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h2 className="mb-1">
            <i className="bi bi-file-earmark-text me-2"></i>
            My Documents
          </h2>
          <p className="text-muted mb-0">
            {filteredAndSortedDocuments.length} document{filteredAndSortedDocuments.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary"
              onClick={fetchDocuments}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <i className="bi bi-arrow-clockwise me-2"></i>
              )}
              Refresh
            </button>
            {paginatedDocuments.length > 0 && (
              <button 
                className="btn btn-success"
                onClick={handleBulkDownload}
                title="Download all visible documents"
              >
                <i className="bi bi-download me-2"></i>
                Download All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-filter"></i>
                </span>
                <select
                  className="form-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="pdf">PDFs</option>
                  <option value="word">Word Docs</option>
                  <option value="spreadsheet">Spreadsheets</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-sort-alpha-down"></i>
                </span>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Newest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="size">Size (Largest)</option>
                  <option value="type">Type (A-Z)</option>
                </select>
              </div>
            </div>
            
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Grid
                </button>
                <button
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  List
                </button>
              </div>
              
              <div className="d-flex align-items-center gap-2">
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="bi bi-chevron-down me-2"></i>
                    Actions
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={() => window.print()}>Print List</button></li>
                    <li><button className="dropdown-item" onClick={() => navigator.clipboard.writeText(
                      paginatedDocuments.map(d => d.file_name).join('\n')
                    )}>Copy File Names</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger"
                        onClick={() => {
                          if (window.confirm("Delete all visible documents?")) {
                            // Implement bulk delete
                          }
                        }}
                      >
                        Delete All Visible
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      {/* Documents Display */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading documents...</p>
        </div>
      ) : paginatedDocuments.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="bi bi-file-earmark-text text-muted" style={{ fontSize: '64px' }}></i>
            <h4 className="mt-3">No documents found</h4>
            <p className="text-muted">
              {searchTerm || filterType !== 'all' 
                ? 'Try changing your search or filter settings'
                : 'No documents available'
              }
            </p>
            {searchTerm || filterType !== 'all' ? (
              <button 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Clear Filters
              </button>
            ) : null}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
            {paginatedDocuments.map((doc) => (
              <div className="col" key={doc.id}>
                <DocumentCard
                  document={doc}
                  onView={handleView}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Page navigation" className="d-flex justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(1)}>
                    <i className="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        // List View
        <div className="card mb-4">
          <div className="list-group list-group-flush">
            {paginatedDocuments.map((doc) => (
              <div className="list-group-item" key={doc.id}>
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div className="file-icon-wrapper bg-primary bg-opacity-10 rounded p-2">
                      <span style={{ fontSize: '20px' }}>
                        {doc.mime_type?.startsWith("image/") ? "🖼️" : "📄"}
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">{doc.file_name}</h6>
                        <small className="text-muted">
                          {doc.document_type} • {new Date(doc.upload_date).toLocaleDateString()} • 
                          {(doc.file_size / 1024).toFixed(1)} KB
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleView(doc)}>
                          <i className="bi bi-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleDownload(doc)}>
                          <i className="bi bi-download"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(doc)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {documents.length > 0 && (
        <div className="accordion mt-4" id="documentStats">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#statsCollapse"
              >
                <i className="bi bi-info-circle me-2"></i>
                Document Statistics
              </button>
            </h2>
            <div id="statsCollapse" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-3 text-center mb-3">
                    <div className="display-6">{documents.length}</div>
                    <small className="text-muted">Total Documents</small>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="display-6">
                      {(documents.reduce((acc, doc) => acc + (doc.file_size || 0), 0) / (1024 * 1024)).toFixed(1)} MB
                    </div>
                    <small className="text-muted">Total Size</small>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="display-6">
                      {documents.filter(d => d.mime_type?.startsWith('image/')).length}
                    </div>
                    <small className="text-muted">Images</small>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="display-6">
                      {documents.filter(d => d.mime_type?.includes('pdf')).length}
                    </div>
                    <small className="text-muted">PDF Files</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <DocumentPreviewModal
        show={showPreview}
        document={selectedDocument}
        onHide={() => setShowPreview(false)}
      />
    </div>
  );
};

export default Documents;