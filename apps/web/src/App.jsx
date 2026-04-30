
import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import OrderPage from '@/pages/OrderPage';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from "./pages/AdminDashboard";
import AuthSuccess from "./pages/AuthSuccess";
import ClientAccount from "./pages/ClientAccount";
import ClientLogin from "./pages/ClientLogin";
import ClientRegister from "./pages/ClientRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/account" element={<ClientAccount />} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/cuenta" element={<Navigate to="/account" replace />} />
        <Route path="/register" element={<ClientRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
