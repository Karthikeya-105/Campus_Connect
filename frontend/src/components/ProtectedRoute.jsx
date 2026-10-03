import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        if (role === 'COMPANY') return <Navigate to="/company/dashboard" replace />;
        if (role === 'STUDENT') return <Navigate to="/dashboard" replace />;
        if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;