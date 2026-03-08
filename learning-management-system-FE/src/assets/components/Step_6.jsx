import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Step_6 = () => {
  const [scholarship, setScholarship] = useState({
    merit: false,
    needBased: false,
  });
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setScholarship({ ...scholarship, [name]: checked });
  };

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const renderFeedback = () => {
    if (scholarship.merit && scholarship.needBased) {
      return 'You have applied for Merit-based and Need-based scholarships.';
    } else if (scholarship.merit) {
      return 'You have applied for Merit-based scholarship.';
    } else if (scholarship.needBased) {
      return 'You have applied for Need-based scholarship.';
    } else {
      return 'No scholarship selected.';
    }
  };

  return (
    <div className="container my-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title">Scholarship Application</h4>

          <form>
            {/* Merit-based checkbox */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="merit"
                name="merit"
                checked={scholarship.merit}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="merit">
                Merit-based Scholarship{' '}
                <small className="text-muted">
                  (Eligible for 80%+ marks)
                </small>
              </label>
            </div>

            {/* Need-based checkbox */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="needBased"
                name="needBased"
                checked={scholarship.needBased}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="needBased">
                Need-based Scholarship{' '}
                <small className="text-muted">
                  (Requires financial documents)
                </small>
              </label>
            </div>

            {/* File upload for supporting documents */}
            {(scholarship.merit || scholarship.needBased) && (
              <div className="mb-3">
                <label htmlFor="fileUpload" className="form-label">
                  Upload supporting documents (optional)
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChange}
                />
                {uploadedFile && (
                  <small className="text-success">
                    Uploaded: {uploadedFile.name}
                  </small>
                )}
              </div>
            )}
          </form>

          {/* Dynamic feedback */}
          <p className="mt-3 fs-5">{renderFeedback()}</p>
        </div>
      </div>
    </div>
  );
};

export default Step_6;
