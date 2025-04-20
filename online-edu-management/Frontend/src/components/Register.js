import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function Register({ setIsRegistered }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password,
        role, 
      });
      setSuccess('Registration successful! Now you can log in.');
      setError('');
    } catch (error) {
      setError('Registration failed. Please try again later.');
      setSuccess('');
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label>Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="button-container">
          <button type="submit">Register</button>
        </div>
      </form>
      <p onClick={() => setIsRegistered(true)}>Already have an account? Login</p>
    </div>
  );
}

export default Register;
