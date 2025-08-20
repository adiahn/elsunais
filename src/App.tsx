import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import WorkplanDetailsView from './components/views/WorkplanDetailsView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Routes>
          {/* Public route for workplan details */}
          <Route path="/workplan/:id" element={<WorkplanDetailsView />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? (
                <Dashboard onLogout={() => setIsAuthenticated(false)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Default route */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage onLogin={() => setIsAuthenticated(true)} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;