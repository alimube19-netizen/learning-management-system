import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from './AuthProvider'
import axios from 'axios'

export const Dashboard = () => {
    const { user } = useContext(AuthContext)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch courses API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // Fetch courses based on user's semester
                const semester = user.semester || 1
                const response = await axios.get('http://localhost:5000/api/courses', {
                    params: { semester }
                })
                
                setCourses(response.data.courses)
                
            } catch (err) {
                console.error('Error fetching courses:', err)
                setError(err.response?.data?.error || 'Failed to load courses. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchCourses()
        }
    }, [])

    // Sample data for other sections (keep as is)
    const assignments = [
        { title: 'Algebra Homework', due: 'Dec 15', status: 'Pending' },
        { title: 'Programming Project', due: 'Dec 18', status: 'Submitted' }
    ]

    const upcomingClasses = [
        { title: 'Mathematics 101', time: '10:00 AM' },
        { title: 'Computer Science', time: '02:00 PM' }
    ]

    // Stats based on fetched courses
    const stats = {
        activeCourses: courses.length,
        assignments: assignments.length,
        completed: 0,
        attendance: 85
    }

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading courses...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={() => window.location.reload()}
                >
                    Retry Loading Courses
                </button>
            </div>
        )
    }

    return (
        <div className="container py-2">
            {/* Page Title Heading */}
            <div className="page-title-section mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="page-title mb-1">Dashboard</h1>
                        <p className="page-subtitle text-muted mb-0">
                            Welcome back, <strong>{user.fullname}</strong>! Here's your learning overview.
                        </p>
                    </div>
                    <div className="text-end">
                        <div className="badge bg-primary p-2">
                            <i className="fas fa-graduation-cap me-2"></i>
                            {user.department_name}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="row mb-4">
                <div className="col-md-3 col-sm-6 mb-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2">Active Courses</h6>
                            <h3 className="card-title mb-0">{stats.activeCourses}</h3>
                            <small>Semester {user.semester || 1}</small>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-sm-6 mb-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2">Assignments</h6>
                            <h3 className="card-title mb-0">{stats.assignments}</h3>
                            <small>{assignments.filter(a => a.status === 'Pending').length} pending</small>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-sm-6 mb-3">
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2">Completed</h6>
                            <h3 className="card-title mb-0">{stats.completed}</h3>
                            <small>Courses completed</small>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-sm-6 mb-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2">Attendance</h6>
                            <h3 className="card-title mb-0">{stats.attendance}%</h3>
                            <small>Overall attendance</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Left Column - Courses */}
                <div className="col-lg-8 mb-4">
                    {/* Course List */}
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">My Courses (Semester {user.semester || 1})</h5>
                            <span className="badge bg-secondary">{courses.length} courses</span>
                        </div>
                        <div className="card-body">
                            {courses.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Course Title</th>
                                                <th>Credits</th>
                                                <th>Type</th>
                                                <th>Category</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course) => (
                                                <tr key={course.course_id || course.course_code}>
                                                    <td>
                                                        <strong>{course.course_code}</strong>
                                                    </td>
                                                    <td>{course.course_title}</td>
                                                    <td>
                                                        <span className="badge bg-info">
                                                            {course.credit_hours} credits
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${course.course_type === 'Theory' ? 'bg-primary' : 'bg-success'}`}>
                                                            {course.course_type}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-secondary">
                                                            {course.course_category}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-book fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No courses found for semester {user.semester || 1}.</p>
                                    <button 
                                        className="btn btn-outline-primary"
                                        onClick={() => window.location.href = '/courses'}
                                    >
                                        Browse All Courses
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Classes */}
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Upcoming Classes</h5>
                        </div>
                        <div className="card-body">
                            {upcomingClasses.map((classItem, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                    <div>
                                        <h6 className="mb-1">{classItem.title}</h6>
                                    </div>
                                    <div>
                                        <span className="badge bg-light text-dark me-2">
                                            {classItem.time}
                                        </span>
                                        <button className="btn btn-sm btn-primary">Join</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Assignments */}
                <div className="col-lg-4">
                    {/* Assignments */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Assignments</h5>
                        </div>
                        <div className="card-body">
                            {assignments.map((assignment, index) => (
                                <div key={index} className="mb-3 p-2 border rounded">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="mb-1">{assignment.title}</h6>
                                            <small className="text-muted">Due: {assignment.due}</small>
                                        </div>
                                        <span className={`badge ${assignment.status === 'Submitted' ? 'bg-success' : 'bg-warning'}`}>
                                            {assignment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-primary">Submit Assignment</button>
                                <button className="btn btn-outline-success">Study Materials</button>
                                <button className="btn btn-outline-info">View Schedule</button>
                                <button className="btn btn-outline-warning">Check Grades</button>
                            </div>
                        </div>
                    </div>

                    {/* Admission Alert */}
                    {!user.flag && (
                        <div className="alert alert-warning">
                            <h6>Admission Required</h6>
                            <p className="mb-2">You have not applied for admission yet.</p>
                            <button className="btn btn-warning btn-sm">
                                Fill Admission Form
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Styles */}
            <style jsx="true">{`
                .page-title-section {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border-left: 4px solid #3498db;
                }

                .page-title {
                    color: #2c3e50;
                    font-weight: 700;
                    font-size: 1.8rem;
                    margin: 0;
                }

                .page-subtitle {
                    font-size: 0.95rem;
                    color: #7f8c8d;
                }

                @media (max-width: 768px) {
                    .page-title-section .d-flex {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 10px;
                    }
                    
                    .page-title-section .text-end {
                        width: 100%;
                        text-align: left !important;
                    }
                    
                    .page-title {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    )
}