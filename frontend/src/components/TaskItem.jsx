const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description || 'No description provided.'}</p>
      <div className="meta">
        <span>Status: <strong>{task.status}</strong></span>
        <span>Priority: <strong>{task.priority}</strong></span>
      </div>
      <div className="meta">
        <span>Due: <strong>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</strong></span>
        <span>Created: <strong>{new Date(task.createdAt).toLocaleDateString()}</strong></span>
      </div>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </li>
  );
};

export default TaskItem;