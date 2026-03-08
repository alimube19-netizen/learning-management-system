import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import axios from "axios";
import { FaUserShield } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef } from "react";

const Signin = () => {
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const togglePassword = () => setShow(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/Signin", { Username, password });
      const { token, user } = res.data;

      if (!token) throw new Error("No token returned from server");

      login({ token, user });
      navigate("/StudentDashboard");
    } catch (err) {
      console.error("Signin error:", err?.response?.data || err.message);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Invalid username or password";
            break;
          case 404:
            errorMessage = "Account not found";
            break;
          case 400:
            errorMessage = err.response.data.message || "Invalid credentials";
            break;
          default:
            errorMessage = err.response.data?.message || "Server error";
        }
      } else if (err.request) {
        errorMessage = "Unable to connect to server";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 position-relative px-3" style={{
      backgroundImage: "url('/banner-bg.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      {/* Admin Access Button in Top Right */}
      <div className="position-absolute top-0 end-0 p-3">
        <Link 
          to="/AdminSignin" 
          className="btn btn-sm d-flex align-items-center gap-1"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            color: '#306AE4',
            padding: '6px 12px',
            fontSize: '14px'
          }}
        >
          <FaUserShield />
          <span>Admin Portal</span>
        </Link>
      </div>

      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow-sm p-3 w-100" style={{ maxWidth: "360px", backdropFilter: "blur(3px)" }}>
          <h3 className="text-center text-dark mb-4">Student Login</h3>

          {error && (
            <div className="alert alert-danger p-2 py-1 mb-3 text-center small" role="alert">
              <i className="fas fa-exclamation-circle me-1"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small">Username</label>
              <input 
                type="text" 
                className="form-control form-control-sm" 
                placeholder="Enter your username"
                value={Username} 
                onChange={e => setUsername(e.target.value)} 
                ref={inputRef} 
                required 
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small">Password</label>
              <input 
                type={show ? "text" : "password"} 
                className="form-control form-control-sm"
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
            
            {/* Show Password and Forgot Password Row */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="showPassword" 
                  checked={show}
                  onChange={togglePassword}
                  disabled={loading}
                />
                <label className="form-check-label small" htmlFor="showPassword">
                  Show Password
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="small text-decoration-none"
                style={{ color: "#306AE4" }}
              >
                Forgot Password?
              </Link>
            </div>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn text-white" 
                style={{ backgroundColor: "#306AE4" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
          <div className="mt-3 text-center">
            <div className="border-top pt-3">
              <p className="text-muted small mb-0">
                <i className="fas fa-question-circle me-1"></i>
                Need help? Contact your department administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;