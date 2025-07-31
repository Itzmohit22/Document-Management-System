import React, { useEffect, useState } from 'react';
import { fetchAllDocuments } from '../api';

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  }
  return bytes + ' B';
}

const TOTAL_QUOTA = 1024 * 1024 * 1024; // 1GB quota for example

export default function DataUsageView() {
  const [used, setUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUsage() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('dms_token') || localStorage.getItem('jwt_token');
        const docs = await fetchAllDocuments(token);
        const totalUsed = docs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
        setUsed(totalUsed);
      } catch (e) {
        setError('Failed to load data usage');
      }
      setLoading(false);
    }
    loadUsage();
  }, []);

  const percentUsed = (used / TOTAL_QUOTA) * 100;

  return (
    <div className="data-usage-attractive-card">
      <h2>Data Usage</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{color:'red'}}>{error}</div>
      ) : (
        <>
          <div className="data-usage-summary single">
            <div className="data-usage-amount used" style={{width:'100%'}}>
              <span className="label">Used</span>
              <span className="value">{formatBytes(used)} ({(used/1024).toFixed(1)} KB)</span>
            </div>
          </div>
          <div className="data-usage-progress-bar">
            <div className="bar" style={{ width: percentUsed + '%', background: '#3498db' }}></div>
          </div>
          <div className="data-usage-percent-labels single">
            <span>{percentUsed.toFixed(1)}% Used</span>
          </div>
        </>
      )}
    </div>
  );
}
