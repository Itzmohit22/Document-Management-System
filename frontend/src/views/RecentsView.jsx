import { useEffect, useState } from 'react';
import { fetchRecents } from '../api';

export default function RecentsView({ currentUser }) {
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecents() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('dms_token') || localStorage.getItem('jwt_token');
        const data = await fetchRecents(token);
        setRecents(data);
      } catch (e) {
        setError('Failed to load recents');
      }
      setLoading(false);
    }
    loadRecents();
  }, [currentUser]);

  // Count uploads and deletes
  const uploadCount = recents.filter(r => r.action === 'upload').length;
  const deleteCount = recents.filter(r => r.action === 'delete').length;

  return (
    <div className="view active">
      <div className="view-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Recents History</h2>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" style={{fontWeight:'bold',fontSize:'1.1rem',padding:'10px 18px',display:'flex',alignItems:'center',gap:'8px'}}>
            <i className="fas fa-shield-alt"></i> SecureDoc <i className="fas fa-caret-down"></i>
          </button>
          <div className="dropdown-menu">
            <a href="#" className="dropdown-item">Profile</a>
            <a href="#" className="dropdown-item">Logout</a>
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:'32px',margin:'24px 0 12px 0',fontSize:'1.1rem'}}>
        <span style={{color:'#6366f1',fontWeight:'bold'}}>Files Uploaded: {uploadCount}</span>
        <span style={{color:'#ef4444',fontWeight:'bold'}}>Files Deleted: {deleteCount}</span>
      </div>
      <div className="users-table recents-table-responsive">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{color:'red'}}>{error}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Title</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recents.length === 0 && (
                <tr><td colSpan="3">No recent activity.</td></tr>
              )}
              {recents.map((r) => (
                <tr key={r._id}>
                  <td data-label="Action">{r.action}</td>
                  <td data-label="Title">{r.document?.title || r.document?.fileUrl?.split('/').pop() || 'Deleted Document'}</td>
                  <td data-label="Date">{new Date(r.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
