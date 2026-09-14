import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        // Not logged in — redirect to /login
        return <Navigate to="/login" replace />;
    }

    // Logged in — render whatever page was wrapped
    return children;
}

export default ProtectedRoute;