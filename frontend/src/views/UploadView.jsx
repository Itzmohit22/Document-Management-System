import { useState } from 'react';
import { uploadDocument } from '../api';
import React from 'react'; // Added missing import

export default function UploadView({ currentUser }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userFileCount, setUserFileCount] = useState(0);

  // Fetch user's document count on mount
  React.useEffect(() => {
    async function fetchCount() {
      try {
        const token = localStorage.getItem('jwt_token');
        const res = await fetch('http://localhost:5000/api/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const docs = await res.json();
          setUserFileCount(docs.length);
        }
      } catch {}
    }
    fetchCount();
  }, []);

  async function handleUpload() {
    if (!title || !file) {
      alert('Please fill in all required fields and select a file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large! Max allowed size is 5MB.');
      return;
    }
    if (userFileCount >= 20) {
      alert('Upload limit reached: Max 20 files allowed per user.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      await uploadDocument({
        token,
        file,
        title,
        description,
        category: 'general',
        accessLevel: 'public',
      });
      setTitle(''); setDescription(''); setFile(null);
      alert('Document uploaded successfully!');
      setUserFileCount(c => c + 1);
    } catch (err) {
      // Show backend error for file size or count
      alert(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="uploadView" className="view active">
      <div className="view-header">
        <h2>Upload Document</h2>
      </div>
      <div className="upload-container">
        <div className="upload-form">
          <div className="form-group">
            <label htmlFor="documentTitle">Document Title</label>
            <input id="documentTitle" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="documentDescription">Description</label>
            <textarea id="documentDescription" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="fileInput">Select File</label>
            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png,.txt,.zip,.mp4,.mov,.avi,.mkv" onChange={(e) => {
              const f = e.target.files[0];
              if (f) {
                const ext = f.name.split('.').pop().toLowerCase(); // always lowercase
                const maxSize = 5 * 1024 * 1024;
                if (f.size > maxSize) {
                  alert(`File too large! Max allowed size is 5MB for all file types (detected: .${ext}).`);
                  e.target.value = '';
                  setFile(null);
                  return;
                }
              }
              setFile(f);
            }}/>
            <div style={{color:'#888',fontSize:'0.9em'}}>Max file size: 5MB (all file types). Max files per user: 20.</div>
          </div>
          {file && (() => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (["mp4","mov","avi","mkv"].includes(ext)) {
              return <video src={URL.createObjectURL(file)} controls style={{maxWidth:'100%',maxHeight:200,margin:'10px auto'}} />;
            }
            if (["jpg","jpeg","png","gif"].includes(ext)) {
              return <img src={URL.createObjectURL(file)} alt="preview" style={{maxWidth:'100%',maxHeight:200,margin:'10px auto'}} />;
            }
            return null;
          })()}
          <button type="button" className="btn btn-primary" onClick={handleUpload} disabled={loading}>{loading ? 'Uploading...' : 'Upload Document'}</button>
        </div>
      </div>
    </div>
  );
}
