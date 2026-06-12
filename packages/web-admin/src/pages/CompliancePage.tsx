import React, { useState, useMemo } from 'react';

type ComplianceStatus = 'Verified' | 'Pending' | 'Expired' | 'Missing';
type TabKey = 'pending' | 'all' | 'expiring';

interface ComplianceRow {
  id: string;
  name: string;
  avatar: string;
  therapistId: string;
  license: ComplianceStatus;
  bgCheck: ComplianceStatus;
  insurance: ComplianceStatus;
  nextVerify: string;
  tab: 'pending' | 'all';
}

const complianceData: ComplianceRow[] = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    therapistId: 'T-1001',
    license: 'Pending',
    bgCheck: 'Verified',
    insurance: 'Verified',
    nextVerify: '24/05/2026',
    tab: 'pending',
  },
  {
    id: '2',
    name: 'Dr. Ethan Hunt',
    avatar: 'https://i.pravatar.cc/150?u=ethan',
    therapistId: 'T-1002',
    license: 'Verified',
    bgCheck: 'Pending',
    insurance: 'Expired',
    nextVerify: 'Action Required',
    tab: 'pending',
  },
  {
    id: '3',
    name: 'Dr. Olivia Wilde',
    avatar: 'https://i.pravatar.cc/150?u=olivia',
    therapistId: 'T-1003',
    license: 'Missing',
    bgCheck: 'Missing',
    insurance: 'Pending',
    nextVerify: 'Action Required',
    tab: 'pending',
  },
  {
    id: '4',
    name: 'Dr. Ajesh Anand',
    avatar: 'https://i.pravatar.cc/150?u=ajesh',
    therapistId: 'T-1004',
    license: 'Verified',
    bgCheck: 'Verified',
    insurance: 'Verified',
    nextVerify: '15/11/2026',
    tab: 'all',
  },
  {
    id: '5',
    name: 'Dr. Emily Chen',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    therapistId: 'T-1005',
    license: 'Verified',
    bgCheck: 'Verified',
    insurance: 'Verified',
    nextVerify: '02/09/2026',
    tab: 'all',
  },
  {
    id: '6',
    name: 'Dr. Marcus Reed',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    therapistId: 'T-1006',
    license: 'Verified',
    bgCheck: 'Verified',
    insurance: 'Verified',
    nextVerify: '18/12/2026',
    tab: 'all',
  },
];

const statusBadgeClass = (status: ComplianceStatus): string => {
  switch (status) {
    case 'Verified':
      return 'bg-status-successLight text-status-successDark border border-status-successLight';
    case 'Pending':
      return 'bg-status-warningLight text-status-warningDark border border-status-warningLight';
    case 'Expired':
      return 'bg-status-errorLight text-status-errorDark border border-status-errorLight';
    case 'Missing':
      return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
    default:
      return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
  }
};

const statusLabel = (status: ComplianceStatus): string => {
  if (status === 'Pending') return 'Pending Review';
  return status;
};

const tabs: { key: TabKey; label: string; badge?: number }[] = [
  { key: 'pending', label: 'Pending Reviews', badge: 3 },
  { key: 'all', label: 'All Records' },
  { key: 'expiring', label: 'Expiring Soon' },
];

const perPage = 5;

const CompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<ComplianceRow | null>(null);

  const filtered = useMemo(() => {
    const tabFiltered =
      activeTab === 'pending'
        ? complianceData.filter((r) => r.tab === 'pending')
        : activeTab === 'all'
          ? complianceData
          : []; // expiring tab has no data in this mock

    if (!searchQuery) return tabFiltered;
    const q = searchQuery.toLowerCase();
    return tabFiltered.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.therapistId.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const openReviewModal = (row: ComplianceRow) => {
    setSelectedTherapist(row);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTherapist(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header - matches design tab-style header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '12px',
          paddingBottom: '0',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
            padding: '0 0 12px 0',
            position: 'relative',
          }}
        >
          Compliance & Verification
          <div
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              right: 0,
              height: '3px',
              background: '#0f172a',
              borderRadius: '2px 2px 0 0',
            }}
          />
        </div>
        <img
          src="/src/Heali-peak.png"
          alt="Mascot"
          style={{ height: '48px', marginBottom: '-1px' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '10px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px 4px',
              fontSize: '15px',
              fontWeight: 600,
              color: activeTab === tab.key ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s',
            }}
          >
            {tab.label}
            {tab.badge && (
              <span
                style={{
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '99px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  marginLeft: '6px',
                }}
              >
                {tab.badge}
              </span>
            )}
            {activeTab === tab.key && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#2563eb',
                  borderRadius: '2px 2px 0 0',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Pending Reviews Tab */}
      {activeTab === 'pending' && (
        <div>
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '240px' }}>
                <svg
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '16px',
                    height: '16px',
                    color: '#64748b',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search therapists..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 38px',
                    borderRadius: '99px',
                    border: '1px solid #cbd5e1',
                    background: 'transparent',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
              {/* Filters Button */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '99px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid #0f172a',
                  background: 'transparent',
                  color: '#0f172a',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>
            </div>
            {/* Export Button */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '99px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid #2563eb',
                background: '#2563eb',
                color: '#ffffff',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Export Compliance Report
            </button>
          </div>

          {/* Table Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px 32px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '25%' }}>
                    Therapist
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Clinical License
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Background Check
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Indemnity Ins.
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Next Verification
                  </th>
                  <th style={{ textAlign: 'right', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 0', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((row) => (
                    <tr key={row.id}>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={row.avatar}
                            alt={row.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', background: '#f1f5f9' }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{row.name}</span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>ID: {row.therapistId}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold min-w-[90px] text-center ${statusBadgeClass(row.license)}`}
                        >
                          {statusLabel(row.license)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold min-w-[90px] text-center ${statusBadgeClass(row.bgCheck)}`}
                        >
                          {statusLabel(row.bgCheck)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold min-w-[90px] text-center ${statusBadgeClass(row.insurance)}`}
                        >
                          {statusLabel(row.insurance)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            color: row.nextVerify.includes('Required') ? '#dc2626' : '#475569',
                            fontWeight: row.nextVerify.includes('Required') ? 600 : 400,
                          }}
                        >
                          {row.nextVerify}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle', textAlign: 'right' }}>
                        <button
                          onClick={() => openReviewModal(row)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Records Tab */}
      {activeTab === 'all' && (
        <div>
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '240px' }}>
                <svg
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '16px',
                    height: '16px',
                    color: '#64748b',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search therapists..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 38px',
                    borderRadius: '99px',
                    border: '1px solid #cbd5e1',
                    background: 'transparent',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
              {/* Filters Button */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '99px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid #0f172a',
                  background: 'transparent',
                  color: '#0f172a',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>
            </div>
            {/* Export Button */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '99px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid #2563eb',
                background: '#2563eb',
                color: '#ffffff',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Export Compliance Report
            </button>
          </div>

          {/* Table Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px 32px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '25%' }}>
                    Therapist
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Clinical License
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Background Check
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Indemnity Ins.
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Next Verification
                  </th>
                  <th style={{ textAlign: 'right', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 0', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((row) => (
                    <tr key={row.id}>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={row.avatar}
                            alt={row.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', background: '#f1f5f9' }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{row.name}</span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>ID: {row.therapistId}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold min-w-[90px] text-center ${statusBadgeClass(row.license)}`}
                        >
                          {statusLabel(row.license)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold min-w-[90px] text-center ${statusBadgeClass(row.bgCheck)}`}
                        >
                          {statusLabel(row.bgCheck)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold min-w-[90px] text-center ${statusBadgeClass(row.insurance)}`}
                        >
                          {statusLabel(row.insurance)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            color: row.nextVerify.includes('Required') ? '#dc2626' : '#475569',
                            fontWeight: row.nextVerify.includes('Required') ? 600 : 400,
                          }}
                        >
                          {row.nextVerify}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign: 'middle', textAlign: 'right' }}>
                        <button
                          onClick={() => openReviewModal(row)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#94a3b8',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  SHOWING 1 OF {totalPages} PAGES
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#f1f5f9',
                      color: '#334155',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: currentPage === 1 ? 0.4 : 1,
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        border: 'none',
                        background: currentPage === page ? '#2563eb' : '#f1f5f9',
                        color: currentPage === page ? '#ffffff' : '#334155',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#f1f5f9',
                      color: '#334155',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: currentPage === totalPages ? 0.4 : 1,
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expiring Soon Tab */}
      {activeTab === 'expiring' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px 32px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          }}
        >
          <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
            No documents expiring within the next 30 days.
          </p>
        </div>
      )}

      {/* Document Review Modal */}
      {showModal && selectedTherapist && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#ffffff',
              width: '650px',
              maxWidth: '90%',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563eb' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Document Review
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Therapist Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <img
                  src={selectedTherapist.avatar}
                  alt={selectedTherapist.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', background: '#f1f5f9' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{selectedTherapist.name}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '0' }}>Therapist ID: {selectedTherapist.therapistId}</span>
                </div>
              </div>

              {/* Document Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Document Type</span>
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>Clinical License Renewal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Submitted On</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>25/04/2026, 09:14 AM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Issuing Authority</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>National Board of Psychology</span>
                </div>
              </div>

              {/* Document Preview Area */}
              <div
                style={{
                  background: '#f1f5f9',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '12px',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  gap: '12px',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '48px', height: '48px', color: '#94a3b8' }}>
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
                <span style={{ fontWeight: 500, fontSize: '14px', color: '#475569' }}>Clinical_License_2026.pdf</span>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #0f172a',
                    background: 'transparent',
                    color: '#0f172a',
                    marginTop: '8px',
                  }}
                >
                  Download to View
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                background: '#fafafa',
                alignItems: 'center',
              }}
            >
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '99px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid #fecaca',
                  background: 'transparent',
                  color: '#dc2626',
                }}
              >
                Reject Document
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={closeModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '99px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #0f172a',
                    background: 'transparent',
                    color: '#0f172a',
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '99px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #16a34a',
                    background: '#16a34a',
                    color: '#ffffff',
                  }}
                >
                  Approve &amp; Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompliancePage;
