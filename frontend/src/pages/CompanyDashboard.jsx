import React from 'react';
import { Link } from 'react-router-dom';

function CompanyDashboard() {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    return (
        <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 24px' }}>
            <div
                style={{
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    padding: '40px 32px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border)',
                    animation: 'fadeInUp 400ms ease both',
                }}
            >
                <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
                    Welcome, {name} 🏢
                </h1>
                <p style={{ color: 'var(--muted)' }}>
                    You're logged in as <strong>{email}</strong>
                </p>

                <div
                    style={{
                        height: '1px',
                        background: 'var(--border)',
                        margin: '32px 0',
                    }}
                />

                <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Quick Actions
                </h3>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '16px',
                    }}
                >
                    <Link to="/company/jobs/new" className="link-btn" style={{ padding: '20px' }}>
                        <span style={{ fontSize: '20px', marginRight: '4px' }}>+</span>
                        Post a New Job
                    </Link>

                    <Link
                        to="/company/jobs"
                        className="link-btn secondary"
                        style={{ padding: '20px' }}
                    >
                        📋 View My Jobs
                    </Link>
                </div>

                <div
                    style={{
                        marginTop: '40px',
                        padding: '20px',
                        background: 'var(--bg-from)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: 'var(--muted)',
                    }}
                >
                    <strong style={{ color: 'var(--text)' }}>Tip:</strong> Post a job and
                    it will be visible to students browsing jobs.
                </div>
            </div>
        </div>
    );
}

export default CompanyDashboard;