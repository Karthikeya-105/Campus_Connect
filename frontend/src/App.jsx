import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

import CompanyRegister from './pages/CompanyRegister';
import CompanyLogin from './pages/CompanyLogin';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyJobs from './pages/CompanyJobs';
import PostJob from './pages/PostJob';
import JobApplicants from './pages/JobApplicants';

import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: '10px',
                        background: '#1e293b',
                        color: '#fff',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#fff' },
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#fff' },
                    },
                }}
            />
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/company/register" element={<CompanyRegister />} />
                <Route path="/company/login" element={<CompanyLogin />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Student */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requiredRole="STUDENT">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute requiredRole="STUDENT">
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute requiredRole="STUDENT">
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Company */}
                <Route
                    path="/company/dashboard"
                    element={
                        <ProtectedRoute requiredRole="COMPANY">
                            <CompanyDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/company/jobs"
                    element={
                        <ProtectedRoute requiredRole="COMPANY">
                            <CompanyJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/company/jobs/new"
                    element={
                        <ProtectedRoute requiredRole="COMPANY">
                            <PostJob />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/company/jobs/:id/applicants"
                    element={
                        <ProtectedRoute requiredRole="COMPANY">
                            <JobApplicants />
                        </ProtectedRoute>
                    }
                />

                {/* Admin */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;