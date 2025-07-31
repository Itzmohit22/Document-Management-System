import { useState } from 'react';
import DocumentsView from '../views/DocumentsView';
import UploadView from '../views/UploadView';
import UsersView from '../views/UsersView';
import RecentsView from '../views/RecentsView';
import DataUsageView from '../views/DataUsageView';
import AdminPanelView from '../views/AdminPanelView';

const NAV = [
  { key: 'documents', label: 'Documents', icon: 'fa-file-alt' },
  { key: 'upload', label: 'Upload', icon: 'fa-upload' },
  { key: 'users', label: 'Users', icon: 'fa-users', admin: true },
  { key: 'recents', label: 'Recents History', icon: 'fa-history' },
  { key: 'datausage', label: 'Data Usage', icon: 'fa-chart-pie' }, // Added Data Usage nav
  { key: 'admin', label: 'Admin Panel', icon: 'fa-crown', admin: true }, // Admin Panel nav
];

export default function DashboardScreen({ currentUser, setCurrentUser }) {
  const [view, setView] = useState('documents');

  function logout() {
    setCurrentUser(null);
  }

  return (
    <div className="screen active login-container dashboard-bg" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
      <div style={{boxShadow:'0 8px 32px rgba(44,62,80,0.10)',borderRadius:'22px',padding:'0',background:'rgba(255,255,255,0.85)',backdropFilter:'blur(8px)',minWidth:'340px',maxWidth:'1200px',width:'100%',display:'flex',overflow:'hidden',position:'relative'}}>
        {/* Decorative background shapes */}
        <div className="dashboard-shape dashboard-shape-1"></div>
        <div className="dashboard-shape dashboard-shape-2"></div>
        <nav className="sidebar glass-sidebar" style={{background:'rgba(241,245,249,0.7)',backdropFilter:'blur(12px)',padding:'40px 0',width:'220px',minHeight:'100%',display:'flex',flexDirection:'column',alignItems:'center',borderRight:'1px solid #e5e7eb',boxShadow:'0 4px 24px rgba(99,102,241,0.08)'}}>
          <div style={{marginBottom:36,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{background:'linear-gradient(135deg,#6366f1 60%,#60a5fa 100%)',borderRadius:'50%',padding:16,marginBottom:12,boxShadow:'0 2px 12px rgba(99,102,241,0.13)'}}>
              <i className="fas fa-shield-alt" style={{fontSize:'2.2rem',color:'#fff'}}></i>
            </div>
            <h2 style={{fontWeight:'bold',fontSize:'1.35rem',color:'#2c3e50',margin:0,letterSpacing:'1px'}}>SecureDoc</h2>
          </div>
          <ul className="nav-menu" style={{width:'100%'}}>
            {NAV.filter(n => !n.admin || currentUser.role === 'admin').map(n => (
              <li key={n.key} style={{width:'100%'}}>
                <a href="#" className={`nav-link${view===n.key?' active':''}`} onClick={() => setView(n.key)} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 28px',color:view===n.key?'#6366f1':'#334155',fontWeight:view===n.key?'bold':'normal',background:view===n.key?'rgba(99,102,241,0.08)':'none',border:'none',borderRadius:'0 22px 22px 0',fontSize:'1.12rem',transition:'background 0.25s, color 0.25s'}}>
                  <i className={`fas ${n.icon}`}></i> {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:'100vh'}}>
          <header className="header dashboard-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'32px 44px 22px 44px',borderBottom:'1px solid #e5e7eb',background:'rgba(255,255,255,0.92)',backdropFilter:'blur(6px)'}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <span style={{fontWeight:'bold',fontSize:'1.22rem',color:'#6366f1',letterSpacing:'0.5px'}}>Welcome, {currentUser.username} <span style={{color:'#64748b',fontWeight:'normal'}}>({currentUser.role})</span></span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div className="user-avatar" style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1 60%,#60a5fa 100%)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'bold',fontSize:'1.2rem',boxShadow:'0 2px 8px rgba(99,102,241,0.13)'}}>
                {currentUser.username[0].toUpperCase()}
              </div>
              <button className="btn btn-secondary logout-btn" style={{background:'linear-gradient(90deg,#6366f1 60%,#60a5fa 100%)',color:'#fff',border:'none',padding:'10px 26px',borderRadius:'22px',fontWeight:'bold',fontSize:'1.05rem',boxShadow:'0 2px 8px rgba(99,102,241,0.10)',transition:'background 0.2s,box-shadow 0.2s'}} onClick={logout}>
                <i className="fas fa-sign-out-alt" style={{marginRight:8}}></i>Logout
              </button>
            </div>
          </header>
          <main className="main-content dashboard-main-content" style={{flex:1,padding:'44px',background:'rgba(248,250,252,0.95)',minHeight:'calc(100vh - 90px)'}}>
            {view === 'documents' && <DocumentsView currentUser={currentUser} />}
            {view === 'upload' && <UploadView currentUser={currentUser} />}
            {view === 'users' && currentUser.role === 'admin' && <UsersView currentUser={currentUser} />}
            {view === 'recents' && <RecentsView currentUser={currentUser} />}
            {view === 'datausage' && <DataUsageView currentUser={currentUser} />}
            {view === 'admin' && currentUser.role === 'admin' && <AdminPanelView currentUser={currentUser} />}
          </main>
        </div>
      </div>
    </div>
  );
}
