import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import CompanyRegister from './pages/CompanyRegister';
import CompanyLogin from './pages/CompanyLogin';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyJobs from './pages/CompanyJobs';
import PostJob from './pages/PostJob';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/company/register" element={<CompanyRegister />} />
                <Route path="/company/login" element={<CompanyLogin />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requiredRole="STUDENT">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;