import React, { useState } from "react";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Step_3 = () => {

const {setAddressDetails} = useContext(AuthContext)

let [details, setDetails] = useState({
    address: "",
    city: "",
    phoneNumber: ""
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prevData => ({ ...prevData, [name]: value }));
    setAddressDetails(prevData =>({...prevData, [name]: value}));
};

  return (
    <div className="container">
  <h4 className="mb-3">Address Details</h4>
    <div className="row">
      {/* Permanent Address */}
      <div className="col-md-6">
        <h6>Permanent Address</h6>
        <div className="mb-2">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            onChange={handleChange}
            placeholder="Enter permanent address"
            value={details.address} 
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">City</label>
          <input
            type="text"
            name="city"
            className="form-control"
            onChange={handleChange}
            placeholder="Enter city"
            value={details.city}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phoneNumber"
            className="form-control"
            onChange={handleChange}
            placeholder="Enter phone number"
            value={details.phoneNumber}
            required
          />
        </div>
      </div>

      {/* Mailing Address */}
      <div className="col-md-6">
        <h6>Mailing Address</h6>
        <div className="mb-2">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter mailing address"
          />
        </div>
        <div className="mb-2">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>
</div>
  );
};

export default Step_3;
