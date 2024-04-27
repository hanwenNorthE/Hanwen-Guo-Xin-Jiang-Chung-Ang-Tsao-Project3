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
    const [passwordsList, setPasswordsList] = useState([])
    const [usernameToShare, setUsernameToShare] = useState('');
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve and parse the user data


    const [pendingRequests, setPendingRequests] = useState([]);

    const [sharedPasswords, setSharedPasswords] = useState([]);


    const fetchSharedPasswords = async () => {
        try {
            const response = await axios.get('/api/sharePassword/'); // Endpoint to get shared passwords
            setSharedPasswords(response.data);
        } catch (error) {
            console.error("No shared pw or Error fetching shared passwords");
        }
    };
    useEffect(() => {
        fetchSharedPasswords().then(() => {
        });
    }, []);
    useEffect(() => {
        fetchSharedPasswords();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('/api/shareRequest/getRequest');
            setPendingRequests(response.data);
            console.log("fetched requests");
        } catch (error) {
            console.error("No requests or Error fetching requests");
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleAcceptRequest = async (userRequestId) => {
        try {
            const response = await axios.put(`/api/shareRequest/updateRequest/accepted`, {
                userRequest: userRequestId
            });
            toast.success('Request accepted successfully');
            // Filter out the accepted request from the state
            setPendingRequests(prevRequests => prevRequests.filter(request => request.fromUser !== userRequestId));
        } catch (error) {
            toast.error("Failed to accept request: " + (error.response ? error.response.data.error : "Unknown Error"));
        }
    };

    const handleDeclineRequest = async (userRequestId) => {
        try {
            const response = await axios.put(`/api/shareRequest/updateRequest/rejected`, {
                userRequest: userRequestId
            });
            toast.success('Request declined successfully');
            setPendingRequests(prevRequests => prevRequests.filter(request => request.fromUser !== userRequestId));
        } catch (error) {
            toast.error("Failed to decline request: " + (error.response ? error.response.data.error : "Unknown Error"));
        }
    };


    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prevVisiblePasswords => ({
            ...prevVisiblePasswords,
            [id]: !prevVisiblePasswords[id]
        }));
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



    const handleShareChange = (e) => {
        setUsernameToShare(e.target.value);
    };

    const handleShareRequest = async () => {
        console.log("Current user's username:", user ? user.username : "No user found");

        if (!usernameToShare) {
            toast.error("Please enter a username.");
            return;
        }
        if (!user) {
            toast.error("Session not found. Please login again.");
            return;
        }

        try {
            console.log("Sending request for", usernameToShare, "from", user.username);
            const response = await axios.post('/api/shareRequest/createRequest', {
                shareUser: usernameToShare,
                requestingUser: user.username // Optional, for reference or other use
            });
            console.log("Request sent successfully", response.data);
            toast.success('Request sent successfully');
            setUsernameToShare('');
        } catch (error) {
            console.error("Error sending request:", error.response ? error.response.data : error.message);
            toast.error(error.response ? error.response.data.error : "Failed to send request");
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
                {pendingRequests.length > 0 ? (
                    pendingRequests.map(request => (
                        <div key={request.id}>
                            <p>{request.fromUsername} wants to share a password with you.</p>
                            <button onClick={() => handleAcceptRequest(request.fromUser)}>Accept</button>
                            <button onClick={() => handleDeclineRequest(request.fromUser)}>Decline</button>
                        </div>
                    ))
                ) : (
                    <p>No pending requests.</p>
                )}
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
                                <p>{visiblePasswords[password.id] ? password.password : '••••••••••'}</p>
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
                            value={usernameToShare}
                            onChange={handleShareChange}
                            placeholder='Enter Username to Share Password'
                            className='input'
                        />
                        <button onClick={handleShareRequest} className="bot-button">
                            <img src="/share-1-svgrepo-com.svg" alt="Share" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="cards-container">
                {sharedPasswords.map((passwordData) => (
                    passwordData.sharePasswords.map((password, index) => (
                        <div key={password._id || `${passwordData._id}-${index}`} className="card">
                            <div className="shared-by-info">Shared Password</div>
                            <h2>{password.title}</h2>
                            <div className="password-container">
                                <p>{visiblePasswords[password._id] ? password.password : '••••••••••'}</p>
                                <div className="button-row">
                                    <button onClick={() => togglePasswordVisibility(password._id)} className="toggle-visibility">
                                        <img src={visiblePasswords[password._id] ? "show-svgrepo-com.svg" : "hide-svgrepo-com.svg"} alt="Show/Hide" />
                                    </button>
                                    <button onClick={() => copyToClipboard(password.password)} className="bot-button">
                                        <img src="/copy-svgrepo-com.svg" alt="Copy" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ))}
            </div>




            {/* <div className="cards-container">
                {sharedPasswords.map(password => (
                    <div key={password.id} className="card">
                        <h2>{password.title}</h2>
                        <div className="password-container">
                            <p>{visiblePasswords[password.id] ? password.password : '••••••••••'}</p>
                            <div className="button-row">
                                <button onClick={() => togglePasswordVisibility(password.id)} className="toggle-visibility">
                                    <img src={visiblePasswords[password.id] ? "show-svgrepo-com.svg" : "hide-svgrepo-com.svg"} alt="Show/Hide" />
                                </button>
                                <button onClick={() => copyToClipboard(password.password)} className="bot-button">
                                    <img src="/copy-svgrepo-com.svg" alt="Copy" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}


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