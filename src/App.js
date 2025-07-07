import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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
        priority: priority,
      };
      setTasks([newTask, ...tasks]);
      setTaskInput("");
      setPriority("medium");
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

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="container">
          <div className="box">
            <div className="header">
              <h2>My Pastel Task Tracker</h2>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
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
                    className={`task ${task.completed ? "completed" : ""}`}
                  >
                    <span onClick={() => toggleTask(task.id)}>
                      {task.text}
                    </span>
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                    <button onClick={() => deleteTask(task.id)}>🗑️</button>
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
