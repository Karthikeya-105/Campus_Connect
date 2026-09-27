import React from 'react';

const VARIANTS = {
    primary:
        'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30',
    secondary:
        'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25',
    ghost:
        'bg-transparent text-slate-700 border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50',
    danger:
        'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30',
};

function Button({
                    children,
                    type = 'button',
                    loading = false,
                    disabled = false,
                    onClick,
                    variant = 'primary',
                    fullWidth = true,
                    className = '',
                }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm
        ${fullWidth ? 'w-full' : ''}
        ${VARIANTS[variant]}
        ${className}`}
        >
            {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
                children
            )}
        </button>
    );
}

export default Button;