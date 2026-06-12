import React, { useState } from 'react';

// --- Types ---

interface PromoRow {
  id: number;
  name: string;
  code: string;
  audience: string;
  offer: string;
  validUntil: string;
  usage: string;
  status: 'Active' | 'Scheduled' | 'Expired';
}

interface BroadcastRow {
  msg: string;
  target: string;
  publish: string;
  clear: string;
  status: 'Active' | 'Scheduled' | 'Expired';
}

// --- Mock Data ---

const promoData: PromoRow[] = [
  { id: 1, name: 'Summer Wellness Campaign', code: 'SUMMER20', audience: 'Clients', offer: '20% Off Session', validUntil: '30/06/2026', usage: '142 / 500', status: 'Active' },
  { id: 2, name: 'New Therapist Onboarding', code: 'WELCOME500', audience: 'Therapists', offer: '\u20B9500 Bonus', validUntil: '15/05/2026', usage: '12 / 50', status: 'Active' },
  { id: 3, name: 'Mental Health Awareness', code: 'MHMONTH', audience: 'All', offer: 'Free First Session', validUntil: '31/05/2026', usage: '0 / 1000', status: 'Scheduled' },
  { id: 4, name: 'Re-engagement Push', code: 'COMEBACK10', audience: 'Clients', offer: '10% Off Subscription', validUntil: '10/05/2026', usage: '85 / Unlimited', status: 'Active' },
  { id: 5, name: 'Winter Flash Sale', code: 'WINTER15', audience: 'Clients', offer: '15% Off Session', validUntil: '31/12/2025', usage: '450 / 500', status: 'Expired' },
];

const broadcastData: BroadcastRow[] = [
  { msg: 'System maintenance is scheduled for May 1st...', target: 'All', publish: '01/05/2026 02:00 AM', clear: '01/05/2026 04:00 AM', status: 'Active' },
  { msg: 'New TeleHealings App Version 2.1 is now available to download.', target: 'Clients', publish: '15/05/2026 10:00 AM', clear: '17/05/2026 10:00 AM', status: 'Scheduled' },
  { msg: "We're experiencing higher than normal video latency...", target: 'Therapists', publish: '12/04/2026 08:30 AM', clear: '12/04/2026 12:00 PM', status: 'Expired' },
];

// --- SVG Icons ---

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const audienceIcons: Record<string, React.ReactNode> = {
  All: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Clients: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Therapists: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

// --- Status Badge ---

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = status.toLowerCase();
  const cls =
    s === 'active'
      ? 'background:#dcfce7;color:#166534;'
      : s === 'scheduled'
        ? 'background:#e0f2fe;color:#1e40af;'
        : 'background:#f1f5f9;color:#475569;';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        ...parseStyle(cls),
      }}
    >
      {status}
    </span>
  );
};

// --- Helper ---

function parseStyle(s: string): React.CSSProperties {
  const obj: Record<string, string> = {};
  s.split(';').forEach((pair) => {
    const [k, v] = pair.split(':');
    if (k && v) obj[k.trim()] = v.trim();
  });
  return obj as React.CSSProperties;
}

// --- Main Page ---

const PromotionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'promotions' | 'broadcasts'>('promotions');
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Modal form state
  const [promoName, setPromoName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [discountOffer, setDiscountOffer] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Broadcast form state
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('All Users & Therapists');
  const [broadcastClearDate, setBroadcastClearDate] = useState('');

  const filteredPromos = promoData.filter(
    (p) =>
      searchText === '' ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.code.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: 12,
          paddingBottom: 0,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#0f172a',
            padding: '0 0 12px 0',
            position: 'relative',
          }}
        >
          Promotion &amp; Offers
          <span
            style={{
              position: 'absolute',
              bottom: -2,
              left: 0,
              right: 0,
              height: 3,
              background: '#0f172a',
              borderRadius: '2px 2px 0 0',
            }}
          />
        </div>
        <img
          src="/src/Heali-peak.png"
          alt="Mascot"
          style={{ height: 48, marginBottom: -1 }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </header>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('promotions')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '10px 4px',
            fontSize: 15,
            fontWeight: 600,
            color: activeTab === 'promotions' ? '#2563eb' : '#64748b',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          Promotions &amp; Offers
          {activeTab === 'promotions' && (
            <span
              style={{
                position: 'absolute',
                bottom: -1,
                left: 0,
                right: 0,
                height: 2,
                background: '#2563eb',
                borderRadius: '2px 2px 0 0',
              }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('broadcasts')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '10px 4px',
            fontSize: 15,
            fontWeight: 600,
            color: activeTab === 'broadcasts' ? '#2563eb' : '#64748b',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          System Broadcasts
          {activeTab === 'broadcasts' && (
            <span
              style={{
                position: 'absolute',
                bottom: -1,
                left: 0,
                right: 0,
                height: 2,
                background: '#2563eb',
                borderRadius: '2px 2px 0 0',
              }}
            />
          )}
        </button>
      </div>

      {/* ===== TAB: Promotions & Offers ===== */}
      {activeTab === 'promotions' && (
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 240 }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    display: 'flex',
                  }}
                >
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search promotions..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 38px',
                    borderRadius: 99,
                    border: '1px solid #cbd5e1',
                    background: 'transparent',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 99,
                  fontSize: 14,
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                <FilterIcon />
                Filters
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 99,
                  fontSize: 14,
                  fontWeight: 600,
                  border: '1px solid #2563eb',
                  background: '#2563eb',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <PlusIcon />
                New Promotion
              </button>
            </div>
          </div>

          {/* Promotions Table Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '24px 32px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '5%' }}>Sl No</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '25%' }}>Promotion Details</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '15%' }}>Target Audience</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '15%' }}>Offer / Discount</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '15%' }}>Valid Until</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '10%' }}>Usage</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '10%' }}>Status</th>
                  <th style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredPromos.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 0', color: '#64748b', fontSize: 14 }}>{item.id}</td>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{item.name}</div>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 13,
                          color: '#3b82f6',
                          background: '#eff6ff',
                          padding: '4px 8px',
                          borderRadius: 4,
                          display: 'inline-block',
                          marginTop: 4,
                        }}
                      >
                        {item.code}
                      </div>
                    </td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
                        {audienceIcons[item.audience] || null} {item.audience}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0', fontWeight: 500, color: '#0f172a', fontSize: 14 }}>{item.offer}</td>
                    <td style={{ padding: '16px 0', color: '#475569', fontSize: 14 }}>{item.validUntil}</td>
                    <td style={{ padding: '16px 0', color: '#475569', fontSize: 14 }}>{item.usage}</td>
                    <td style={{ padding: '16px 0' }}>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ padding: '16px 0', textAlign: 'center' }}>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: 8,
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MoreIcon />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPromos.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '24px 0', textAlign: 'center', color: '#64748b' }}>
                      No promotions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== TAB: System Broadcasts ===== */}
      {activeTab === 'broadcasts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Broadcast Message Editor Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Broadcast Message</div>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px 0' }}>
              Set a global banner message visible on the user or therapist dashboards.
            </p>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <textarea
                  rows={3}
                  placeholder="Enter broadcast message here..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    padding: 12,
                    fontFamily: 'inherit',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    padding: 10,
                    fontSize: 14,
                    outline: 'none',
                    background: 'white',
                    color: '#334155',
                    fontFamily: 'inherit',
                  }}
                >
                  <option>All Users &amp; Therapists</option>
                  <option>Clients Only</option>
                  <option>Therapists Only</option>
                </select>
                <input
                  type="datetime-local"
                  value={broadcastClearDate}
                  onChange={(e) => setBroadcastClearDate(e.target.value)}
                  title="Auto-clear date and time (optional)"
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    padding: 10,
                    fontSize: 14,
                    outline: 'none',
                    background: 'white',
                    color: '#334155',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 8,
                    border: 'none',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Publish Broadcast
                </button>
              </div>
            </div>

            {/* Current Live Broadcast */}
            <div
              style={{
                marginTop: 16,
                padding: '12px 16px',
                background: '#eff6ff',
                borderLeft: '4px solid #3b82f6',
                borderRadius: 4,
                fontSize: 13,
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <CheckCircleIcon />
              <div>
                <strong>Current Live Broadcast:</strong>{' '}
                &quot;System maintenance is scheduled for May 1st, 2:00 AM - 4:00 AM. Thank you for your patience.&quot;{' '}
                <span style={{ opacity: 0.8 }}>(Target: All Users)</span>
                <br />
                <span
                  style={{
                    fontSize: 11.5,
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  <ClockIcon /> Auto-clears on: 01/05/2026, 04:00 AM
                </span>
              </div>
              <button
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: '#1e40af',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Broadcast Schedule & History Table */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '24px 32px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Broadcast Schedule &amp; History</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '40%' }}>Message Snippet</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '15%' }}>Target Audience</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '15%' }}>Publish Date</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '15%' }}>Auto-Clear Date</th>
                  <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '10%' }}>Status</th>
                  <th style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {broadcastData.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 0', color: '#0f172a', fontWeight: 500, fontSize: 14 }}>{item.msg}</td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
                        {audienceIcons[item.target] || null} {item.target}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0', color: '#475569', fontSize: 14 }}>{item.publish}</td>
                    <td style={{ padding: '16px 0', color: '#475569', fontSize: 14 }}>{item.clear || '-'}</td>
                    <td style={{ padding: '16px 0' }}>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ padding: '16px 0', textAlign: 'center' }}>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: 8,
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MoreIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== New Promotion Modal ===== */}
      {showModal && (
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
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              width: 500,
              maxWidth: '90%',
              borderRadius: 16,
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
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#2563eb', display: 'flex' }}>
                  <TagIcon />
                </span>
                Create New Promotion
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: 4,
                  borderRadius: '50%',
                  display: 'flex',
                }}
              >
                <XIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Promotion Name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Wellness Campaign"
                  value={promoName}
                  onChange={(e) => setPromoName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#ffffff',
                    color: '#0f172a',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      color: '#0f172a',
                      textTransform: 'uppercase',
                    }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      color: '#0f172a',
                    }}
                  >
                    <option value="">Select...</option>
                    <option>All Users</option>
                    <option>Clients Only</option>
                    <option>Therapists Only</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Discount Offer</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% or \u20B9500"
                    value={discountOffer}
                    onChange={(e) => setDiscountOffer(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      color: '#0f172a',
                    }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Usage Limit</label>
                  <input
                    type="number"
                    placeholder="e.g. 500 (blank = unlimited)"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      color: '#0f172a',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Valid Until (Expiration Date)</label>
                <input
                  type="datetime-local"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#ffffff',
                    color: '#0f172a',
                  }}
                />
              </div>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
                * If the expiration date is set in the past, the system clock will instantly mark this code as Expired upon saving.
              </p>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                background: '#fafafa',
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 99,
                  fontSize: 14,
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 99,
                  fontSize: 14,
                  fontWeight: 600,
                  border: '1px solid #2563eb',
                  background: '#2563eb',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Schedule Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionPage;
