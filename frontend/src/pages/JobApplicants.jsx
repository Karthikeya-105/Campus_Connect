import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const STATUS_STYLES = {
    APPLIED: 'bg-slate-100 text-slate-700',
    SHORTLISTED: 'bg-blue-50 text-blue-700',
    SELECTED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-700',
};

function JobApplicants() {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchApplicants = async () => {
        try {
            const res = await api.get(`/applications/job/${id}`);
            setApplications(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load applicants.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const updateStatus = async (applicationId, newStatus) => {
        setUpdatingId(applicationId);
        try {
            const res = await api.patch(`/applications/${applicationId}/status`, {
                status: newStatus,
            });
            // Update the single application in local state — no full refresh
            setApplications((prev) =>
                prev.map((a) => (a.id === applicationId ? { ...a, status: res.data.status } : a))
            );
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update status.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <Link
                    to="/company/jobs"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    ← Back to my jobs
                </Link>

                <div className="mt-6 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Applicants</h1>
                    <p className="mt-2 text-slate-500">
                        {applications.length}{' '}
                        {applications.length === 1 ? 'student has' : 'students have'} applied.
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-20 text-slate-500">Loading applicants…</div>
                )}

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!loading && applications.length === 0 && !error && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
                        <div className="text-5xl mb-4">👥</div>
                        <h3 className="text-lg font-semibold text-slate-900">No applicants yet</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Share your job posting with students — applications will show up here.
                        </p>
                    </div>
                )}

                <div className="grid gap-4">
                    {applications.map((app, i) => (
                        <div
                            key={app.id}
                            style={{ animationDelay: `${i * 50}ms` }}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-[fadeInUp_300ms_ease_both]"
                        >
                            {/* Applicant header */}
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-lg font-bold text-white">
                                        {app.studentName?.charAt(0) || '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                                            {app.studentName}
                                        </h3>
                                        <p className="text-sm text-slate-500 truncate">{app.studentEmail}</p>
                                    </div>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED
                                    }`}
                                >
                  {app.status}
                </span>
                            </div>

                            {/* Applicant details */}
                            <div className="mt-5 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <div className="text-xs text-slate-500">Roll No</div>
                                    <div className="mt-1 font-semibold text-slate-900 truncate">
                                        {app.studentRollNumber || '—'}
                                    </div>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <div className="text-xs text-slate-500">Branch</div>
                                    <div className="mt-1 font-semibold text-slate-900 truncate">
                                        {app.studentBranch || '—'}
                                    </div>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <div className="text-xs text-slate-500">CGPA</div>
                                    <div className="mt-1 font-semibold text-slate-900">
                                        {app.studentCgpa ?? '—'}
                                    </div>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <div className="text-xs text-slate-500">Applied On</div>
                                    <div className="mt-1 font-semibold text-slate-900">
                                        {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Resume link */}
                            {app.studentResumeUrl && (
                                <div className="mt-4">
                                    <a
                                        href={app.studentResumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        📄 View Resume
                                    </a>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                                <button
                                    onClick={() => updateStatus(app.id, 'SHORTLISTED')}
                                    disabled={updatingId === app.id || app.status === 'SHORTLISTED'}
                                    className="rounded-lg border-2 border-blue-500 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Shortlist
                                </button>
                                <button
                                    onClick={() => updateStatus(app.id, 'SELECTED')}
                                    disabled={updatingId === app.id || app.status === 'SELECTED'}
                                    className="rounded-lg border-2 border-green-500 bg-white px-4 py-2 text-sm font-semibold text-green-600 transition-all hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Select
                                </button>
                                <button
                                    onClick={() => updateStatus(app.id, 'REJECTED')}
                                    disabled={updatingId === app.id || app.status === 'REJECTED'}
                                    className="rounded-lg border-2 border-red-500 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default JobApplicants;