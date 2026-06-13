import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const DashboardLayout: React.FC = () => {
  return (
    <div
      className="h-screen w-screen flex overflow-hidden"
      style={{
        background:
          'linear-gradient(110deg, #ffffff 0%, #eef5fc 35%, #7aaaf6 100%)',
      }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ padding: '0 40px', scrollbarWidth: 'none' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
