import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 md:px-10">
            <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
                Campus<span className="text-indigo-600">Connect</span>
            </Link>

            <div className="flex items-center gap-3 text-sm md:gap-6">
                {token ? (
                    <>
            <span className="hidden text-slate-500 md:inline">
              {name}{' '}
                <span className="ml-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                {role}
              </span>
            </span>
                        <Link
                            to={role === 'COMPANY' ? '/company/dashboard' : '/dashboard'}
                            className="font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                        >
                            Student Login
                        </Link>
                        <Link
                            to="/company/login"
                            className="font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                        >
                            Company Login
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;