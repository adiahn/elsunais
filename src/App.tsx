import React, { useState } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {isAuthenticated ? (
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <AuthPage onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;