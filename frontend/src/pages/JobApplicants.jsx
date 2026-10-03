import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { SkeletonCard } from '../components/Skeleton';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
    const [atsScores, setAtsScores] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [interviewForm, setInterviewForm] = useState({
        interviewDate: '',
        interviewTime: '',
        interviewMode: 'ONLINE',
        interviewLink: '',
        interviewNotes: '',
    });
    const [scheduling, setScheduling] = useState(false);

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
            setApplications((prev) =>
                prev.map((a) => (a.id === applicationId ? { ...a, status: res.data.status } : a))
            );
            toast.success(`Application ${newStatus.toLowerCase()}`);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const fetchAts = async (applicationId) => {
        try {
            const res = await api.post(`/resume/ats-score-company/${applicationId}`);
            setAtsScores((prev) => ({ ...prev, [applicationId]: res.data }));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to calculate ATS score.');
        }
    };

    const openInterviewModal = (app) => {
        const existing = app.interviewDate
            ? {
                interviewDate: app.interviewDate.split('T')[0],
                interviewTime: app.interviewDate.split('T')[1]?.substring(0, 5) || '',
                interviewMode: app.interviewMode || 'ONLINE',
                interviewLink: app.interviewLink || '',
                interviewNotes: app.interviewNotes || '',
            }
            : {
                interviewDate: '',
                interviewTime: '',
                interviewMode: 'ONLINE',
                interviewLink: '',
                interviewNotes: '',
            };

        setSelectedApp(app);
        setInterviewForm(existing);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedApp(null);
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        if (!selectedApp) return;

        if (!interviewForm.interviewDate || !interviewForm.interviewTime) {
            toast.error('Please select both date and time.');
            return;
        }

        const isoDateTime = `${interviewForm.interviewDate}T${interviewForm.interviewTime}:00`;

        setScheduling(true);
        try {
            const res = await api.patch(`/applications/${selectedApp.id}/interview`, {
                interviewDate: isoDateTime,
                interviewMode: interviewForm.interviewMode,
                interviewLink: interviewForm.interviewLink,
                interviewNotes: interviewForm.interviewNotes,
            });
            setApplications((prev) =>
                prev.map((a) => (a.id === selectedApp.id ? { ...a, ...res.data } : a))
            );
            toast.success('Interview scheduled');
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to schedule interview.');
        } finally {
            setScheduling(false);
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
                    <div className="grid gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
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
                    {applications.map((app, i) => {
                        const ats = atsScores[app.id];
                        const canSchedule = ['SHORTLISTED', 'SELECTED'].includes(app.status);
                        return (
                            <div
                                key={app.id}
                                style={{ animationDelay: `${i * 50}ms` }}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-[fadeInUp_300ms_ease_both]"
                            >
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

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    {app.studentResumeUrl ? (
                                        <a
                                            href={`${API_BASE}/resume/view/${app.studentResumeUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                                        >
                                            📄 View Resume
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-500">No resume uploaded</span>
                                    )}

                                    {app.studentResumeUrl && (
                                        <button
                                            onClick={() => fetchAts(app.id)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                        >
                                            ⚡ Check ATS Score
                                        </button>
                                    )}

                                    {ats && (
                                        <span
                                            className="rounded-full px-3 py-1 text-xs font-bold"
                                            style={{
                                                background:
                                                    ats.score >= 70 ? '#d1fae5' : ats.score >= 40 ? '#fef3c7' : '#fee2e2',
                                                color:
                                                    ats.score >= 70 ? '#065f46' : ats.score >= 40 ? '#92400e' : '#991b1b',
                                            }}
                                        >
                      ATS: {Math.round(ats.score)}%
                    </span>
                                    )}
                                </div>

                                {app.interviewDate && (
                                    <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800">
                                            📅 Interview Scheduled
                                        </div>
                                        <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-indigo-700 md:grid-cols-3">
                                            <div>
                                                <span className="text-indigo-500">When: </span>
                                                {new Date(app.interviewDate).toLocaleString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                            <div>
                                                <span className="text-indigo-500">Mode: </span>
                                                {app.interviewMode}
                                            </div>
                                            {app.interviewLink && (
                                                <div className="truncate">
                                                    <span className="text-indigo-500">Link: </span>
                                                    <a
                                                        href={app.interviewLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline"
                                                    >
                                                        {app.interviewLink}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        {app.interviewNotes && (
                                            <p className="mt-2 text-sm italic text-indigo-700">
                                                "{app.interviewNotes}"
                                            </p>
                                        )}
                                    </div>
                                )}

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

                                    {canSchedule && (
                                        <button
                                            onClick={() => openInterviewModal(app)}
                                            className="rounded-lg border-2 border-indigo-500 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-500 hover:text-white"
                                        >
                                            {app.interviewDate ? 'Reschedule Interview' : 'Schedule Interview'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showModal && selectedApp && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-[fadeInUp_300ms_ease_both]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Schedule Interview
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    with <strong>{selectedApp.studentName}</strong>
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleScheduleInterview} className="mt-5 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-800">Date</label>
                                    <input
                                        type="date"
                                        value={interviewForm.interviewDate}
                                        onChange={(e) =>
                                            setInterviewForm({ ...interviewForm, interviewDate: e.target.value })
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-800">Time</label>
                                    <input
                                        type="time"
                                        value={interviewForm.interviewTime}
                                        onChange={(e) =>
                                            setInterviewForm({ ...interviewForm, interviewTime: e.target.value })
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-800">Mode</label>
                                <div className="flex gap-2">
                                    {['ONLINE', 'IN_PERSON'].map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() =>
                                                setInterviewForm({ ...interviewForm, interviewMode: m })
                                            }
                                            className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                                                interviewForm.interviewMode === m
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            {m === 'ONLINE' ? '🌐 Online' : '🏢 In Person'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-800">
                                    {interviewForm.interviewMode === 'ONLINE' ? 'Meeting Link' : 'Venue Address'}
                                </label>
                                <input
                                    type="text"
                                    value={interviewForm.interviewLink}
                                    onChange={(e) =>
                                        setInterviewForm({ ...interviewForm, interviewLink: e.target.value })
                                    }
                                    placeholder={
                                        interviewForm.interviewMode === 'ONLINE'
                                            ? 'https://meet.google.com/abc-defg-hij'
                                            : 'TechNova Pvt Ltd, 3rd Floor, MG Road, Bangalore'
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-800">
                                    Notes for the candidate
                                </label>
                                <textarea
                                    rows={3}
                                    value={interviewForm.interviewNotes}
                                    onChange={(e) =>
                                        setInterviewForm({ ...interviewForm, interviewNotes: e.target.value })
                                    }
                                    placeholder="Please join 5 minutes early. Bring your resume and a valid ID."
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                                />
                            </div>

                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={scheduling}
                                    className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60"
                                >
                                    {scheduling ? 'Scheduling…' : 'Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobApplicants;