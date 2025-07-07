import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="task-input"
      />
      <textarea
        placeholder="Enter task description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="task-textarea"
      />
      <button type="submit" className="add-button">➕ Add Task</button>
    </form>
  );
};

export default TaskForm;
