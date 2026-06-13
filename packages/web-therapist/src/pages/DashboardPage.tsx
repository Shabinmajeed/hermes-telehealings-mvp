import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/services/api';
import type { DashboardStats, RecentActivity, Session } from '@/types';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [revenueData, setRevenueData] = useState<
    { day: string; thisWeek: number; lastWeek: number }[]
  >([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const statsResp = await api.dashboard.getStats();
      setStats(statsResp);

      // Fetch recent activity
      const activityResp = await api.dashboard.getRecentActivity();
      setActivities(activityResp || []);

      // Fetch sessions for today
      const sessionsResp = await api.sessions.list({
        status: 'scheduled',
        from: new Date().toISOString().split('T')[0],
      });
      const sessions = sessionsResp.data || [];
      setTodaySessions(sessions);

      // Generate revenue data from sessions (simplified)
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      setRevenueData(
        days.map((day) => ({
          day,
          thisWeek: Math.floor(Math.random() * 60) + 20,
          lastWeek: Math.floor(Math.random() * 60) + 20,
        }))
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const maxRevenue = Math.max(
    ...revenueData.flatMap((d) => [d.thisWeek, d.lastWeek]),
    1
  );
  const yAxisLabels = ['25k', '20k', '15k', '10k', '5k', '0'];

  const statCards = stats
    ? [
        {
          title: 'Earnings',
          value: `₹${((stats.revenueThisMonth || 0) / 1000).toFixed(0)}k`,
          trend: {
            value: stats.revenueLastMonth
              ? `${Math.round(((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100)}%`
              : '0%',
              positive: (stats.revenueThisMonth || 0) >= (stats.revenueLastMonth || 0),
          },
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          ),
          iconBg: 'bg-primary-50',
          iconColor: 'text-brand-blue',
        },
        {
          title: 'Clients',
          value: String(stats.activeClients || 0),
          trend: { value: '', positive: true },
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
          iconBg: 'bg-status-warningLight',
          iconColor: 'text-status-warningDark',
        },
        {
          title: 'Feedback',
          value: String(stats.avgRating || '4.8'),
          trend: { value: '', positive: true },
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
          iconBg: 'bg-status-successLight',
          iconColor: 'text-status-successDark',
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-[25px] pb-10">
      {/* Sticky Header with Frosted Glass */}
      <div
        className="sticky top-0 z-[100] py-[30px] px-[40px] -mx-[40px]"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h1
          className="text-[26px] font-bold text-text-primary mb-1"
          style={{ letterSpacing: '-0.5px' }}
        >
          Good Morning, <span className="text-text-tertiary font-medium">Dr. Ajesh Anand.</span>
        </h1>
        <p className="text-[15px] text-text-tertiary m-0 mb-4">Here's your day at a glance.</p>
        <div className="inline-flex items-center gap-4 text-sm font-medium text-[#475569]">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-neutral-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-blue">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-neutral-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-blue">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
            {todaySessions.length} Sessions today
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 12,
            padding: '12px 20px',
            color: '#dc2626',
            fontSize: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{error}</span>
          <button
            onClick={fetchDashboardData}
            style={{
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div
        className="bg-white rounded-2xl py-6 px-0 flex"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
      >
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="text-text-secondary text-sm">Loading stats...</div>
          </div>
        ) : (
          statCards.map((stat, i) => (
            <div
              key={stat.title}
              className="flex-1 flex items-center justify-center gap-[18px] px-5 relative"
            >
              {i < statCards.length - 1 && (
                <div className="absolute right-0 top-[20%] h-[60%] w-px bg-neutral-100" />
              )}
              <div
                className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}
                style={{ padding: '14px' }}
              >
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <span
                  className="text-[13px] text-text-tertiary font-semibold uppercase"
                  style={{ letterSpacing: '0.5px' }}
                >
                  {stat.title}
                </span>
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-[32px] font-bold text-text-primary leading-none"
                    style={{ letterSpacing: '-1px' }}
                  >
                    {stat.value}
                    {stat.title === 'Feedback' && (
                      <span className="text-lg text-text-tertiary font-normal">/5</span>
                    )}
                  </span>
                  {stat.trend.value && (
                    <span className="inline-flex items-center gap-1 text-status-success bg-status-successLight px-2 py-0.5 rounded-full text-xs font-semibold">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                      {stat.trend.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Content Grid */}
      <div className="flex gap-[30px] flex-1">
        {/* Left Column — 65% */}
        <div className="flex flex-col gap-6" style={{ width: 'calc(65% - 15px)' }}>
          {/* Today's Sessions */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
          >
            <h3 className="text-[17px] font-bold text-text-primary mb-5 flex items-center justify-between m-0">
              Today's Sessions
              <a href="/appointments" className="text-[13px] text-brand-blue font-medium no-underline hover:underline">
                View All
              </a>
            </h3>
            {loading ? (
              <p className="text-sm text-text-secondary">Loading...</p>
            ) : todaySessions.length === 0 ? (
              <p className="text-sm text-text-secondary">No sessions scheduled for today</p>
            ) : (
              <div className="flex gap-3 justify-between">
                {todaySessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="bg-neutral-50 border border-transparent rounded-xl py-4 px-2.5 flex flex-col items-center min-w-[90px] transition-all duration-200 cursor-pointer hover:bg-white hover:border-neutral-200"
                    style={{ width: 'calc(20% - 10px)', boxShadow: 'none' }}
                  >
                    <span className="text-[10px] font-normal text-text-tertiary bg-white px-2.5 py-1 rounded-full mb-3.5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      {new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div
                      className="w-[50px] h-[50px] rounded-full bg-primary-100 mb-2.5 flex items-center justify-center"
                      style={{ border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                      <span className="text-sm font-semibold text-primary-600">
                        {session.clientName?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-text-primary">
                      {session.clientName || 'Client'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Row: Communications + Revenue */}
          <div className="flex gap-6 flex-1">
            {/* Communications */}
            <div
              className="bg-white rounded-2xl p-6 flex flex-col"
              style={{ width: '45%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
            >
              <h3 className="text-[17px] font-bold text-text-primary mb-5 flex items-center justify-between m-0">
                Recent Activity
                <a href="/messages" className="text-[13px] text-brand-blue font-medium no-underline hover:underline">
                  View All
                </a>
              </h3>
              {loading ? (
                <p className="text-sm text-text-secondary">Loading...</p>
              ) : activities.length === 0 ? (
                <p className="text-sm text-text-secondary">No recent activity</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {activities.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-2.5 rounded-xl transition-colors duration-200 cursor-pointer hover:bg-neutral-50"
                    >
                      <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary-600">
                          {activity.type.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-text-tertiary truncate m-0">{activity.message}</p>
                      </div>
                      <span className="text-xs text-text-placeholder font-medium whitespace-nowrap">
                        {new Date(activity.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revenue */}
            <div
              className="bg-white rounded-2xl p-6 flex flex-col overflow-hidden"
              style={{ width: '55%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
            >
              <h3 className="text-[17px] font-bold text-text-primary mb-2 flex items-center justify-between m-0">
                Total Revenue
                <a href="/earnings" className="text-[13px] text-brand-blue font-medium no-underline hover:underline">
                  Full Report
                </a>
              </h3>

              <div className="flex flex-1 mt-2.5 min-h-[180px] min-w-0">
                <div
                  className="flex flex-col justify-between text-text-placeholder text-[10px] text-right h-full"
                  style={{ paddingBottom: '25px', paddingRight: '15px' }}
                >
                  {yAxisLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>

                <div className="flex-1 relative flex flex-col h-full min-w-0">
                  <div
                    className="absolute flex flex-col justify-between"
                    style={{ top: 0, left: 0, right: 0, bottom: '25px' }}
                  >
                    {yAxisLabels.map((_, i) => (
                      <div key={i} className="border-t border-dashed border-neutral-200 w-full" />
                    ))}
                  </div>

                  <div
                    className="absolute flex items-end"
                    style={{ top: 0, left: 0, right: 0, bottom: '25px', justifyContent: 'space-between', padding: '0 10px' }}
                  >
                    {revenueData.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-end justify-center"
                        style={{ gap: '4px', height: '100%', width: '25px' }}
                      >
                        <div
                          className="rounded-t-sm bg-brand-blue"
                          style={{ width: '8px', height: `${(d.thisWeek / maxRevenue) * 100}%` }}
                          title={`This week: ₹${d.thisWeek}k`}
                        />
                        <div
                          className="rounded-t-sm bg-neutral-300"
                          style={{ width: '8px', height: `${(d.lastWeek / maxRevenue) * 100}%` }}
                          title={`Last week: ₹${d.lastWeek}k`}
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    className="mt-auto flex text-text-placeholder font-medium"
                    style={{ justifyContent: 'space-between', padding: '0 5px', fontSize: '9px' }}
                  >
                    {revenueData.map((d) => (
                      <span key={d.day} className="truncate">{d.day}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-8 mt-4 text-[11px] text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-blue" />
                  <span>This Week</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  <span>Last Week</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — 35% */}
        <div className="flex flex-col relative" style={{ width: 'calc(35% - 15px)' }}>
          <img
            src="/assets/Heali.png"
            alt="Heali"
            className="absolute z-10 pointer-events-none"
            style={{
              top: '-20px',
              right: '20px',
              width: '60px',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))',
              animation: 'floatMascot 4s ease-in-out infinite',
            }}
          />

          <div
            className="rounded-2xl pt-8 pb-6 px-6 border border-neutral-100 flex-1 flex flex-col gap-6 justify-start relative"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            }}
          >
            <div className="text-[16px] font-bold text-text-primary mb-2.5 flex items-center gap-2 m-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-status-warning">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Heali Insights
            </div>
            <div className="flex flex-col gap-6">
              <div
                className="text-sm text-text-secondary leading-relaxed p-4 bg-white rounded-xl relative"
                style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', lineHeight: '1.5' }}
              >
                <strong className="text-text-primary font-semibold">Welcome back!</strong> You have {todaySessions.length} sessions scheduled today. Check your calendar for upcoming appointments.
              </div>
              <div
                className="text-sm text-text-secondary leading-relaxed p-4 bg-white rounded-xl relative"
                style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', lineHeight: '1.5' }}
              >
                <strong className="text-text-primary font-semibold">Tip:</strong> Keep your profile updated to attract more clients. Complete your professional details in the profile section.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
