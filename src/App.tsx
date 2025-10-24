import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { SEO } from './components/SEO';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminShortcut } from './components/AdminShortcut';
import { HomePage } from './components/HomePage';
import { ResumePage } from './components/ResumePage';
import { DesignWorkPage } from './components/DesignWorkPage';
import { ProjectPage } from './components/ProjectPage';
import { VenturesPage } from './components/VenturesPage';
import { VenturePage } from './components/VenturePage';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load heavy components
const AdminPage = lazy(() => import('./components/AdminPage').then(module => ({ default: module.AdminPage })));
const LogoShowcase = lazy(() => import('./components/LogoShowcase').then(module => ({ default: module.LogoShowcase })));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SEO />
        <ScrollToTop />
        <AdminShortcut />
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/design-work" element={<DesignWorkPage />} />
            <Route path="/design-work/:id" element={<ProjectPage />} />
            <Route path="/ventures" element={<VenturesPage />} />
            <Route path="/ventures/:id" element={<VenturePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading admin panel...</div>}>
                    <AdminPage />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route path="/logo" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <LogoShowcase />
              </Suspense>
            } />
            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}