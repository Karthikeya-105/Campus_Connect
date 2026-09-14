import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Login() {
    // These state variables hold what the user types.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // For showing error messages

    // useNavigate lets us redirect after successful login
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop the browser from reloading the page
        setError('');       // Clear any previous error

        try {
            // Send POST request to Spring Boot
            const response = await api.post('/auth/login'
            , { email, password });

            // Extract the data from the response
            const { token, studentId, name, email: userEmail } = response.data;

            // Save to localStorage (browser's persistent storage)
            localStorage.setItem('token', token);
            localStorage.setItem('studentId', studentId);
            localStorage.setItem('name', name);
            localStorage.setItem('email', userEmail);

            // Redirect to dashboard
            navigate('/dashboard');

        } catch (err) {
            // If the backend returned an error, show its message
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Login failed');
            } else {
                setError('Network error. Is the backend running?');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Student Login</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br /><br />

                <button type="submit">Login</button>
            </form>

            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;