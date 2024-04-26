import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    console.log(111);
    console.log(credentials);

    try {
      const response = await axios({
        method: 'POST',
        url: '/api/users/login',
        data: credentials
      });
      console.log('response', response);
      console.log('response', response.data);

      localStorage.setItem('user', JSON.stringify(response.data)); 
      alert('login success');
      window.location.href = '/pwmanager'; 
    } catch (err) {
      console.log('error', err.response ? err.response.data : err.message);
      setError(err.response ? JSON.stringify(err.response.data) : "Login failed!");
    }
  };

  return (
    <div className="wrapper">
      <form className="form">
        <p className="form-title">Login</p>
        <input id="username" name="username" value={credentials.username} type="text" placeholder="Username" className="input" onChange={handleChange} />
        <input id="password" name="password" value={credentials.password} type="password" placeholder="Password" className="input" onChange={handleChange} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="button" className="submit" onClick={handleLogin}>Login</button>
        <p className="signup-link">
          No account? <NavLink to='/signup' className='link'>Sign Up</NavLink>
        </p>
      </form>
    </div>
  );
}

export default Login;
