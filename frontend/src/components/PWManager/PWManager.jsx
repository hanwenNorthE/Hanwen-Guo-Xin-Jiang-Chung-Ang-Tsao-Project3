import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './PWManager.css';

function PWManager() {
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [editPasswordId, setEditPasswordId] = useState(null);
    const [editPasswordValue, setEditPasswordValue] = useState('');
    const [passwordsList, setPasswordsList] = useState([]);
    const [sharedPasswords, setSharedPasswords] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [shareUsername, setShareUsername] = useState('');

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Password copied to clipboard!');
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
            toast.success('delete success');
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
            toast.success('edit success');
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
            toast.success('add success');
            setCredentials({ title: '', password: '' });
            setError2('');
            fuzzyMatching('');
        } catch (error) {
            console.error('Failed to add password:', error);
            setError2(error.response.data.error || 'Failed to add password');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [passwordResponse, sharedResponse, requestsResponse] = await Promise.all([
                    axios.get('/api/passwords'),
                    axios.get('/api/passwords/shared'),
                    axios.get('/api/passwords/requests')
                ]);
                setPasswordsList(passwordResponse.data);
                setSharedPasswords(sharedResponse.data);
                setPendingRequests(requestsResponse.data);
            } catch (error) {
                setError('Failed to fetch data');
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleSharePassword = async (passwordId, shareUsername) => {
        if (!shareUsername.trim()) {
            toast.error('Username required to share password.');
            return;
        }
        try {
            await axios.post('/api/passwords/createRequest', { passwordId, shareUser: shareUsername });
            toast.success('Share request sent.');
            setShareUsername('');
        } catch (error) {
            toast.error('Failed to send share request.');
            console.error(error);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`/api/passwords/requests/${requestId}/accept`, { userRequest: requestId });
            toast.success('Request accepted.');
        } catch (error) {
            toast.error('Failed to accept request.');
            console.error(error);
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            await axios.post(`/api/passwords/requests/${requestId}/decline`, { userRequest: requestId });
            toast.success('Request declined.');
        } catch (error) {
            toast.error('Failed to decline request.');
            console.error(error);
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
            <div>
                {pendingRequests.map(request => (
                    <div key={request.id}>
                        <p>{request.fromUsername} wants to share a password with you.</p>
                        <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                        <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
                    </div>
                ))}
            </div>
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
                        <input
                            placeholder='Enter Username to Share Password'
                            className='input'
                            value={shareUsername}
                            onChange={e => setShareUsername(e.target.value)}
                        />
                        <button className="bot-button" onClick={() => handleSharePassword(password.id, shareUsername)}>
                            <img src="/share-1-svgrepo-com.svg" alt="Share" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="cards-container">
                {sharedPasswords.map(password => (
                    <div key={password.id} className="card">
                        <h2>{password.title} (shared by {password.fromUsername})</h2>
                        <p>{password.password}</p>
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
