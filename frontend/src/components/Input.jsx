import React from 'react';
import './Input.css';

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
        <div className={`input-group ${error ? 'has-error' : ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
            />
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
}

export default Input;