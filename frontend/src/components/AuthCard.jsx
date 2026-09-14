import React from 'react';
import './AuthCard.css';

function AuthCard({ title, subtitle, children, footer }) {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>{title}</h1>
                    {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                </div>
                <div className="auth-body">{children}</div>
                {footer && <div className="auth-footer">{footer}</div>}
            </div>
        </div>
    );
}

export default AuthCard;