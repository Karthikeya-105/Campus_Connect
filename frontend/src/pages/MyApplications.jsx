import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const STATUS_STYLES = {
    APPLIED: 'bg-slate-100 text-slate-700',
    SHORTLISTED: 'bg-blue-50 text-blue-700',
    SELECTED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-700',
};

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/me');
                setApplications(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        My Applications
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Track the status of every job you've applied to.
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-20 text-slate-500">Loading applications…</div>
                )}

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!loading && applications.length === 0 && !error && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
                        <div className="text-5xl mb-4">📄</div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            No applications yet
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Browse open jobs and start applying.
                        </p>
                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                )}

                <div className="grid gap-4">
                    {applications.map((app, i) => (
                        <div
                            key={app.id}
                            style={{ animationDelay: `${i * 50}ms` }}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md animate-[fadeInUp_300ms_ease_both]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                                        {app.jobTitle}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">{app.companyName}</p>
                                </div>
                                <span
                                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                        STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED
                                    }`}
                                >
                  {app.status}
                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500">
                  Applied on{' '}
                    {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
                                <Link
                                    to={`/jobs/${app.jobPostingId}`}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    View job →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyApplications;