import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import CompanyRegister from './pages/CompanyRegister';
import CompanyLogin from './pages/CompanyLogin';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyJobs from './pages/CompanyJobs';
import PostJob from './pages/PostJob';
import JobApplicants from './pages/JobApplicants';

import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/company/register" element={<CompanyRegister />} />
                <Route path="/company/login" element={<CompanyLogin />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />

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
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;