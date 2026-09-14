import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, studentId, name, email: userEmail } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('studentId', studentId);
            localStorage.setItem('name', name);
            localStorage.setItem('email', userEmail);
            localStorage.setItem('role', 'STUDENT');

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Welcome back"
            subtitle="Sign in to your CampusConnect account"
            footer={
                <>
                    Don't have an account? <Link to="/register">Create one</Link>
                </>
            }
        >
            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    autoComplete="email"
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                />

                <Button type="submit" loading={loading}>
                    Sign in
                </Button>
            </form>
        </AuthCard>
    );
}

export default Login;