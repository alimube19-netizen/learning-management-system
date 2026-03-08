import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";

const Step_4 = () => {
  const { setAcademicInfo } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    matricBoard: "",
    matricYear: "",
    matricMarks: "",
    matricObtained: "",
    matricTotal: "",
    matricPercent: "",
    interBoard: "",
    interYear: "",
    interMarks: "",
    interObtained: "",
    interTotal: "",
    interPercent: "",
    bachelorTitle: "",
    bachelorUni: "",
    bachelorCGPA: "",
    masterTitle: "",
    masterUni: "",
    masterCGPA: "",
    phdTitle: "",
    phdUni: "",
    phdCGPA: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const calculatePercentage = (obtained, total) => {
    if (!obtained || !total) return "";
    const percent = (parseFloat(obtained) / parseFloat(total)) * 100;
    return percent.toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    // Auto-calculate percentages when marks are entered
    if (name === "matricMarks") {
      const [obtained, total] = value.split("/").map(item => item.trim());
      if (obtained && total) {
        updatedFormData.matricPercent = calculatePercentage(obtained, total);
      }
    }

    if (name === "interMarks") {
      const [obtained, total] = value.split("/").map(item => item.trim());
      if (obtained && total) {
        updatedFormData.interPercent = calculatePercentage(obtained, total);
      }
    }

    setFormData(updatedFormData);
    setAcademicInfo(updatedFormData);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "matricYear":
      case "interYear":
        if (value && (value < 1950 || value > new Date().getFullYear())) {
          error = "Please enter a valid year";
        }
        break;
      case "matricMarks":
      case "interMarks":
        if (value && !/^\d+\s*\/\s*\d+$/.test(value)) {
          error = "Format: Obtained / Total";
        }
        break;
      case "bachelorCGPA":
      case "masterCGPA":
      case "phdCGPA":
        if (value && (parseFloat(value) < 0 || parseFloat(value) > 4.0)) {
          error = "CGPA must be between 0.0 and 4.0";
        }
        break;
      default:
        if (name.includes("Title") && value && value.length < 2) {
          error = "Please enter a valid degree title";
        }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const getInputClasses = (fieldName) => {
    return `form-control ${errors[fieldName] ? 'is-invalid' : touched[fieldName] && formData[fieldName] ? 'is-valid' : ''}`;
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="container-fluid mt-4"> {/* Added mt-4 for top margin */}
      <div className="row justify-content-center">
        <div className="col-lg-12 col-xl-10">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h3 className="fw-bold text-primary mb-2">Academic Information</h3>
            <p className="text-muted">Enter the student's educational background in detail</p>
            <div className="progress mb-4" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-success" 
                style={{ width: '66%' }}
                role="progressbar"
              ></div>
            </div>
          </div>

          {/* School Education */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0 text-primary">
                <i className="fas fa-school me-2"></i>
                School Education
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                {/* Matriculation */}
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <h6 className="fw-semibold text-success mb-3">
                      <i className="fas fa-graduation-cap me-2"></i>
                      Matriculation (SSC)
                    </h6>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Board <span className="text-danger">*</span>
                      </label>
                      <select
                        className={getInputClasses("matricBoard")}
                        name="matricBoard"
                        value={formData.matricBoard}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Select Board</option>
                        <option>BISE Lahore</option>
                        <option>BISE Gujranwala</option>
                        <option>BISE Faisalabad</option>
                        <option>BISE Multan</option>
                        <option>BISE Rawalpindi</option>
                        <option>FBISE Islamabad</option>
                        <option>BISE Karachi</option>
                        <option>BISE Peshawar</option>
                        <option>Aga Khan Board</option>
                        <option>Cambridge (O Levels)</option>
                        <option>Other</option>
                      </select>
                      {errors.matricBoard && <div className="invalid-feedback">{errors.matricBoard}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Year of Passing <span className="text-danger">*</span>
                      </label>
                      <select
                        className={getInputClasses("matricYear")}
                        name="matricYear"
                        value={formData.matricYear}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.matricYear && <div className="invalid-feedback">{errors.matricYear}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Marks <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={getInputClasses("matricMarks")}
                        name="matricMarks"
                        value={formData.matricMarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="850 / 1100"
                        required
                      />
                      {errors.matricMarks && <div className="invalid-feedback">{errors.matricMarks}</div>}
                    </div>

                    {formData.matricPercent && (
                      <div className="alert alert-success py-2 mb-0">
                        <small className="fw-semibold">
                          Percentage: <strong>{formData.matricPercent}%</strong>
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Intermediate */}
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <h6 className="fw-semibold text-info mb-3">
                      <i className="fas fa-user-graduate me-2"></i>
                      Intermediate (HSSC)
                    </h6>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Board <span className="text-danger">*</span>
                      </label>
                      <select
                        className={getInputClasses("interBoard")}
                        name="interBoard"
                        value={formData.interBoard}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Select Board</option>
                        <option>BISE Lahore</option>
                        <option>BISE Gujranwala</option>
                        <option>BISE Faisalabad</option>
                        <option>BISE Multan</option>
                        <option>BISE Rawalpindi</option>
                        <option>FBISE Islamabad</option>
                        <option>BISE Karachi</option>
                        <option>BISE Peshawar</option>
                        <option>Aga Khan Board</option>
                        <option>Cambridge (A Levels)</option>
                        <option>Other</option>
                      </select>
                      {errors.interBoard && <div className="invalid-feedback">{errors.interBoard}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Year of Passing <span className="text-danger">*</span>
                      </label>
                      <select
                        className={getInputClasses("interYear")}
                        name="interYear"
                        value={formData.interYear}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.interYear && <div className="invalid-feedback">{errors.interYear}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Marks <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={getInputClasses("interMarks")}
                        name="interMarks"
                        value={formData.interMarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="950 / 1100"
                        required
                      />
                      {errors.interMarks && <div className="invalid-feedback">{errors.interMarks}</div>}
                    </div>

                    {formData.interPercent && (
                      <div className="alert alert-info py-2 mb-0">
                        <small className="fw-semibold">
                          Percentage: <strong>{formData.interPercent}%</strong>
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Higher Education */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0 text-primary">
                <i className="fas fa-university me-2"></i>
                Higher Education
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                {/* Bachelor's Degree */}
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <h6 className="fw-semibold text-warning mb-3">
                      <i className="fas fa-book me-2"></i>
                      Bachelor's Degree
                    </h6>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Degree Title</label>
                      <input
                        type="text"
                        className={getInputClasses("bachelorTitle")}
                        name="bachelorTitle"
                        value={formData.bachelorTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., BSCS, BBA, MBBS"
                      />
                      {errors.bachelorTitle && <div className="invalid-feedback">{errors.bachelorTitle}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">University</label>
                      <input
                        type="text"
                        className={getInputClasses("bachelorUni")}
                        name="bachelorUni"
                        value={formData.bachelorUni}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="University Name"
                      />
                      {errors.bachelorUni && <div className="invalid-feedback">{errors.bachelorUni}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">CGPA / Marks</label>
                      <input
                        type="text"
                        className={getInputClasses("bachelorCGPA")}
                        name="bachelorCGPA"
                        value={formData.bachelorCGPA}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., 3.5/4.0 or 750/1000"
                      />
                      {errors.bachelorCGPA && <div className="invalid-feedback">{errors.bachelorCGPA}</div>}
                    </div>
                  </div>
                </div>

                {/* Master's Degree */}
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <h6 className="fw-semibold text-purple mb-3">
                      <i className="fas fa-mastercard me-2"></i>
                      Master's Degree
                    </h6>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Degree Title</label>
                      <input
                        type="text"
                        className={getInputClasses("masterTitle")}
                        name="masterTitle"
                        value={formData.masterTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., MBA, MSCS, MA"
                      />
                      {errors.masterTitle && <div className="invalid-feedback">{errors.masterTitle}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">University</label>
                      <input
                        type="text"
                        className={getInputClasses("masterUni")}
                        name="masterUni"
                        value={formData.masterUni}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="University Name"
                      />
                      {errors.masterUni && <div className="invalid-feedback">{errors.masterUni}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">CGPA / Marks</label>
                      <input
                        type="text"
                        className={getInputClasses("masterCGPA")}
                        name="masterCGPA"
                        value={formData.masterCGPA}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., 3.8/4.0 or 850/1000"
                      />
                      {errors.masterCGPA && <div className="invalid-feedback">{errors.masterCGPA}</div>}
                    </div>
                  </div>
                </div>

                {/* PhD */}
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <h6 className="fw-semibold text-danger mb-3">
                      <i className="fas fa-user-md me-2"></i>
                      PhD (Optional)
                    </h6>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Research Area</label>
                      <input
                        type="text"
                        className={getInputClasses("phdTitle")}
                        name="phdTitle"
                        value={formData.phdTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Research Field / Area"
                      />
                      {errors.phdTitle && <div className="invalid-feedback">{errors.phdTitle}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">University</label>
                      <input
                        type="text"
                        className={getInputClasses("phdUni")}
                        name="phdUni"
                        value={formData.phdUni}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="University Name"
                      />
                      {errors.phdUni && <div className="invalid-feedback">{errors.phdUni}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">CGPA / Marks</label>
                      <input
                        type="text"
                        className={getInputClasses("phdCGPA")}
                        name="phdCGPA"
                        value={formData.phdCGPA}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., 3.9/4.0 or Thesis Completed"
                      />
                      {errors.phdCGPA && <div className="invalid-feedback">{errors.phdCGPA}</div>}
                    </div>
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

export default Step_4;