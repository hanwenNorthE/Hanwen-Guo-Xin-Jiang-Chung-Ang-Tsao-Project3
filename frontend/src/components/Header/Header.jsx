import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isSignupPage = location.pathname === '/signup';

    return (
        <div className='header'>
            <NavLink to='/' className='logo'>Home</NavLink>
            <div className="auth-buttons">
                <NavLink to='/pwmanager' className='link'>View Password</NavLink>
                {!isLoginPage && <NavLink to='/login' className='link'>Log In</NavLink>}
                {!isSignupPage && <NavLink to='/signup' className='link'>Sign Up</NavLink>}
            </div>
        </div>
    );
}

export default Header;
