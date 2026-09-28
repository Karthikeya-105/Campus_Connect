import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function CompanyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const companyId = localStorage.getItem('companyId');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get(`/jobs/company/${companyId}`);
                setJobs(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load jobs.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [companyId]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            My Job Postings
                        </h1>
                        <p className="mt-2 text-slate-500">
                            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted
                        </p>
                    </div>

                    <Link
                        to="/company/jobs/new"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
                    >
                        <span className="text-lg leading-none">+</span>
                        Post a New Job
                    </Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20 text-slate-500">Loading jobs…</div>
                )}

                {/* Error */}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!loading && jobs.length === 0 && !error && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
                        <div className="text-5xl mb-4">📭</div>
                        <h3 className="text-lg font-semibold text-slate-900">No jobs posted yet</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Start by posting your first job opening.
                        </p>
                        <Link
                            to="/company/jobs/new"
                            className="mt-6 inline-flex rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
                        >
                            + Post your first job
                        </Link>
                    </div>
                )}

                {/* Job cards */}
                <div className="grid gap-4">
                    {jobs.map((job, i) => (
                        <div
                            key={job.id}
                            style={{ animationDelay: `${i * 50}ms` }}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md animate-[fadeInUp_300ms_ease_both]"
                        >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                                        {job.jobTitle}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        📍 {job.location || 'Remote'}
                                        {job.salary != null && ` · 💰 ₹${job.salary.toLocaleString()}`}
                                    </p>
                                </div>

                                <span
                                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                        job.status === 'OPEN'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                  {job.status}
                </span>
                            </div>

                            {job.requiredSkills && (
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {job.requiredSkills
                                        .split(',')
                                        .slice(0, 5)
                                        .map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                                            >
                        {skill.trim()}
                      </span>
                                        ))}
                                </div>
                            )}

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 flex-wrap gap-3">
                <span className="text-xs text-slate-500">
                  Deadline: {job.applicationDeadline}
                    {job.minCgpa != null && ` · Min CGPA: ${job.minCgpa}`}
                </span>

                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        to={`/company/jobs/${job.id}/applicants`}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        View Applicants →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CompanyJobs;