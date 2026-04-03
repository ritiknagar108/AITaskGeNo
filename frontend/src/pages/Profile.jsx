import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updatePassword } from '../services/api';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('❌ New passwords do not match');
      return;
    }

    try {
      await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setMessage('✅ Password updated successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to update password'));
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>👤 Profile</h1>

        <div className="user-info">
          <div className="info-item">
            <label>Name:</label>
            <p>{user?.name}</p>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <p>{user?.email}</p>
          </div>
          <div className="info-item">
            <label>Member Since:</label>
            <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="btn-primary">
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="password-form">
            <h2>Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
            <button type="submit">Update Password</button>
          </form>
        )}

        {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
      </div>
    </div>
  );
}