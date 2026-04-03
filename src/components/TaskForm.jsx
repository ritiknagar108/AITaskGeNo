import { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
      <button type="submit">{initialData ? 'Update' : 'Add'} Task</button>
    </form>
  );
};

export default TaskForm;