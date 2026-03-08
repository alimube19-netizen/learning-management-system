import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthProvider'
import axios from 'axios'

export const MyGrades = () => {
    const { user } = useContext(AuthContext)
    const [grades, setGrades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState('all')
    const [selectedYear, setSelectedYear] = useState('all')
    const [gpa, setGpa] = useState(0.0)
    const [cgpa, setCgpa] = useState(0.0)

    // Fetch grades from API
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // TODO: Replace with your actual grades API endpoint
                // For now, using courses API as placeholder
                const response = await axios.get('http://localhost:5000/api/courses', {
                    params: { semester: user?.semester || 1 }
                })
                
                // Transform courses data to grades format with empty grades
                const coursesData = response.data.courses || []
                const gradesData = coursesData.map(course => ({
                    course_id: course.course_id,
                    course_code: course.course_code,
                    course_title: course.course_title,
                    credit_hours: course.credit_hours,
                    grade: "", // Empty grade
                    grade_points: 0.0, // Zero grade points
                    semester: course.semester,
                    year: course.year_of_study,
                    status: "Not Graded",
                    attendance: "0%",
                    instructor: "TBA",
                    exam_date: "Not Scheduled",
                    remarks: "Grade pending"
                }))
                
                setGrades(gradesData)
                
                // Get unique semesters and years
                const uniqueSemesters = [...new Set(gradesData.map(g => g.semester))].sort()
                const uniqueYears = [...new Set(gradesData.map(g => g.year))].sort()
                
                // Initialize GPA and CGPA as 0.0
                setGpa(0.0)
                setCgpa(0.0)
                
                setLoading(false)
                
            } catch (err) {
                console.error('Error fetching grades:', err)
                setError(err.response?.data?.error || 'Failed to load grades. Please try again later.')
                setLoading(false)
            }
        }

        if (user) {
            fetchGrades()
        }
    }, [])

    // Filter grades based on selected filters
    const filteredGrades = grades.filter(grade => {
        if (selectedSemester !== 'all' && grade.semester !== parseInt(selectedSemester)) return false
        if (selectedYear !== 'all' && grade.year !== selectedYear) return false
        return true
    })

    // Calculate statistics
    const stats = {
        totalCourses: filteredGrades.length,
        gradedCourses: filteredGrades.filter(g => g.grade !== "").length,
        pendingGrades: filteredGrades.filter(g => g.grade === "").length,
        totalCredits: filteredGrades.reduce((sum, course) => sum + course.credit_hours, 0),
        completedCredits: filteredGrades
            .filter(g => g.grade !== "")
            .reduce((sum, course) => sum + course.credit_hours, 0)
    }

    // Get unique semesters and years for filters
    const semesters = [...new Set(grades.map(g => g.semester))].sort((a, b) => a - b)
    const years = [...new Set(grades.map(g => g.year))].sort()

    // Reset filters
    const resetFilters = () => {
        setSelectedSemester('all')
        setSelectedYear('all')
    }

    // Handle grade refresh
    const refreshGrades = async () => {
        setLoading(true)
        setError(null)
        
        try {
            // TODO: Replace with actual grades API
            const response = await axios.get('http://localhost:5000/api/courses', {
                params: { semester: user?.semester || 1 }
            })
            
            const coursesData = response.data.courses || []
            const gradesData = coursesData.map(course => ({
                course_id: course.course_id,
                course_code: course.course_code,
                course_title: course.course_title,
                credit_hours: course.credit_hours,
                grade: "",
                grade_points: 0.0,
                semester: course.semester,
                year: course.year_of_study,
                status: "Not Graded",
                attendance: "0%",
                instructor: "TBA",
                exam_date: "Not Scheduled",
                remarks: "Grade pending"
            }))
            
            setGrades(gradesData)
            setGpa(0.0)
            setCgpa(0.0)
            
        } catch (err) {
            setError('Failed to refresh grades. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center">
                    <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <h5>Please login to view grades</h5>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="mb-5">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <h1 className="display-6 fw-bold text-primary mb-2">
                            <i className="fas fa-chart-line me-2"></i>
                            My Grades
                        </h1>
                        <p className="lead text-muted mb-0">
                            Track your academic performance and grades. All grades are currently pending.
                        </p>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <div className="d-flex gap-2 justify-content-lg-end">
                            <button 
                                className="btn btn-outline-primary"
                                onClick={refreshGrades}
                                disabled={loading}
                            >
                                <i className="fas fa-redo me-1"></i> Refresh
                            </button>
                            <button className="btn btn-outline-secondary">
                                <i className="fas fa-download me-1"></i> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* GPA/CGPA Overview */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="card bg-gradient-primary text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-1">Current GPA</h6>
                                    <h1 className="card-title display-4 fw-bold mb-0">{gpa.toFixed(2)}</h1>
                                    <small className="opacity-75">No grades available yet</small>
                                </div>
                                <div className="display-1 opacity-50">
                                    <i className="fas fa-chart-bar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 mb-3">
                    <div className="card bg-gradient-success text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-1">Cumulative GPA</h6>
                                    <h1 className="card-title display-4 fw-bold mb-0">{cgpa.toFixed(2)}</h1>
                                    <small className="opacity-75">Overall performance</small>
                                </div>
                                <div className="display-1 opacity-50">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 bg-light shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-book text-primary fa-2x"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="card-title mb-0">{stats.totalCourses}</h5>
                                    <small className="text-muted">Total Courses</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 bg-light shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-check-circle text-success fa-2x"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="card-title mb-0">{stats.gradedCourses}</h5>
                                    <small className="text-muted">Graded Courses</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 bg-light shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-clock text-warning fa-2x"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="card-title mb-0">{stats.pendingGrades}</h5>
                                    <small className="text-muted">Pending Grades</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 bg-light shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-star text-info fa-2x"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="card-title mb-0">{stats.totalCredits}</h5>
                                    <small className="text-muted">Total Credits</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="fas fa-filter"></i>
                                </span>
                                <select 
                                    className="form-select"
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="all">All Semesters</option>
                                    {semesters.map(sem => (
                                        <option key={sem} value={sem}>Semester {sem}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="fas fa-calendar"></i>
                                </span>
                                <select 
                                    className="form-select"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="all">All Years</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-outline-secondary flex-grow-1"
                                    onClick={resetFilters}
                                    disabled={loading}
                                >
                                    <i className="fas fa-redo me-1"></i> Reset Filters
                                </button>
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => setSelectedSemester(user?.semester?.toString() || '1')}
                                    disabled={loading}
                                >
                                    Current Semester
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="mt-4">Loading Grades...</h4>
                    <p className="text-muted">Fetching your academic records</p>
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

            {/* Empty State - No Grades Yet */}
            {!loading && !error && filteredGrades.length === 0 && (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-clipboard-list fa-4x text-muted opacity-50"></i>
                    </div>
                    <h4 className="text-muted mb-3">No Grades Available</h4>
                    <p className="text-muted mb-4">
                        You haven't been enrolled in any courses yet, or grades are not published.
                    </p>
                    <button 
                        className="btn btn-primary"
                        onClick={refreshGrades}
                    >
                        <i className="fas fa-redo me-2"></i> Check Again
                    </button>
                </div>
            )}

            {/* Grades Table */}
            {!loading && !error && filteredGrades.length > 0 && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">
                            {filteredGrades.length} courses found
                            {selectedSemester !== 'all' && ` • Semester ${selectedSemester}`}
                        </h5>
                        <div className="text-muted small">
                            Showing {stats.gradedCourses} graded, {stats.pendingGrades} pending
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="ps-4">Course Code</th>
                                            <th scope="col">Course Title</th>
                                            <th scope="col" className="text-center">Credits</th>
                                            <th scope="col" className="text-center">Semester</th>
                                            <th scope="col" className="text-center">Year</th>
                                            <th scope="col" className="text-center">Grade</th>
                                            <th scope="col" className="text-center">Grade Points</th>
                                            <th scope="col" className="text-center">Status</th>
                                            <th scope="col" className="text-center">Attendance</th>
                                            <th scope="col" className="text-center">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredGrades.map((grade) => (
                                            <tr key={grade.course_id} className="align-middle">
                                                <td className="ps-4 fw-bold text-primary">
                                                    {grade.course_code}
                                                </td>
                                                <td>{grade.course_title}</td>
                                                <td className="text-center">
                                                    <span className="badge bg-info rounded-pill px-3 py-1">
                                                        {grade.credit_hours} Cr
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span className="badge bg-secondary rounded-pill px-3 py-1">
                                                        Sem {grade.semester}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <small>{grade.year}</small>
                                                </td>
                                                <td className="text-center">
                                                    {grade.grade ? (
                                                        <span className="badge bg-success rounded-pill px-3 py-2 fw-bold">
                                                            {grade.grade}
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-light text-muted rounded-pill px-3 py-2">
                                                            <i className="fas fa-clock me-1"></i> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {grade.grade_points > 0 ? (
                                                        <span className="fw-bold text-primary">
                                                            {grade.grade_points.toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge ${
                                                        grade.status === "Completed" ? "bg-success" :
                                                        grade.status === "In Progress" ? "bg-warning" :
                                                        "bg-light text-dark"
                                                    } rounded-pill px-3 py-1`}>
                                                        {grade.status}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="progress" style={{ height: '8px', width: '80px', margin: '0 auto' }}>
                                                        <div 
                                                            className={`progress-bar ${
                                                                parseInt(grade.attendance) >= 80 ? "bg-success" :
                                                                parseInt(grade.attendance) >= 60 ? "bg-warning" : "bg-danger"
                                                            }`}
                                                            role="progressbar"
                                                            style={{ width: grade.attendance }}
                                                        ></div>
                                                    </div>
                                                    <small className="text-muted">{grade.attendance}</small>
                                                </td>
                                                <td className="text-center">
                                                    <small className="text-muted">{grade.remarks}</small>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {/* Summary Footer */}
                        <div className="card-footer bg-light border-0">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <small className="text-muted">
                                        <i className="fas fa-info-circle me-1"></i>
                                        All grades are calculated on a 4.0 scale
                                    </small>
                                </div>
                                <div className="col-md-6 text-md-end">
                                    <div className="d-flex justify-content-md-end gap-3">
                                        <div className="text-end">
                                            <div className="text-muted small">Total Credits</div>
                                            <div className="fw-bold">{stats.totalCredits}</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-muted small">Earned Credits</div>
                                            <div className="fw-bold">{stats.completedCredits}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grade Legend */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="mb-3">
                                        <i className="fas fa-key me-2"></i>
                                        Grade Legend
                                    </h6>
                                    <div className="row">
                                        <div className="col-md-3 col-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="badge bg-success rounded-pill me-2 px-3">A</span>
                                                <small>4.0 (Excellent)</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="badge bg-info rounded-pill me-2 px-3">B</span>
                                                <small>3.0 (Good)</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="badge bg-warning rounded-pill me-2 px-3">C</span>
                                                <small>2.0 (Average)</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="badge bg-light text-dark rounded-pill me-2 px-3">
                                                    <i className="fas fa-clock"></i>
                                                </span>
                                                <small>Pending Grade</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Note for Empty Grades */}
                    <div className="alert alert-info mt-4">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-info-circle fa-2x me-3"></i>
                            <div>
                                <h6 className="mb-1">No Grades Published Yet</h6>
                                <p className="mb-0">
                                    Your grades will appear here once they are published by your instructors. 
                                    Please check back after your semester exams are complete.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}