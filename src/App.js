// src/App.js
import './index.css';
import Homepage from './pages/home/Homepgae';
import Login from './pages/Login';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;






