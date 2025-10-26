import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NoteDetailPage from './pages/NoteDetailPage';
import PatientDetailPage from './pages/PatientDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
