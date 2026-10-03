import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function Profile() {
    const [resumeUrl, setResumeUrl] = useState(localStorage.getItem('resumeUrl') || '');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    const handleFileChange = (selected) => {
        if (!selected) return;
        if (selected.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }
        if (selected.size > 5 * 1024 * 1024) {
            toast.error('File too large. Max 5 MB.');
            return;
        }
        setFile(selected);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return;
        }
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResumeUrl(res.data.resumeUrl);
            localStorage.setItem('resumeUrl', res.data.resumeUrl);
            toast.success('Resume uploaded successfully!');
            setFile(null);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
                <p className="mt-2 text-slate-500">Manage your details and resume.</p>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-slate-50 p-4">
                            <div className="text-xs text-slate-500">Name</div>
                            <div className="mt-1 font-semibold text-slate-900">{name || '—'}</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-4">
                            <div className="text-xs text-slate-500">Email</div>
                            <div className="mt-1 font-semibold text-slate-900">{email || '—'}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Resume</h2>
                    <p className="mt-1 text-sm text-slate-500">PDF only, max 5 MB.</p>

                    {resumeUrl && (
                        <div className="mt-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📄</span>
                                <div>
                                    <div className="font-semibold text-green-800">Resume uploaded</div>
                                    <div className="text-xs text-green-700">
                                        Companies will see this when you apply.
                                    </div>
                                </div>
                            </div>
                            <a
                                href={`${API_BASE}/resume/view/${resumeUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-100"
                            >
                                View
                            </a>
                        </div>
                    )}

                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            handleFileChange(e.dataTransfer.files[0]);
                        }}
                        className={`mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                            dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50'
                        }`}
                    >
                        <input
                            type="file"
                            id="resume-input"
                            accept=".pdf,application/pdf"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                            className="hidden"
                        />
                        <label
                            htmlFor="resume-input"
                            className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            {file ? `Selected: ${file.name}` : 'Click to select a PDF, or drag it here'}
                        </label>
                        {file && (
                            <p className="mt-2 text-xs text-slate-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading…' : resumeUrl ? 'Replace Resume' : 'Upload Resume'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;