import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("loggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("tasks");
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskInput.trim()) {
      const newTask = {
        id: Date.now(),
        text: taskInput,
        completed: false,
        priority,
        dueDate,
      };
      setTasks([newTask, ...tasks]);
      setTaskInput("");
      setPriority("medium");
      setDueDate("");
    }
  };

  const toggleTask = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const isExpired = (due) => {
    if (!due) return false;
    const today = new Date().toISOString().split("T")[0];
    return due < today;
  };

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="container">
          <div className="box">
            <div className="header">
              <h2>My Pastel Task Tracker</h2>
              <div className="right-header">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <span className="slider"></span>
                </label>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>

            <form onSubmit={handleAddTask} className="add-task-form">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a new task..."
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
              >
                <option value="high">High 🔥</option>
                <option value="medium">Medium 💫</option>
                <option value="low">Low 🌱</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="due-date-input"
              />
              <button type="submit">Add</button>
            </form>

            <div className="filter-buttons">
              <button
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={filter === "completed" ? "active" : ""}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button
                className={filter === "incomplete" ? "active" : ""}
                onClick={() => setFilter("incomplete")}
              >
                Incomplete
              </button>
            </div>

            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <p className="empty">No tasks to show for this filter.</p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task ${task.completed ? "completed" : ""} ${
                      isExpired(task.dueDate) && !task.completed ? "expired" : ""
                    }`}
                  >
                    <span onClick={() => toggleTask(task.id)}>{task.text}</span>
                    {task.dueDate && (
                      <span className="due-date">Due: {task.dueDate}</span>
                    )}
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
