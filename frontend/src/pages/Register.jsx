import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        rollNumber: '',
        branch: '',
        cgpa: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/students/register', {
                ...form,
                cgpa: parseFloat(form.cgpa),
            });

            setSuccess('Account created! Redirecting to login…');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            const data = err.response?.data;
            if (typeof data === 'object' && data !== null && !data.error) {
                // Validation errors: { field: "message" }
                setError(Object.values(data).join(', '));
            } else {
                setError(data?.error || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Create your account"
            subtitle="Start your placement journey with CampusConnect"
            footer={
                <>
                    Already registered? <Link to="/login">Sign in</Link>
                </>
            }
        >
            {error && <div className="error-banner">{error}</div>}
            {success && <div className="success-banner">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <Input label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="Alice Wonderland" required />
                <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" required />
                <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
                <Input label="Roll number" name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="CS2201" />
                <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} placeholder="Computer Science" />
                <Input label="CGPA" type="number" name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="8.5" required />

                <Button type="submit" loading={loading}>
                    Create account
                </Button>
            </form>
        </AuthCard>
    );
}

export default Register;