// ManageResources.jsx
import React, { useState } from 'react';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newResource, setNewResource] = useState({
    name: '',
    url: '',
    type: 'link',
    description: '',
    courseId: '',
    category: 'general',
    tags: '',
    access: 'public'
  });

  const resourceTypes = [
    { id: 'link', name: 'External Link', icon: 'bi-link' },
    { id: 'video', name: 'Video', icon: 'bi-play-circle' },
    { id: 'book', name: 'Book/PDF', icon: 'bi-book' },
    { id: 'tool', name: 'Tool/Software', icon: 'bi-tools' },
    { id: 'article', name: 'Article', icon: 'bi-newspaper' },
    { id: 'repository', name: 'Code Repository', icon: 'bi-github' },
    { id: 'forum', name: 'Forum/Discussion', icon: 'bi-chat' }
  ];

  const categories = [
    'general', 'programming', 'mathematics', 'science', 'business', 
    'design', 'research', 'tutorial', 'reference', 'project'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    
    if (!newResource.name || !newResource.url) {
      alert('Name and URL are required');
      return;
    }

    const resourceToAdd = {
      id: Date.now().toString(),
      ...newResource,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clicks: 0,
      rating: 0,
      tags: newResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setResources(prev => [resourceToAdd, ...prev]);
    setNewResource({
      name: '',
      url: '',
      type: 'link',
      description: '',
      courseId: '',
      category: 'general',
      tags: '',
      access: 'public'
    });
    setShowAddForm(false);
  };

  const handleUpdateResource = (e) => {
    e.preventDefault();
    
    if (!editingResource.name || !editingResource.url) {
      alert('Name and URL are required');
      return;
    }

    setResources(prev => prev.map(resource => 
      resource.id === editingResource.id 
        ? { 
            ...editingResource, 
            updatedAt: new Date().toISOString(),
            tags: editingResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          }
        : resource
    ));
    setEditingResource(null);
  };

  const deleteResource = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(prev => prev.filter(resource => resource.id !== id));
    }
  };

  const startEditing = (resource) => {
    setEditingResource({
      ...resource,
      tags: Array.isArray(resource.tags) ? resource.tags.join(', ') : resource.tags || ''
    });
  };

  const cancelEditing = () => {
    setEditingResource(null);
  };

  const handleResourceClick = (id) => {
    setResources(prev => prev.map(resource => 
      resource.id === id 
        ? { ...resource, clicks: resource.clicks + 1 }
        : resource
    ));
  };

  const loadSampleData = () => {
    setLoading(true);
    
    setTimeout(() => {
      const sampleResources = [
        {
          id: '1',
          name: 'React Official Documentation',
          url: 'https://reactjs.org',
          type: 'link',
          description: 'Official React documentation and guides',
          courseId: 'CS301',
          category: 'programming',
          tags: ['react', 'frontend', 'javascript'],
          access: 'public',
          clicks: 45,
          rating: 4,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Data Structures Visualizations',
          url: 'https://visualgo.net',
          type: 'tool',
          description: 'Interactive data structures and algorithms visualizations',
          courseId: 'CS201',
          category: 'programming',
          tags: ['algorithms', 'visualization', 'learning'],
          access: 'public',
          clicks: 89,
          rating: 5,
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z'
        },
        {
          id: '3',
          name: 'Khan Academy - Calculus',
          url: 'https://khanacademy.org/math/calculus',
          type: 'video',
          description: 'Free calculus tutorials and practice exercises',
          courseId: 'MATH101',
          category: 'mathematics',
          tags: ['calculus', 'tutorial', 'free'],
          access: 'public',
          clicks: 120,
          rating: 4,
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-05T09:15:00Z'
        }
      ];
      
      setResources(sampleResources);
      setLoading(false);
    }, 1000);
  };

  const clearAllResources = () => {
    if (window.confirm('Are you sure you want to clear all resources?')) {
      setResources([]);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.tags && Array.isArray(resource.tags) && 
                          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const getResourceIcon = (type) => {
    const typeObj = resourceTypes.find(t => t.id === type);
    return typeObj ? typeObj.icon : 'bi-link';
  };

  const getTypeColor = (type) => {
    const colors = {
      link: 'primary',
      video: 'danger',
      book: 'success',
      tool: 'warning',
      article: 'info',
      repository: 'dark',
      forum: 'secondary'
    };
    return colors[type] || 'primary';
  };

  const getTypeName = (type) => {
    const typeObj = resourceTypes.find(t => t.id === type);
    return typeObj ? typeObj.name : 'Link';
  };

  return (
    <div className="container-fluid manage-resources py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-3">Manage Resources</h1>
          <p className="text-muted mb-4">
            Organize and manage external learning resources and references
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="flex-grow-1">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="d-flex flex-wrap gap-2">
                  <select
                    className="form-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="all">All Types</option>
                    {resourceTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  
                  <select
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                  
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Resource
                  </button>
                  
                  <button
                    className="btn btn-outline-secondary"
                    onClick={loadSampleData}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Load Sample
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Add/Edit Form */}
        <div className="col-lg-4 mb-4">
          {(showAddForm || editingResource) && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i>
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={editingResource ? handleUpdateResource : handleAddResource}>
                  <div className="mb-3">
                    <label className="form-label">Resource Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editingResource ? editingResource.name : newResource.name}
                      onChange={editingResource ? handleEditInputChange : handleInputChange}
                      placeholder="Enter resource name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL *</label>
                    <input
                      type="url"
                      className="form-control"
                      name="url"
                      value={editingResource ? editingResource.url : newResource.url}
                      onChange={editingResource ? handleEditInputChange : handleInputChange}
                      placeholder="https://example.com"
                      required
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        name="type"
                        value={editingResource ? editingResource.type : newResource.type}
                        onChange={editingResource ? handleEditInputChange : handleInputChange}
                      >
                        {resourceTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={editingResource ? editingResource.category : newResource.category}
                        onChange={editingResource ? handleEditInputChange : handleInputChange}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={editingResource ? editingResource.description : newResource.description}
                      onChange={editingResource ? handleEditInputChange : handleInputChange}
                      placeholder="Describe the resource and how it's useful..."
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Course ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="courseId"
                        value={editingResource ? editingResource.courseId : newResource.courseId}
                        onChange={editingResource ? handleEditInputChange : handleInputChange}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Access</label>
                      <select
                        className="form-select"
                        name="access"
                        value={editingResource ? editingResource.access : newResource.access}
                        onChange={editingResource ? handleEditInputChange : handleInputChange}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="restricted">Restricted</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tags"
                      value={editingResource ? editingResource.tags : newResource.tags}
                      onChange={editingResource ? handleEditInputChange : handleInputChange}
                      placeholder="react, javascript, tutorial"
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-warning flex-grow-1"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      {editingResource ? 'Update Resource' : 'Add Resource'}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        if (editingResource) {
                          cancelEditing();
                        } else {
                          setShowAddForm(false);
                          setNewResource({
                            name: '',
                            url: '',
                            type: 'link',
                            description: '',
                            courseId: '',
                            category: 'general',
                            tags: '',
                            access: 'public'
                          });
                        }
                      }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Statistics Card */}
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Resource Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-primary">{resources.length}</div>
                    <small className="text-muted">Total Resources</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-success">
                      {resources.filter(r => r.access === 'public').length}
                    </div>
                    <small className="text-muted">Public</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-warning">
                      {resources.reduce((total, r) => total + r.clicks, 0)}
                    </div>
                    <small className="text-muted">Total Clicks</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <div className="h4 mb-0 text-danger">
                      {resources.length > 0 
                        ? (resources.reduce((total, r) => total + r.rating, 0) / resources.length).toFixed(1)
                        : '0.0'}
                    </div>
                    <small className="text-muted">Avg. Rating</small>
                  </div>
                </div>
              </div>
              
              {resources.length > 0 && (
                <div className="mt-3">
                  <h6>Resource Types</h6>
                  {resourceTypes.map(type => {
                    const count = resources.filter(r => r.type === type.id).length;
                    if (count === 0) return null;
                    
                    return (
                      <div key={type.id} className="d-flex justify-content-between align-items-center mb-2">
                        <span>
                          <i className={`bi ${type.icon} me-2 text-${getTypeColor(type.id)}`}></i>
                          {type.name}
                        </span>
                        <span className="badge bg-secondary">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Resources List */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-0">Resources List</h5>
                <div className="d-flex gap-2 mt-2 mt-sm-0">
                  <span className="badge bg-primary">
                    {filteredResources.length} resources
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={clearAllResources}
                    disabled={resources.length === 0}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {filteredResources.length > 0 ? (
                <div className="resources-list">
                  {filteredResources.map(resource => (
                    <div key={resource.id} className="resource-item card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1 me-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className={`bi ${getResourceIcon(resource.type)} text-${getTypeColor(resource.type)} me-2`}></i>
                              <h6 className="mb-0">
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-decoration-none"
                                  onClick={() => handleResourceClick(resource.id)}
                                >
                                  {resource.name}
                                </a>
                              </h6>
                              <span className={`badge ms-2 bg-${getTypeColor(resource.type)}`}>
                                {getTypeName(resource.type)}
                              </span>
                              <span className={`badge ms-2 bg-${resource.access === 'public' ? 'success' : 'warning'}`}>
                                {resource.access}
                              </span>
                            </div>
                            
                            <p className="small text-muted mb-2">{resource.description}</p>
                            
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              <small className="text-muted">
                                <i className="bi bi-link me-1"></i>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                  {resource.url.length > 50 ? resource.url.substring(0, 50) + '...' : resource.url}
                                </a>
                              </small>
                              
                              {resource.courseId && (
                                <small className="text-muted">
                                  <i className="bi bi-journal-text me-1"></i>
                                  {resource.courseId}
                                </small>
                              )}
                            </div>
                            
                            {resource.tags && resource.tags.length > 0 && (
                              <div className="mb-2">
                                {resource.tags.map((tag, index) => (
                                  <span key={index} className="badge bg-light text-dark me-1 mb-1">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                Added: {new Date(resource.createdAt).toLocaleDateString()}
                              </small>
                              <div className="d-flex gap-3">
                                <small className="text-muted">
                                  <i className="bi bi-mouse me-1"></i>
                                  {resource.clicks} clicks
                                </small>
                                <small className="text-muted">
                                  <i className="bi bi-star me-1"></i>
                                  {resource.rating}/5
                                </small>
                              </div>
                            </div>
                          </div>
                          
                          <div className="btn-group btn-group-sm flex-shrink-0">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => startEditing(resource)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => deleteResource(resource.id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-box-seam text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">No Resources Found</h5>
                  <p className="text-muted">
                    {resources.length === 0 
                      ? 'Add your first resource using the "Add Resource" button.'
                      : 'No resources match your current filters.'}
                  </p>
                  {resources.length === 0 && (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={loadSampleData}
                    >
                      <i className="bi bi-download me-2"></i>
                      Load Sample Resources
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="card-footer bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {filteredResources.length} of {resources.length} resources
                </small>
                <div className="d-flex gap-2">
                  <small className="text-muted">
                    <i className="bi bi-filter me-1"></i>
                    Type: {filterType === 'all' ? 'All' : getTypeName(filterType)}
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-tag me-1"></i>
                    Category: {filterCategory === 'all' ? 'All' : filterCategory}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageResources;