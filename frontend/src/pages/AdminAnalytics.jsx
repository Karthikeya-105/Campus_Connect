import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { SkeletonCard } from '../components/Skeleton';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const STATUS_COLORS = {
    APPLIED: '#64748b',
    SHORTLISTED: '#3b82f6',
    SELECTED: '#10b981',
    REJECTED: '#ef4444',
};

const PIE_FALLBACK = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function AdminAnalytics() {
    const [jobsPerMonth, setJobsPerMonth] = useState([]);
    const [appsByStatus, setAppsByStatus] = useState([]);
    const [topCompanies, setTopCompanies] = useState([]);
    const [branchPlacement, setBranchPlacement] = useState([]);
    const [appsOverTime, setAppsOverTime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [a, b, c, d, e] = await Promise.all([
                    api.get('/admin/analytics/jobs-per-month'),
                    api.get('/admin/analytics/applications-by-status'),
                    api.get('/admin/analytics/top-companies'),
                    api.get('/admin/analytics/branch-placement'),
                    api.get('/admin/analytics/applications-over-time'),
                ]);
                setJobsPerMonth(a.data);
                setAppsByStatus(b.data);
                setTopCompanies(c.data);
                setBranchPlacement(d.data);
                setAppsOverTime(e.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load analytics.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="Jobs Posted per Month" subtitle="Last 6 months">
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={jobsPerMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                            <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Applications by Status" subtitle="Across all jobs">
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={appsByStatus}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={95}
                                innerRadius={50}
                                paddingAngle={3}
                                label={(entry) => `${entry.status} (${entry.count})`}
                            >
                                {appsByStatus.map((entry, i) => (
                                    <Cell key={i} fill={STATUS_COLORS[entry.status] || PIE_FALLBACK[i % PIE_FALLBACK.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="Top Hiring Companies" subtitle="By number of applications">
                    {topCompanies.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={topCompanies} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                                <YAxis type="category" dataKey="company" tick={{ fontSize: 12, fill: '#64748b' }} width={140} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                                <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard title="Branch-wise Placement" subtitle="Total vs Selected">
                    {branchPlacement.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={branchPlacement}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="branch" tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="total" fill="#818cf8" radius={[6, 6, 0, 0]} name="Total" />
                                <Bar dataKey="selected" fill="#10b981" radius={[6, 6, 0, 0]} name="Selected" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>

            <ChartCard title="Application Activity" subtitle="Last 14 days">
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={appsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => v.slice(5)} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                        <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}

function ChartCard({ title, subtitle, children }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

function EmptyChart() {
    return (
        <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">
            Not enough data yet.
        </div>
    );
}

export default AdminAnalytics;