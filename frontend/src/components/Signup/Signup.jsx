import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Signup.css';
import axios from 'axios'

function Signup() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const handleSignUp = async () => {
        console.log(credentials)
        try {
            const response = await axios({
                method: 'POST',
                url: '/api/users/signup',
                data: credentials
            })
            // localStorage.setItem('token', response.data.token);
            toast.success('sign up success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 500)
        } catch (err) {
            setError(err.response ? JSON.stringify(err.response.data) : "Sign Up failed!");
        }
    }

    return (
        <div className='wrapper'>
            <div className='platform'>
                <form className='signup-form'>
                    <h2 className='form-title'>Registration Form</h2>
                    <div className="form-section">
                        <div className="form-inputs">
                            <input className='input' type="text" placeholder="Name" />
                            <input className='input' type="email" placeholder="Email" />
                            <input id="username" name="username" value={credentials.username} type="text" placeholder="Username" className="input" onChange={handleChange} />
                            <input id="password" name="password" value={credentials.password} type="password" placeholder="Password" className="input" onChange={handleChange} />
                        </div>
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <button type="button" onClick={handleSignUp}>Sign Up</button>
                    <p className="signup-link">
                        Have an account? <NavLink to='/login' className='link'>Login</NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
