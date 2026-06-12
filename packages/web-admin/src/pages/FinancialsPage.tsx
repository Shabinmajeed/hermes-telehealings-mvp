import React, { useState, useEffect, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface TransactionData {
  id: number;
  trxId: string;
  direction: 'inflow' | 'outflow';
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  time: string;
  type: string;
  amount: string;
  amountClass: 'amount-positive' | 'amount-negative';
  status: string;
}

interface TierRow {
  name: string;
  rate: number;
  split: number;
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const financialsData: TransactionData[] = [
  { id: 1, trxId: 'TXN-894521', direction: 'inflow', user: { name: 'Nathaniel Jacob', role: 'Client', avatar: 'https://i.pravatar.cc/150?u=nathaniel' }, date: '24/04/2026', time: '10:30 AM', type: 'Session Payment', amount: '+ ₹ 1,500', amountClass: 'amount-positive', status: 'Completed' },
  { id: 2, trxId: 'TXN-894522', direction: 'outflow', user: { name: 'Dr. Sarah Smith', role: 'Therapist', avatar: 'https://i.pravatar.cc/150?u=sarah' }, date: '24/04/2026', time: '09:00 AM', type: 'Weekly Payout', amount: '- ₹ 12,400', amountClass: 'amount-negative', status: 'Completed' },
  { id: 3, trxId: 'TXN-894523', direction: 'inflow', user: { name: 'Jane Hopper', role: 'Client', avatar: 'https://i.pravatar.cc/150?u=jane' }, date: '23/04/2026', time: '02:15 PM', type: 'Premium Wellness Sub', amount: '+ ₹ 4,999', amountClass: 'amount-positive', status: 'Completed' },
  { id: 4, trxId: 'TXN-894524', direction: 'outflow', user: { name: 'Mike Wheeler', role: 'Client', avatar: 'https://i.pravatar.cc/150?u=mike' }, date: '23/04/2026', time: '11:45 AM', type: 'Session Refund', amount: '- ₹ 1,500', amountClass: 'amount-negative', status: 'Refunded' },
  { id: 5, trxId: 'TXN-894525', direction: 'outflow', user: { name: 'Dr. Ajesh Anand', role: 'Therapist', avatar: 'https://i.pravatar.cc/150?u=ajesh' }, date: '22/04/2026', time: '05:00 PM', type: 'Weekly Payout', amount: '- ₹ 18,200', amountClass: 'amount-negative', status: 'Pending' },
  { id: 6, trxId: 'TXN-894526', direction: 'inflow', user: { name: 'Nancy Wheeler', role: 'Client', avatar: 'https://i.pravatar.cc/150?u=nancy' }, date: '22/04/2026', time: '01:20 PM', type: 'Session Payment', amount: '+ ₹ 1,500', amountClass: 'amount-positive', status: 'Failed' },
  { id: 7, trxId: 'TXN-894527', direction: 'inflow', user: { name: 'Victor Martinez', role: 'Client', avatar: 'https://i.pravatar.cc/150?u=victor' }, date: '21/04/2026', time: '10:10 AM', type: 'Session Payment', amount: '+ ₹ 2,000', amountClass: 'amount-positive', status: 'Completed' },
];

// ── Page ───────────────────────────────────────────────────────────────────

const FinancialsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'rates'>('transactions');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [payoutData, setPayoutData] = useState({ name: '', avatar: '', amount: '₹ 0' });

  // Tier state
  const [tiers, setTiers] = useState<TierRow[]>([
    { name: 'Junior Practitioner', rate: 1500, split: 20 },
    { name: 'Senior Practitioner', rate: 2500, split: 15 },
    { name: 'Specialist', rate: 3500, split: 10 },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Filter transactions
  const filteredData = useMemo(() => {
    return financialsData.filter((item) => {
      if (filter !== 'all' && item.direction !== filter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.trxId.toLowerCase().includes(q) ||
          item.user.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, searchQuery]);

  const totalPages = 125; // As per design
  const displayData = filteredData;

  const handleReviewPayout = (name: string, avatar: string, amount: string) => {
    setPayoutData({ name, avatar, amount: amount.replace('- ', '') });
    setPayoutModalOpen(true);
  };

  const addTier = () => {
    setTiers([...tiers, { name: '', rate: 0, split: 0 }]);
  };

  const updateTier = (index: number, field: keyof TierRow, value: string | number) => {
    const updated = [...tiers];
    if (field === 'name') {
      updated[index] = { ...updated[index], [field]: value as string };
    } else {
      updated[index] = { ...updated[index], [field]: Number(value) };
    }
    setTiers(updated);
  };

  const statusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      default: return '';
    }
  };

  return (
    <>
      <style>{`
        /* --- Base Layout --- */
        .fin-page-shell {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
          background: transparent;
          display: flex;
          flex-direction: column;
        }
        .fin-content-wrapper {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 40px;
          flex: 1;
        }

        /* --- Header --- */
        .fin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 12px;
          padding-bottom: 0;
          flex-shrink: 0;
        }
        .fin-header-tab {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          padding: 0 0 12px 0;
          position: relative;
        }
        .fin-header-tab::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 3px;
          background: #0f172a;
          border-radius: 2px 2px 0 0;
        }
        .fin-header-mascot {
          height: 48px;
          margin-bottom: -1px;
        }

        /* --- Toolbar --- */
        .fin-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .fin-toolbar-left, .fin-toolbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .fin-user-count {
          font-size: 16px;
          color: #475569;
        }
        .fin-user-count strong {
          color: #0f172a;
          font-weight: 700;
        }
        .fin-search-wrap {
          position: relative;
          width: 240px;
        }
        .fin-search-wrap svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #64748b;
        }
        .fin-search-input {
          width: 100%;
          padding: 10px 16px 10px 38px;
          border-radius: 99px;
          border: 1px solid #cbd5e1;
          background: transparent;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .fin-search-input:focus {
          border-color: #3b82f6;
        }

        /* --- Buttons --- */
        .fin-btn-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .fin-btn-pill svg {
          width: 16px;
          height: 16px;
        }
        .fin-btn-outline {
          border: 1px solid #0f172a;
          background: transparent;
          color: #0f172a;
        }
        .fin-btn-outline:hover {
          background: #f1f5f9;
        }
        .fin-btn-primary {
          border: 1px solid #2563eb;
          background: #2563eb;
          color: #ffffff;
        }
        .fin-btn-primary:hover {
          background: #1d4ed8;
        }

        /* --- Table Card --- */
        .fin-table-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px 32px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .fin-clients-table {
          width: 100%;
          border-collapse: collapse;
        }
        .fin-clients-table th {
          text-align: left;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .fin-clients-table th svg {
          width: 14px; height: 14px;
          vertical-align: middle;
          margin-left: 4px;
        }
        .fin-clients-table td {
          padding: 16px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: #334155;
          vertical-align: middle;
        }
        .fin-clients-table tr:last-child td {
          border-bottom: none;
        }

        /* User Info Column */
        .fin-user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fin-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          background: #f1f5f9;
        }
        .fin-user-details {
          display: flex;
          flex-direction: column;
        }
        .fin-user-name {
          font-weight: 600;
          color: #0f172a;
          font-size: 14px;
        }
        .fin-user-role {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .fin-sub-text {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-top: 4px;
        }
        .fin-transaction-id {
          font-family: monospace;
          font-size: 13px;
          color: #475569;
          background: #f8fafc;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }
        .fin-amount-value {
          font-weight: 700;
          font-size: 15px;
          color: #0f172a;
        }
        .fin-amount-positive { color: #16a34a; }
        .fin-amount-negative { color: #0f172a; }

        /* Status Badges */
        .fin-status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-completed { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef9c3; color: #854d0e; }
        .status-failed { background: #fee2e2; color: #991b1b; }
        .status-refunded { background: #f1f5f9; color: #475569; }

        .fin-action-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fin-action-btn:hover { background: #f1f5f9; }

        /* --- Pagination --- */
        .fin-pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
        }
        .fin-pagination-info {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .fin-pagination-nav {
          display: flex;
          gap: 8px;
        }
        .fin-page-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: none;
          background: #f1f5f9;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .fin-page-btn:hover { background: #e2e8f0; }
        .fin-page-btn.active { background: #2563eb; color: #ffffff; }
        .fin-page-btn svg { width: 16px; height: 16px; }

        /* --- Tabs Navigation --- */
        .fin-tabs-nav {
          display: flex; gap: 24px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px;
        }
        .fin-tab-btn {
          background: transparent; border: none; padding: 10px 4px; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; position: relative; transition: color 0.2s; font-family: inherit;
        }
        .fin-tab-btn:hover { color: #0f172a; }
        .fin-tab-btn.active { color: #2563eb; }
        .fin-tab-btn.active::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #2563eb; border-radius: 2px 2px 0 0;
        }
        .fin-tab-content { display: none; flex-direction: column; flex: 1; min-height: 0; }
        .fin-tab-content.active { display: flex; }

        /* --- Tier Table Styles --- */
        .fin-tier-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .fin-tier-table th { text-align: left; font-size: 12px; font-weight: 600; color: #64748b; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; }
        .fin-tier-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .fin-tier-table tr:last-child td { border-bottom: none; }
        .fin-tier-input {
          width: 100%; padding: 8px 12px; border-radius: 6px;
          border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit;
          outline: none; transition: border 0.2s; box-sizing: border-box;
        }
        .fin-tier-input:focus { border-color: #2563eb; }
        .fin-tier-input-group { position: relative; display: flex; align-items: center; }
        .fin-tier-input-group span { position: absolute; left: 10px; color: #64748b; font-size: 14px; }
        .fin-tier-input-group .fin-tier-input { padding-left: 24px; }
        .fin-tier-input-group.percent .fin-tier-input { padding-left: 12px; padding-right: 24px; }
        .fin-tier-input-group.percent span { left: auto; right: 10px; }

        /* --- Transaction Filters --- */
        .fin-trx-filters { display: flex; gap: 8px; margin: 0 12px; flex-wrap: wrap; }
        .fin-trx-filter-btn {
          background: #f1f5f9; border: 1px solid transparent; color: #475569;
          padding: 6px 14px; border-radius: 99px; font-size: 12px;
          font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .fin-trx-filter-btn:hover { background: #e2e8f0; }
        .fin-trx-filter-btn.active {
          background: #eff6ff; color: #2563eb; border-color: #bfdbfe;
        }

        /* --- Modal Styles --- */
        .fin-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; opacity: 0; visibility: hidden; transition: all 0.2s;
        }
        .fin-modal-overlay.active { opacity: 1; visibility: visible; }
        .fin-modal-card {
          background: #ffffff; width: 500px; max-width: 90%;
          border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          transform: scale(0.95); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .fin-modal-overlay.active .fin-modal-card { transform: scale(1); }
        .fin-modal-header { padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
        .fin-modal-title { font-size: 16px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;}
        .fin-modal-title svg { color: #2563eb; }
        .fin-modal-close { background: transparent; border: none; cursor: pointer; color: #64748b; padding: 4px; border-radius: 50%; }
        .fin-modal-close:hover { background: #e2e8f0; color: #0f172a; }
        .fin-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .fin-modal-footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; background: #fafafa; }

        /* Form Utilities for Modal */
        .fin-form-group { display: flex; flex-direction: column; gap: 6px; }
        .fin-form-label { font-size: 12px; font-weight: 600; color: #475569; }
        .fin-form-input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit; outline: none; transition: border 0.2s; box-sizing: border-box; background: #ffffff; color: #0f172a; }
        .fin-form-input:focus { border-color: #2563eb; }
        .fin-form-row { display: flex; gap: 16px; }
        .fin-form-row .fin-form-group { flex: 1; }
      `}</style>

      <div className="fin-page-shell">
        <div className="fin-content-wrapper">

          {/* Header */}
          <header className="fin-page-header">
            <div className="fin-header-tab">Financials</div>
            <img src="/assets/Heali-peak.png" className="fin-header-mascot" alt="Mascot" />
          </header>

          {/* Tabs Navigation */}
          <div className="fin-tabs-nav">
            <button
              className={`fin-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <button
              className={`fin-tab-btn ${activeTab === 'rates' ? 'active' : ''}`}
              onClick={() => setActiveTab('rates')}
            >
              Rates & Tiers
            </button>
          </div>

          {/* Tab Content: Transactions */}
          <div className={`fin-tab-content ${activeTab === 'transactions' ? 'active' : ''}`}>
            {/* Toolbar */}
            <div className="fin-toolbar">
              <div className="fin-toolbar-left">
                <div className="fin-user-count"><strong>All Transactions</strong> 1,248</div>
                <div className="fin-search-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="fin-search-input"
                    placeholder="Search Trx ID or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="fin-trx-filters">
                  <button
                    className={`fin-trx-filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >All</button>
                  <button
                    className={`fin-trx-filter-btn ${filter === 'inflow' ? 'active' : ''}`}
                    onClick={() => setFilter('inflow')}
                  >Inflows</button>
                  <button
                    className={`fin-trx-filter-btn ${filter === 'outflow' ? 'active' : ''}`}
                    onClick={() => setFilter('outflow')}
                  >Outflows</button>
                </div>
                <button className="fin-btn-pill fin-btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filters
                </button>
              </div>
              <div className="fin-toolbar-right">
                <button className="fin-btn-pill fin-btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Export CSV
                </button>
                <button className="fin-btn-pill fin-btn-primary" onClick={() => setReportModalOpen(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Generate Report
                </button>
              </div>
            </div>

            {/* Table Card */}
            <div className="fin-table-card">
              <table className="fin-clients-table">
                <thead>
                  <tr>
                    <th style={{ width: '5%' }}>Sl No</th>
                    <th style={{ width: '15%' }}>Transaction ID</th>
                    <th style={{ width: '20%' }}>User Details</th>
                    <th style={{ width: '15%' }}>
                      Date & Time{' '}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </th>
                    <th style={{ width: '15%' }}>Type</th>
                    <th style={{ width: '12%' }}>Amount</th>
                    <th style={{ width: '12%' }}>Status</th>
                    <th style={{ width: '6%', textAlign: 'center' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Loading...</td></tr>
                  ) : displayData.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No transactions found</td></tr>
                  ) : (
                    displayData.map((item) => (
                      <tr key={item.id}>
                        <td style={{ color: '#64748b' }}>{item.id}</td>
                        <td><span className="fin-transaction-id">{item.trxId}</span></td>
                        <td>
                          <div className="fin-user-cell">
                            <img src={item.user.avatar} className="fin-avatar" alt={item.user.name} />
                            <div className="fin-user-details">
                              <span className="fin-user-name">{item.user.name}</span>
                              <span className="fin-user-role">{item.user.role}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {item.date}
                          <span className="fin-sub-text">{item.time}</span>
                        </td>
                        <td style={{ color: '#475569', fontWeight: 500 }}>{item.type}</td>
                        <td>
                          <span className={`fin-amount-value ${item.amountClass === 'amount-positive' ? 'fin-amount-positive' : 'fin-amount-negative'}`}>
                            {item.amount}
                          </span>
                        </td>
                        <td>
                          <span className={`fin-status-badge ${statusClass(item.status)}`}>{item.status}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {item.type === 'Weekly Payout' && item.status === 'Pending' ? (
                            <button
                              className="fin-action-btn"
                              onClick={() => handleReviewPayout(item.user.name, item.user.avatar, item.amount)}
                              title="Review Payout"
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="19" r="2" />
                              </svg>
                            </button>
                          ) : (
                            <button className="fin-action-btn">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="19" r="2" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="fin-pagination-container">
                <div className="fin-pagination-info">SHOWING 1 OF {totalPages} PAGES</div>
                <div className="fin-pagination-nav">
                  <button className="fin-page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button className={`fin-page-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
                  <button className={`fin-page-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
                  <button className={`fin-page-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
                  <button className="fin-page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content: Rates & Tiers */}
          <div className={`fin-tab-content ${activeTab === 'rates' ? 'active' : ''}`}>
            <div className="fin-table-card">
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Base Rates & Commission Splits</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Define global hourly baselines and platform commission percentages for various therapist tiers.</p>
              </div>

              <table className="fin-tier-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Therapist Tier</th>
                    <th style={{ width: '30%' }}>Base Hourly Rate</th>
                    <th style={{ width: '30%' }}>Platform Split</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          className="fin-tier-input"
                          value={tier.name}
                          onChange={(e) => updateTier(index, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <div className="fin-tier-input-group">
                          <span>₹</span>
                          <input
                            type="number"
                            className="fin-tier-input"
                            value={tier.rate}
                            onChange={(e) => updateTier(index, 'rate', e.target.value)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="fin-tier-input-group percent">
                          <input
                            type="number"
                            className="fin-tier-input"
                            value={tier.split}
                            onChange={(e) => updateTier(index, 'split', e.target.value)}
                          />
                          <span>%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="fin-btn-pill fin-btn-outline"
                style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', color: '#64748b' }}
                onClick={addTier}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add New Tier
              </button>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                <button className="fin-btn-pill fin-btn-outline" onClick={() => setTiers([
                  { name: 'Junior Practitioner', rate: 1500, split: 20 },
                  { name: 'Senior Practitioner', rate: 2500, split: 15 },
                  { name: 'Specialist', rate: 3500, split: 10 },
                ])}>Cancel Changes</button>
                <button className="fin-btn-pill fin-btn-primary">Save Configuration</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Review Payout Modal */}
      <div className={`fin-modal-overlay ${payoutModalOpen ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setPayoutModalOpen(false); }}>
        <div className="fin-modal-card">
          <div className="fin-modal-header">
            <div className="fin-modal-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Review Weekly Payout
            </div>
            <button className="fin-modal-close" onClick={() => setPayoutModalOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="fin-modal-body">
            <div className="fin-user-cell" style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <img src={payoutData.avatar} className="fin-avatar" alt="Therapist" />
              <div className="fin-user-details">
                <span className="fin-user-name">{payoutData.name}</span>
                <span className="fin-user-role">Therapist</span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0' }}>
              Payout details for the period: <strong>15 Apr 2026 - 21 Apr 2026</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Total Sessions (Completed)</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>14</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Gross Earnings</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>₹ 21,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Platform Commission (15%)</span>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>- ₹ 3,150</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Bonus / Adjustments</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>+ ₹ 350</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Net Payout Amount</span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{payoutData.amount}</span>
            </div>
          </div>
          <div className="fin-modal-footer">
            <button className="fin-btn-pill fin-btn-outline" onClick={() => setPayoutModalOpen(false)}>Hold Payout</button>
            <button className="fin-btn-pill fin-btn-primary" style={{ background: '#16a34a', borderColor: '#16a34a' }}>Approve & Transfer</button>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      <div className={`fin-modal-overlay ${reportModalOpen ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setReportModalOpen(false); }}>
        <div className="fin-modal-card">
          <div className="fin-modal-header">
            <div className="fin-modal-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Generate Custom Report
            </div>
            <button className="fin-modal-close" onClick={() => setReportModalOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="fin-modal-body">
            <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>Configure parameters to extract an accounting-ready CSV ledger.</p>

            <div className="fin-form-row">
              <div className="fin-form-group">
                <label className="fin-form-label">Start Date</label>
                <input type="date" className="fin-form-input" />
              </div>
              <div className="fin-form-group">
                <label className="fin-form-label">End Date</label>
                <input type="date" className="fin-form-input" />
              </div>
            </div>

            <div className="fin-form-group">
              <label className="fin-form-label">Transaction Type</label>
              <select className="fin-form-input">
                <option>All Types</option>
                <option>Session Payments</option>
                <option>Premium Subscriptions</option>
                <option>Therapist Payouts</option>
                <option>Refunds</option>
              </select>
            </div>

            <div className="fin-form-group">
              <label className="fin-form-label">Ledger Segment</label>
              <select className="fin-form-input">
                <option>Consolidated (Inflows & Outflows)</option>
                <option>Inflows Only (Client Payments)</option>
                <option>Outflows Only (Payouts & Refunds)</option>
              </select>
            </div>
          </div>
          <div className="fin-modal-footer">
            <button className="fin-btn-pill fin-btn-outline" onClick={() => setReportModalOpen(false)}>Cancel</button>
            <button className="fin-btn-pill fin-btn-primary" onClick={() => { alert('Financial Report CSV generated successfully based on selected parameters!'); setReportModalOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CSV Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialsPage;
