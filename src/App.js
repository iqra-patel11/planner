import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function Home() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addOrUpdateTask = () => {
    if (taskInput.trim() === "") return;

    if (editTaskId !== null) {
      setTasks(tasks.map(task =>
        task.id === editTaskId
          ? { ...task, text: taskInput, priority, dueDate }
          : task
      ));
      setEditTaskId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text: taskInput,
        completed: false,
        priority,
        dueDate,
      };
      setTasks([...tasks, newTask]);
    }

    setTaskInput("");
    setPriority("medium");
    setDueDate("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const confirmDelete = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (
      window.confirm(`Are you sure you want to delete "${taskToDelete.text}"?`)
    ) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setTaskInput(task.text);
    setPriority(task.priority);
    setDueDate(task.dueDate || "");
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    })
    .filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="App">
      <div className="box">
        <div className="header">
          <h2>My Planner</h2>
        </div>

        <div className="add-task-form">
          <input
            type="text"
            placeholder="Add or edit a task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">High 🔴</option>
            <option value="medium">Medium 🟡</option>
            <option value="low">Low 🟢</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button onClick={addOrUpdateTask}>
            {editTaskId !== null ? "Update" : "Add"}
          </button>
        </div>

        <input
          className="search-bar"
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("incomplete")}>Incomplete</button>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="empty">No tasks match your search.</p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task ${task.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                <div className="task-details">
                  <strong>{task.text}</strong>
                  {task.dueDate && (
                    <div className="due">Due: {task.dueDate}</div>
                  )}
                </div>
                <span className={`priority ${task.priority}`}>
                  {task.priority}
                </span>
                <div className="task-buttons">
                  <button onClick={() => startEdit(task)}>✏️</button>
                  <button onClick={() => confirmDelete(task.id)}>❌</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  const isLoggedIn = localStorage.getItem("loggedIn");

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
