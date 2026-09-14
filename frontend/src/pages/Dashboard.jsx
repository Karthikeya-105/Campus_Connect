import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    // Read saved info from localStorage
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    const handleLogout = () => {
        localStorage.clear();   // Remove token + user info
        navigate('/login');     // Send back to login
    };

    return (
        <div style={{ maxWidth: '700px', margin: '50px auto' }}>
            <h1>Welcome, {name} 👋</h1>
            <p>You are logged in as <strong>{email}</strong>.</p>

            <hr />
            <h3>Coming soon:</h3>
            <ul>
                <li>Browse Job Postings</li>
                <li>Apply to Jobs</li>
                <li>Track Applications</li>
                <li>View Interviews</li>
            </ul>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;