import { useState } from 'react';

export default function SettingsView({ currentUser, setCurrentUser }) {
  const [newPassword, setNewPassword] = useState('');

  function updateProfile() {
    if (newPassword) {
      const users = JSON.parse(localStorage.getItem('dms_users')) || [];
      const idx = users.findIndex(u => u.username === currentUser.username);
      users[idx].password = newPassword;
      localStorage.setItem('dms_users', JSON.stringify(users));
      setNewPassword('');
      alert('Profile updated successfully!');
      setCurrentUser(users[idx]);
    }
  }

  return (
    <div id="settingsView" className="view active">
      <div className="view-header">
        <h2>Settings</h2>
      </div>
      <div className="settings-container">
        <div className="settings-section">
          <h3>Profile Settings</h3>
          <div className="form-group">
            <label htmlFor="profileUsername">Username</label>
            <input id="profileUsername" value={currentUser.username} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary" onClick={updateProfile}>Update Profile</button>
        </div>
      </div>
    </div>
  );
}
