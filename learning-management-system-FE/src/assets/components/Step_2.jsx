import React, { createContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Step_3 from './Step_3';
import { AuthContext } from './AuthProvider';
import { useContext } from 'react';

const Step_2 = ({ onNext }) => {
  const { setPersonalInfo } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    religion: '',
    dob: '',
    gender: '',
    meritalStatus: '',
    nationality: '',
    domicile: '',
    cnic: '',
    emailAddress: '',
    mobile: '',
    permanentAddress: '',
    currentAddress: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setPersonalInfo(prev => ({ ...prev, [name]: value}));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'emailAddress':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'cnic':
        if (!/^\d{5}-\d{7}-\d{1}$/.test(value)) {
          error = 'CNIC must be in format: XXXXX-XXXXXXX-X';
        }
        break;
      case 'mobile':
        if (!/^03\d{9}$/.test(value)) {
          error = 'Mobile must start with 03 and be 11 digits long';
        }
        break;
      case 'dob':
        if (value && new Date(value) > new Date()) {
          error = 'Date of birth cannot be in the future';
        }
        break;
      default:
        if (!value.trim()) {
          error = 'This field is required';
        }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const getInputClasses = (fieldName) => {
    return `form-control ${errors[fieldName] ? 'is-invalid' : touched[fieldName] && formData[fieldName] ? 'is-valid' : ''}`;
  };

  return (
    <div className="container-fluid mt-4"> {/* Changed to container-fluid and added mt-4 */}
      <div className="row justify-content-center"> {/* Added consistent row structure */}
        <div className="col-lg-12 col-xl-10"> {/* Added consistent column width */}
          {/* Header Section - Added to match other components */}
          <div className="text-center mb-5">
            <h3 className="fw-bold text-primary mb-2">Personal Information</h3>
            <p className="text-muted">Please provide the student's accurate personal details</p>
            <div className="progress mb-4" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ width: '33%' }}
                role="progressbar"
              ></div>
            </div>
          </div>

          <div className="card shadow-sm border-0"> {/* Added card wrapper for consistency */}
            <div className="card-body p-4 p-md-5">
              <div className="row">
                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    className={getInputClasses('name')} 
                    value={formData.name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    required 
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Father Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Father Name <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="fatherName" 
                    className={getInputClasses('fatherName')} 
                    value={formData.fatherName} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter father's name"
                    required 
                  />
                  {errors.fatherName && <div className="invalid-feedback">{errors.fatherName}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Religion</label>
                  <input 
                    type="text" 
                    name="religion" 
                    className={getInputClasses('religion')} 
                    value={formData.religion} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your religion"
                  />
                  {errors.religion && <div className="invalid-feedback">{errors.religion}</div>}
                </div>

                {/* Date of Birth */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="dob" 
                    className={getInputClasses('dob')} 
                    value={formData.dob} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                </div>

                {/* Gender */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select 
                    name="gender" 
                    className={getInputClasses('gender')} 
                    value={formData.gender} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>

                {/* Marital Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Marital Status <span className="text-danger">*</span>
                  </label>
                  <select 
                    name="meritalStatus" 
                    className={getInputClasses('meritalStatus')} 
                    value={formData.meritalStatus} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.meritalStatus && <div className="invalid-feedback">{errors.meritalStatus}</div>}
                </div>

                {/* Nationality */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Nationality <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="nationality" 
                    className={getInputClasses('nationality')} 
                    value={formData.nationality} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter nationality"
                    required
                  />
                  {errors.nationality && <div className="invalid-feedback">{errors.nationality}</div>}
                </div>

                {/* Domicile */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Domicile <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="domicile" 
                    className={getInputClasses('domicile')} 
                    value={formData.domicile} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter domicile"
                    required
                  />
                  {errors.domicile && <div className="invalid-feedback">{errors.domicile}</div>}
                </div>

                {/* CNIC */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    CNIC <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="cnic" 
                    className={getInputClasses('cnic')} 
                    value={formData.cnic} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="XXXXX-XXXXXXX-X" 
                    required
                  />
                  {errors.cnic && <div className="invalid-feedback">{errors.cnic}</div>}
                </div>

                {/* emailAddress */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="emailAddress" 
                    className={getInputClasses('emailAddress')} 
                    value={formData.emailAddress} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Email Address" 
                    required
                  />
                  {errors.emailAddress && <div className="invalid-feedback">{errors.emailAddress}</div>}
                </div>

                {/* Mobile */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Mobile <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="mobile" 
                    className={getInputClasses('mobile')} 
                    value={formData.mobile} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="03XXXXXXXXX" 
                    required
                  />
                  {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                </div>

                {/* permanentAddress */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Permanent Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="permanentAddress"
                    className={getInputClasses('permanentAddress')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter permanent address"
                    value={formData.permanentAddress}
                    required
                  />
                  {errors.permanentAddress && <div className="invalid-feedback">{errors.permanentAddress}</div>}
                </div>

                {/* currentAddress */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Current Address</label>
                  <input
                    type="text"
                    name="currentAddress"
                    className={getInputClasses('currentAddress')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter current address"
                    value={formData.currentAddress}
                  />
                  {errors.currentAddress && <div className="invalid-feedback">{errors.currentAddress}</div>}
                  
                  {/* Same as permanent address checkbox */}
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="sameAsPermanent"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            currentAddress: prev.permanentAddress
                          }));
                        }
                      }}
                    />
                    <label className="form-check-label text-muted" htmlFor="sameAsPermanent">
                      Same as permanent address
                    </label>
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

export default Step_2;