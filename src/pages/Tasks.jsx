import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import './Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending', priority: 'medium' });
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await createTask(form.title, form.description, form.status, form.priority);
      setForm({ title: '', description: '', status: 'pending', priority: 'medium' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task._id, task.title, task.description, newStatus, task.priority);
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (loading) return <Loader />;

  const filteredTasks = tasks
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter(t => filterPriority === 'all' || t.priority === filterPriority);

  return (
    <div className="tasks-container">
      <h1>📋 All Tasks</h1>

      <div className="tasks-toolbar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">+ Add Task</button>
      </div>

      {showForm && (
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Save Task</button>
        </form>
      )}

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <p className="empty-message">No tasks found</p>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => {}}
              onDelete={() => handleDeleteTask(task._id)}
              onToggle={() => handleToggleComplete(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}