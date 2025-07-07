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

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
      priority,
      dueDate,
    };

    setTasks([...tasks, newTask]);
    setTaskInput("");
    setPriority("medium");
    setDueDate("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
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
            placeholder="Add a new task"
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
          <button onClick={addTask}>Add</button>
        </div>

        {/* ✅ Search input below add-task-form */}
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
                onClick={() => toggleTask(task.id)}
              >
                <div>
                  <strong>{task.text}</strong>
                  {task.dueDate && (
                    <div className="due">Due: {task.dueDate}</div>
                  )}
                </div>
                <span className={`priority ${task.priority}`}>
                  {task.priority}
                </span>
                <button onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}>
                  ❌
                </button>
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
