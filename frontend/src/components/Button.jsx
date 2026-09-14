import React from 'react';
import './Button.css';

function Button({ children, type = 'button', loading = false, disabled = false, onClick, variant = 'primary' }) {
    return (
        <button
            type={type}
            className={`btn btn-${variant}`}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading ? <span className="btn-spinner" /> : children}
        </button>
    );
}

export default Button;