// AdminAddStudentDeclaration.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthProvider";

const Step_8 = () => {
  const { personalInfo, academicInfo, programInfo, documents } = useContext(AuthContext);
  const [isChecked, setIsChecked] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setIsChecked((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = () => {
    if (isChecked.adminAgreement && !isSubmitted) {
      // Log the data to console
      console.log("Student registration data:", {
        personalInfo,
        academicInfo,
        programInfo,
        documents
      });
      
      // Change button state
      setIsSubmitted(true);
    }
  };

  useEffect(() => {
    console.log("Updated checkbox state:", isChecked);
  }, [isChecked]);

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-xl-10">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h3 className="fw-bold text-primary mb-2">Admin Agreement & Submission</h3>
            <p className="text-muted">Verify and agree to complete student registration</p>
            <div className="progress mb-4" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-success" 
                style={{ width: '100%' }}
                role="progressbar"
              ></div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h4 className="fw-semibold text-primary mb-4">
                <i className="fas fa-user-shield me-2"></i>
                Administrator Agreement
              </h4>

              {/* Admin Agreement Content */}
              <div className="agreement-content bg-light rounded p-4 mb-4">
                <p className="mb-3 fw-medium">
                  As an authorized administrator of this institution, I hereby agree that:
                </p>
                
                <ul className="list-unstyled mb-4">
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    I have personally verified all information provided by the student
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    All documents submitted are genuine and properly authenticated
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    The student meets all academic and administrative requirements
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    I take full responsibility for the accuracy of this registration
                  </li>
                  <li>
                    <i className="fas fa-check-circle text-success me-2"></i>
                    This registration complies with all institutional policies and regulations
                  </li>
                </ul>

                <div className="border-top pt-3">
                  <p className="text-muted small mb-0">
                    <strong>Administrator Note:</strong> By agreeing below, you confirm your responsibility 
                    as the registering official for this student admission.
                  </p>
                </div>
              </div>

              {/* Admin Agreement Checkbox */}
              <div className="agreement-section">
                <div className={`card border-2 ${isChecked.adminAgreement ? 'border-success' : 'border-light'} transition-all`}>
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="adminAgreement"
                        name="adminAgreement"
                        onChange={handleChange}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <label className="form-check-label fw-semibold ms-2" htmlFor="adminAgreement">
                        I agree to the terms above and confirm my responsibility as the registering administrator
                      </label>
                    </div>
                    
                    {isChecked.adminAgreement && (
                      <div className="alert alert-success mt-3 mb-0 py-2">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-check-circle me-2"></i>
                          <span className="fw-semibold">
                            Agreement confirmed. You may now complete the registration.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button - ONLY CHANGED THIS PART */}
              <div className="text-center mt-5">
                <button 
                  className={`btn btn-lg ${isSubmitted ? 'btn-success' : (isChecked.adminAgreement ? 'btn-primary' : 'btn-secondary')} px-5`}
                  disabled={!isChecked.adminAgreement}
                  onClick={handleSubmit}
                >
                  <i className={`fas ${isSubmitted ? 'fa-user-check' : 'fa-user-plus'} me-2`}></i>
                  {isSubmitted ? 'Student Registered' : 'Complete Student Registration'}
                </button>
                
                {!isChecked.adminAgreement && (
                  <p className="text-muted mt-2 small">
                    Please agree to the administrator terms to complete registration
                  </p>
                )}
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step_8;