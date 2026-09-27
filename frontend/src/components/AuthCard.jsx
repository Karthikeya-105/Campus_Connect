import React from 'react';

function AuthCard({ title, subtitle, children, footer }) {
    return (
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 animate-[fadeInUp_400ms_ease_both]">
                <div className="text-center mb-7">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                    {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
                </div>

                <div className="flex flex-col gap-4">{children}</div>

                {footer && (
                    <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
                )}
            </div>
        </div>
    );
}

export default AuthCard;