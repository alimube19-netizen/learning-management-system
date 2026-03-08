import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";

const programsByLevel = {
  BS: [
    "BS Computer Science",
    "BS Software Engineering", 
    "BS Information Technology",
    "BS Electrical Engineering",
    "BS Business Administration",
    "BS Mathematics",
    "BS Physics",
    "BS Chemistry"
  ],
  Masters: [
    "MS Computer Science",
    "MS Software Engineering",
    "MS Information Technology", 
    "MS Electrical Engineering",
    "MBA",
    "MSc Mathematics",
    "MSc Physics",
    "MSc Chemistry"
  ],
  PhD: [
    "PhD Computer Science",
    "PhD Software Engineering",
    "PhD Information Technology",
    "PhD Electrical Engineering",
    "PhD Business Administration",
    "PhD Mathematics",
    "PhD Physics",
    "PhD Chemistry"
  ]
};

// Available program levels
const programLevels = ["BS", "Masters", "PhD"];

function Step_7() {

  const { setProgramInfo } = useContext(AuthContext)

  const [form, setForm] = useState({
    programLevel:"",  // Changed from "program" to "programLevel"
    selectedProgram: "",          // Changed from "course" to "selectedProgram"
    scholarshipInterest: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...form,
      [name]: value
    };
    
    // If program level changes, reset selected program
    if (name === "programLevel") {
      updatedForm.selectedProgram = "";
    }
    
    setForm(updatedForm);
    setProgramInfo(updatedForm);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-xl-10">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h3 className="fw-bold text-primary mb-2">Program Information</h3>
            <p className="text-muted">Select student's preferred program level and specific program</p>
            <div className="progress mb-4" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-info" 
                style={{ width: '85%' }}
                role="progressbar"
              ></div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="row">
                <div className="col-12">
                  {/* Program Information */}
                  <div className="mb-4">
                    <h5 className="fw-semibold text-primary mb-3">
                      <i className="fas fa-graduation-cap me-2"></i>
                      Program Details
                    </h5>
                    
                    <div className="row g-3">
                      {/* Program Level Selection */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Program Level <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="programLevel"
                          value={form.programLevel}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Program Level --</option>
                          {programLevels.map((level) => (
                            <option key={level} value={level}>
                              {level === "BS" ? "Bachelor's (Undergraduate)" : 
                               level === "Masters" ? "Master's (Graduate)" : 
                               "Doctorate (PhD)"}
                            </option>
                          ))}
                        </select>
                        <small className="text-muted">
                          Select your degree level (BS, Masters, or PhD)
                        </small>
                      </div>

                      {/* Specific Program Selection (depends on level) */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Select Program <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="selectedProgram"
                          value={form.selectedProgram}
                          onChange={handleChange}
                          required
                          disabled={!form.programLevel}
                        >
                          <option value="">
                            {form.programLevel ? `-- Select ${form.programLevel} Program --` : "-- First select program level --"}
                          </option>
                          {form.programLevel && programsByLevel[form.programLevel]?.map((programName) => (
                            <option key={programName} value={programName}>
                              {programName}
                            </option>
                          ))}
                        </select>
                        <small className="text-muted">
                          {form.programLevel ? `Available ${form.programLevel} programs` : "Choose program level first"}
                        </small>
                      </div>
                    </div>

                    {/* Display Selected Program Info */}
                    {form.selectedProgram && (
                      <div className="alert alert-success mt-3">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-check-circle me-2"></i>
                          <div>
                            <strong>Selected Program:</strong> {form.selectedProgram}
                            <div className="small mt-1">
                              Duration: {form.programLevel === "BS" ? "4 years (8 semesters)" : 
                                       form.programLevel === "Masters" ? "2 years (4 semesters)" : 
                                       "3-5 years (6-10 semesters)"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scholarship Section */}
                  <div className="scholarship-section mt-4 pt-4 border-top">
                    <h5 className="fw-semibold text-primary mb-3">
                      <i className="fas fa-award me-2"></i>
                      Scholarship Information
                    </h5>
                    
                    <div className="mb-3">
                      <p className="text-muted mb-3">
                        Would you like to apply for a scholarship under the university's 
                        <strong className="text-success"> merit-based</strong> or 
                        <strong className="text-info"> need-based</strong> program? 
                        Please select one option below.
                      </p>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="card border h-100">
                          <div className="card-body">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="scholarshipInterest"
                                id="scholarshipYes"
                                value="Yes"
                                checked={form.scholarshipInterest === "Yes"}
                                onChange={handleChange}
                                disabled={!form.selectedProgram}
                              />
                              <label className="form-check-label fw-semibold" htmlFor="scholarshipYes">
                                Yes, I want to apply for a scholarship
                              </label>
                              <p className="text-muted small mt-1 mb-0">
                                You'll need to provide additional documents for scholarship consideration
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="card border h-100">
                          <div className="card-body">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="scholarshipInterest"
                                id="scholarshipNo"
                                value="No"
                                checked={form.scholarshipInterest === "No"}
                                onChange={handleChange}
                                disabled={!form.selectedProgram}
                              />
                              <label className="form-check-label fw-semibold" htmlFor="scholarshipNo">
                                No, I don't want to apply for a scholarship
                              </label>
                              <p className="text-muted small mt-1 mb-0">
                                Continue with regular admission process
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scholarship Additional Info */}
                    {form.scholarshipInterest === "Yes" && (
                      <div className="alert alert-info mt-3">
                        <div className="d-flex">
                          <i className="fas fa-info-circle me-2 mt-1"></i>
                          <div>
                            <strong>Scholarship Application Note:</strong>
                            <p className="mb-0 small">
                              After submitting your application, you'll need to provide additional documents 
                              including income certificates, academic transcripts, and a scholarship application 
                              form for review by the scholarship committee.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step_7;