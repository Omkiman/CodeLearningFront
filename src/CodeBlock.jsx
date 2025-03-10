import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Controlled as CodeMirror } from 'react-codemirror2';

// Import CodeMirror CSS and JavaScript mode
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
// Lint addons
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';

function CodeBlock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [code, setCode] = useState('');
  const [studentCount, setStudentCount] = useState(0);
  const [showSmiley, setShowSmiley] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [blockName, setBlockName] = useState('');

  // Socket ref
  const socketRef = useRef(null);

  useEffect(() => {
    // Fetch the initial code block data
    fetch(`https://codelearningback.onrender.com/api/codeblocks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCode(data.template);
        setBlockName(data.name); // store the name
        setExplanation(data.explanation);
      })
      .catch((err) => console.error(err));

    // Initialize socket
    const socket = io('https://codelearningback.onrender.com');
    socketRef.current = socket;

    // Join the room
    socket.emit('join_room', { room_id: parseInt(id) });

    // Listen for role assignment
    socket.on('role_assignment', (data) => {
      setRole(data.role);
      setCode(data.code);
      setStudentCount(data.student_count);
    });

    // Listen for code updates
    socket.on('update_code', (data) => {
      setCode(data.code);
    });

    // Listen for student count updates
    socket.on('update_student_count', (data) => {
      setStudentCount(data.student_count);
    });

    // Mentor leaves -> redirect
    socket.on('redirect_to_lobby', (data) => {
      alert(data.message);
      navigate('/');
    });

    // If solution is found, show smiley
    socket.on('solution_found', () => {
      setShowSmiley(true);
    });
    // If solution is found, show smiley
    socket.on('solution_incorrect', () => {
      setShowSmiley(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, navigate]);

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
    if (role === 'student' && socketRef.current) {
      socketRef.current.emit('code_change', {
        room_id: parseInt(id),
        code: value,
      });
    }
  };

  return (
    <div>
      <h1>{blockName}</h1>
      <p>{explanation}</p>
      <p>Role: {role}</p>
      <p>Students in room: {studentCount}</p>
      {showSmiley && <div style={{ fontSize: '3rem', marginTop: '20px' }}>You got it! 😊😊😊</div>}
      <CodeMirror
        value={code}
        options={{
          mode: 'javascript',
          theme: 'the-matrix',
          lineNumbers: true,
          readOnly: role === 'mentor',
          lint: true,
          gutters: ['CodeMirror-lint-markers'],
        }}
        onBeforeChange={handleCodeChange}
      />
    </div>
  );
}

export default CodeBlock;
