import React, { useState } from 'react';

// ── SVG Icons ────────────────────────────────────────────────────────────────

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconActivity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconReport = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconTrendUp = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconTrendDown = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconPulse = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// ── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  trendDirection: 'up' | 'down';
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, value, label, trend, trendDirection }) => (
  <article style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.01)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'flex-start' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: '#eff6ff', color: '#2563eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, textAlign: 'right',
        display: 'flex', alignItems: 'center', gap: 4,
        color: trendDirection === 'up' ? '#16a34a' : '#dc2626',
      }}>
        {trendDirection === 'up' ? <IconTrendUp /> : <IconTrendDown />}
        {trend}
      </div>
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
  </article>
);

// ── Platform Traffic Chart (SVG) ────────────────────────────────────────────

const PlatformTrafficChart: React.FC = () => (
  <div style={{ position: 'relative', height: 220, marginBottom: 12, marginLeft: 30, width: 'calc(100% - 30px)' }}>
    {/* Y Axis */}
    <div style={{
      position: 'absolute', left: -35, top: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontSize: 11, color: '#94a3b8',
    }}>
      <span>1.5K</span>
      <span>1.0K</span>
      <span>500</span>
      <span>250</span>
      <span>0</span>
    </div>
    {/* Grid lines */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0,
    }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ width: '100%', height: 1, background: '#f1f5f9' }} />
      ))}
    </div>
    {/* SVG Chart */}
    <svg viewBox="0 0 600 220" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
      <defs>
        <linearGradient id="blue-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(37,99,235,0.2)" />
          <stop offset="100%" stopColor="rgba(37,99,235,0)" />
        </linearGradient>
      </defs>
      {/* Area */}
      <path d="M0 160 C 50 120, 100 180, 150 100 C 200 60, 250 120, 300 80 C 350 40, 400 90, 450 50 C 500 20, 550 60, 600 30 L 600 220 L 0 220 Z" fill="url(#blue-area)" />
      {/* Primary Line */}
      <path d="M0 160 C 50 120, 100 180, 150 100 C 200 60, 250 120, 300 80 C 350 40, 400 90, 450 50 C 500 20, 550 60, 600 30" fill="none" stroke="#2563eb" strokeWidth="3" />
      {/* Secondary Line */}
      <path d="M0 190 C 50 170, 100 200, 150 150 C 200 120, 250 160, 300 130 C 350 110, 400 150, 450 110 C 500 80, 550 120, 600 90" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
      {/* Highlight Marker */}
      <line x1="450" y1="50" x2="450" y2="220" stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
      <circle cx="450" cy="50" r="4" fill="#0f172a" />
    </svg>
  </div>
);

// ── Top Devices Bars ────────────────────────────────────────────────────────

interface DeviceBarProps {
  label: string;
  percent: number;
  color: string;
}

const DeviceBar: React.FC<DeviceBarProps> = ({ label, percent, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
      <span>{label}</span>
      <span>{percent}%</span>
    </div>
    <div style={{ width: '100%', background: '#f1f5f9', height: 6, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', background: color, borderRadius: 99, width: `${percent}%` }} />
    </div>
  </div>
);

// ── Data ────────────────────────────────────────────────────────────────────

const topUserEvents = [
  { name: 'session_booked', category: 'Scheduling', trend: '+12.4%', trendColor: '#16a34a' },
  { name: 'video_played', category: 'Engagement', trend: '+8.1%', trendColor: '#16a34a' },
  { name: 'login_success', category: 'Auth', trend: '+0.2%', trendColor: '#64748b' },
  { name: 'chat_sent', category: 'Comms', trend: '-3.5%', trendColor: '#dc2626' },
  { name: 'therapist_profile_viewed', category: 'Discovery', trend: '+15.8%', trendColor: '#16a34a' },
];

const topContentAssets = [
  { title: 'Morning Yoga Routine', type: 'Video', completion: '88%', rating: '★ 4.9', ratingColor: '#f59e0b' },
  { title: 'Meditation for Deep Sleep', type: 'Audio', completion: '92%', rating: '★ 4.9', ratingColor: '#f59e0b' },
  { title: 'Box Breathing Tool', type: 'Interactive', completion: '65%', rating: '★ 4.5', ratingColor: '#f59e0b' },
  { title: 'Understanding Anxiety', type: 'Article', completion: '78%', rating: '★ 4.8', ratingColor: '#f59e0b' },
  { title: 'Managing Workplace Stress', type: 'Article', completion: '45%', rating: '★ 4.1', ratingColor: '#94a3b8' },
];

// ── Event Log Modal ─────────────────────────────────────────────────────────

interface EventLogModalProps {
  isOpen: boolean;
  eventName: string;
  onClose: () => void;
}

const EventLogModal: React.FC<EventLogModalProps> = ({ isOpen, eventName, onClose }) => {
  if (!isOpen) return null;

  const sources = ['Summer Promo', 'Organic Search', 'Email Newsletter', 'Direct', 'In-App Banner'];
  const devices = ['iOS App', 'Android App', 'Web Chrome', 'Web Safari'];

  const logs = Array.from({ length: 5 }, () => ({
    time: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toLocaleString(),
    userId: `USR-${Math.floor(Math.random() * 9000) + 1000}`,
    device: devices[Math.floor(Math.random() * devices.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
  }));

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#ffffff', width: 650, maxWidth: '90%', borderRadius: 16,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#f8fafc',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#2563eb' }}><IconPulse /></span>
            Detailed Event Logs
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4, borderRadius: '50%', display: 'flex' }}
          >
            <IconClose />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 400, overflowY: 'auto' }}>
          <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
            Showing recent log breakouts for:{' '}
            <strong style={{ color: '#0f172a', fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
              {eventName}
            </strong>
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '30%' }}>Timestamp</th>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }}>User / ID</th>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%' }}>Device</th>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }}>Source Campaign</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0', fontSize: 12, color: '#64748b' }}>{log.time}</td>
                  <td style={{ padding: '14px 0', fontSize: 13, fontWeight: 500 }}>{log.userId}</td>
                  <td style={{ padding: '14px 0', fontSize: 12, color: '#475569' }}>{log.device}</td>
                  <td style={{ padding: '14px 0', fontSize: 12, color: '#2563eb', fontWeight: 500 }}>{log.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#fafafa',
        }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99,
              fontSize: 14, fontWeight: 600, cursor: pointer,
              border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155',
            }}
          >
            Close
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99,
            fontSize: 14, fontWeight: 600, cursor: pointer,
            border: '1px solid #2563eb', background: '#2563eb', color: '#ffffff',
          }}>
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Pill Button ─────────────────────────────────────────────────────────────

interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'outline' | 'primary';
  onClick?: () => void;
}

const PillButton: React.FC<PillButtonProps> = ({ children, variant = 'outline', onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 20px', borderRadius: 99,
      fontSize: 14, fontWeight: 600, cursor: pointer,
      border: variant === 'primary' ? '1px solid #2563eb' : '1px solid #cbd5e1',
      background: variant === 'primary' ? '#2563eb' : '#ffffff',
      color: variant === 'primary' ? '#ffffff' : '#334155',
    }}
  >
    {children}
  </button>
);

// ── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  titleAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, titleAction }) => (
  <section style={{
    background: '#ffffff', borderRadius: 16, padding: 24,
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
    display: 'flex', flexDirection: 'column',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  }}>
    <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {title}
      {titleAction}
    </div>
    {subtitle && <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px 0' }}>{subtitle}</p>}
    {children}
  </section>
);

// ── Main Page ───────────────────────────────────────────────────────────────

const AnalyticsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEventName, setModalEventName] = useState('');

  const openEventModal = (eventName: string) => {
    setModalEventName(eventName);
    setModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>
      {/* Page Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderBottom: '2px solid #e2e8f0', marginBottom: 12, paddingBottom: 0,
      }}>
        <div style={{
          fontSize: 20, fontWeight: 700, color: '#0f172a',
          padding: '0 0 12px 0', position: 'relative',
        }}>
          Analytics & Reporting
          <div style={{
            position: 'absolute', bottom: -2, left: 0, right: 0,
            height: 3, background: '#0f172a', borderRadius: '2px 2px 0 0',
          }} />
        </div>
        <img
          src="/src/Heali-peak.png"
          alt="Mascot"
          style={{ height: 48, marginBottom: -1 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </header>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <PillButton variant="outline">
            <IconCalendar />
            Last 30 Days
          </PillButton>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <PillButton variant="outline">
            <IconDownload />
            Export Report
          </PillButton>
          <PillButton variant="primary">
            <IconReport />
            Custom Report
          </PillButton>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <KpiCard icon={<IconUsers />} value="14.2K" label="Active Users" trend="12.5%" trendDirection="up" />
        <KpiCard icon={<IconUser />} value="284" label="Active Therapists" trend="4.2%" trendDirection="up" />
        <KpiCard icon={<IconClock />} value="6m 14s" label="Avg Session Duration" trend="8.1%" trendDirection="up" />
        <KpiCard icon={<IconActivity />} value="42.8%" label="App Bounce Rate" trend="2.4%" trendDirection="down" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Platform Traffic Chart */}
        <Card title="Platform Traffic Over Time" subtitle="Daily active users engaging with the web and mobile apps.">
          <PlatformTrafficChart />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 16, paddingLeft: 30 }}>
            <span>Apr 01</span>
            <span>Apr 05</span>
            <span>Apr 10</span>
            <span>Apr 15</span>
            <span>Apr 20</span>
            <span>Apr 25</span>
            <span>Apr 30</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: '#2563eb' }} />
              Mobile App Users
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: '#94a3b8' }} />
              Web Platform Users
            </div>
          </div>
        </Card>

        {/* Top Devices */}
        <Card title="Top Devices" subtitle="Where your users access Telehealings.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
            <DeviceBar label="Apple iOS" percent={54} color="#2563eb" />
            <DeviceBar label="Android" percent={32} color="#10b981" />
            <DeviceBar label="Desktop Web" percent={14} color="#8b5cf6" />
          </div>
        </Card>
      </div>

      {/* Analytics Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 20 }}>
        {/* Top User Events */}
        <Card
          title="Top User Events"
          titleAction={
            <button style={{
              border: 'none', padding: '4px 8px', fontSize: 13,
              background: 'transparent', cursor: 'pointer', color: '#64748b',
            }}>
              View All →
            </button>
          }
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '40%' }}>Event Name</th>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '30%' }}>Category</th>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '30%' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {topUserEvents.map((event) => (
                <tr key={event.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0', fontSize: 14, color: '#334155' }}>
                    <button
                      onClick={() => openEventModal(event.name)}
                      style={{
                        color: '#2563eb', cursor: 'pointer', fontWeight: 600,
                        textDecoration: 'underline', textDecorationColor: 'transparent',
                        background: 'transparent', border: 'none', padding: 0, fontSize: 14,
                      }}
                    >
                      {event.name}
                    </button>
                  </td>
                  <td style={{ padding: '14px 0', fontSize: 14, color: '#334155' }}>{event.category}</td>
                  <td style={{ padding: '14px 0', fontSize: 14, fontWeight: 600, color: event.trendColor }}>{event.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Top Content Assets */}
        <Card
          title="Top Content Assets"
          titleAction={
            <button style={{
              border: 'none', padding: '4px 8px', fontSize: 13,
              background: 'transparent', cursor: 'pointer', color: '#64748b',
            }}>
              View Library →
            </button>
          }
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '45%' }}>Content Title</th>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '15%' }}>Type</th>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%' }}>Completion</th>
                <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', paddingBottom: 12, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {topContentAssets.map((content) => (
                <tr key={content.title} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{content.title}</td>
                  <td style={{ padding: '14px 0', fontSize: 12, color: '#64748b' }}>{content.type}</td>
                  <td style={{ padding: '14px 0', fontSize: 14, fontWeight: 600, color: '#334155' }}>{content.completion}</td>
                  <td style={{ padding: '14px 0', fontSize: 13, fontWeight: 600, color: content.ratingColor }}>{content.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Event Log Modal */}
      <EventLogModal
        isOpen={modalOpen}
        eventName={modalEventName}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AnalyticsPage;
