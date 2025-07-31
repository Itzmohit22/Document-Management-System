import React, { useEffect, useState } from 'react';
import { fetchAllDocuments, fetchDocuments, fetchUsers, deleteUser, deleteDocument, sendAnnouncement, fetchAnnouncements } from '../api';

export default function AdminPanelView({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ users: 0, documents: 0, storage: 0 });
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [announceMsg, setAnnounceMsg] = useState('');
  const [announceLoading, setAnnounceLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        // Fetch users
        let users = [];
        try { users = await fetchUsers(token); } catch {}
        setUsers(users);
        // Fetch documents
        let docs = [];
        try { docs = await fetchAllDocuments(token); } catch {}
        setDocuments(docs);
        // Stats
        setStats({
          users: users.length,
          documents: docs.length,
          storage: docs.reduce((sum, d) => sum + (d.fileSize || 0), 0)
        });
        // Activity (recent uploads/deletes)
        setActivity(docs.slice(0, 10).map(d => ({
          action: 'upload',
          title: d.title,
          date: d.uploadDate
        })));
        // Announcements
        let anns = [];
        try { anns = await fetchAnnouncements(token); } catch {}
        setAnnouncements(anns);
      } catch {}
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleDeleteUser(id) {
    if (!window.confirm('Delete this user?')) return;
    try {
      const token = localStorage.getItem('jwt_token');
      await deleteUser(token, id);
      setUsers(users.filter(u => u._id !== id));
      alert('User deleted');
    } catch (e) { alert('Delete failed'); }
  }
  async function handleDeleteDoc(id) {
    if (!window.confirm('Delete this document?')) return;
    try {
      const token = localStorage.getItem('jwt_token');
      await deleteDocument(token, id);
      setDocuments(documents.filter(d => d._id !== id));
      alert('Document deleted');
    } catch (e) { alert('Delete failed'); }
  }
  async function handleAnnounce() {
    setAnnounceLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      await sendAnnouncement(token, announceMsg);
      setAnnounceMsg('');
      setShowAnnounce(false);
      alert('Announcement sent!');
    } catch (e) { alert('Failed to send'); }
    setAnnounceLoading(false);
  }

  function formatBytes(bytes) {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  }

  return (
    <div className="view active" style={{animation:'fadeInUp 0.7s cubic-bezier(.39,.575,.56,1)'}}>
      <div className="view-header" style={{justifyContent:'space-between'}}>
        <h2>Admin Panel</h2>
        <button className="btn btn-primary" onClick={()=>setShowAnnounce(true)}>Send Announcement</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <>
        <div style={{display:'flex',gap:'32px',marginBottom:'32px',flexWrap:'wrap'}}>
          <StatCard label="Total Users" value={stats.users} icon="fa-users" />
          <StatCard label="Total Documents" value={stats.documents} icon="fa-file-alt" />
          <StatCard label="Storage Used" value={formatBytes(stats.storage)} icon="fa-database" />
        </div>
        {announcements.length > 0 && (
          <div className="admin-panel-section" style={{marginBottom:'32px'}}>
            <h3 style={{marginBottom:12}}>Latest Announcements</h3>
            <ul style={{listStyle:'none',padding:0}}>
              {announcements.slice(0,3).map(a => (
                <li key={a._id} style={{marginBottom:10,padding:'10px 0',borderBottom:'1px solid #eee'}}>
                  <span style={{fontWeight:'bold',color:'#6366f1'}}>{a.createdBy?.username||'Admin'}:</span> {a.message}
                  <span style={{float:'right',color:'#888',fontSize:'0.98rem'}}>{new Date(a.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{display:'flex',gap:'32px',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:320}}>
            <h3>User Management</h3>
            <div className="users-table" style={{maxHeight:260,overflowY:'auto'}}>
              <table><thead><tr><th>Username</th><th>Role</th><th>Actions</th></tr></thead><tbody>
                {users.map(u => (
                  <tr key={u._id}><td>{u.username}</td><td>{u.role}</td><td>
                    <button className="btn btn-danger" onClick={()=>handleDeleteUser(u._id)}>Delete</button>
                  </td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
          <div style={{flex:1,minWidth:320}}>
            <h3>Document Management</h3>
            <div className="users-table" style={{maxHeight:260,overflowY:'auto'}}>
              <table><thead><tr><th>Title</th><th>Uploader</th><th>Actions</th></tr></thead><tbody>
                {documents.map(d => (
                  <tr key={d._id}><td>{d.title}</td><td>{d.uploader?.username||d.uploader}</td><td>
                    <button className="btn btn-danger" onClick={()=>handleDeleteDoc(d._id)}>Delete</button>
                  </td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
          <div style={{flex:1,minWidth:320}}>
            <h3>Recent Activity</h3>
            <ul style={{listStyle:'none',padding:0,maxHeight:260,overflowY:'auto'}}>
              {activity.map((a,i) => (
                <li key={i} style={{marginBottom:8}}>
                  <i className={`fas fa-${a.action==='upload'?'upload':'trash'}`} style={{marginRight:8}}></i>
                  <b>{a.title}</b> - {a.action} on {a.date?new Date(a.date).toLocaleDateString():''}
                </li>
              ))}
            </ul>
          </div>
        </div>
        </>
      )}
      {showAnnounce && (
        <div className="modal active">
          <div className="modal-content" style={{maxWidth:400}}>
            <div className="modal-header"><h3>Send Announcement</h3><span className="close" onClick={()=>setShowAnnounce(false)}>&times;</span></div>
            <div className="modal-body">
              <textarea value={announceMsg} onChange={e=>setAnnounceMsg(e.target.value)} placeholder="Enter announcement..." style={{width:'100%',minHeight:80,marginBottom:12}} />
              <button className="btn btn-primary" onClick={handleAnnounce} disabled={announceLoading}>{announceLoading?'Sending...':'Send'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : 0;
    if (end === 0) return setDisplay(value);
    const duration = 800;
    const step = Math.ceil(end / (duration/20));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(start);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [value]);
  return (
    <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 8px rgba(44,62,80,0.08)',padding:'24px 32px',minWidth:180,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <i className={`fas ${icon}`} style={{fontSize:'2.2rem',color:'#6366f1',marginBottom:8}}></i>
      <div style={{fontSize:'2rem',fontWeight:'bold',color:'#23272f'}}>{display}{typeof value==='string' && !/\d/.test(value)?value:''}</div>
      <div style={{fontSize:'1.1rem',color:'#6366f1',marginTop:4}}>{label}</div>
    </div>
  );
} 