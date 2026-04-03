import { useEffect, useState } from 'react';
import { getTasks, getStats } from '../services/api';
import Loader from '../components/Loader';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([getStats(), getTasks()]);
      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  return (
    <div className="dashboard-container">
      <h1>📊 Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>{stats?.total || 0}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card completed">
          <h3>{stats?.completed || 0}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card pending">
          <h3>{stats?.pending || 0}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card in-progress">
          <h3>{stats?.inProgress || 0}</h3>
          <p>In Progress</p>
        </div>
      </div>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'in-progress' ? 'active' : ''} 
          onClick={() => setFilter('in-progress')}
        >
          In Progress
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="tasks-list">
        <h2>Recent Tasks ({filteredTasks.length})</h2>
        {filteredTasks.length === 0 ? (
          <p className="empty-message">No tasks found. <a href="/generate">Generate some tasks</a>!</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task._id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className={`status ${task.status}`}>{task.status}</span>
              <span className={`priority ${task.priority}`}>{task.priority}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}