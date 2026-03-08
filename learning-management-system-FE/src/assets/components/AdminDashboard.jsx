import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 156,
    activeCourses: 24,
    pendingApplications: 12,
    revenue: 125600
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: "John Smith", action: "Applied for admission", time: "10 mins ago", icon: "fas fa-user-plus", color: "success" },
    { id: 2, user: "Sarah Johnson", action: "Submitted assignment", time: "25 mins ago", icon: "fas fa-tasks", color: "info" },
    { id: 3, user: "Mike Chen", action: "Paid course fee", time: "1 hour ago", icon: "fas fa-credit-card", color: "warning" },
    { id: 4, user: "Emily Davis", action: "Uploaded document", time: "2 hours ago", icon: "fas fa-file-upload", color: "primary" },
    { id: 5, user: "Robert Brown", action: "Completed quiz", time: "3 hours ago", icon: "fas fa-check-circle", color: "danger" },
  ]);

  const [topCourses, setTopCourses] = useState([
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: "Admission Deadline", date: "Mar 15, 2024", type: "deadline", color: "danger" },
    { id: 2, title: "Faculty Meeting", date: "Mar 18, 2024", type: "meeting", color: "info" },
    { id: 3, title: "Course Launch", date: "Mar 22, 2024", type: "launch", color: "success" },
    { id: 4, title: "Student Orientation", date: "Mar 25, 2024", type: "event", color: "warning" },
  ]);

  // Mock data initialization
  useEffect(() => {
    // In real implementation, fetch from API
    // setStats(fetchStats());
    // setRecentActivities(fetchActivities());
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="h2 mb-1">Admin Dashboard</h1>
            <p className="text-muted mb-0">Welcome back! Here's what's happening with your platform today.</p>
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-end">
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-outline-primary btn-sm">Today</button>
                <button type="button" className="btn btn-outline-primary btn-sm">Week</button>
                <button type="button" className="btn btn-outline-primary btn-sm active">Month</button>
                <button type="button" className="btn btn-outline-primary btn-sm">Year</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-8">
                  <h5 className="card-title text-muted mb-1">Total Students</h5>
                  <h2 className="mb-0">{stats.totalStudents}</h2>
                  <p className="text-success mb-0">
                    <i className="fas fa-arrow-up me-1"></i>
                    12.5% from last month
                  </p>
                </div>
                <div className="col-4 text-end">
                  <div className="stat-icon">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-8">
                  <h5 className="card-title text-muted mb-1">Active Courses</h5>
                  <h2 className="mb-0">{stats.activeCourses}</h2>
                  <p className="text-success mb-0">
                    <i className="fas fa-arrow-up me-1"></i>
                    3 new this month
                  </p>
                </div>
                <div className="col-4 text-end">
                  <div className="stat-icon">
                    <i className="fas fa-book"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-8">
                  <h5 className="card-title text-muted mb-1">Pending Apps</h5>
                  <h2 className="mb-0">{stats.pendingApplications}</h2>
                  <p className="text-danger mb-0">
                    <i className="fas fa-clock me-1"></i>
                    Requires attention
                  </p>
                </div>
                <div className="col-4 text-end">
                  <div className="stat-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-8">
                  <h5 className="card-title text-muted mb-1">Total Revenue</h5>
                  <h2 className="mb-0">${(stats.revenue / 1000).toFixed(1)}K</h2>
                  <p className="text-success mb-0">
                    <i className="fas fa-arrow-up me-1"></i>
                    18.2% from last month
                  </p>
                </div>
                <div className="col-4 text-end">
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Overview */}
      <div className="row mb-4">
        <div className="col-xl-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Platform Overview</h5>
              <select className="form-select form-select-sm w-auto">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option selected>Last 90 days</option>
              </select>
            </div>
            <div className="card-body">
              {/* Chart placeholder */}
              <div className="chart-placeholder d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Chart visualization will appear here</p>
                  <p className="small text-muted">Showing trends for student enrollment and course completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Upcoming Events</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="list-group-item border-0 py-3">
                    <div className="d-flex align-items-center">
                      <div className={`event-indicator bg-${event.color} me-3`}></div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{event.title}</h6>
                        <small className="text-muted">
                          <i className="far fa-calendar me-1"></i>
                          {event.date}
                        </small>
                      </div>
                      <span className={`badge bg-${event.color}-subtle text-${event.color}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer bg-white border-0">
              <NavLink to="/admin/calendar" className="btn btn-link btn-sm text-decoration-none">
                View All Events <i className="fas fa-arrow-right ms-1"></i>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Top Courses */}
      <div className="row mb-4">
        <div className="col-xl-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Recent Activities</h5>
              <button className="btn btn-sm btn-outline-primary">
                <i className="fas fa-sync-alt me-1"></i> Refresh
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Time</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map(activity => (
                      <tr key={activity.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="activity-icon me-3">
                              <i className={`fas ${activity.icon} text-${activity.color}`}></i>
                            </div>
                            <div>
                              <div className="fw-medium">{activity.user}</div>
                            </div>
                          </div>
                        </td>
                        <td>{activity.action}</td>
                        <td>
                          <span className="text-muted">{activity.time}</span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-secondary">
                            <i className="fas fa-ellipsis-h"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Top Performing Courses</h5>
              <NavLink to="/admin/courses" className="btn btn-sm btn-outline-primary">
                View All
              </NavLink>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Course Name</th>
                      <th>Students</th>
                      <th>Revenue</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCourses.map(course => (
                      <tr key={course.id}>
                        <td>
                          <div className="fw-medium">{course.name}</div>
                          <small className="text-muted">ID: CRS-{course.id.toString().padStart(3, '0')}</small>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary">
                            {course.students} students
                          </span>
                        </td>
                        <td>${course.revenue.toLocaleString()}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                              <div 
                                className="progress-bar" 
                                role="progressbar" 
                                style={{ width: `${course.progress}%` }}
                                aria-valuenow={course.progress}
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <small>{course.progress}%</small>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="row">
        <div className="col-12 mb-4">
          <h4 className="mb-3">Quick Actions</h4>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card action-card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="action-icon mb-3">
                <i className="fas fa-user-plus"></i>
              </div>
              <h5 className="card-title">Add New Student</h5>
              <p className="card-text text-muted small">Manually enroll a new student to the platform</p>
              <NavLink to="/admin/students/add" className="btn btn-primary btn-sm w-100">
                Enroll Now
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card action-card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="action-icon mb-3">
                <i className="fas fa-book-medical"></i>
              </div>
              <h5 className="card-title">Create Course</h5>
              <p className="card-text text-muted small">Design and publish a new course for students</p>
              <NavLink to="/admin/courses/create" className="btn btn-success btn-sm w-100">
                Create Course
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card action-card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="action-icon mb-3">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h5 className="card-title">View Reports</h5>
              <p className="card-text text-muted small">Generate detailed analytics and performance reports</p>
              <NavLink to="/admin/reports" className="btn btn-info btn-sm w-100">
                Generate Report
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card action-card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="action-icon mb-3">
                <i className="fas fa-cog"></i>
              </div>
              <h5 className="card-title">System Settings</h5>
              <p className="card-text text-muted small">Configure platform settings and preferences</p>
              <NavLink to="/admin/settings" className="btn btn-warning btn-sm w-100">
                Configure
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .admin-dashboard {
          padding: 20px;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        /* Dashboard Header */
        .dashboard-header h1 {
          color: #2c3e50;
          font-weight: 600;
        }

        /* Stat Cards */
        .stat-card {
          border-radius: 10px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }

        .stat-card:nth-child(2) .stat-icon {
          background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
        }

        .stat-card:nth-child(3) .stat-icon {
          background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
        }

        .stat-card:nth-child(4) .stat-icon {
          background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
        }

        /* Chart Placeholder */
        .chart-placeholder {
          height: 300px;
          background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 8px;
          border: 2px dashed #dee2e6;
        }

        /* Event Indicator */
        .event-indicator {
          width: 8px;
          height: 40px;
          border-radius: 4px;
        }

        /* Activity Icon */
        .activity-icon {
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Action Cards */
        .action-card {
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .action-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
          border-color: #e0e0e0;
        }

        .action-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 28px;
        }

        .action-card:nth-child(2) .action-icon {
          background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
        }

        .action-card:nth-child(3) .action-icon {
          background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
        }

        .action-card:nth-child(4) .action-icon {
          background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
        }

        /* Progress Bar Custom */
        .progress {
          background-color: #e9ecef;
          border-radius: 10px;
        }

        .progress-bar {
          background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
          border-radius: 10px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 15px;
          }
          
          .dashboard-header .btn-group {
            width: 100%;
            margin-top: 10px;
          }
          
          .dashboard-header .btn-group .btn {
            flex: 1;
          }
        }

        @media (max-width: 576px) {
          .stat-card .row .col-8,
          .stat-card .row .col-4 {
            width: 100%;
            text-align: center;
          }
          
          .stat-icon {
            margin: 0 auto;
            margin-top: 10px;
          }
        }

        /* Table hover effects */
        .table-hover tbody tr:hover {
          background-color: rgba(102, 126, 234, 0.05);
        }

        /* Badge styles */
        .bg-primary-subtle {
          background-color: rgba(102, 126, 234, 0.1) !important;
        }
        
        .bg-success-subtle {
          background-color: rgba(76, 175, 80, 0.1) !important;
        }
        
        .bg-info-subtle {
          background-color: rgba(33, 150, 243, 0.1) !important;
        }
        
        .bg-warning-subtle {
          background-color: rgba(255, 152, 0, 0.1) !important;
        }
        
        .bg-danger-subtle {
          background-color: rgba(244, 67, 54, 0.1) !important;
        }
      `}</style>
    </div>
  );
};