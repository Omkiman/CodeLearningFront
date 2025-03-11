import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './crypto-polyfill.js';

createRoot(document.getElementById('root')).render(
    <App />,
)
