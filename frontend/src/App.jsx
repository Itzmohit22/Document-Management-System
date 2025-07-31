import React, { useEffect, useState } from 'react';
import './index.css';

import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './views/DashboardScreen';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('dms_theme') || 'light');

  // Persist login state using JWT and user info
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const user = localStorage.getItem('jwt_user');
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('dms_theme', theme);
  }, [theme]);

  // When user logs in, store user info in localStorage
  function handleSetCurrentUser(user) {
    if (user) {
      localStorage.setItem('jwt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jwt_user');
      localStorage.removeItem('jwt_token');
    }
    setCurrentUser(user);
  }

  return (
    <div className={`app-root ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <header className="app-header">
        <h1>Document Management System</h1>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{marginLeft: 'auto', marginRight: 16, padding: '6px 16px', fontSize: '1.3rem', background: 'none', border: 'none'}}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      {!currentUser ? (
        <AuthScreen setCurrentUser={handleSetCurrentUser} />
      ) : (
        <DashboardScreen currentUser={currentUser} setCurrentUser={handleSetCurrentUser} />
      )}
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} Document Management System. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
