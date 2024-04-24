import React, { useState } from 'react';
import './PWManager.css';

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Password copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function PWManager() {
    const [searchTerm, setSearchTerm] = useState('');  // State to hold the search term
    const passwords = [
        { id: 1, name: 'Password 1', details: 'Details for Password 1' },
        { id: 2, name: 'Password 2', details: 'Details for Password 2' },
        { id: 3, name: 'Password 3', details: 'Details for Password 3' }
    ];

    // Filter passwords based on the search term
    const filteredPasswords = passwords.filter(password => 
        password.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pwmanager">
            <h1>View and update your passwords.</h1>
            <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-box"
            />
            <div className="cards-container">
                {filteredPasswords.map(password => (
                    <div key={password.id} className="card">
                        <h2>{password.name}</h2>
                        <p>{password.details}</p>
                        <button onClick={() => copyToClipboard(password.details)} className="copy-button">
                            <img src="/copy-svgrepo-com.svg" alt="Copy" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PWManager;
