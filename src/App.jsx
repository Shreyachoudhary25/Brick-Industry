import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Quote from './pages/Quote';
import Contact from './pages/Contact';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import Calculator from './pages/Calculator';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/calculator" element={<Calculator />} /> 

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </AuthProvider>
  );
}

export default App;