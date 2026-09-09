import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register />} />
                {/* We will add "/login" and "/dashboard" later */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;