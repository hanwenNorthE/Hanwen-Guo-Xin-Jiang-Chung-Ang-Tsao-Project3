import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './PWManager.css';

function PWManager() {
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [editPasswordId, setEditPasswordId] = useState(null);
    const [editPasswordValue, setEditPasswordValue] = useState('');
    const [passwordsList, setPasswordsList] = useState([])

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Password copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    const fuzzyMatching = async (value) => {
        setSearchTerm(value);
        let url = value ? `/api/passwords/search/${value}` : `/api/passwords`;
        try {
            const response = await axios.get(url);
            setPasswordsList(response.data)
            setError('');
        } catch (err) {
            setPasswordsList([])
            console.error('err', err.response.data);
            setError('NO Data');
        }
    };

    const handleDeletePassword = async (title) => {
        try {
            const response = await axios.delete(`/api/passwords/delete/${title}`);
            console.log('Delete password response:', response.data);
            fuzzyMatching('')
            setError('')
        } catch (error) {
            console.error('Failed to delete password:', error.response.data);
            setError(error.response.data.error || 'Failed to delete password');
        }
    };

    const handleStartEdit = (password) => {
        setEditPasswordId(password.id);
        setEditPasswordValue(password.password);
    };

    const handleSaveEdit = async (id, title) => {
        try {
            const response = await axios.patch(`/api/passwords/update/${title}`, {
                password: editPasswordValue
            });
            console.log('Update password response:', response);
            fuzzyMatching('')
            setEditPasswordId(null); // Exit edit mode
        } catch (error) {
            console.error('Failed to update password:', error);
            setError(error.response.data.error || 'Failed to update password');
        }
    };

    const handleEditInputChange = (event) => {
        setEditPasswordValue(event.target.value);
    };

    useEffect(() => {
        fuzzyMatching('')
    }, [])

    const [error2, setError2] = useState('');
    const [credentials, setCredentials] = useState({ title: '', password: '' });
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleAddPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/passwords/add', credentials);
            console.log('Add password response:', response);
            // alert('add success');
            setCredentials({ title: '', password: '' });
            setError2('');
            fuzzyMatching('');
        } catch (error) {
            console.error('Failed to add password:', error);
            setError2(error.response.data.error || 'Failed to add password');
        }
    };

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
                {passwordsList.map(password => (
                    <div key={password.id} className="card">
                        <h2>{password.title}</h2>
                        <div className="password-container">
                            {editPasswordId === password.id ? (
                                <input
                                    type="text"
                                    value={editPasswordValue}
                                    onChange={handleEditInputChange}
                                    className="password-input"
                                />
                            ) : (
                                <p>{visiblePasswords[password.id] ? password.password : '••••••••'}</p>
                            )}
                            <div className="button-row">
                                <button onClick={() => togglePasswordVisibility(password.id)} className="toggle-visibility">
                                    <img src={visiblePasswords[password.id] ? "show-svgrepo-com.svg" : "hide-svgrepo-com.svg"} alt="Show/Hide" />
                                </button>
                                {editPasswordId === password.id ? (
                                    <button onClick={() => handleSaveEdit(password.id, password.title)} className="bot-button">
                                        <img src="/save-svgrepo-com.svg" alt="Save" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleStartEdit(password)} className="bot-button">
                                        <img src="/edit-svgrepo-com.svg" alt="Edit" />
                                    </button>
                                )}
                                <button onClick={() => copyToClipboard(password.password)} className="bot-button">
                                    <img src="/copy-svgrepo-com.svg" alt="Copy" />
                                </button>
                                <button onClick={() => handleDeletePassword(password.title)} className="bot-button">
                                    <img src="delete-2-svgrepo-com.svg" alt="Delete" />
                                </button>
                            </div>
                        </div>
                        <input placeholder='Enter Username to Share Password' className='input'></input>
                        <button className="bot-button">
                            <img src="/share-1-svgrepo-com.svg" alt="Share" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="wrapper">
                <div className="form">
                    <h2 className="form-title">Add a new password</h2>
                    <input id="title" name="title" value={credentials.title} type="text" placeholder="Service/Domain name" className="input" onChange={handleChange} />
                    <input id="password" name="password" value={credentials.password} type="password" placeholder="Password" className="input" onChange={handleChange} />
                    {error2 && <div style={{ color: 'red' }}>{error2}</div>}
                    <button className="button" onClick={handleAddPassword}>Add Password</button>
                </div>
            </div>
        </div>
    );
}

export default PWManager;
