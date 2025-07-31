import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../api';
import DocumentsView from './DocumentsView';
import UploadView from './UploadView';

export default function DashboardScreen({ currentUser, setCurrentUser }) {
  const [view, setView] = useState('dashboard');
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnBar, setShowAnnBar] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    async function loadAnns() {
      try {
        const token = localStorage.getItem('jwt_token');
        const anns = await fetchAnnouncements(token);
        setAnnouncements(anns);
      } catch {}
    }
    loadAnns();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_user');
    setCurrentUser(null);
  };

  const renderContent = () => {
    switch(view) {
      case 'documents':
        return <DocumentsView currentUser={currentUser} />;
      case 'upload':
        return <UploadView currentUser={currentUser} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: animate ? 'slideInUp 0.6s ease-out 0.4s both' : 'none'
    }}>
      {view === 'documents' ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: '50%',
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <i className="fas fa-file-upload" style={{ fontSize: '3rem', color: '#9ca3af' }}></i>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            No Documents Yet
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '1.1rem' }}>
            Start by uploading your first document to get organized!
          </p>
          <button 
            onClick={() => setView('upload')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
            Upload Document
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: '50%',
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <i className="fas fa-bullhorn" style={{ fontSize: '3rem', color: '#9ca3af' }}></i>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            No Announcements Yet
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '1.1rem' }}>
            Check back later for important updates and announcements!
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }}
          >
            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
            Create Announcement
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
        animation: 'float 20s infinite ease-in-out'
      }}></div>

      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '20px 40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            padding: '12px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}>
            <i className="fas fa-folder-open" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
          </div>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Document Hub
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Welcome back, {currentUser.username}! 👋
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: 'rgba(102, 126, 234, 0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: '#667eea',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
            {currentUser.username}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '12px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
            }}
          >
            <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '40px',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Announcement Bar */}
        {showAnnBar && announcements.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '20px 24px',
            borderRadius: '16px',
            marginBottom: '30px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            animation: animate ? 'slideInDown 0.6s ease-out' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '50%',
                padding: '8px',
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
              }}>
                <i className="fas fa-bullhorn" style={{ fontSize: '1rem', color: '#fff' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#1f2937', fontSize: '1.1rem' }}>Announcement</strong>
                <p style={{ margin: '4px 0 0 0', color: '#374151' }}>{announcements[0].message}</p>
                <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {new Date(announcements[0].createdAt).toLocaleString()}
                </small>
              </div>
              <button 
                onClick={() => setShowAnnBar(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            animation: animate ? 'slideInUp 0.6s ease-out 0.1s both' : 'none'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}>
                <i className="fas fa-file-alt" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>0</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Total Documents</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            animation: animate ? 'slideInUp 0.6s ease-out 0.2s both' : 'none'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}>
                <i className="fas fa-clock" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>0</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Recent Files</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            animation: animate ? 'slideInUp 0.6s ease-out 0.3s both' : 'none'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}>
                <i className="fas fa-bullhorn" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>{announcements.length}</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Announcements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setView('dashboard')}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: view === 'dashboard' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: view === 'dashboard' ? '#fff' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
            Dashboard
          </button>
          <button
            onClick={() => setView('documents')}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: view === 'documents' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: view === 'documents' ? '#fff' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
            Documents
          </button>
          <button
            onClick={() => setView('upload')}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: view === 'upload' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: view === 'upload' ? '#fff' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
            Upload
          </button>
        </div>

        {/* Content Area */}
        {renderContent()}
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 