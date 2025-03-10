# Tom's Watch - Collaborative Coding Platform Frontend

A modern React application that provides a real-time collaborative coding interface for teaching and learning programming.

## Overview

This React application serves as the frontend for "Tom's Watch", a platform designed to help teachers monitor and assist students with coding exercises in real-time. It connects to a Flask backend via REST API and WebSockets to provide a seamless collaborative coding experience.

## Features

### Real-time Collaboration
- Live code syncing between mentors and students
- First user becomes the mentor (view-only mode)
- Students can edit and receive instant feedback
- Automatic solution validation

### User Interface
- Modern, responsive design using Bootstrap
- Dark/light mode toggle
- CodeMirror editor with JavaScript syntax highlighting and linting
- Room-based navigation through toolbar dropdown

### Admin Interface
- CRUD operations for managing code blocks
- Form validation for creating and updating exercises
- Confirmation dialogs for destructive actions
- Success/error notifications

## Application Structure

### Components

- **App.jsx**: Main application component and router setup
- **Toolbar.jsx**: Navigation bar with dark mode toggle and room selector
- **Lobby.jsx**: Welcome page displaying available coding exercises
- **CodeBlock.jsx**: Interactive coding environment with real-time collaboration
- **Crud.jsx**: Admin interface for managing code blocks

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Running Flask backend (see backend README)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd <repository-directory>
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

The application will be available at `http://localhost:3000`

### Required Dependencies

- react
- react-dom
- react-router-dom
- socket.io-client
- react-codemirror2
- codemirror (with addons)
- bootstrap (for styling)

## Usage Guide

### For Teachers (Mentors)

1. Access the application and select a code block from the lobby
2. As the first user to join, you will be assigned the mentor role
3. Students can join the same room through the lobby or toolbar dropdown
4. Monitor students' code in real-time
5. When a student correctly implements the solution, a success message appears

### For Students

1. Join a coding exercise through the lobby
2. Edit the code in the CodeMirror editor
3. Changes are instantly visible to the mentor and other students
4. When you successfully implement the solution, a celebratory message appears

### For Administrators

1. Access the admin panel via the "Admin" link in the toolbar
2. Create new code blocks with:
   - Name
   - Template code (starting point)
   - Solution code (correct implementation)
   - Explanation
3. Edit or delete existing code blocks

## Communication with Backend

### REST API Endpoints
- `GET /api/codeblocks`: Fetch list of available code blocks
- `GET /api/codeblocks/:id`: Fetch a specific code block
- `GET /api/codeblocks/admin`: Fetch all code blocks with solutions (admin only)
- `POST /api/codeblocks`: Create a new code block
- `PUT /api/codeblocks/:id`: Update an existing code block
- `DELETE /api/codeblocks/:id`: Delete a code block

### Socket.IO Events
The application uses Socket.IO for real-time communication:

#### Emitted Events
- `join_room`: Join a coding room
- `code_change`: Send code updates

#### Received Events
- `role_assignment`: Receive role (mentor/student)
- `update_code`: Receive code changes
- `update_student_count`: Updated count of students
- `solution_found`: Notification when code matches solution
- `solution_incorrect`: Notification when solution is incorrect
- `redirect_to_lobby`: Redirect instruction (e.g., when mentor leaves)
- `active_rooms`: List of currently active rooms

## Customization

### Themes
The application supports dark and light modes toggled via the toolbar button.

### CodeMirror Configuration
The CodeMirror editor can be customized in the CodeBlock component:
- Syntax highlighting
- Line numbers
- Theme
- Linting options

## Deployment

### Building for Production

```
npm run build
```

This creates optimized production files in the `dist` directory that can be served by any static file server.

### Environment Configuration

Create a `.env` file in the project root to configure environment variables:

```
VITE_API_URL=http://yourdomain.com/api
```

## Contributing

[Your contribution guidelines here]

## Author

Omkiman