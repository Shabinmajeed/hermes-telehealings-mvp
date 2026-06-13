import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import SchedulePage from './pages/SchedulePage';
import MessagesPage from './pages/MessagesPage';
import EarningsPage from './pages/EarningsPage';
import PaymentsPage from './pages/PaymentsPage';
import AvailabilityPage from './pages/AvailabilityPage';
import DocumentsPage from './pages/DocumentsPage';
import ContentsPage from './pages/ContentsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import ToolsPage from './pages/ToolsPage';
import ClientsProfilePage from './pages/workflows/clients/ClientsProfilePage';
import RegistrationProfessionalDetailsPage from './pages/workflows/RegistrationProfessionalDetailsPage';
import RegistrationPage from './pages/workflows/registration/RegistrationPage';
import ActiveSessionPage from './pages/workflows/ActiveSessionPage';
import SessionPrepPage from './pages/workflows/sessions/SessionPrepPage';
import SessionSummaryPage from './pages/workflows/SessionSummaryPage';
import VerificationHubPage from './pages/workflows/VerificationHubPage';
import DashboardLayout from './layouts/DashboardLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="availability" element={<AvailabilityPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="contents" element={<ContentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="tools" element={<ToolsPage />} />
          {/* Workflow Pages */}
          <Route path="workflows/clients-profile" element={<ClientsProfilePage />} />
          <Route path="workflows/registration" element={<RegistrationProfessionalDetailsPage />} />
          <Route path="workflows/registration/signup" element={<RegistrationPage />} />
          <Route path="workflows/active-session" element={<ActiveSessionPage />} />
          <Route path="workflows/session-prep" element={<SessionPrepPage />} />
          <Route path="workflows/session-summary" element={<SessionSummaryPage />} />
          <Route path="workflows/verification-hub" element={<VerificationHubPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
