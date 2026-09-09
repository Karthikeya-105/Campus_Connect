import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after success
import api from '../services/api';

function Register() {
    // 1. STATE: These variables hold the form data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [branch, setBranch] = useState('');
    const [cgpa, setCgpa] = useState('');
    const [error, setError] = useState(''); // To show backend errors
    const navigate = useNavigate();

    // 2. HANDLE SUBMIT: This runs when the user clicks the button
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the browser from refreshing the page
        setError(''); // Clear old errors

        try {
            // Send POST request to your Spring Boot API
            const response = await api.post('/students/register', {
                name,
                email,
                password,
                rollNumber,
                branch,
                cgpa: parseFloat(cgpa), // Convert string to number
            });

            console.log('Registration Success:', response.data);
            // 3. REDIRECT: Send the user to the Login page
            navigate('/login');

        } catch (err) {
            // 4. ERROR HANDLING: Catch the error from your GlobalExceptionHandler
            if (err.response && err.response.data) {
                // Spring Boot sends a JSON like { "error": "Email already exists!" }
                setError(err.response.data.error || 'Registration failed');
            } else {
                setError('Network error. Is the backend running?');
            }
        }
    };

    // 5. THE UI: The actual HTML/JSX
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Student Registration</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <br /><br />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br /><br />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br /><br />
                <input type="text" placeholder="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                <br /><br />
                <input type="text" placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
                <br /><br />
                <input type="number" step="0.01" placeholder="CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
                <br /><br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;