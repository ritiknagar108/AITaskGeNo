import { useState } from 'react';
import { generateTasks } from '../services/api';
import Loader from '../components/Loader';
import './GenerateTask.css';

export default function GenerateTask() {
  const [text, setText] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedTasks, setSelectedTasks] = useState(new Set());

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setMessage('❌ Please enter your goals or plans');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const { data } = await generateTasks(text);
      setGeneratedTasks(data.tasks || []);
      setSelectedTasks(new Set());
      
      if (data.tasks?.length > 0) {
        setMessage(`✅ ${data.message}`);
        setText('');
      } else {
        setMessage(`⚠️ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to generate tasks'));
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#ffa500';
      case 'low':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      study: '📚',
      work: '💼',
      project: '🚀',
      health: '❤️',
      personal: '✨'
    };
    return emojis[category] || '📌';
  };

  const getRecurringLabel = (recurring) => {
    const labels = {
      daily: '⏰ Daily',
      weekly: '📅 Weekly',
      monthly: '📆 Monthly',
      none: 'Once'
    };
    return labels[recurring] || 'Once';
  };

  const formatDate = (deadline) => {
    if (!deadline) return 'No deadline';
    const date = new Date(deadline);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return '📍 Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '📍 Tomorrow';
    }

    const daysUntil = Math.floor((date - today) / (1000 * 60 * 60 * 24));
    if (daysUntil === 2) return '📍 In 2 days';
    if (daysUntil > 2 && daysUntil <= 7) return `📍 In ${daysUntil} days`;

    return `📍 ${date.toLocaleDateString()}`;
  };

  return (
    <div className="generate-container">
      <div className="generate-header">
        <h1>🤖 AI Task Generator</h1>
        <p className="subtitle">Describe your plans in natural language → Get structured tasks instantly</p>
      </div>

      <div className="generate-form-box">
        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label>📝 What's on your mind?</label>
            <textarea
              placeholder="Example: I have GATE exam on Feb 15, need to complete CN by Feb 1, practice daily, and finish projects"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="5"
              className="textarea-input"
              disabled={loading}
            />
            <p className="textarea-hint">
              💡 Tip: Use natural language - mention deadlines, priorities, and frequencies
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-generate">
            {loading ? '⏳ Generating...' : '✨ Generate Tasks'}
          </button>
        </form>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : message.includes('⚠️') ? 'warning' : 'error'}`}>
          {message}
        </div>
      )}

      {loading && <Loader />}

      {generatedTasks.length > 0 && (
        <div className="generated-tasks-section">
          <div className="section-header">
            <h2>Generated Tasks 🎯</h2>
            <p className="task-count">{generatedTasks.length} task{generatedTasks.length !== 1 ? 's' : ''} created</p>
          </div>

          <div className="tasks-grid">
            {generatedTasks.map((task) => (
              <div
                key={task._id}
                className={`task-card ${selectedTasks.has(task._id) ? 'selected' : ''}`}
                onClick={() => toggleTaskSelection(task._id)}
              >
                <div className="task-header">
                  <div className="task-title-section">
                    <div className="checkbox">
                      {selectedTasks.has(task._id) && <span className="checkmark">✓</span>}
                    </div>
                    <h3 className="task-title">{task.title}</h3>
                    <span className="category-badge">
                      {getCategoryEmoji(task.category)} {task.category}
                    </span>
                  </div>
                  <div className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                    {task.priority.toUpperCase()}
                  </div>
                </div>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                <div className="task-meta">
                  <div className="meta-item">
                    <span className="meta-label">Deadline:</span>
                    <span className="meta-value">{formatDate(task.deadline)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Recurring:</span>
                    <span className="meta-value">{getRecurringLabel(task.recurring)}</span>
                  </div>
                </div>

                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="subtasks">
                    <div className="subtasks-label">📋 Subtasks:</div>
                    <ul className="subtasks-list">
                      {task.subtasks.map((subtask, idx) => (
                        <li key={idx}>
                          <input type="checkbox" disabled />
                          <span>{subtask}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}