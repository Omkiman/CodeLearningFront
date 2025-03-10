import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Lobby from './Lobby';
import CodeBlock from './CodeBlock';
import Toolbar from './Toolbar';
import Crud from './Crud';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [openBlocks, setOpenBlocks] = useState([]);
  const socketRef = useRef(null);

  // Apply dark-mode class to the <body>
  useEffect(() => {
    document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
  }, [darkMode]);

  // Setup socket connection
  useEffect(() => {
    // Initialize socket
    const socket = io('https://codelearningback.onrender.com/', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 10000  
    });
    socketRef.current = socket;

    // Listen for active rooms updates
    socket.on('active_rooms', (activeRooms) => {
      setOpenBlocks(activeRooms);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <Router>
      {/* Our custom toolbar, always at the top */}
      <Toolbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        openBlocks={openBlocks}
      />

      {/* Main content area */}
      <div style={{ flex: '1 1 auto', width: '100%', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/codeblock/:id" element={<CodeBlock />} />
          <Route path="/crud" element={<Crud/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;