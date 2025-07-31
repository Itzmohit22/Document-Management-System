import { useState } from 'react';
import './LoginScreen.css'; // Import the CSS file for styling

export default function LoginScreen({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    const users = JSON.parse(localStorage.getItem('dms_users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      user.lastLogin = new Date().toISOString();
      localStorage.setItem('dms_users', JSON.stringify(users));
      setCurrentUser(user);
    } else {
      setError('Invalid credentials! Try admin/admin123 or user/user123');
    }
  }

  function quickLogin(type) {
    if (type === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('user');
      setPassword('user123');
    }
    setTimeout(handleLogin, 100);
  }

  return (
    <div className="login-attractive-bg dashboard-bg" style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="login-attractive-card auth-glass-card" style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(8px)',borderRadius:'22px',boxShadow:'0 8px 32px rgba(44,62,80,0.10)',padding:'48px 36px 36px 36px',maxWidth:'370px',width:'100%'}}>
        <div className="login-avatar" style={{width:'80px',height:'80px',borderRadius:'50%',overflow:'hidden',marginBottom:'18px',boxShadow:'0 2px 12px rgba(44,62,80,0.10)'}}>
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User Avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
        </div>
        <h1 className="login-title" style={{fontSize:'2rem',fontWeight:'700',marginBottom:'6px',color:'#222'}}>
          Welcome to <span style={{color:'#6366f1'}}>SecureDoc</span>
        </h1>
        <p className="login-subtitle" style={{color:'#666',fontSize:'1.05rem',marginBottom:'24px'}}>Sign in to your document management dashboard</p>
        <div className="login-form-group" style={{width:'100%',marginBottom:'18px',display:'flex',flexDirection:'column'}}>
          <label htmlFor="username" style={{fontWeight:'600',marginBottom:'5px',color:'#2980b9'}}>Username</label>
          <input id="username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Enter your username" style={{padding:'12px',border:'1.5px solid #cce0f6',borderRadius:'9px',fontSize:'1rem',transition:'border 0.2s',background:'rgba(248,250,252,0.95)'}} />
        </div>
        <div className="login-form-group" style={{width:'100%',marginBottom:'18px',display:'flex',flexDirection:'column'}}>
          <label htmlFor="password" style={{fontWeight:'600',marginBottom:'5px',color:'#2980b9'}}>Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Enter your password" style={{padding:'12px',border:'1.5px solid #cce0f6',borderRadius:'9px',fontSize:'1rem',transition:'border 0.2s',background:'rgba(248,250,252,0.95)'}} />
        </div>
        <button type="button" className="btn btn-primary login-btn auth-btn" style={{width:'100%',padding:'14px 0',background:'linear-gradient(90deg,#6366f1 60%,#60a5fa 100%)',color:'#fff',fontSize:'1.13rem',fontWeight:'600',border:'none',borderRadius:'12px',marginTop:'6px',marginBottom:'10px',boxShadow:'0 2px 8px rgba(99,102,241,0.10)',transition:'background 0.2s,box-shadow 0.2s'}} onClick={handleLogin}>Login</button>
        {error && <div className="login-error" style={{color:'#e74c3c',background:'#fbeeea',borderRadius:'4px',padding:'7px 0',width:'100%',textAlign:'center',marginBottom:'10px',fontSize:'0.98rem'}}>{error}</div>}
        <div className="login-demo-credentials" style={{background:'#f6fafd',borderRadius:'8px',padding:'12px 10px 10px 10px',marginTop:'18px',width:'100%',textAlign:'center',fontSize:'0.98rem',color:'#2980b9',boxShadow:'0 1px 4px rgba(44,62,80,0.04)'}}>
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: admin / admin123</p>
          <p>User: user / user123</p>
          <div className="login-demo-btns" style={{display:'flex',gap:'10px',justifyContent:'center',marginTop:'8px'}}>
            <button type="button" className="btn btn-secondary" style={{background:'#e3f1fb',color:'#2980b9',border:'none',borderRadius:'5px',padding:'7px 16px',fontSize:'1rem',fontWeight:'500',cursor:'pointer',transition:'background 0.2s, color 0.2s'}} onClick={() => quickLogin('admin')}>Login as Admin</button>
            <button type="button" className="btn btn-secondary" style={{background:'#e3f1fb',color:'#2980b9',border:'none',borderRadius:'5px',padding:'7px 16px',fontSize:'1rem',fontWeight:'500',cursor:'pointer',transition:'background 0.2s, color 0.2s'}} onClick={() => quickLogin('user')}>Login as User</button>
          </div>
        </div>
      </div>
    </div>
  );
}
