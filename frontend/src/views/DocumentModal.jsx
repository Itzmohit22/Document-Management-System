import { useState } from 'react';

export default function DocumentModal({ doc, currentUser, onClose }) {
  const [showUpload, setShowUpload] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function downloadDocument() {
    if (doc.fileUrl) {
      try {
        // Try to fetch the file as a blob and trigger download
        const response = await fetch(doc.fileUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.title || 'document';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
      } catch (e) {
        // fallback: open in new tab
        window.open(doc.fileUrl, '_blank');
      }
    } else {
      alert('No file available for download.');
    }
  }

  async function deleteDocument() {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(`http://localhost:5000/api/documents/${doc._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      alert('Document deleted successfully!');
      onClose(true); // Pass true to trigger reload in DocumentsView
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleting(false);
    }
  }

  function uploadNewVersion(e) {
    const file = e.target.files[0];
    if (file) {
      const docs = JSON.parse(localStorage.getItem('dms_documents')) || [];
      const idx = docs.findIndex(d => d.id === doc.id);
      const currentVersion = parseFloat(docs[idx].version);
      const newVersion = (currentVersion + 0.1).toFixed(1);
      docs[idx].version = newVersion;
      docs[idx].uploadDate = new Date().toISOString();
      docs[idx].versions.push({
        version: newVersion,
        date: new Date().toISOString(),
        uploader: currentUser.username
      });
      localStorage.setItem('dms_documents', JSON.stringify(docs));
      alert(`New version ${newVersion} uploaded successfully!`);
      onClose();
    }
  }

  function renderFilePreview() {
    if (!doc.fileUrl) return <div style={{color:'#888'}}>No preview available.</div>;
    const type = doc.fileType.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(type)) {
      return <img src={doc.fileUrl} alt={doc.title} style={{maxWidth:'100%',maxHeight:300,margin:'10px auto'}} />;
    }
    if (["mp4", "mov", "avi", "mkv"].includes(type)) {
      return <video src={doc.fileUrl} controls style={{width:'100%',maxHeight:400,margin:'10px 0'}} />;
    }
    if (type === 'pdf') {
      return <iframe src={doc.fileUrl} title={doc.title} style={{width:'100%',height:400,border:'none',margin:'10px 0'}} />;
    }
    if (["txt"].includes(type)) {
      return <iframe src={doc.fileUrl} title={doc.title} style={{width:'100%',height:200,border:'1px solid #eee',margin:'10px 0'}} />;
    }
    return <div style={{color:'#888'}}>Preview not supported for this file type.</div>;
  }

  return (
    <div className="modal active" id="documentModal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{doc.title}</h3>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="document-info">
            <p><strong>Description:</strong> {doc.description}</p>
            <p><strong>Category:</strong> {doc.category}</p>
            <p><strong>Access Level:</strong> {doc.accessLevel}</p>
            <p><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleDateString()}</p>
            <p><strong>Version:</strong> {doc.version}</p>
          </div>
          <div className="document-actions" style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            <button className="btn btn-primary" onClick={downloadDocument}>Download</button>
            <button className="btn btn-secondary" onClick={() => {
              if (!doc.fileUrl) return alert('No file available to open.');
              const type = doc.fileType?.toLowerCase();
              if (["pdf","jpg","jpeg","png","gif","txt"].includes(type)) {
                window.open(doc.fileUrl, '_blank');
              } else {
                alert('Preview not supported for this file type. Please download instead.');
              }
            }}>Open</button>
            <label className="btn btn-secondary" style={{marginBottom:0}}>
              Upload New Version
              <input type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.png" style={{display:'none'}} onChange={uploadNewVersion} />
            </label>
            <button className="btn btn-danger" onClick={deleteDocument} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button className="btn btn-view-file" style={{marginLeft:8}} onClick={()=>setShowFile(f=>!f)}>{showFile ? 'Hide' : 'Show'} File</button>
          </div>
          {showFile && (
            <div className="file-preview-container">
              {renderFilePreview()}
            </div>
          )}
          {/* Version history removed: not supported by backend */}
        </div>
      </div>
    </div>
  );
}
