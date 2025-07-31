import { useState, useEffect } from 'react';

export default function UsersView() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem('dms_users')) || []);
  }, []);

  function handleEdit(username) {
    const newRole = prompt(`Change role for ${username}:`, users.find(u => u.username === username).role);
    if (newRole && (newRole === 'admin' || newRole === 'user')) {
      const updated = users.map(u => u.username === username ? { ...u, role: newRole } : u);
      setUsers(updated);
      localStorage.setItem('dms_users', JSON.stringify(updated));
      alert('User updated successfully!');
    }
  }

  function handleDelete(username) {
    if (username === 'admin') return;
    if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      const updated = users.filter(u => u.username !== username);
      setUsers(updated);
      localStorage.setItem('dms_users', JSON.stringify(updated));
      alert('User deleted successfully!');
    }
  }

  function handleAdd() {
    const username = prompt('Enter username:');
    const password = prompt('Enter password:');
    const role = prompt('Enter role (admin/user):', 'user');
    if (username && password && (role === 'admin' || role === 'user')) {
      if (users.find(u => u.username === username)) {
        alert('Username already exists!');
        return;
      }
      const updated = [...users, { username, password, role, lastLogin: null }];
      setUsers(updated);
      localStorage.setItem('dms_users', JSON.stringify(updated));
      alert('User added successfully!');
    }
  }

  return (
    <div id="usersView" className="view active">
      <div className="view-header">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>Add User</button>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(user.username)}>Edit</button>
                  {user.username !== 'admin' && (
                    <button className="btn btn-danger" onClick={() => handleDelete(user.username)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
