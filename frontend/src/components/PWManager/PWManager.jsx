import React from 'react';
import './PWManager.css';

function PWManager() {
    return (
        <div className="pwmanager">
            <h1>User Password Manager Page</h1>
            <p>View and update your stored passwords.</p>
            <div className="cards-container">
                <div className="card">
                    <h2>Password 1</h2>
                    <p>Details for Password 1</p>
                </div>
                <div className="card card2">
                    <h2>Password 2</h2>
                    <p>Details for Password 2</p>
                </div>
                <div className="card">
                    <h2>Password 3</h2>
                    <p>Details for Password 3</p>
                </div>
            </div>
        </div>
    );
}

export default PWManager;
