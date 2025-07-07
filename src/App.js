import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const App = () => {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleLogin = (name) => {
    setUsername(name);
    localStorage.setItem('username', name);
  };

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      title: task,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleComplete = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="app">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <h1>Hello, {username}!</h1>
          <TaskForm onAdd={addTask} />
          <TaskList tasks={tasks} onToggle={toggleComplete} onDelete={deleteTask} />
        </>
      )}
    </div>
  );
};

export default App;
