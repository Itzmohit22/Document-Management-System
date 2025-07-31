import { useState, useEffect } from 'react';
import DocumentModal from './DocumentModal';
import { fetchDocuments } from '../api';
import { useRef } from 'react';

export default function DocumentsView({ currentUser }) {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [modalDoc, setModalDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedDocId, setCopiedDocId] = useState(null); // For share feedback
  const [shareMenuDocId, setShareMenuDocId] = useState(null); // For share menu
  const shareMenuRef = useRef();

  async function loadDocs() {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const docs = await fetchDocuments(token);
      setDocuments(docs);
    } catch (err) {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  // Close share menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShareMenuDocId(null);
      }
    }
    if (shareMenuDocId) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [shareMenuDocId]);

  function handleShareMenu(docId) {
    setShareMenuDocId(shareMenuDocId === docId ? null : docId);
  }

  function handleShareAction(type, doc) {
    const link = `${window.location.origin}/api/documents/${doc._id}`;
    if (type === 'copy') {
      navigator.clipboard.writeText(link);
      setCopiedDocId(doc._id);
      setTimeout(() => setCopiedDocId(null), 1500);
    } else if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(link)}`,'_blank');
    } else if (type === 'email') {
      window.open(`mailto:?subject=Document%20Share&body=${encodeURIComponent(link)}`);
    } else if (type === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}`,'_blank');
    }
    setShareMenuDocId(null);
  }

  const filtered = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleModalClose(reload) {
    setModalDoc(null);
    if (reload) loadDocs();
  }

  function getFileIcon(fileType) {
    const icons = {
      pdf: 'fas fa-file-pdf',
      doc: 'fas fa-file-word',
      docx: 'fas fa-file-word',
      txt: 'fas fa-file-alt',
      jpg: 'fas fa-file-image',
      png: 'fas fa-file-image',
      default: 'fas fa-file'
    };
    return icons[fileType] || icons.default;
  }

  // Share handler
  function handleShare(doc) {
    // You can customize the link format as per your backend route
    const link = `${window.location.origin}/api/documents/${doc._id}`;
    navigator.clipboard.writeText(link);
    setCopiedDocId(doc._id);
    setTimeout(() => setCopiedDocId(null), 1500);
  }

  return (
    <div id="documentsView" className="view active">
      <div className="view-header">
        <h2>Documents</h2>
        <div className="search-bar">
          <input type="text" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
          <i className="fas fa-search"></i>
        </div>
      </div>
      {loading ? <div>Loading documents...</div> : (
      <div className="documents-grid">
        {filtered.length === 0 ? (
          <div style={{padding:'32px',textAlign:'center',color:'#888',width:'100%'}}>No documents found. Upload your first file!</div>
        ) : filtered.map(doc => (
          <div className="document-card" key={doc._id} style={{position:'relative'}}>
            <div className="document-icon"><i className={getFileIcon(doc.fileType)}></i></div>
            <div className="document-title" title={doc.title}>{doc.title}</div>
            <div className="document-meta">Type: {doc.fileType?.toUpperCase()}</div>
            <div className="document-meta">Size: {(doc.fileSize/1024).toFixed(1)} KB</div>
            <div className="document-meta">Uploaded: {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : ''}</div>
            <div className="document-meta">
              <span className={`access-badge access-${doc.accessLevel}`}>{doc.accessLevel}</span>
            </div>
            <div style={{display:'flex',gap:8,marginTop:'10px'}}>
              <button className="btn btn-primary btn-view-doc" onClick={() => setModalDoc(doc)} style={{flex:1}}>View</button>
              <button className="btn btn-secondary btn-share-doc" title="Share" onClick={() => handleShareMenu(doc._id)} style={{flex:'none',padding:'0 14px',fontSize:'1.1rem',display:'flex',alignItems:'center',gap:4,position:'relative'}}>
                <i className="fas fa-share-alt"></i>
              </button>
            </div>
            {shareMenuDocId === doc._id && (
              <div ref={shareMenuRef} className="share-popup-menu">
                <div className="share-popup-arrow"></div>
                <button className="btn btn-link share-popup-item whatsapp" onClick={()=>handleShareAction('whatsapp',doc)}><i className="fab fa-whatsapp"></i> WhatsApp</button>
                <button className="btn btn-link share-popup-item telegram" onClick={()=>handleShareAction('telegram',doc)}><i className="fab fa-telegram-plane"></i> Telegram</button>
                <button className="btn btn-link share-popup-item email" onClick={()=>handleShareAction('email',doc)}><i className="fas fa-envelope"></i> Email</button>
                <button className="btn btn-link share-popup-item copy" onClick={()=>handleShareAction('copy',doc)}><i className="fas fa-link"></i> Copy Link</button>
              </div>
            )}
            {copiedDocId === doc._id && (
              <div style={{position:'absolute',top:10,right:10,background:'#6366f1',color:'#fff',padding:'4px 12px',borderRadius:'8px',fontSize:'0.98rem',boxShadow:'0 2px 8px rgba(99,102,241,0.13)',zIndex:2,transition:'opacity 0.2s'}}>Link copied!</div>
            )}
          </div>
        ))}
      </div>
      )}
      {modalDoc && <DocumentModal doc={modalDoc} currentUser={currentUser} onClose={handleModalClose} showFileButton={true} />}
    </div>
  );
}
