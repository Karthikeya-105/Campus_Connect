import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { SkeletonCard } from '../components/Skeleton';

function Notifications() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/notifications');
                setItems(res.data);
            } catch (err) {
                toast.error('Failed to load notifications');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const openNotification = async (n) => {
        try {
            if (!n.read) {
                await api.patch(`/notifications/${n.id}/read`);
                setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
            }
        } catch (err) {}
        if (n.linkUrl) navigate(n.linkUrl);
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setItems((list) => list.map((x) => ({ ...x, read: true })));
            toast.success('All marked read');
        } catch (err) {
            toast.error('Failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Notifications
                    </h1>
                    {items.some((x) => !x.read) && (
                        <button
                            onClick={markAllRead}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="grid gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}

                {!loading && items.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
                        <div className="text-5xl mb-4">🔔</div>
                        <h3 className="text-lg font-semibold text-slate-900">No notifications yet</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Updates on your applications will show up here.
                        </p>
                    </div>
                )}

                <div className="grid gap-3">
                    {items.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => openNotification(n)}
                            className={`w-full rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                !n.read ? 'border-indigo-200 bg-indigo-50/40' : 'border-slate-200'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {n.type === 'INTERVIEW' ? '📅' : n.type === 'STATUS_CHANGE' ? '📢' : '📬'}
                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-slate-900">{n.title}</h3>
                                        {!n.read && (
                                            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                                    <div className="mt-2 text-xs text-slate-400">
                                        {new Date(n.createdAt).toLocaleString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notifications;