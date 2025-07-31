// Fetch all documents for the current user (for data usage)
export async function fetchAllDocuments(token) {
  const res = await fetch(`${API_URL}/documents`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}
// Fetch recent history for the logged-in user
export async function fetchRecents(token) {
  const res = await fetch(`${API_URL}/recents`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch recents');
  return res.json();
}
// API utility for backend communication
const API_URL = 'http://localhost:5000/api';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json();
}

export async function register(username, password, role = 'user') {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  return res.json();
}

export async function fetchDocuments(token) {
  const res = await fetch(`${API_URL}/documents`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function uploadDocument({ token, file, title, description, category, accessLevel }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('accessLevel', accessLevel);
  const res = await fetch(`${API_URL}/documents/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

// ADMIN: Fetch all users
export async function fetchUsers(token) {
  const res = await fetch(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}
// ADMIN: Delete user
export async function deleteUser(token, userId) {
  const res = await fetch(`${API_URL}/auth/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}
// ADMIN: Delete document (already exists, but wrap for admin)
export async function deleteDocument(token, docId) {
  const res = await fetch(`${API_URL}/documents/${docId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}
// ADMIN: Send announcement (dummy, as backend route may not exist)
export async function sendAnnouncement(token, message) {
  const res = await fetch('http://localhost:5000/api/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('Failed to send announcement');
  return res.json();
}
export async function fetchAnnouncements(token) {
  const res = await fetch('http://localhost:5000/api/announcements', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch announcements');
  return res.json();
}
