import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Apply-related state
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [applySuccess, setApplySuccess] = useState('');

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load job.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!token) return navigate('/login');
        if (role !== 'STUDENT') return;

        setApplyError('');
        setApplySuccess('');
        setApplying(true);

        try {
            await api.post('/applications', { jobPostingId: Number(id) });
            setApplied(true);
            setApplySuccess('Application submitted successfully!');
        } catch (err) {
            const data = err.response?.data;
            setApplyError(data?.error || 'Failed to submit application.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500">Loading…</div>;
    if (error)
        return (
            <div className="max-w-3xl mx-auto mt-10 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
            </div>
        );
    if (!job) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-10">
                <Link to="/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    ← Back to all jobs
                </Link>

                {/* Header card */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-start gap-5">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-2xl font-bold text-white">
                            {job.companyName?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{job.jobTitle}</h1>
                            <p className="mt-1 text-slate-500">{job.companyName}</p>
                        </div>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              {job.status}
            </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div className="rounded-lg bg-slate-50 p-3">
                            <div className="text-xs text-slate-500">Location</div>
                            <div className="mt-1 font-semibold text-slate-900">{job.location || 'Remote'}</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                            <div className="text-xs text-slate-500">Salary</div>
                            <div className="mt-1 font-semibold text-slate-900">
                                {job.salary ? `₹${job.salary.toLocaleString()}` : '—'}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                            <div className="text-xs text-slate-500">Min CGPA</div>
                            <div className="mt-1 font-semibold text-slate-900">{job.minCgpa ?? '—'}</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                            <div className="text-xs text-slate-500">Deadline</div>
                            <div className="mt-1 font-semibold text-slate-900">{job.applicationDeadline}</div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Job Description</h2>
                    <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
                        {job.description || 'No description provided.'}
                    </p>

                    {job.requiredSkills && (
                        <>
                            <h3 className="mt-8 text-lg font-semibold text-slate-900">Required Skills</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {job.requiredSkills.split(',').map((s, i) => (
                                    <span
                                        key={i}
                                        className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                                    >
                    {s.trim()}
                  </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Apply action */}
                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Interested in this role?</p>
                        <p className="font-semibold text-slate-900">
                            {token ? 'Submit your application now.' : 'Log in as a student to apply.'}
                        </p>
                    </div>

                    {token ? (
                        role === 'STUDENT' ? (
                            applied ? (
                                <span className="rounded-lg bg-green-50 px-6 py-3 font-semibold text-green-700">
                  ✓ Applied
                </span>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:transform-none"
                                >
                                    {applying ? 'Submitting…' : 'Apply for this job'}
                                </button>
                            )
                        ) : (
                            <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">
                Only students can apply
              </span>
                        )
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-center font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
                        >
                            Login to apply
                        </Link>
                    )}
                </div>

                {/* Feedback banners */}
                {applySuccess && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {applySuccess}
                    </div>
                )}
                {applyError && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {applyError}
                    </div>
                )}
            </div>
        </div>
    );
}

export default JobDetails;