import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('stocksense_user');
      if (saved) setUser(saved);
    } catch (e) {
      console.warn('localStorage error:', e);
    }
    setLoading(false);
  }, []);

  const handleLogin = (name) => {
    try { localStorage.setItem('stocksense_user', name); } catch (e) {}
    setUser(name);
  };

  const handleLogout = () => {
    try { localStorage.removeItem('stocksense_user'); } catch (e) {}
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="min-h-screen text-gray-100">
      {user
        ? <Dashboard user={user} onLogout={handleLogout}/>
        : <Login onLogin={handleLogin}/>
      }
    </div>
  );
}
