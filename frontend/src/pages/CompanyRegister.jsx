import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

function CompanyRegister() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        description: '',
        website: '',
        industry: '',
        contactPerson: '',
        contactPhone: '',
        location: '',
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
            await api.post('/companies/register', form);
            setSuccess('Company registered! Redirecting to login…');
            setTimeout(() => navigate('/company/login'), 1200);
        } catch (err) {
            const data = err.response?.data;
            if (typeof data === 'object' && data !== null && !data.error) {
                setError(Object.values(data).join(', '));
            } else {
                setError(data?.error || 'Registration failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Register your company"
            subtitle="Post jobs and hire from campus"
            footer={
                <>
                    Already registered? <Link to="/company/login">Company login</Link>
                </>
            }
        >
            {error && <div className="error-banner">{error}</div>}
            {success && <div className="success-banner">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <Input label="Company name" name="name" value={form.name} onChange={handleChange} required />
                <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
                <Input label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" />
                <Input label="Industry" name="industry" value={form.industry} onChange={handleChange} placeholder="Fintech" />
                <Input label="Contact person" name="contactPerson" value={form.contactPerson} onChange={handleChange} />
                <Input label="Contact phone" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
                <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore" />

                <Button type="submit" loading={loading}>
                    Register company
                </Button>
            </form>
        </AuthCard>
    );
}

export default CompanyRegister;