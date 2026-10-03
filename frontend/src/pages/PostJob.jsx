import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                salary: form.salary ? parseFloat(form.salary) : null,
                minCgpa: form.minCgpa ? parseFloat(form.minCgpa) : null,
            };

            await api.post('/jobs', payload);
            toast.success('Job posted successfully!');
            setTimeout(() => navigate('/company/jobs'), 800);
        } catch (err) {
            const data = err.response?.data;
            if (typeof data === 'object' && data !== null && !data.error) {
                toast.error(Object.values(data).join(', '));
            } else {
                toast.error(data?.error || 'Failed to post job.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <Link
                    to="/company/jobs"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    ← Back to my jobs
                </Link>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Post a new job
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Publish an opening for students to apply.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                        <Input label="Job title" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Software Engineer Intern" required />
                        <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore / Remote" />
                        <Input label="Salary (annual CTC)" name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="800000" />
                        <Input label="Required skills" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="Java, Spring Boot, MySQL" />
                        <Input label="Minimum CGPA" name="minCgpa" type="number" value={form.minCgpa} onChange={handleChange} placeholder="7.5" />
                        <Input label="Application deadline" name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={handleChange} required />

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="description" className="text-sm font-medium text-slate-800">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Describe the role, responsibilities, and what you're looking for…"
                                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting…' : 'Post job'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Inline Input component (already in your project, keeping it simple here)
function Input({ label, type = 'text', name, value, onChange, placeholder, required = false }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-slate-800">
                    {label}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
            />
        </div>
    );
}

export default PostJob;