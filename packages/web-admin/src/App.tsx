import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardLayout from './layouts/DashboardLayout';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="sessions" element={<div className="page-shell"><div className="content-wrapper"><h2>Sessions & Schedule</h2><p>Coming soon...</p></div></div>} />
        <Route path="clients" element={<div className="page-shell"><div className="content-wrapper"><h2>Clients</h2><p>Coming soon...</p></div></div>} />
        <Route path="therapists" element={<TherapistsPage />} />
        <Route path="content" element={<div className="page-shell"><div className="content-wrapper"><h2>Content Management</h2><p>Coming soon...</p></div></div>} />
        <Route path="communications" element={<div className="page-shell"><div className="content-wrapper"><h2>Communications</h2><p>Coming soon...</p></div></div>} />
        <Route path="compliance" element={<div className="page-shell"><div className="content-wrapper"><h2>Compliance</h2><p>Coming soon...</p></div></div>} />
        <Route path="financials" element={<div className="page-shell"><div className="content-wrapper"><h2>Financials</h2><p>Coming soon...</p></div></div>} />
        <Route path="analytics" element={<div className="page-shell"><div className="content-wrapper"><h2>Analytics & Reporting</h2><p>Coming soon...</p></div></div>} />
        <Route path="promotion" element={<div className="page-shell"><div className="content-wrapper"><h2>Promotion & Offers</h2><p>Coming soon...</p></div></div>} />
        <Route path="schedule" element={<div className="page-shell"><div className="content-wrapper"><h2>Schedule</h2><p>Coming soon...</p></div></div>} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
