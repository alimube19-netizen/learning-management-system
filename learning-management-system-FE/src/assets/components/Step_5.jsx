import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";

const Step_5 = () => {
  const { setDocuments } = useContext(AuthContext);

  const [files, setFiles] = useState({
    photo: null,
    cnic: null,
    domicile: null,
    matricCert: null,
    interCert: null,
    bachelorMasterDegree: null,
    feeReceipt: null,
    characterCert: null,
    entryTestSlip: null,
    equivalenceCert: null,
  });

  const handleFileChange = (e) => {
    const updatedFiles = { ...files, [e.target.name]: e.target.files[0] };
    setFiles(updatedFiles);
    console.log(updatedFiles)
    setDocuments(updatedFiles);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-xl-10">
          {/* Header Section - Consistent with other components */}
          <div className="text-center mb-5">
            <h3 className="fw-bold text-primary mb-2">Document Upload</h3>
            <p className="text-muted">Upload all required documents</p>
            <div className="progress mb-4" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-warning" 
                style={{ width: '95%' }}
                role="progressbar"
              ></div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h4 className="mb-4 fw-semibold text-primary">
                <i className="fas fa-file-upload me-2"></i>
                Upload Required Documents
              </h4>

              <div className="row gy-4">
                {[
                  { 
                    label: "Passport-size Photo", 
                    name: "photo", 
                    accept: "image/*", 
                    required: true,
                    description: "Recent color photograph with white background"
                  },
                  { 
                    label: "CNIC / B-Form Copy", 
                    name: "cnic", 
                    accept: ".pdf,.jpg,.png", 
                    required: true,
                    description: "Clear copy of your CNIC or B-Form"
                  },
                  { 
                    label: "Domicile Certificate", 
                    name: "domicile", 
                    accept: ".pdf,.jpg,.png", 
                    required: false,
                    description: "Issued by competent authority"
                  },
                  { 
                    label: "Matric Certificate", 
                    name: "matricCert", 
                    accept: ".pdf,.jpg,.png", 
                    required: true,
                    description: "SSC/O-Levels certificate and marksheet"
                  },
                  { 
                    label: "Intermediate Certificate", 
                    name: "interCert", 
                    accept: ".pdf,.jpg,.png", 
                    required: true,
                    description: "HSSC/A-Levels certificate and marksheet"
                  },
                  {
                    label: "Bachelor's / Master's Degree",
                    name: "bachelorMasterDegree", 
                    accept: ".pdf,.jpg,.png",
                    required: false,
                    description: "For graduate programs (if applicable)"
                  },
                  { 
                    label: "Character Certificate", 
                    name: "characterCert", 
                    accept: ".pdf,.jpg,.png", 
                    required: false,
                    description: "From last institution attended"
                  },
                ].map((doc) => (
                  <div className="col-12 col-md-6" key={doc.name}>
                    <div className="document-upload-card border rounded p-3 h-100">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <label className="fw-semibold mb-1">
                          {doc.label} 
                          {doc.required && <span className="text-danger ms-1">*</span>}
                        </label>
                        {files[doc.name] && (
                          <span className="badge bg-success">
                            <i className="fas fa-check me-1"></i>
                            Uploaded
                          </span>
                        )}
                      </div>
                      
                      <p className="text-muted small mb-3">{doc.description}</p>
                      
                      <div className="input-group">
                        <input
                          type="file"
                          name={doc.name}
                          accept={doc.accept}
                          onChange={handleFileChange}
                          className="form-control"
                          id={doc.name}
                          required={doc.required}
                        />
                      </div>
                      
                      {files[doc.name] && (
                        <div className="mt-2">
                          <small className="text-success">
                            <i className="fas fa-file me-1"></i>
                            {files[doc.name].name}
                          </small>
                          <small className="text-muted d-block">
                            Size: {(files[doc.name].size / 1024 / 1024).toFixed(2)} MB
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* File Requirements */}
              <div className="mt-5 pt-4 border-top">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-3">
                      <i className="fas fa-info-circle me-2 text-info"></i>
                      File Requirements
                    </h6>
                    <ul className="list-unstyled text-muted small">
                      <li className="mb-1">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        Supported formats: JPG, PNG, PDF
                      </li>
                      <li className="mb-1">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        Max file size: 2MB per document
                      </li>
                      <li className="mb-1">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        Clear and readable scans only
                      </li>
                      <li>
                        <i className="fas fa-check-circle text-success me-2"></i>
                        All required documents must be uploaded
                      </li>
                    </ul>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-3">
                      <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                      Important Notes
                    </h6>
                    <ul className="list-unstyled text-muted small">
                      <li className="mb-1">
                        <i className="fas fa-circle me-2" style={{ fontSize: '6px' }}></i>
                        Ensure documents are valid and not expired
                      </li>
                      <li className="mb-1">
                        <i className="fas fa-circle me-2" style={{ fontSize: '6px' }}></i>
                        Photograph must be taken within last 6 months
                      </li>
                      <li className="mb-1">
                        <i className="fas fa-circle me-2" style={{ fontSize: '6px' }}></i>
                        All certificates must be attested if required
                      </li>
                      <li>
                        <i className="fas fa-circle me-2" style={{ fontSize: '6px' }}></i>
                        Incomplete applications will not be processed
                      </li>
                    </ul>
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

export default Step_5;