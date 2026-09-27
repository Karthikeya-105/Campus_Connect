import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

function PostJob() {
    const [form, setForm] = useState({
        jobTitle: '',
        description: '',
        location: '',
        salary: '',
        requiredSkills: '',
        minCgpa: '',
        applicationDeadline: '',
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
            // Convert numeric fields — HTML inputs give us strings
            const payload = {
                ...form,
                salary: form.salary ? parseFloat(form.salary) : null,
                minCgpa: form.minCgpa ? parseFloat(form.minCgpa) : null,
            };

            await api.post('/jobs', payload);
            setSuccess('Job posted! Redirecting…');
            setTimeout(() => navigate('/company/jobs'), 1000);
        } catch (err) {
            const data = err.response?.data;
            if (typeof data === 'object' && data !== null && !data.error) {
                setError(Object.values(data).join(', '));
            } else {
                setError(data?.error || 'Failed to post job.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Post a new job"
            subtitle="Publish an opening for students to apply"
            footer={
                <>
                    <Link to="/company/jobs">← Back to my jobs</Link>
                </>
            }
        >
            {error && <div className="error-banner">{error}</div>}
            {success && <div className="success-banner">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <Input label="Job title" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Software Engineer Intern" required />
                <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore / Remote" />
                <Input label="Salary (annual CTC)" name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="800000" />
                <Input label="Required skills" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="Java, Spring Boot, MySQL" />
                <Input label="Minimum CGPA" name="minCgpa" type="number" value={form.minCgpa} onChange={handleChange} placeholder="7.5" />
                <Input label="Application deadline" name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={handleChange} required />

                <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe the role, responsibilities, and what you're looking for…"
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            fontSize: '15px',
                            fontFamily: 'inherit',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            outline: 'none',
                            resize: 'vertical',
                        }}
                    />
                </div>

                <Button type="submit" loading={loading}>Post job</Button>
            </form>
        </AuthCard>
    );
}

export default PostJob;