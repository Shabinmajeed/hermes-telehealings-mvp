import React, { useState } from 'react';

/* ───────── KPI Data ───────── */
const KPI_DATA = [
  {
    label: 'Available for Payout',
    value: '₹24,500',
    highlight: true,
    action: 'Withdraw Funds',
  },
  {
    label: 'Earnings This Month',
    value: '₹48,000',
    trend: '+12% from last month',
    trendPositive: true,
  },
  {
    label: 'Pending Invoices',
    value: '₹3,500',
    valueColor: '#b45309',
    subtitle: 'From 3 upcoming/unpaid sessions',
  },
];

/* ───────── Transactions ───────── */
const TRANSACTIONS = [
  { date: 'Oct 24, 2023', client: 'Sarah Johnson', desc: '1-Hour Therapy Session', amount: '₹1,500', status: 'Paid' },
  { date: 'Oct 24, 2023', client: 'Michael Chen', desc: '1-Hour Therapy Session', amount: '₹1,500', status: 'Pending' },
  { date: 'Oct 23, 2023', client: 'Priya Patel', desc: 'Initial Intake Session', amount: '₹2,000', status: 'Paid' },
  { date: 'Oct 21, 2023', client: 'Telehealings Platform', desc: 'Weekly Payout Transfer', amount: '-₹12,400', status: 'Completed', amountColor: '#b91c1c' },
];

/* ───────── Helpers ───────── */
const statusClass = (s: string) =>
  s === 'Paid' ? 'status-paid' : s === 'Pending' ? 'status-pending' : 'status-paid';

/* ───────── Component ───────── */
const EarningsPage: React.FC = () => {
  const [period, setPeriod] = useState('Last 6 Months');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Sticky Header with Blur ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '40px 40px 20px 40px',
          margin: '0 -40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
            Payments &amp; Earnings
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>
            Track your revenue, manage payouts, and view transaction history.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Tax Report
          </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          margin: '24px 0',
        }}
      >
        {KPI_DATA.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: kpi.highlight
                ? 'linear-gradient(135deg, #2a73d4, #1e40af)'
                : '#ffffff',
              borderRadius: 16,
              padding: 24,
              border: kpi.highlight ? 'none' : '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              color: kpi.highlight ? '#ffffff' : undefined,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: kpi.highlight ? '#bfdbfe' : '#64748b',
                marginBottom: 8,
              }}
            >
              {kpi.label}
            </span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: kpi.highlight ? '#ffffff' : (kpi.valueColor ?? '#0f172a'),
                letterSpacing: '-1px',
                marginBottom: 16,
              }}
            >
              {kpi.value}
            </span>

            {/* Highlight card action button */}
            {kpi.highlight && kpi.action && (
              <div style={{ marginTop: 'auto' }}>
                <button
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    color: '#2a73d4',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {kpi.action}
                </button>
              </div>
            )}

            {/* Trend / subtitle for non-highlight cards */}
            {!kpi.highlight && kpi.trend && (
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#059669',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                {kpi.trend}
              </div>
            )}
            {!kpi.highlight && kpi.subtitle && (
              <div style={{ marginTop: 'auto', fontSize: 14, color: '#64748b' }}>
                {kpi.subtitle}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Revenue Overview (Chart Placeholder) ── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Revenue Overview
          </h3>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option>Last 6 Months</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
        <div
          style={{
            padding: 30,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 250,
            background: '#f8fafc',
            color: '#94a3b8',
          }}
        >
          [ Interactive Revenue Chart Visualization ]
        </div>
      </div>

      {/* ── Recent Transactions Table ── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          marginBottom: 40,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Recent Transactions
          </h3>
          <button
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            View All
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              {['Date', 'Client', 'Description', 'Amount', 'Status', 'Invoice'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '16px 24px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, i) => (
              <tr
                key={i}
                style={{ borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
              >
                <td style={{ padding: '16px 24px', fontSize: 14, color: '#475569' }}>{tx.date}</td>
                <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{tx.client}</td>
                <td style={{ padding: '16px 24px', fontSize: 14, color: '#475569' }}>{tx.desc}</td>
                <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 700, color: tx.amountColor ?? '#0f172a' }}>{tx.amount}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span
                    className={statusClass(tx.status)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {tx.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <a
                    href="#"
                    style={{ color: '#94a3b8', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#2a73d4'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarningsPage;
