import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthProvider'
import axios from 'axios'

export const CourseCatalog = () => {
    const { user } = useContext(AuthContext)
    const [allCourses, setAllCourses] = useState([])
    const [filteredCourses, setFilteredCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSemester, setSelectedSemester] = useState('all')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedType, setSelectedType] = useState('all')
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

    // Fetch all courses
    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // Fetch from all-courses endpoint (create this if not exists)
                const response = await axios.get('http://localhost:5000/api/courses')
                setAllCourses(response.data.courses)
                setFilteredCourses(response.data.courses)
                
            } catch (err) {
                console.error('Error fetching courses:', err)
                setError(err.response?.data?.error || 'Failed to load course catalog. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchAllCourses()
    }, [])

    // Apply filters
    useEffect(() => {
        let filtered = allCourses

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            filtered = filtered.filter(course =>
                course.course_code.toLowerCase().includes(term) ||
                course.course_title.toLowerCase().includes(term) ||
                course.course_category.toLowerCase().includes(term)
            )
        }

        // Apply semester filter
        if (selectedSemester !== 'all') {
            filtered = filtered.filter(course => course.semester === parseInt(selectedSemester))
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(course => course.course_category === selectedCategory)
        }

        // Apply type filter
        if (selectedType !== 'all') {
            filtered = filtered.filter(course => course.course_type === selectedType)
        }

        setFilteredCourses(filtered)
    }, [searchTerm, selectedSemester, selectedCategory, selectedType, allCourses])

    // Get unique values for filters
    const semesters = [...new Set(allCourses.map(course => course.semester))].sort((a, b) => a - b)
    const categories = [...new Set(allCourses.map(course => course.course_category))]
    const types = [...new Set(allCourses.map(course => course.course_type))]

    // Calculate statistics
    const stats = {
        totalCourses: allCourses.length,
        filteredCourses: filteredCourses.length,
        totalCredits: allCourses.reduce((sum, course) => sum + course.credit_hours, 0),
        bySemester: semesters.reduce((acc, sem) => {
            acc[sem] = allCourses.filter(course => course.semester === sem).length
            return acc
        }, {})
    }

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('')
        setSelectedSemester('all')
        setSelectedCategory('all')
        setSelectedType('all')
    }

    // Handle course enrollment (mock function)
    const handleEnroll = (course) => {
        alert(`You have enrolled in ${course.course_code}: ${course.course_title}`)
        // Here you would call your enrollment API
    }

    // Course Card Component for Grid View
    const CourseCard = ({ course }) => (
        <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <span className="badge bg-primary rounded-pill px-3">
                            {course.course_code}
                        </span>
                        <span className="badge bg-secondary ms-2 rounded-pill px-3">
                            {course.credit_hours} Cr
                        </span>
                    </div>
                    <div className="dropdown">
                        <button 
                            className="btn btn-sm btn-outline-secondary border-0"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item">
                                    <i className="fas fa-info-circle me-2"></i> Details
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item">
                                    <i className="fas fa-syllabus me-2"></i> Syllabus
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item">
                                    <i className="fas fa-chart-line me-2"></i> Prerequisites
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <h6 className="card-title fw-bold mb-2">{course.course_title}</h6>
                
                <p className="card-text text-muted small mb-3">
                    <i className="fas fa-graduation-cap me-1"></i>
                    {course.year_of_study} • Semester {course.semester}
                </p>

                <div className="mb-3">
                    <span className={`badge ${course.course_type === 'Theory' ? 'bg-info' : 'bg-success'} me-2`}>
                        {course.course_type}
                    </span>
                    <span className="badge bg-secondary">
                        {course.course_category}
                    </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <small className="text-muted">
                            <i className="fas fa-clock me-1"></i>
                            {course.credit_hours} hours/week
                        </small>
                    </div>
                    <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEnroll(course)}
                        disabled={user?.semester !== course.semester}
                    >
                        {user?.semester === course.semester ? 'Enroll' : 'Semester ' + course.semester}
                    </button>
                </div>
            </div>
        </div>
    )

    // Loading State
    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center py-5">
                    <div className="spinner-grow text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="mt-4">Loading Course Catalog...</h4>
                    <p className="text-muted">Fetching all available courses</p>
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
                            <i className="fas fa-book-open me-2"></i>
                            Course Catalog
                        </h1>
                        <p className="lead text-muted mb-0">
                            Browse and enroll in available courses. {stats.totalCourses} courses available.
                        </p>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <div className="badge bg-light text-dark p-3">
                            <i className="fas fa-user-graduate me-2"></i>
                            {user?.fullname || 'Student'}
                            {user?.department_name && ` • ${user.department_name}`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 bg-gradient-primary text-white shadow-sm">
                        <div className="card-body py-3">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-book fa-2x opacity-75"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="card-title mb-0">{stats.totalCourses}</h5>
                                    <small className="opacity-75">Total Courses</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 bg-gradient-success text-white shadow-sm">
                        <div className="card-body py-3">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-star fa-2x opacity-75"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="card-title mb-0">{stats.totalCredits}</h5>
                                    <small className="opacity-75">Total Credits</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 bg-gradient-info text-white shadow-sm">
                        <div className="card-body py-3">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-filter fa-2x opacity-75"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="card-title mb-0">{stats.filteredCourses}</h5>
                                    <small className="opacity-75">Filtered Courses</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3 col-6 mb-3">
                    <div className="card border-0 bg-gradient-warning text-white shadow-sm">
                        <div className="card-body py-3">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-calendar-alt fa-2x opacity-75"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="card-title mb-0">8</h5>
                                    <small className="opacity-75">Semesters</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3">
                        {/* Search Bar */}
                        <div className="col-lg-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search courses by code, title, or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button 
                                        className="btn btn-outline-secondary"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="col-lg-8">
                            <div className="row g-2">
                                <div className="col-md">
                                    <select 
                                        className="form-select"
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                    >
                                        <option value="all">All Semesters</option>
                                        {semesters.map(sem => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="col-md">
                                    <select 
                                        className="form-select"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="col-md">
                                    <select 
                                        className="form-select"
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                    >
                                        <option value="all">All Types</option>
                                        {types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="col-md-auto">
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-outline-secondary"
                                            onClick={resetFilters}
                                            title="Reset filters"
                                        >
                                            <i className="fas fa-redo"></i>
                                        </button>
                                        
                                        <div className="btn-group" role="group">
                                            <button 
                                                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setViewMode('grid')}
                                                title="Grid View"
                                            >
                                                <i className="fas fa-th-large"></i>
                                            </button>
                                            <button 
                                                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setViewMode('list')}
                                                title="List View"
                                            >
                                                <i className="fas fa-list"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                    {filteredCourses.length} courses found
                    {selectedSemester !== 'all' && ` • Semester ${selectedSemester}`}
                </h5>
                <div className="text-muted small">
                    {selectedCategory !== 'all' && <span className="me-3">Category: {selectedCategory}</span>}
                    {selectedType !== 'all' && <span>Type: {selectedType}</span>}
                </div>
            </div>

            {/* Courses Display */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-search fa-4x text-muted opacity-50"></i>
                    </div>
                    <h4 className="text-muted mb-3">No Courses Found</h4>
                    <p className="text-muted mb-4">
                        Try adjusting your filters or search term
                    </p>
                    <button 
                        className="btn btn-primary"
                        onClick={resetFilters}
                    >
                        <i className="fas fa-redo me-2"></i> Reset Filters
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                // Grid View
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {filteredCourses.map(course => (
                        <div key={course.course_id} className="col">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            ) : (
                // List View
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="ps-4">Code</th>
                                        <th scope="col">Course Title</th>
                                        <th scope="col" className="text-center">Semester</th>
                                        <th scope="col" className="text-center">Credits</th>
                                        <th scope="col" className="text-center">Type</th>
                                        <th scope="col" className="text-center">Category</th>
                                        <th scope="col" className="text-center">Year</th>
                                        <th scope="col" className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map(course => (
                                        <tr key={course.course_id} className="align-middle">
                                            <td className="ps-4 fw-bold text-primary">
                                                {course.course_code}
                                            </td>
                                            <td>
                                                <div className="fw-medium">{course.course_title}</div>
                                                {course.description && (
                                                    <small className="text-muted d-block mt-1">
                                                        {course.description.substring(0, 80)}...
                                                    </small>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-secondary rounded-pill px-3 py-1">
                                                    Sem {course.semester}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-primary rounded-pill px-3 py-1">
                                                    {course.credit_hours} Cr
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${course.course_type === 'Theory' ? 'bg-info' : 'bg-success'} rounded-pill px-3 py-1`}>
                                                    {course.course_type}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-warning text-dark rounded-pill px-3 py-1">
                                                    {course.course_category}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <small className="text-muted">{course.year_of_study}</small>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleEnroll(course)}
                                                        disabled={user?.semester !== course.semester}
                                                        title={user?.semester === course.semester ? 'Enroll' : 'Available in Semester ' + course.semester}
                                                    >
                                                        <i className="fas fa-plus me-1"></i> Enroll
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-secondary">
                                                        <i className="fas fa-info-circle"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Semester Distribution */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="fas fa-chart-bar me-2"></i>
                                Courses by Semester
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {Object.entries(stats.bySemester).map(([semester, count]) => (
                                    <div key={semester} className="col-md-3 col-6 mb-3">
                                        <div className={`border rounded p-3 text-center ${selectedSemester === semester.toString() ? 'border-primary bg-light' : ''}`}>
                                            <div className="fw-bold display-6 text-primary mb-1">{count}</div>
                                            <div className="text-muted small">Semester {semester}</div>
                                            <button 
                                                className="btn btn-sm btn-link mt-2"
                                                onClick={() => setSelectedSemester(semester.toString())}
                                            >
                                                View Courses
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}