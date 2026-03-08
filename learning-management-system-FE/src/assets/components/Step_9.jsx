// Step_9.jsx
import React, { useState } from "react";

const Step_9 = () => {
  const [scholarshipInterest, setScholarshipInterest] = useState("");

  const handleChange = (e) => {
    setScholarshipInterest(e.target.value);
  };

  return (
    <div className="container">
      <h4 className="fw-bold mb-3">Scholarship Interest</h4>

      <div className="card shadow-sm border-0 rounded-3 p-4">
        <p className="mb-3">
          Would you like to apply for a scholarship under the university’s
          <strong> merit-based</strong> or <strong>need-based</strong> program?
          Please select one option below.
        </p>

        <div className="row">
          <div className="col-md-6">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="scholarship_interest"
                id="scholarshipYes"
                value="Yes"
                checked={scholarshipInterest === "Yes"}
                onChange={handleChange}
                required
              />
              <label className="form-check-label" htmlFor="scholarshipYes">
                Yes, I want to apply for a scholarship.
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="scholarship_interest"
                id="scholarshipNo"
                value="No"
                checked={scholarshipInterest === "No"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="scholarshipNo">
                No, I don’t want to apply for a scholarship.
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step_9;
