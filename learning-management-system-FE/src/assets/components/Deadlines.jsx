// Deadlines.jsx
import React, { useState } from 'react';

const Deadlines = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, today
  const [loading, setLoading] = useState(false);
  const [newDeadline, setNewDeadline] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    courseId: '',
    assignmentId: '',
    priority: 'medium'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDeadline(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In real app, would make API call here
    setTimeout(() => {
      const deadlineToAdd = {
        ...newDeadline,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'upcoming'
      };
      
      setDeadlines(prev => [...prev, deadlineToAdd]);
      setNewDeadline({
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        courseId: '',
        assignmentId: '',
        priority: 'medium'
      });
      setLoading(false);
    }, 1000);
  };

  const deleteDeadline = (id) => {
    setDeadlines(prev => prev.filter(deadline => deadline.id !== id));
  };

  const toggleStatus = (id) => {
    setDeadlines(prev => prev.map(deadline => 
      deadline.id === id 
        ? { ...deadline, status: deadline.status === 'completed' ? 'pending' : 'completed' }
        : deadline
    ));
  };

  const filteredDeadlines = deadlines.filter(deadline => {
    const now = new Date();
    const dueDate = new Date(`${deadline.dueDate}T${deadline.dueTime}`);
    
    switch(filter) {
      case 'upcoming':
        return dueDate > now;
      case 'past':
        return dueDate < now;
      case 'today':
        const today = now.toISOString().split('T')[0];
        return deadline.dueDate === today;
      default:
        return true;
    }
  });

  return (
    <div className="container-fluid deadlines-container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Deadlines Management</h1>
          <p className="text-muted mb-4">
            Create and manage assignment deadlines, exam dates, and other important dates.
          </p>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Add New Deadline */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-calendar-plus me-2"></i>
                Create New Deadline
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={newDeadline.title}
                    onChange={handleInputChange}
                    placeholder="Enter deadline title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newDeadline.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Add details about this deadline"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Due Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dueDate"
                      value={newDeadline.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Due Time *</label>
                    <input
                      type="time"
                      className="form-control"
                      name="dueTime"
                      value={newDeadline.dueTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Course ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="courseId"
                      value={newDeadline.courseId}
                      onChange={handleInputChange}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Assignment ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="assignmentId"
                      value={newDeadline.assignmentId}
                      onChange={handleInputChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    name="priority"
                    value={newDeadline.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !newDeadline.title || !newDeadline.dueDate || !newDeadline.dueTime}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>
                      Create Deadline
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h6 className="card-title mb-3">Deadlines Overview</h6>
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-primary">{deadlines.length}</div>
                    <small className="text-muted">Total</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-success">
                      {deadlines.filter(d => d.status === 'completed').length}
                    </div>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-warning">
                      {deadlines.filter(d => d.status === 'pending' || d.status === 'upcoming').length}
                    </div>
                    <small className="text-muted">Pending</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-danger">
                      {deadlines.filter(d => {
                        const dueDate = new Date(`${d.dueDate}T${d.dueTime}`);
                        return dueDate < new Date() && d.status !== 'completed';
                      }).length}
                    </div>
                    <small className="text-muted">Overdue</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Deadlines List */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Deadlines</h5>
                <div className="d-flex gap-2">
                  <select
                    className="form-select form-select-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="all">All Deadlines</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="today">Today</option>
                    <option value="past">Past</option>
                  </select>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setDeadlines([])}
                    disabled={deadlines.length === 0}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {filteredDeadlines.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Title</th>
                        <th>Due Date & Time</th>
                        <th>Priority</th>
                        <th>Course</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeadlines.map(deadline => {
                        const dueDateTime = new Date(`${deadline.dueDate}T${deadline.dueTime}`);
                        const isOverdue = dueDateTime < new Date() && deadline.status !== 'completed';
                        
                        return (
                          <tr key={deadline.id} className={isOverdue ? 'table-danger' : ''}>
                            <td>
                              <button
                                className={`btn btn-sm ${deadline.status === 'completed' ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => toggleStatus(deadline.id)}
                                title={deadline.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                              >
                                <i className={`bi ${deadline.status === 'completed' ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                              </button>
                            </td>
                            <td>
                              <div>
                                <strong>{deadline.title}</strong>
                                {deadline.description && (
                                  <small className="d-block text-muted">{deadline.description}</small>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <div>{new Date(dueDateTime).toLocaleDateString()}</div>
                                <small className="text-muted">{deadline.dueTime}</small>
                              </div>
                            </td>
                            <td>
                              <span className={`badge bg-${getPriorityColor(deadline.priority)}`}>
                                {deadline.priority.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              {deadline.courseId ? (
                                <span className="badge bg-info">{deadline.courseId}</span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => deleteDeadline(deadline.id)}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">No deadlines found</h5>
                  <p className="text-muted">
                    {filter === 'all' 
                      ? 'Create your first deadline using the form on the left.'
                      : `No ${filter} deadlines found.`}
                  </p>
                </div>
              )}
            </div>

            <div className="card-footer bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {filteredDeadlines.length} of {deadlines.length} deadlines
                </small>
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Red rows indicate overdue deadlines
                </small>
              </div>
            </div>
          </div>

          {/* Calendar View (Minimal) */}
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-white">
              <h6 className="mb-0">Upcoming Deadlines Timeline</h6>
            </div>
            <div className="card-body">
              {deadlines.filter(d => {
                const dueDate = new Date(`${d.dueDate}T${d.dueTime}`);
                return dueDate >= new Date();
              }).length > 0 ? (
                <div className="timeline">
                  {deadlines
                    .filter(d => {
                      const dueDate = new Date(`${d.dueDate}T${d.dueTime}`);
                      return dueDate >= new Date();
                    })
                    .sort((a, b) => new Date(`${a.dueDate}T${a.dueTime}`) - new Date(`${b.dueDate}T${b.dueTime}`))
                    .slice(0, 5)
                    .map((deadline, index) => (
                      <div key={deadline.id} className="timeline-item mb-3">
                        <div className="d-flex">
                          <div className="timeline-marker bg-primary rounded-circle me-3" style={{ width: '12px', height: '12px', marginTop: '5px' }}></div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <strong>{deadline.title}</strong>
                              <small className="text-muted">
                                {new Date(`${deadline.dueDate}T${deadline.dueTime}`).toLocaleDateString()}
                              </small>
                            </div>
                            <small className="text-muted">{deadline.description}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <small className="text-muted">No upcoming deadlines scheduled</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for priority colors
const getPriorityColor = (priority) => {
  switch(priority) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': return 'danger';
    case 'critical': return 'dark';
    default: return 'secondary';
  }
};

export default Deadlines;