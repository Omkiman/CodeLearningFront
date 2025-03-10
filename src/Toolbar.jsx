import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Toolbar({ darkMode, onToggleDarkMode, openBlocks }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Function to handle room selection from dropdown
  const handleRoomSelect = (event) => {
    const roomId = event.target.value;
    if (roomId) {
      navigate(`/codeblock/${roomId}`);
    }
  };
  
  // Get current room ID if we're on a codeblock page
  const currentRoomId = location.pathname.startsWith('/codeblock/') 
    ? location.pathname.split('/')[2] 
    : '';
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3" style={{ width: '100%' }}>
      {/* Logo */}
      <Link className="navbar-brand" to="/">
        <img
          src="https://img.artiversehub.ai/online/2024/12/13/f63e2cb6-a2eb-47d3-a28a-8b6500326215_04726383.png"
          alt="Logo"
          style={{ width: '50px', height: '50px', marginRight: '10px' }}
        />
        Tom's Watch
      </Link>
      
      {/* Open Rooms Dropdown with label */}
      <div className="ms-3 me-auto d-flex align-items-center">
        <label className="text-light me-2 mb-0">Open Rooms:</label>
        <select 
          className="form-select bg-dark text-light border-secondary" 
          onChange={handleRoomSelect}
          value={currentRoomId}
          aria-label="Select Room"
        >
          <option value="" disabled>Select a room</option>
          {openBlocks && openBlocks.map((block) => (
            <option key={block.id} value={block.id}>
              {block.name} ({block.student_count} {block.student_count === 1 ? 'student' : 'students'})
            </option>
          ))}
        </select>
      </div>

      {/* Toggle button for mobile view */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar links (right side) */}
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">
        <li className="nav-item me-3">
            <Link to="/crud" className="nav-link">
              Admin
            </Link>
          </li>
          {/* Dark Mode toggle */}
          <li className="nav-item">
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={onToggleDarkMode}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Toolbar;