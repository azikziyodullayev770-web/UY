import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingsPage from './pages/ListingsPage';

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-xl font-bold tracking-wider">UY JOY REALTY</Link>
          <div className="hidden md:flex gap-4 text-sm font-medium">
            <Link to="/listings" className="hover:text-cyan-400 transition-colors">Listings</Link>
          </div>
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">Hi, <span className="text-cyan-400 font-semibold">{JSON.parse(user).name}</span></span>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded-lg text-sm font-bold shadow"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-cyan-400 transition-colors">Login</Link>
              <Link to="/register" className="bg-cyan-600 hover:bg-cyan-700 transition-colors px-4 py-2 rounded-lg text-sm font-bold shadow">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function IntegrationApp() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<ListingsPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
