import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthProvider";

const Application_Status = () => {
  const { token } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock status - Replace with actual API call
      const mockStatus = "pending"; // "accepted", "rejected", or "pending"
      setStatus(mockStatus);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Checking your application status...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body text-center p-5">
              
              {status === "accepted" && (
                <>
                  <div className="text-success mb-4">
                    <i className="bi bi-check-circle-fill" style={{fontSize: '4rem'}}></i>
                  </div>
                  <h2 className="text-success">Application Accepted!</h2>
                  <p className="lead">Congratulations! Your application has been approved.</p>
                  <div className="alert alert-success mt-3">
                    Check your email for next steps and instructions.
                  </div>
                </>
              )}

              {status === "rejected" && (
                <>
                  <div className="text-danger mb-4">
                    <i className="bi bi-x-circle-fill" style={{fontSize: '4rem'}}></i>
                  </div>
                  <h2 className="text-danger">Application Rejected</h2>
                  <p className="lead">Your application was not accepted at this time.</p>
                  <div className="alert alert-info mt-3">
                    You may contact the admissions office for more information.
                  </div>
                </>
              )}

              {status === "pending" && (
                <>
                  <div className="text-warning mb-4">
                    <i className="bi bi-clock-fill" style={{fontSize: '4rem'}}></i>
                  </div>
                  <h2 className="text-warning">Application Pending</h2>
                  <p className="lead">Your application is still under review.</p>
                  <div className="alert alert-warning mt-3">
                    Please check back later for updates. Decision usually takes 7-10 days.
                  </div>
                </>
              )}

              <div className="mt-4">
                <button className="btn btn-primary me-2">
                  Check Again
                </button>
                <button className="btn btn-outline-secondary">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application_Status;