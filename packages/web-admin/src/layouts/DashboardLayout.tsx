import React from 'react';
import { Outlet } from 'react-router-dom';
import '@/styles/globals.css';

const DashboardLayout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(110deg, #ffffff 0%, #eef5fc 35%, #7aaaf6 100%)',
      }}
    >
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
