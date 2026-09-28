import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobApplicants from './pages/JobApplicants';

import CompanyRegister from './pages/CompanyRegister';
import CompanyLogin from './pages/CompanyLogin';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyJobs from './pages/CompanyJobs';
import PostJob from './pages/PostJob';

import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/company/register" element={<CompanyRegister />} />
                <Route path="/company/login" element={<CompanyLogin />} />

                {/* Public job browsing */}
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />

                {/* Student protected routes */}
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

                {/* Company protected routes */}
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;