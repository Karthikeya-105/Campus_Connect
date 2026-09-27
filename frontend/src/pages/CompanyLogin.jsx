import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

function CompanyLogin() {
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
            const response = await api.post('/auth/company/login', { email, password });
            const { token, companyId, name, email: companyEmail } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('companyId', companyId);
            localStorage.setItem('name', name);
            localStorage.setItem('email', companyEmail);
            localStorage.setItem('role', 'COMPANY');

            navigate('/company/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Company login"
            subtitle="Sign in to post jobs and review applicants"
            footer={
                <>
                    New here? <Link to="/company/register">Register your company</Link>
                </>
            }
        >
            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <Input label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" loading={loading}>Sign in</Button>
            </form>
        </AuthCard>
    );
}

export default CompanyLogin;