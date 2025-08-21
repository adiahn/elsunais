import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import WorkplanDetailsView from './components/views/WorkplanDetailsView';

interface UserData {
  message: string;
  token: string;
  role: string;
  organizationName: string;
  email: string;
  rcNumber: string;
  status: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleLogin = (userData: UserData) => {
    setUserData(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Reset state
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Routes>
          {/* Public route for workplan details */}
          <Route path="/workplan/:id" element={<WorkplanDetailsView />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated && userData ? (
                <Dashboard onLogout={handleLogout} userData={userData} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Default route */}
          <Route 
            path="/" 
            element={
              isAuthenticated && userData ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage onLogin={handleLogin} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;