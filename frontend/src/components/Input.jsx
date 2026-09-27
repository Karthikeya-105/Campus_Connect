import React from 'react';

function Input({
                   label,
                   type = 'text',
                   name,
                   value,
                   onChange,
                   placeholder,
                   error,
                   required = false,
                   autoComplete,
               }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-slate-800">
                    {label}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all
          ${
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
                }`}
            />
            {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
    );
}

export default Input;