import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const [list, count] = await Promise.all([
                api.get('/notifications/recent'),
                api.get('/notifications/unread-count'),
            ]);
            setNotifications(list.data);
            setUnread(count.data.count);
        } catch (err) {}
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        setOpen((o) => !o);
        if (!open) fetchNotifications();
    };

    const handleClick = async (n) => {
        try {
            await api.patch(`/notifications/${n.id}/read`);
            setUnread((u) => Math.max(0, u - 1));
            setNotifications((list) =>
                list.map((x) => (x.id === n.id ? { ...x, read: true } : x))
            );
        } catch (err) {}
        setOpen(false);
        if (n.linkUrl) navigate(n.linkUrl);
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setUnread(0);
            setNotifications((list) => list.map((n) => ({ ...n, read: true })));
        } catch (err) {}
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Notifications"
            >
                <span className="text-lg">🔔</span>
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-slate-200 bg-white shadow-lg animate-[fadeInUp_200ms_ease_both]">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <span className="text-sm font-semibold text-slate-900">Notifications</span>
                        {unread > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 && (
                            <div className="p-6 text-center text-sm text-slate-400">
                                No notifications yet
                            </div>
                        )}
                        {notifications.map((n) => (
                            <button
                                key={n.id}
                                onClick={() => handleClick(n)}
                                className={`w-full border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                                    !n.read ? 'bg-indigo-50/40' : ''
                                }`}
                            >
                                <div className="flex items-start gap-2">
                                    {!n.read && (
                                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                                    )}
                                    <div className={`min-w-0 flex-1 ${n.read ? 'pl-4' : ''}`}>
                                        <div className="text-sm font-medium text-slate-900 truncate">
                                            {n.title}
                                        </div>
                                        <div className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                                            {n.message}
                                        </div>
                                        <div className="mt-1 text-[10px] text-slate-400">
                                            {new Date(n.createdAt).toLocaleString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <Link
                        to="/notifications"
                        onClick={() => setOpen(false)}
                        className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-medium text-indigo-600 hover:bg-slate-50"
                    >
                        View all
                    </Link>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;