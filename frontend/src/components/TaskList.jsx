import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('Could not fetch tasks. Your session might have expired.');
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const addTask = async (task) => {
    await axios.post('http://localhost:5000/api/tasks', task, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  const updateTask = async (id, task) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, task, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
    setEditing(null);
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>
      {status && <p className="status-msg">{status}</p>}
      <TaskForm onSubmit={editing ? (task) => updateTask(editing._id, task) : addTask} initialData={editing} />
      <ul>
        {tasks.map(task => (
          <TaskItem key={task._id} task={task} onEdit={() => setEditing(task)} onDelete={() => deleteTask(task._id)} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;