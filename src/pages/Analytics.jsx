import { useEffect, useState } from 'react'
;
import { getTasks } from '../services/api';
import Loader from '../components/Loader';
import './Analytics.css';

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;

  return (
    <div className="analytics-container">
      <h1>📊 Analytics & Insights</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Completion Rate</h3>
          <div className="stat-large">{completionRate}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Total Tasks</h3>
          <div className="stat-large">{tasks.length}</div>
        </div>

        <div className="analytics-card">
          <h3>Task Distribution</h3>
          <p>✅ Completed: {completed}</p>
          <p>⏳ Pending: {pending}</p>
          <p>🔄 In Progress: {inProgress}</p>
        </div>

        <div className="analytics-card">
          <h3>Priority Distribution</h3>
          <p>🔴 High: {highPriority}</p>
          <p>🟡 Medium: {mediumPriority}</p>
          <p>🟢 Low: {lowPriority}</p>
        </div>
      </div>

      <div className="insights">
        <h2>💡 Insights</h2>
        {completionRate >= 80 && <p className="insight-positive">🎉 Great job! You're highly productive with a {completionRate}% completion rate!</p>}
        {completionRate < 50 && <p className="insight-warning">⚠️ Try to focus on completing pending tasks to improve your productivity.</p>}
        {highPriority > mediumPriority && <p className="insight-info">ℹ️ You have {highPriority} high-priority tasks. Consider tackling them first!</p>}
      </div>
    </div>
  );
}