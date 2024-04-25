import React, { useState } from 'react';
import axios from 'axios'

import './PWManager.css';

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Password copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function PWManager() {
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // need change, add logic
    const passwords = [
        { id: 1, name: 'Service/Domain 1', password: 'password 1' },
        { id: 2, name: 'Service/Domain 2', password: 'password 2' },
        { id: 3, name: 'Service/Domain 3', password: 'password 3' }
    ];

    const filteredPasswords = passwords.filter(password =>
        password.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fuzzyMatching = async (value) => {
        setSearchTerm(value)
        let url = ''
        if (value) {
            url = `/api/passwords/search/${value}`
        } else {
            url = `/api/passwords`
        }
        try {
            const response = await axios({
                method: 'GET',
                url: url
            })
            console.log('response', response)
        } catch (err) {
            console.log('err', err.response.data)
            setError(JSON.stringify(err.response.data))
        }
    }

    return (
        <div className="pwmanager">
            <h1>View and update your passwords.</h1>
            <input
                type="text"
                placeholder="Search by service"
                value={searchTerm}
                onChange={e => fuzzyMatching(e.target.value)}
                className="search-box"
            />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="cards-container">
                {filteredPasswords.map(password => (
                    <div key={password.id} className="card">
                        <h2>{password.name}</h2>
                        <div className="password-container">
                            <p>{visiblePasswords[password.id] ? password.password : '••••••••'}</p>
                            <div className="button-row">
                                <button onClick={() => togglePasswordVisibility(password.id)} className="toggle-visibility">
                                    <img src={visiblePasswords[password.id] ? "show-svgrepo-com.svg" : "hide-svgrepo-com.svg"} alt={visiblePasswords[password.id] ? "Hide" : "Show"} />
                                </button>
                                <button className="bot-button">
                                    <img src="/edit-svgrepo-com.svg" alt="Edit" />
                                </button>
                                <button onClick={() => copyToClipboard(password.password)} className="bot-button">
                                    <img src="/copy-svgrepo-com.svg" alt="Copy" />
                                </button>
                            </div>
                        </div>
                        <input placeholder='Enter Username to Share Password' className='input'></input>
                        <button onClick={() => sharePassword(password.details)} className="bot-button">
                            <img src="/share-1-svgrepo-com.svg" alt="Share" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="wrapper">
                <div className="form">
                    <h2 className="form-title">Add a new password</h2>
                    <input
                        type="text"
                        placeholder="Service/Domain name"
                        className="input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                    />
                    <button className="submit">Add Password</button>
                </div>
            </div>
        </div>
    );
}

export default PWManager;
