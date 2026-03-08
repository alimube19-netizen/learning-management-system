import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from './AuthProvider';

const FeeStructure = () => {

  const {user , flag} = useContext(AuthContext);

  console.log(user)

  // Mock data
  const [feeData, setFeeData] = useState({
    studentName: user.fullname,
    studentId: user.id,
    semester: "Spring 2024",
    items: []
  });

  // Calculate totals
  const calculateTotals = () => {
    const total = feeData.items
      .filter(item => item.type === 'mandatory' || item.paid)
      .reduce((sum, item) => sum + item.amount, 0);
    
    const paid = feeData.items
      .filter(item => item.paid)
      .reduce((sum, item) => sum + item.amount, 0);
    
    const due = total - paid;
    
    return { total, paid, due };
  };

  const { total, paid, due } = calculateTotals();

  // Toggle optional fee
  const toggleOptionalFee = (itemId) => {
    const updatedItems = feeData.items.map(item => {
      if (item.id === itemId) {
        return { ...item, paid: !item.paid };
      }
      return item;
    });
    
    setFeeData({
      ...feeData,
      items: updatedItems
    });
  };

  // Handle mock payment
  const handleMockPayment = () => {
    // Mark all mandatory items as paid
    const updatedItems = feeData.items.map(item => ({
      ...item,
      paid: item.type === 'mandatory' ? true : item.paid
    }));
    
    setFeeData({
      ...feeData,
      items: updatedItems
    });
    
    alert("✅ Demo: All mandatory fees marked as paid!\nOptional fees remain unchanged.");
  };

  return (
    <div className="container-fluid py-2">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="card-title mb-0">
                    <i className="fas fa-file-invoice-dollar me-2 text-primary"></i>
                    Fee Structure
                  </h2>
                  <p className="text-muted mb-0">{user.admission_year}-Semester {user.semester}</p>
                </div>
                <div className="text-end">
                  <h5 className="mb-1">{feeData.studentName}</h5>
                  <p className="text-muted mb-0">{user.registration_no}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-primary shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <i className="fas fa-money-bill-wave fa-2x text-primary"></i>
                </div>
              </div>
              <h5 className="card-title text-muted">Total Fee</h5>
              <h2 className="fw-bold text-primary">Rs. {total.toLocaleString()}</h2>
              <p className="text-muted small">Including mandatory fees</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-success shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="fas fa-check-circle fa-2x text-success"></i>
                </div>
              </div>
              <h5 className="card-title text-muted">Amount Paid</h5>
              <h2 className="fw-bold text-success">Rs. {paid.toLocaleString()}</h2>
              <p className="text-muted small">Verified payments</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-warning shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <i className="fas fa-exclamation-triangle fa-2x text-warning"></i>
                </div>
              </div>
              <h5 className="card-title text-muted">Balance Due</h5>
              <h2 className="fw-bold text-warning">Rs. {due.toLocaleString()}</h2>
              <p className="text-muted small">Due by Jan 31, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-list-alt me-2"></i>
                Fee Breakdown
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th width="5%">#</th>
                      <th width="45%">Description</th>
                      <th width="15%">Amount (Rs)</th>
                      <th width="15%">Type</th>
                      <th width="15%">Status</th>
                      <th width="10%">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeData.items.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={item.paid ? 'table-success' : ''}
                      >
                        <td>{index + 1}</td>
                        <td>
                          {item.description}
                          {item.paid && (
                            <span className="badge bg-success ms-2">
                              <i className="fas fa-check me-1"></i>
                              Paid
                            </span>
                          )}
                        </td>
                        <td className="fw-bold">{item.amount.toLocaleString()}</td>
                        <td>
                          {item.type === 'mandatory' ? (
                            <span className="badge bg-primary">
                              <i className="fas fa-star me-1"></i>
                              Mandatory
                            </span>
                          ) : (
                            <span className="badge bg-secondary">
                              <i className="fas fa-plus-circle me-1"></i>
                              Optional
                            </span>
                          )}
                        </td>
                        <td>
                          {item.paid ? (
                            <span className="badge bg-success">
                              <i className="fas fa-check me-1"></i>
                              Paid
                            </span>
                          ) : (
                            <span className="badge bg-warning">
                              <i className="fas fa-clock me-1"></i>
                              Pending
                            </span>
                          )}
                        </td>
                        <td>
                          {item.type === 'optional' && (
                            <button
                              className={`btn btn-sm ${item.paid ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => toggleOptionalFee(item.id)}
                            >
                              {item.paid ? (
                                <>
                                  <i className="fas fa-minus me-1"></i>
                                  Remove
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-plus me-1"></i>
                                  Add
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="2" className="text-end fw-bold">
                        Total Payable:
                      </td>
                      <td className="fw-bold fs-5 text-primary">
                        Rs. {total.toLocaleString()}
                      </td>
                      <td colSpan="3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Important Notice</h5>
                  <p className="text-muted mb-0">
                    <i className="fas fa-calendar-alt me-2 text-danger"></i>
                    All fees are due by <strong>January 31, 2024</strong>
                  </p>
                  <p className="text-muted mb-0">
                    <i className="fas fa-exclamation-circle me-2 text-warning"></i>
                    Late fee of Rs. 1,000 will be applied after due date
                  </p>
                </div>
                <div className="d-flex gap-3">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => {
                      alert("📄 Demo: Fee slip would be downloaded");
                    }}
                  >
                    <i className="fas fa-print me-2"></i>
                    Print Fee Slip
                  </button>
                  
                  <button 
                    className="btn btn-success"
                    onClick={handleMockPayment}
                    disabled={due === 0}
                  >
                    <i className="fas fa-credit-card me-2"></i>
                    {due === 0 ? 'All Fees Paid' : `Pay Rs. ${due.toLocaleString()}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Add FontAwesome for icons */}
      
    </div>
  );
};

export default FeeStructure;