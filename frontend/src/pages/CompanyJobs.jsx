import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function CompanyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const companyId = localStorage.getItem('companyId');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get(`/jobs/company/${companyId}`);
                setJobs(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load jobs.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [companyId]);

    return (
        <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 24px' }}>
            {/* Page header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '28px',
                    animation: 'fadeInUp 300ms ease both',
                }}
            >
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', letterSpacing: '-0.02em' }}>
                        My Job Postings
                    </h1>
                    <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '14px' }}>
                        {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted
                    </p>
                </div>

                <Link to="/company/jobs/new" className="link-btn">
                    <span style={{ fontSize: '18px', marginRight: '4px' }}>+</span>
                    Post a New Job
                </Link>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                    Loading jobs…
                </div>
            )}

            {error && <div className="error-banner">{error}</div>}

            {!loading && jobs.length === 0 && !error && (
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: '16px',
                        padding: '60px 24px',
                        textAlign: 'center',
                        border: '1px dashed var(--border)',
                    }}
                >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                    <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>No jobs posted yet</h3>
                    <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
                        Start by posting your first job opening.
                    </p>
                    <Link to="/company/jobs/new" className="link-btn" style={{ display: 'inline-flex' }}>
                        + Post your first job
                    </Link>
                </div>
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
                {jobs.map((job, i) => (
                    <div
                        key={job.id}
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '14px',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform var(--transition), box-shadow var(--transition)',
                            animation: `fadeInUp 300ms ease both`,
                            animationDelay: `${i * 60}ms`,
                            cursor: 'default',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                gap: '16px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <h3 style={{ margin: 0, fontSize: '19px', letterSpacing: '-0.01em' }}>
                                    {job.jobTitle}
                                </h3>
                                <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '14px' }}>
                                    📍 {job.location || 'Remote'}
                                    {job.salary && ` · 💰 ₹${job.salary.toLocaleString()}`}
                                </p>
                            </div>

                            <span
                                style={{
                                    padding: '5px 12px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    letterSpacing: '0.03em',
                                    borderRadius: '999px',
                                    background: job.status === 'OPEN' ? 'var(--success-bg)' : '#f1f5f9',
                                    color: job.status === 'OPEN' ? 'var(--success)' : 'var(--muted)',
                                }}
                            >
                {job.status}
              </span>
                        </div>

                        {job.requiredSkills && (
                            <p style={{ margin: '16px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                                <strong style={{ color: 'var(--text)' }}>Skills:</strong> {job.requiredSkills}
                            </p>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                gap: '20px',
                                marginTop: '12px',
                                fontSize: '13px',
                                color: 'var(--muted)',
                                flexWrap: 'wrap',
                            }}
                        >
              <span>
                <strong style={{ color: 'var(--text)' }}>Deadline:</strong>{' '}
                  {job.applicationDeadline}
              </span>
                            {job.minCgpa != null && (
                                <span>
                  <strong style={{ color: 'var(--text)' }}>Min CGPA:</strong> {job.minCgpa}
                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompanyJobs;