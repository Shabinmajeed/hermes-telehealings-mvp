import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface Client {
  name: string;
  email: string;
  avatar: string;
  status: 'Active' | 'Paused';
  lastSession: string;
  nextSession: string | null;
  nextTime: string | null;
}

const MOCK_CLIENTS: Client[] = [
  { name: 'Sarah Johnson', email: 'sarah.j@example.com', avatar: 'https://i.pravatar.cc/150?img=5', status: 'Active', lastSession: 'Oct 12, 2023', nextSession: 'Oct 24, 2023', nextTime: '09:00 AM' },
  { name: 'Michael Chen', email: 'm.chen@example.com', avatar: 'https://i.pravatar.cc/150?img=12', status: 'Active', lastSession: 'Oct 18, 2023', nextSession: 'Oct 24, 2023', nextTime: '10:30 AM' },
  { name: 'Priya Patel', email: 'priya.p@example.com', avatar: 'https://i.pravatar.cc/150?img=32', status: 'Paused', lastSession: 'Sep 28, 2023', nextSession: null, nextTime: null },
  { name: 'Emma Wilson', email: 'emma.w@example.com', avatar: 'https://i.pravatar.cc/150?img=9', status: 'Active', lastSession: 'Oct 20, 2023', nextSession: 'Oct 27, 2023', nextTime: '02:00 PM' },
  { name: 'James Rodriguez', email: 'james.r@example.com', avatar: 'https://i.pravatar.cc/150?img=11', status: 'Active', lastSession: 'Oct 21, 2023', nextSession: 'Oct 28, 2023', nextTime: '11:00 AM' },
  { name: 'Lisa Thompson', email: 'lisa.t@example.com', avatar: 'https://i.pravatar.cc/150?img=47', status: 'Active', lastSession: 'Oct 23, 2023', nextSession: 'Oct 30, 2023', nextTime: '01:00 PM' },
];

const TOTAL_CLIENTS = 32;

const FILTER_TABS = ['All Clients', 'First Session', 'Archived', 'Last Session in One Week'] as const;

const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredClients = useMemo(() => {
    let result = MOCK_CLIENTS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    if (activeTab === 1) result = result.filter((c) => c.status === 'Active');
    if (activeTab === 2) result = result.filter((c) => c.status === 'Paused');
    return result;
  }, [searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCount = TOTAL_CLIENTS;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header with Frosted Glass — matches design .top-header */}
      <div
        className="sticky top-0 z-[100]"
        style={{
          padding: '30px 40px 20px 40px',
          margin: '0 -40px',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[32px] font-bold text-text-primary tracking-tight mb-1">My Clients</h1>
            <p className="text-[15px] text-text-tertiary m-0">You have {activeCount} active clients</p>
          </div>
        </div>
      </div>

      {/* Filter Bar — matches design .clients-filter-bar */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <div className="flex items-center gap-2">
          {FILTER_TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(i); setCurrentPage(1); }}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
              }}
              className={`border transition-all cursor-pointer ${
                activeTab === i
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-text-secondary border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-[300px]">
          <svg
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: '14px', color: '#94a3b8' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full text-sm outline-none transition-colors bg-white"
            style={{
              padding: '10px 16px 10px 40px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#2a73d4'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
          />
        </div>
      </div>

      {/* Clients Table Card — matches design .clients-container */}
      <div
        className="bg-white overflow-hidden flex flex-col"
        style={{
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          marginTop: '10px',
          marginBottom: '40px',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th
                  className="cursor-pointer select-none transition-colors"
                  style={{
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <div className="flex items-center gap-1.5">
                    Client Details
                    <svg style={{ color: '#cbd5e1' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 15l5 5 5-5" />
                      <path d="M7 9l5-5 5 5" />
                    </svg>
                  </div>
                </th>
                <th
                  style={{
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                >
                  Status
                </th>
                <th
                  className="cursor-pointer select-none transition-colors"
                  style={{
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <div className="flex items-center gap-1.5">
                    Last Session
                    <svg style={{ color: '#cbd5e1' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 15l5 5 5-5" />
                      <path d="M7 9l5-5 5 5" />
                    </svg>
                  </div>
                </th>
                <th
                  className="cursor-pointer select-none transition-colors"
                  style={{
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <div className="flex items-center gap-1.5">
                    Next Session
                    <svg style={{ color: '#cbd5e1' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 15l5 5 5-5" />
                      <path d="M7 9l5-5 5 5" />
                    </svg>
                  </div>
                </th>
                <th
                  style={{
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map((client, i) => (
                <tr
                  key={i}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', verticalAlign: 'middle' as const }}>
                    <div className="flex items-center gap-3.5">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          objectFit: 'cover' as const,
                          border: '1px solid #e2e8f0',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <span className="block font-semibold text-text-primary mb-0.5">{client.name}</span>
                        <span className="block text-xs text-text-tertiary">{client.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', verticalAlign: 'middle' as const }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                      className={
                        client.status === 'Active'
                          ? 'bg-status-successLight text-status-successDark'
                          : 'bg-status-warningLight text-status-warningDark'
                      }
                    >
                      {client.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', verticalAlign: 'middle' as const }}>
                    {client.lastSession}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', verticalAlign: 'middle' as const }}>
                    {client.nextSession ? (
                      <>
                        <strong className="text-text-primary">{client.nextSession}</strong>
                        <br />
                        <span className="text-xs text-text-tertiary">({client.nextTime})</span>
                      </>
                    ) : (
                      <span className="text-text-tertiary">To be scheduled</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', verticalAlign: 'middle' as const }}>
                    <button
                      onClick={() => navigate('/workflows/clients-profile')}
                      className="inline-block font-semibold text-center cursor-pointer transition-colors"
                      style={{
                        color: '#2a73d4',
                        background: '#eff6ff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        border: 'none',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-text-tertiary" style={{ padding: '48px 24px' }}>
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — matches design .pagination-container */}
        <div
          className="flex justify-between items-center"
          style={{
            padding: '16px 24px',
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            Showing {filteredClients.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {TOTAL_CLIENTS} entries
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer transition-all"
              style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#475569',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="cursor-pointer transition-all"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: currentPage === page ? '#2a73d4' : '#ffffff',
                  color: currentPage === page ? '#ffffff' : '#475569',
                  border: currentPage === page ? '1px solid #2a73d4' : '1px solid #e2e8f0',
                }}
              >
                {page}
              </button>
            ))}
            {totalPages > 3 && (
              <>
                <span style={{ color: '#94a3b8', padding: '0 4px', fontWeight: 600 }}>...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="cursor-pointer transition-all"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    background: currentPage === totalPages ? '#2a73d4' : '#ffffff',
                    color: currentPage === totalPages ? '#ffffff' : '#475569',
                    border: currentPage === totalPages ? '1px solid #2a73d4' : '1px solid #e2e8f0',
                  }}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer transition-all"
              style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#475569',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
