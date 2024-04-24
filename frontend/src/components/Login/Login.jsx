import React from 'react';
import { NavLink } from 'react-router-dom';
import './Login.css';

function Login() {
  return (
    <div className="wrapper">
      <form className="form">
        <p className="form-title">Login</p>
          <input type="text" placeholder="Username" className="input" />
          <input type="password" placeholder="Password" className="input" />
        <button type="button" className="submit">Login</button>
        <p className="signup-link">
          No account? <NavLink to='/signup' className='link'>Sign Up</NavLink>
        </p>
      </form>
    </div>
  );
}

export default Login;
