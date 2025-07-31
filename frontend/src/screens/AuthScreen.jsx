import { useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';

export default function AuthScreen({ setCurrentUser }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const { token, user } = await apiLogin(username, password);
      localStorage.setItem('jwt_token', token);
      setCurrentUser(user);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  }

  async function handleSignup() {
    if (!username || !password) {
      setError('Please enter a username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiRegister(username, password);
      await handleLogin();
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  }

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="auth-screen" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s infinite linear',
        zIndex: 1
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'pulse 4s infinite ease-in-out',
        zIndex: 1
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        animation: 'float 6s infinite ease-in-out',
        zIndex: 1
      }}></div>

      <div className="auth-container" style={{
        transform: animate ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
        opacity: animate ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10,
        position: 'relative'
      }}>
        <div className="auth-card" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px 40px',
          minWidth: '380px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            borderRadius: '50%',
            opacity: 0.1
          }}></div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              animation: 'bounce 2s infinite'
            }}>
              <i className="fas fa-shield-alt" style={{
                fontSize: '2.5rem',
                color: '#fff'
              }}></i>
            </div>
            
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              letterSpacing: '1px'
            }}>
              {mode === 'login' ? 'Welcome Back' : 'Join Us'}
            </h1>
            
            <p style={{
              fontSize: '1.1rem',
              color: '#64748b',
              marginBottom: '0',
              textAlign: 'center'
            }}>
              {mode === 'login' ? 'Sign in to access your documents' : 'Create your account to get started'}
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="username" style={{
              fontWeight: '600',
              fontSize: '1.05rem',
              color: '#374151',
              marginBottom: '8px',
              display: 'block'
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-user" style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '1.1rem'
              }}></i>
              <input 
                id="username" 
                autoFocus 
                placeholder="Enter your username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())} 
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1.05rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{
              fontWeight: '600',
              fontSize: '1.05rem',
              color: '#374151',
              marginBottom: '8px',
              display: 'block'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-lock" style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '1.1rem'
              }}></i>
              <input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())} 
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1.05rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(v => !v)} 
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#667eea',
                  fontSize: '1.1rem',
                  padding: '4px'
                }} 
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              color: '#ef4444',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: '500',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              animation: 'shake 0.5s ease-in-out'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
              {error}
            </div>
          )}

          <button 
            type="button" 
            style={{
              width: '100%',
              fontSize: '1.1rem',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '16px 0',
              borderRadius: '12px',
              fontWeight: '600',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }} 
            onClick={mode === 'login' ? handleLogin : handleSignup} 
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                {mode === 'login' ? 'Signing In...' : 'Signing Up...'}
              </span>
            ) : (
              <span>
                <i className={`fas fa-${mode === 'login' ? 'sign-in-alt' : 'user-plus'}`} style={{ marginRight: '8px' }}></i>
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
              </span>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            {mode === 'login' ? (
              <div>
                <span style={{ color: '#6b7280', fontSize: '1rem' }}>Don't have an account? </span>
                <button 
                  style={{
                    padding: '0 8px',
                    fontSize: '1rem',
                    color: '#667eea',
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'color 0.3s ease'
                  }} 
                  onClick={() => handleModeSwitch('signup')}
                  onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                  onMouseLeave={(e) => e.target.style.color = '#667eea'}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div>
                <span style={{ color: '#6b7280', fontSize: '1rem' }}>Already have an account? </span>
                <button 
                  style={{
                    padding: '0 8px',
                    fontSize: '1rem',
                    color: '#667eea',
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'color 0.3s ease'
                  }} 
                  onClick={() => handleModeSwitch('login')}
                  onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                  onMouseLeave={(e) => e.target.style.color = '#667eea'}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
