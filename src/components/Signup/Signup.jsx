import React from 'react';
import { NavLink } from 'react-router-dom';
import './Signup.css';

function Signup() {
    return (
        <div className='wrapper'>
            <div className='platform'>
                <form className='signup-form'>
                    <h2 className='form-title'>Registration Form</h2>
                    <div className="form-section">
                        <div className="form-inputs">
                            <input className='input' type="text" placeholder="Name" />
                            <input className='input' type="email" placeholder="Email" />
                            <input className='input' type="text" placeholder="Username" />
                            <input className='input' type="password" placeholder="Password" />
                        </div>
                    </div>
                    <button type="submit">Sign Up</button>
                    <p className="signup-link">
                        Have an account? <NavLink to='/login' className='link'>Login</NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
