import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminAnalytics from './AdminAnalytics';

const TABS = ['Overview', 'Students', 'Companies', 'Jobs', 'Applications', 'Analytics'];

function AdminDashboard() {
    const [tab, setTab] = useState('Overview');
    const [stats, setStats] = useState(null);
    const [placement, setPlacement] = useState(null);
    const [students, setStudents] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState({});
    const [error, setError] = useState('');

    const name = localStorage.getItem('name');

    useEffect(() => {
        const load = async () => {
            try {
                const [s, p] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/placement-stats'),
                ]);
                setStats(s.data);
                setPlacement(p.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load stats.');
            }
        };
        load();
    }, []);

    useEffect(() => {
        const loadTab = async () => {
            if (tab === 'Students' && students.length === 0) {
                setLoading((l) => ({ ...l, Students: true }));
                try {
                    const res = await api.get('/admin/students');
                    setStudents(res.data);
                } catch (err) {
                    setError(err.response?.data?.error || 'Failed to load students.');
                } finally {
                    setLoading((l) => ({ ...l, Students: false }));
                }
            }
            if (tab === 'Companies' && companies.length === 0) {
                setLoading((l) => ({ ...l, Companies: true }));
                try {
                    const res = await api.get('/admin/companies');
                    setCompanies(res.data);
                } catch (err) {
                    setError(err.response?.data?.error || 'Failed to load companies.');
                } finally {
                    setLoading((l) => ({ ...l, Companies: false }));
                }
            }
            if (tab === 'Jobs' && jobs.length === 0) {
                setLoading((l) => ({ ...l, Jobs: true }));
                try {
                    const res = await api.get('/admin/jobs');
                    setJobs(res.data);
                } catch (err) {
                    setError(err.response?.data?.error || 'Failed to load jobs.');
                } finally {
                    setLoading((l) => ({ ...l, Jobs: false }));
                }
            }
            if (tab === 'Applications' && applications.length === 0) {
                setLoading((l) => ({ ...l, Applications: true }));
                try {
                    const res = await api.get('/admin/applications');
                    setApplications(res.data);
                } catch (err) {
                    setError(err.response?.data?.error || 'Failed to load applications.');
                } finally {
                    setLoading((l) => ({ ...l, Applications: false }));
                }
            }
        };
        loadTab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const statCards = [
        { label: 'Students', value: stats?.totalStudents ?? '—', icon: '🎓', color: 'from-indigo-500 to-indigo-700' },
        { label: 'Companies', value: stats?.totalCompanies ?? '—', icon: '🏢', color: 'from-emerald-500 to-emerald-700' },
        { label: 'Jobs Posted', value: stats?.totalJobs ?? '—', icon: '💼', color: 'from-amber-500 to-amber-700' },
        { label: 'Applications', value: stats?.totalApplications ?? '—', icon: '📝', color: 'from-rose-500 to-rose-700' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        🛡️ Admin
                    </div>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        Welcome, {name || 'Placement Officer'}
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Complete visibility into the placement platform.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {statCards.map((c) => (
                        <div
                            key={c.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-lg text-white`}>
                                {c.icon}
                            </div>
                            <div className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                                {c.label}
                            </div>
                            <div className="mt-1 text-2xl font-bold text-slate-900">{c.value}</div>
                        </div>
                    ))}
                </div>

                {/* Placement stats */}
                {placement && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Placement Snapshot</h3>
                                <p className="text-sm text-slate-500">Across all applications</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500">Placement rate</div>
                                <div className="text-2xl font-bold text-indigo-600">
                                    {placement.placementRate}%
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                            <div className="rounded-lg bg-slate-50 p-3">
                                <div className="text-xs text-slate-500">Applied</div>
                                <div className="mt-1 text-lg font-semibold text-slate-900">{placement.applied}</div>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3">
                                <div className="text-xs text-blue-600">Shortlisted</div>
                                <div className="mt-1 text-lg font-semibold text-blue-700">{placement.shortlisted}</div>
                            </div>
                            <div className="rounded-lg bg-green-50 p-3">
                                <div className="text-xs text-green-600">Selected</div>
                                <div className="mt-1 text-lg font-semibold text-green-700">{placement.selected}</div>
                            </div>
                            <div className="rounded-lg bg-red-50 p-3">
                                <div className="text-xs text-red-600">Rejected</div>
                                <div className="mt-1 text-lg font-semibold text-red-700">{placement.rejected}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                tab === t
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {tab === 'Overview' && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <div className="text-4xl mb-3">📊</div>
                            <p className="text-slate-500">
                                Click a tab above to view detailed records.
                            </p>
                        </div>
                    )}

                    {tab === 'Students' && (
                        <DataTable
                            loading={loading.Students}
                            columns={['Name', 'Email', 'Roll No', 'Branch', 'CGPA']}
                            rows={students.map((s) => [s.name, s.email, s.rollNumber || '—', s.branch || '—', s.cgpa ?? '—'])}
                            empty="No students registered yet."
                        />
                    )}

                    {tab === 'Companies' && (
                        <DataTable
                            loading={loading.Companies}
                            columns={['Name', 'Email', 'Industry', 'Location', 'Contact']}
                            rows={companies.map((c) => [c.name, c.email, c.industry || '—', c.location || '—', c.contactPerson || '—'])}
                            empty="No companies registered yet."
                        />
                    )}

                    {tab === 'Jobs' && (
                        <DataTable
                            loading={loading.Jobs}
                            columns={['Title', 'Company', 'Location', 'Salary', 'Status']}
                            rows={jobs.map((j) => [
                                j.jobTitle,
                                j.company?.name || '—',
                                j.location || 'Remote',
                                j.salary ? `₹${j.salary.toLocaleString()}` : '—',
                                j.status,
                            ])}
                            empty="No jobs posted yet."
                        />
                    )}

                    {tab === 'Applications' && (
                        <DataTable
                            loading={loading.Applications}
                            columns={['Student', 'Job', 'Company', 'Status', 'Applied On']}
                            rows={applications.map((a) => [
                                a.student?.name || '—',
                                a.jobPosting?.jobTitle || '—',
                                a.jobPosting?.company?.name || '—',
                                a.status,
                                a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('en-IN') : '—',
                            ])}
                            empty="No applications yet."
                        />
                    )}

                    {tab === 'Analytics' && <AdminAnalytics />}
                </div>
            </div>
        </div>
    );
}

function DataTable({ columns, rows, loading, empty }) {
    if (loading) {
        return <div className="text-center py-12 text-slate-500">Loading…</div>;
    }
    if (rows.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                {empty}
            </div>
        );
    }
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                    {columns.map((c) => (
                        <th
                            key={c}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                            {c}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                        {r.map((cell, j) => (
                            <td key={j} className="px-4 py-3 text-slate-800">
                                {String(cell)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;