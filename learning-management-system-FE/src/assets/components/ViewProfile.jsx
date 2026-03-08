import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewProfile = () => {
  const { token, user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/View_Application", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setProfileData(res.data.data);
          console.log("Dataa",res.data.data,user)
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary mb-1">
                <i className="bi bi-person-badge me-2"></i>
                Student Profile
              </h2>
              <p className="text-muted mb-0">View and manage your profile information</p>
            </div>
            {user && (
              <div className="text-end">
                <span className="badge bg-primary fs-6 p-2">
                  {user.role || "Student"}
                </span>
              </div>
            )}
          </div>
          <hr className="my-3" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="row">
        {/* Left Column - Personal Info & Photo */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "15px" }}>
            <div className="card-body text-center p-4">
              {/* Profile Photo */}
              <div className="mb-4">
                <div className="mx-auto mb-3" style={{ width: "150px", height: "150px", borderRadius: "50%", overflow: "hidden", border: "3px solid #0d6efd" }}>
                  {profileData?.photo ? (
                    <img 
                      src={profileData.photo} 
                      alt="Profile" 
                      className="img-fluid h-100 w-100"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="h-100 w-100 d-flex align-items-center justify-content-center bg-light">
                      <i className="bi bi-person-fill" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
                    </div>
                  )}
                </div>
                <h4 className="mb-1">{profileData?.personal?.name || "N/A"}</h4>
                <p className="text-muted mb-3">
                  <i className="bi bi-mortarboard me-1"></i>
                  {profileData?.academic?.current_program || "Student"}
                </p>
                <span className="badge bg-success fs-6 p-2">
                  <i className="bi bi-check-circle me-1"></i>
                  {profileData?.status || "Active"}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <h5 className="text-primary mb-0">{user?.semester || "N/A"}</h5>
                    <small className="text-muted">Semester</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <h5 className="text-primary mb-0">{profileData?.academic?.cgpa || "N/A"}</h5>
                    <small className="text-muted">CGPA</small>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 text-start">
                <h6 className="border-bottom pb-2 mb-3">
                  <i className="bi bi-telephone me-2"></i>
                  Contact
                </h6>
                <div className="mb-2">
                  <i className="bi bi-envelope me-2 text-primary"></i>
                  <span>{profileData?.personal?.email_address || "N/A"}</span>
                </div>
                <div className="mb-2">
                  <i className="bi bi-phone me-2 text-primary"></i>
                  <span>{profileData?.personal?.mobile || "N/A"}</span>
                </div>
                <div>
                  <i className="bi bi-geo-alt me-2 text-primary"></i>
                  <span>{profileData?.personal?.permanent_address || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="col-lg-8">
          {/* Personal Information */}
          <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: "15px" }}>
            <div className="card-header bg-transparent border-0 pt-4">
              <h5 className="text-primary">
                <i className="bi bi-person-vcard me-2"></i>
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>Registration No:</strong>
                  <div className="text-muted">{user?.registration_no || "N/A"}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>CNIC:</strong>
                  <div className="text-muted">{profileData?.personal?.cnic || "N/A"}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Date of Birth:</strong>
                  <div className="text-muted">{formatDate(profileData?.personal?.dob)}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Gender:</strong>
                  <div className="text-muted">{profileData?.personal?.gender || "N/A"}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Father's Name:</strong>
                  <div className="text-muted">{profileData?.personal?.father_name || "N/A"}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Emergency Contact:</strong>
                  <div className="text-muted">{profileData?.personal?.emergency_contact || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: "15px" }}>
            <div className="card-header bg-transparent border-0 pt-4">
              <h5 className="text-success">
                <i className="bi bi-mortarboard me-2"></i>
                Academic Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <strong>Current Program:</strong>
                  <div className="text-muted">{user?.department_name || "N/A"}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Batch:</strong>
                  <div className="text-muted">{user?.admission_year || "N/A"}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Admission Date:</strong>
                  <div className="text-muted">{formatDate(profileData?.academic?.admission_date)}</div>
                </div>
              </div>

              {/* Previous Education */}
              <h6 className="border-bottom pb-2 mb-3">Previous Education</h6>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card border-success h-100">
                    <div className="card-body">
                      <h6 className="card-title text-success">Matriculation</h6>
                      <small className="text-muted d-block">Board: {profileData?.academic?.matric_board || "N/A"}</small>
                      <small className="text-muted d-block">Year: {profileData?.academic?.matric_year || "N/A"}</small>
                      <small className="text-muted d-block">Marks: {profileData?.academic?.matric_marks || "N/A"}</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-info h-100">
                    <div className="card-body">
                      <h6 className="card-title text-info">Intermediate</h6>
                      <small className="text-muted d-block">Board: {profileData?.academic?.inter_board || "N/A"}</small>
                      <small className="text-muted d-block">Year: {profileData?.academic?.inter_year || "N/A"}</small>
                      <small className="text-muted d-block">Marks: {profileData?.academic?.inter_marks || "N/A"}</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-warning h-100">
                    <div className="card-body">
                      <h6 className="card-title text-warning">Current</h6>
                      <small className="text-muted d-block">Semester: {user?.semester || "N/A"}</small>
                      <small className="text-muted d-block">CGPA: {profileData?.academic?.cgpa || "N/A"}</small>
                      <small className="text-muted d-block">Credits: {profileData?.academic?.completed_credits || "N/A"}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card shadow-sm border-0" style={{ borderRadius: "15px" }}>
            <div className="card-header bg-transparent border-0 pt-4">
              <h5 className="text-info">
                <i className="bi bi-info-circle me-2"></i>
                Additional Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>Blood Group:</strong>
                  <div className="text-muted">{profileData?.personal?.blood_group || "N/A"}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Disability:</strong>
                  <div className="text-muted">{profileData?.personal?.disability || "None"}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Hostel Facility:</strong>
                  <div className="text-muted">
                    {profileData?.personal?.hostel ? "Yes" : "No"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Transport Facility:</strong>
                  <div className="text-muted">
                    {profileData?.personal?.transport ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-5 pt-4 border-top">
        <button className="btn btn-primary me-3 px-4 py-2">
          <i className="bi bi-download me-2"></i>
          Download Profile
        </button>
        <button className="btn btn-outline-secondary me-3 px-4 py-2">
          <i className="bi bi-pencil me-2"></i>
          Edit Profile
        </button>
        <button className="btn btn-outline-success px-4 py-2" onClick={() => window.print()}>
          <i className="bi bi-printer me-2"></i>
          Print
        </button>
      </div>
    </div>
  );
};

export default ViewProfile;