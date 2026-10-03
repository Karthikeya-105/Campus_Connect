import React from 'react';

function LoadingScreen({ message = 'Waking up the server...' }) {
    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">Just a moment…</h2>
                <p className="mt-2 text-sm text-slate-500">{message}</p>
                <p className="mt-4 text-xs text-slate-400">
                    First visit may take 30–60 seconds on free tier.
                </p>
            </div>
        </div>
    );
}

export default LoadingScreen;