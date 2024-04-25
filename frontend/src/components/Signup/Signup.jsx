import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
            console.log('response', response)
            console.log('response', response.data)

            // localStorage.setItem('token', response.data.token);
            alert('sign up success')
            window.location.href = '/login'
        } catch (err) {
            console.log('err', err.response.data)
            setError(JSON.stringify(err.response.data))
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
