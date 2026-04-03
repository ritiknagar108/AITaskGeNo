import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🤖 AI Task Generator</h1>
      </div>
      <div className="navbar-center">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/generate" className="nav-link">Generate Tasks</Link>
        <Link to="/tasks" className="nav-link">All Tasks</Link>
        <Link to="/analytics" className="nav-link">Analytics</Link>
      </div>
      <div className="navbar-right">
        <span className="user-name">{user?.name}</span>
        <Link to="/profile" className="nav-link">Profile</Link>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}