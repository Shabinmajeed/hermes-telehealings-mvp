import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '@/styles/globals.css';
import healiImg from 'shared/assets/Heali-peak.png';

const DashboardPage: React.FC = () => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const kpiData = [
    { icon: 'trending', value: '₹ 123 K', label: 'Total Sales', trend: '+8% from\nyesterday', trendDir: 'up' },
    { icon: 'check', value: '300', label: 'Completed Sessions', trend: '+5% from\nyesterday', trendDir: 'up' },
    { icon: 'cancel', value: '5', label: 'Session Cancellation', trend: '-1,2% from\nyesterday', trendDir: 'up' },
    { icon: 'user-add', value: '8', label: 'New Customers', trend: '-0.5% from\nyesterday', trendDir: 'down' },
  ];

  const icons: Record<string, React.ReactNode> = {
    trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>,
    cancel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    'user-add': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  };

  const barData = [
    { thisWeek: 55, lastWeek: 45 },
    { thisWeek: 70, lastWeek: 50 },
    { thisWeek: 25, lastWeek: 85 },
    { thisWeek: 60, lastWeek: 25 },
    { thisWeek: 45, lastWeek: 40 },
    { thisWeek: 65, lastWeek: 55 },
    { thisWeek: 85, lastWeek: 35 },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Sidebar />

      {/* Main Content */}
      <div className="page-shell">
        <div className="content-wrapper">

          {/* Header */}
          <header className="page-header">
            <div className="header-tab">Dashboard</div>
            <img src={healiImg} className="header-mascot" alt="Heali AI" />
          </header>

          {/* Row 1: Sales & Info */}
          <div className="row-1">
            <section className="card">
              <div className="sales-header">
                <div>
                  <h2 className="card-title">This Week's Sales</h2>
                  <p className="card-subtitle" style={{ margin: 0 }}>Weekly performance overview</p>
                </div>
                <button className="btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Generate Report
                </button>
              </div>

              <div className="kpi-grid">
                {kpiData.map((kpi, i) => (
                  <article key={i} className="kpi-card">
                    <div className="kpi-top">
                      <div className="kpi-icon">{icons[kpi.icon]}</div>
                      <div className={`kpi-trend ${kpi.trendDir}`}>{kpi.trend.split('\n').map((line, j) => <React.Fragment key={j}>{j > 0 && <br />}{line}</React.Fragment>)}</div>
                    </div>
                    <div className="kpi-value">{kpi.value}</div>
                    <div className="kpi-bottom">
                      <span className="kpi-label">{kpi.label}</span>
                      <span className={`kpi-arrow ${kpi.trendDir}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {kpi.trendDir === 'up' ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></> : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}
                        </svg>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="card info-panel">
              <div className="info-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M9 21h6"/></svg>
                Heali says
              </div>
              <p className="info-text">Wednesday is your peak revenue day. Launch a "Mid-Week Wellness" flash offer on Tuesday evenings targeting the "Others" user segment (the grey line in your User Insights). Converting just 10% of these visitors into active bookings could increase your weekly revenue by an estimated ₹12,000.</p>
            </aside>
          </div>

          {/* Row 2: Charts */}
          <div className="row-2">
            <section className="card">
              <h3 className="card-title">User Insights</h3>
              <div className="chart-container with-y-axis">
                <div className="y-axis"><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div>
                <div className="grid-lines">
                  {[0,1,2,3,4].map(i => <div key={i} className="grid-line" />)}
                </div>
                <svg viewBox="0 0 400 160" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
                  <path d="M0 60 C 50 20, 100 20, 150 100 C 200 150, 250 100, 300 60 C 350 20, 400 120, 400 120" fill="none" stroke="#60a5fa" strokeWidth="2"/>
                  <path d="M0 120 C 50 90, 100 140, 150 140 C 200 140, 250 20, 300 40 C 350 60, 400 140, 400 140" fill="none" stroke="#2563eb" strokeWidth="2"/>
                  <path d="M0 80 C 50 120, 100 160, 150 120 C 200 80, 250 40, 300 80 C 350 120, 400 100, 400 100" fill="none" stroke="#94a3b8" strokeWidth="2"/>
                  <line x1="230" y1="25" x2="230" y2="160" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3"/>
                  <circle cx="230" cy="25" r="4" fill="#ef4444"/>
                </svg>
              </div>
              <div className="x-axis">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Sept','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
              </div>
              <div className="legend">
                <span className="legend-item"><div className="legend-color" style={{ background: '#60a5fa' }}></div>Registered Users</span>
                <span className="legend-item"><div className="legend-color" style={{ background: '#2563eb' }}></div>New Users</span>
                <span className="legend-item"><div className="legend-color" style={{ background: '#94a3b8' }}></div>Others</span>
              </div>
            </section>

            <section className="card">
              <h3 className="card-title">Number of Bookings</h3>
              <div className="chart-container" style={{ marginBottom: 24 }}>
                <svg viewBox="0 0 300 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(37,99,235,0.2)"/><stop offset="100%" stopColor="rgba(37,99,235,0)"/></linearGradient>
                    <linearGradient id="gray-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(148,163,184,0.2)"/><stop offset="100%" stopColor="rgba(148,163,184,0)"/></linearGradient>
                  </defs>
                  <path d="M0 80 L 50 100 L 100 110 L 150 110 L 200 100 L 250 100 L 300 80 L 300 120 L 0 120 Z" fill="url(#gray-grad)"/>
                  <path d="M0 80 L 50 100 L 100 110 L 150 110 L 200 100 L 250 100 L 300 80" fill="none" stroke="#94a3b8" strokeWidth="2"/>
                  {[0,50,100,150,200,250,300].map((x, i) => <circle key={i} cx={x} cy={[80,100,110,110,100,100,80][i]} r="3" fill="#94a3b8"/>)}
                  <path d="M0 20 L 50 40 L 100 30 L 150 60 L 200 25 L 250 80 L 300 10 L 300 120 L 0 120 Z" fill="url(#blue-grad)"/>
                  <path d="M0 20 L 50 40 L 100 30 L 150 60 L 200 25 L 250 80 L 300 10" fill="none" stroke="#2563eb" strokeWidth="2"/>
                  {[0,50,100,150,200,250,300].map((x, i) => <circle key={i} cx={x} cy={[20,40,30,60,25,80,10][i]} r="3" fill="#2563eb"/>)}
                </svg>
              </div>
              <div className="bookings-legend">
                <div className="b-legend-box">
                  <div className="b-legend-title"><div className="b-legend-line"></div> Last Month</div>
                  <div className="b-legend-value">150</div>
                </div>
                <div className="b-legend-box">
                  <div className="b-legend-title"><div className="b-legend-line blue"></div> This Month</div>
                  <div className="b-legend-value" style={{ color: '#2563eb' }}>278</div>
                </div>
              </div>
            </section>
          </div>

          {/* Row 3: Bar Chart & Insights */}
          <div className="row-3">
            <section className="card">
              <h3 className="card-title">Total Revenue</h3>
              <div className="bar-chart-wrapper">
                <div className="y-axis"><span>25k</span><span>20k</span><span>15k</span><span>10k</span><span>5k</span><span>0</span></div>
                <div className="grid-lines">
                  {[0,1,2,3,4,5].map(i => <div key={i} className="grid-line" />)}
                </div>
                {barData.map((d, i) => (
                  <div key={i} className="bar-group">
                    <div className="bar this-week" style={{ height: `${d.thisWeek}%` }} />
                    <div className="bar last-week" style={{ height: `${d.lastWeek}%` }} />
                  </div>
                ))}
              </div>
              <div className="x-axis">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="legend">
                <span className="legend-item"><div className="legend-color" style={{ background: '#2563eb' }}></div>This Week</span>
                <span className="legend-item"><div className="legend-color" style={{ background: '#94a3b8', opacity: 0.5 }}></div>Last Week</span>
              </div>
            </section>

            <section className="card">
              <h3 className="card-title">Heali Insights</h3>
              <ul className="insights-list">
                <li className="priority-high">Churn Risk: 3 users who signed up in March (see "New Users" dip) haven't booked a second session. Action: Trigger "Reengagement Email" with a 10% discount code.</li>
                <li className="priority-low">Revenue Optimization: Wednesday's revenue peak (₹23k) is tied to the "Premium Wellness" package. Action: Feature this package on the homepage for the upcoming weekend.</li>
                <li className="priority-medium">Marketing ROI: The "Promotion & Offers" campaign from Monday resulted in an 8% lift in "New Customers." Follow-up: Extend the campaign for another 48 hours to capitalize on the trend.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Quick Actions Widget */}
      <div className="quick-actions-widget" tabIndex={0} onMouseEnter={() => setShowQuickActions(true)} onMouseLeave={() => setShowQuickActions(false)}>
        <button className="qa-trigger-btn" aria-label="Quick Actions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </button>
        {showQuickActions && (
          <div className="qa-menu">
            <div className="qa-menu-header">Quick Actions</div>
            <button className="qa-menu-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Add New Therapist
            </button>
            <button className="qa-menu-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Manual Session Override
            </button>
            <button className="qa-menu-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              Flagged Content Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
