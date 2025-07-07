// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username);
      navigate('/tasks');
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Welcome!</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Enter your name ✨"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login ➡️</button>
      </form>
    </div>
  );
};

export default Login;
