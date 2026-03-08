import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthProvider'
import axios from 'axios'

export const CurrentCourses = () => {
    const { user } = useContext(AuthContext)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [semester, setSemester] = useState(user?.semester || 1)

    // Fetch courses based on selected semester
    const fetchCourses = async (selectedSemester) => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await axios.get('http://localhost:5000/api/courses', {
                params: { semester: selectedSemester }
            })
            
            setCourses(response.data.courses)
            
        } catch (err) {
            console.error('Error fetching courses:', err)
            setError(err.response?.data?.error || 'Failed to load courses. Please try again later.')
            setCourses([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchCourses(semester)
        }
    }, [semester])

    // Handle semester change
    const handleSemesterChange = (e) => {
        setSemester(parseInt(e.target.value))
    }

    // Calculate total credit hours
    const totalCredits = courses.reduce((sum, course) => sum + course.credit_hours, 0)

    if (!user) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center">
                    <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <h5>Please login to view courses</h5>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-4">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <div>
                    <h2 className="fw-bold text-primary mb-2">
                        <i className="fas fa-book me-2"></i>
                        Current Courses
                    </h2>
                    <p className="text-muted mb-0">
                        View and manage your enrolled courses
                    </p>
                </div>
                
                {/* Semester Selector */}
                <div className="mt-3 mt-md-0">
                    <div className="input-group" style={{ minWidth: '250px' }}>
                        <span className="input-group-text bg-primary text-white">
                            <i className="fas fa-calendar-alt"></i>
                        </span>
                        <select 
                            className="form-select"
                            value={semester}
                            onChange={handleSemesterChange}
                            disabled={loading}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <option key={sem} value={sem}>
                                    Semester {sem}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card bg-primary bg-gradient text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-1">Total Courses</h6>
                                    <h3 className="card-title fw-bold mb-0">
                                        {loading ? '...' : courses.length}
                                    </h3>
                                </div>
                                <div className="display-5">
                                    <i className="fas fa-book-open"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4 mb-3">
                    <div className="card bg-success bg-gradient text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-1">Total Credits</h6>
                                    <h3 className="card-title fw-bold mb-0">
                                        {loading ? '...' : totalCredits}
                                    </h3>
                                </div>
                                <div className="display-5">
                                    <i className="fas fa-star"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4 mb-3">
                    <div className="card bg-info bg-gradient text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-1">Current Semester</h6>
                                    <h3 className="card-title fw-bold mb-0">
                                        {semester}
                                    </h3>
                                </div>
                                <div className="display-5">
                                    <i className="fas fa-graduation-cap"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading courses for semester {semester}...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    <strong>Error:</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {/* Courses Table */}
            {!loading && !error && (
                <>
                    {courses.length > 0 ? (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white border-0 pt-3 pb-3">
                                <h5 className="mb-0 fw-bold">
                                    <i className="fas fa-list me-2"></i>
                                    Courses for Semester {semester}
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col" className="ps-4">Code</th>
                                                <th scope="col">Course Title</th>
                                                <th scope="col" className="text-center">Credits</th>
                                                <th scope="col" className="text-center">Type</th>
                                                <th scope="col" className="text-center">Category</th>
                                                <th scope="col" className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course) => (
                                                <tr key={course.course_id} className="align-middle">
                                                    <td className="ps-4 fw-bold text-primary">
                                                        {course.course_code}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                                                                 style={{ width: '40px', height: '40px' }}>
                                                                <i className={`fas ${course.course_type === 'Lab' ? 'fa-flask' : 'fa-book'}`}></i>
                                                            </div>
                                                            <div>
                                                                <div className="fw-medium">{course.course_title}</div>
                                                                <small className="text-muted">
                                                                    Year: {course.year_of_study}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-primary rounded-pill px-3 py-2">
                                                            {course.credit_hours} Cr
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={`badge ${course.course_type === 'Theory' ? 'bg-info' : 'bg-success'} rounded-pill px-3 py-2`}>
                                                            {course.course_type}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-secondary rounded-pill px-3 py-2">
                                                            {course.course_category}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="btn-group btn-group-sm" role="group">
                                                            <button 
                                                                className="btn btn-outline-primary"
                                                                title="View Details"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-success"
                                                                title="View Materials"
                                                            >
                                                                <i className="fas fa-folder-open"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-warning"
                                                                title="View Schedule"
                                                            >
                                                                <i className="fas fa-calendar-alt"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer bg-light border-0">
                                <div className="row">
                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            Showing {courses.length} courses • {totalCredits} total credit hours
                                        </small>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <button className="btn btn-outline-primary btn-sm me-2">
                                            <i className="fas fa-download me-1"></i> Export
                                        </button>
                                        <button className="btn btn-outline-secondary btn-sm">
                                            <i className="fas fa-print me-1"></i> Print
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <i className="fas fa-book fa-4x text-muted mb-4"></i>
                            </div>
                            <h4 className="text-muted mb-3">No Courses Found</h4>
                            <p className="text-muted mb-4">
                                No courses are available for semester {semester}.
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => fetchCourses(semester)}
                                >
                                    <i className="fas fa-redo me-2"></i> Refresh
                                </button>
                                <button className="btn btn-outline-secondary">
                                    <i className="fas fa-question-circle me-2"></i> Contact Admin
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Course Categories Summary */}
            {!loading && courses.length > 0 && (
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">
                                    <i className="fas fa-chart-pie me-2"></i>
                                    Course Categories Summary
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {Object.entries(
                                        courses.reduce((acc, course) => {
                                            acc[course.course_category] = (acc[course.course_category] || 0) + 1
                                            return acc
                                        }, {})
                                    ).map(([category, count]) => (
                                        <div key={category} className="col-md-3 col-sm-6 mb-3">
                                            <div className="border rounded p-3 text-center">
                                                <div className="fw-bold text-primary mb-1">{count}</div>
                                                <small className="text-muted">{category}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}