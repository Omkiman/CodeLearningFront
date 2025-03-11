import React, { useState, useEffect } from 'react';

function Crud({ darkMode }) {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // State for the form (used for both adding and editing)
  const [formData, setFormData] = useState({
    name: '',
    template: '',
    solution: '',
    explanation: ''
  });
  
  // State to track if we're editing (and which item) or adding new
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Fetch all code blocks
  const fetchCodeBlocks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/codeblocks/admin`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setCodeBlocks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch code blocks');
      console.error('Error fetching code blocks:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load code blocks on component mount
  useEffect(() => {
    fetchCodeBlocks();
  }, []);
  
  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      template: '',
      solution: '',
      explanation: ''
    });
    setEditingId(null);
    setShowForm(false);
  };
  
  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      let response;
      
      if (editingId) {
        // Update existing code block
        response = await fetch(`${apiUrl}/api/codeblocks/${editingId}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(formData)
        });
      } else {
        // Create new code block
        response = await fetch(`${apiUrl}/api/codeblocks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(formData)
        });
      }
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! Status: ${response.status}`);
      }
      
      // Only refresh the list and reset form if the operation was successful
      setSuccessMessage(editingId ? 'Code block updated successfully!' : 'Code block created successfully!');
      fetchCodeBlocks();
      resetForm();
    } catch (err) {
      // Extract more detailed error message if available
      const errorMessage = err.message || (editingId ? 'Failed to update code block' : 'Failed to create code block');
      setError(errorMessage);
      console.error('Error:', err);
      
      // Still refresh code blocks list to show current state
      // This helps when the operation actually succeeded despite error response
      fetchCodeBlocks();
    }
  };
  
  // Start editing a code block
  const handleEdit = (codeBlock) => {
    setFormData({
      name: codeBlock.name,
      template: codeBlock.template,
      solution: codeBlock.solution,
      explanation: codeBlock.explanation
    });
    setEditingId(codeBlock.id);
    setShowForm(true);
    
    // Clear any previous error or success messages
    setError(null);
    setSuccessMessage(null);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Delete a code block
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this code block? Any active sessions using this block will be terminated.')) {
      return;
    }
    
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/codeblocks/${id}`, {
        method: 'DELETE'
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        // If response is not JSON, create a default object
        responseData = { message: response.ok ? 'Operation successful' : 'Operation failed' };
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! Status: ${response.status}`);
      }
      
      setSuccessMessage('Code block deleted successfully!');
      fetchCodeBlocks();
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete code block';
      setError(errorMessage);
      console.error('Error deleting code block:', err);
      
      // Still refresh code blocks list to show current state
      fetchCodeBlocks();
    }
  };
  
  if (loading && codeBlocks.length === 0) {
    return <div className="container mt-4"><div className="alert alert-info">Loading code blocks...</div></div>;
  }
  
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Code Block Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            resetForm();
            setError(null);
            setSuccessMessage(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add New Code Block'}
        </button>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      {/* Form for adding/editing code blocks */}
      {showForm && (
        <div className={`card mb-4 ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}>
          <div className="card-header">
            <h5>{editingId ? 'Edit Code Block' : 'Add New Code Block'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="template" className="form-label">Template Code</label>
                <textarea
                  className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                  id="template"
                  name="template"
                  rows="4"
                  value={formData.template}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <small className={`form-text ${darkMode ? 'text-light' : 'text-muted'}`}>The initial code that will be presented to students.</small>
              </div>
              
              <div className="mb-3">
                <label htmlFor="solution" className="form-label">Solution Code</label>
                <textarea
                  className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                  id="solution"
                  name="solution"
                  rows="4"
                  value={formData.solution}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <small className={`form-text ${darkMode ? 'text-light' : 'text-muted'}`}>The correct solution that students are trying to achieve.</small>
              </div>
              
              <div className="mb-3">
                <label htmlFor="explanation" className="form-label">Explanation</label>
                <textarea
                  className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                  id="explanation"
                  name="explanation"
                  rows="2"
                  value={formData.explanation}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <small className={`form-text ${darkMode ? 'text-light' : 'text-muted'}`}>A brief explanation of what the code does.</small>
              </div>
              
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success">
                  {editingId ? 'Update Code Block' : 'Create Code Block'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Table of code blocks */}
      <div className="table-responsive">
        <table className={`table table-striped table-hover ${darkMode ? 'table-dark' : ''}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Explanation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {codeBlocks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No code blocks available.</td>
              </tr>
            ) : (
              codeBlocks.map(codeBlock => (
                <tr key={codeBlock.id}>
                  <td>{codeBlock.id}</td>
                  <td>{codeBlock.name}</td>
                  <td>{codeBlock.explanation}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(codeBlock)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(codeBlock.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Crud;