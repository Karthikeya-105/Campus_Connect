import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SkeletonJobCard } from '../components/Skeleton';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs/active');
                setJobs(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load jobs.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApplyClick = (jobId) => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (role !== 'STUDENT') return;
        navigate(`/jobs/${jobId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                        Open <span className="text-indigo-600">Opportunities</span>
                    </h1>
                    <p className="mt-3 text-slate-500 max-w-2xl">
                        Discover jobs from top companies hiring from your campus. Apply in seconds.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                {loading && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <SkeletonJobCard />
                        <SkeletonJobCard />
                        <SkeletonJobCard />
                        <SkeletonJobCard />
                    </div>
                )}

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!loading && jobs.length === 0 && !error && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
                        <div className="text-5xl mb-4">📭</div>
                        <h3 className="text-lg font-semibold text-slate-900">No jobs posted yet</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Check back soon — companies will start posting openings.
                        </p>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {jobs.map((job, i) => (
                        <div
                            key={job.id}
                            style={{ animationDelay: `${i * 60}ms` }}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 hover:border-indigo-200 animate-[fadeInUp_400ms_ease_both]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-lg font-bold text-white">
                                        {job.companyName?.charAt(0) || '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="block text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate"
                                        >
                                            {job.jobTitle}
                                        </Link>
                                        <p className="mt-0.5 text-sm text-slate-500 truncate">
                                            {job.companyName}
                                        </p>
                                    </div>
                                </div>
                                <span className="flex-shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {job.status}
                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  📍 {job.location || 'Remote'}
                </span>
                                {job.salary && (
                                    <span className="inline-flex items-center gap-1.5">
                    💰 ₹{job.salary.toLocaleString()}
                  </span>
                                )}
                                {job.minCgpa != null && (
                                    <span className="inline-flex items-center gap-1.5">
                    🎓 {job.minCgpa}+ CGPA
                  </span>
                                )}
                            </div>

                            {job.requiredSkills && (
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {job.requiredSkills.split(',').slice(0, 4).map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                                        >
                      {skill.trim()}
                    </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500">
                  Apply by {job.applicationDeadline}
                </span>
                                {role === 'STUDENT' ? (
                                    <button
                                        onClick={() => handleApplyClick(job.id)}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
                                    >
                                        Apply →
                                    </button>
                                ) : (
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        View details →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Jobs;