import './TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`priority ${task.priority}`}>{task.priority.toUpperCase()}</span>
      </div>
      <p className="task-description">{task.description || 'No description'}</p>
      <div className="task-footer">
        <span className={`status-badge ${task.status}`}>{task.status}</span>
        <div className="task-actions">
          <button className="btn-edit" onClick={onEdit}>Edit</button>
          <button className="btn-delete" onClick={onDelete}>Delete</button>
          {task.status !== 'completed' && (
            <button className="btn-complete" onClick={onToggle}>✓</button>
          )}
        </div>
      </div>
    </div>
  );
}