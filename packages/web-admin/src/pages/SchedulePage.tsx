import React, { useState, useMemo } from 'react';

type SessionStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
type ViewMode = 'list' | 'calendar';
type TabFilter = 'all' | 'ongoing' | 'upcoming' | 'completed' | 'cancelled';

interface SessionData {
  id: string;
  clientName: string;
  clientEmail: string;
  clientAvatar: string;
  therapistName: string;
  therapistSpecialization: string;
  therapistAvatar: string;
  date: string;
  time: string;
  duration: string;
  status: SessionStatus;
}

const sessionsData: SessionData[] = [
  {
    id: 'S-100',
    clientName: 'Mike Wheeler',
    clientEmail: 'mikewheel@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=mike',
    therapistName: 'Dr. Ajesh Anand',
    therapistSpecialization: 'Clinical Psychologist',
    therapistAvatar: 'https://i.pravatar.cc/150?u=ajesh',
    date: 'Today',
    time: 'Right Now',
    duration: '60 Mins',
    status: 'Ongoing',
  },
  {
    id: 'S-101',
    clientName: 'Nathaniel Jacob',
    clientEmail: 'nathanieljacob@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=nathaniel',
    therapistName: 'Dr. Sarah Smith',
    therapistSpecialization: 'Behavioral Therapist',
    therapistAvatar: 'https://i.pravatar.cc/150?u=sarah',
    date: '25/04/2026',
    time: '10:00 AM',
    duration: '45 Mins',
    status: 'Upcoming',
  },
  {
    id: 'S-102',
    clientName: 'Nancy Wheeler',
    clientEmail: 'nancywheeler@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=nancy',
    therapistName: 'Dr. Ajesh Anand',
    therapistSpecialization: 'Clinical Psychologist',
    therapistAvatar: 'https://i.pravatar.cc/150?u=ajesh',
    date: '25/04/2026',
    time: '11:30 AM',
    duration: '60 Mins',
    status: 'Upcoming',
  },
  {
    id: 'S-103',
    clientName: 'Victor Martinez',
    clientEmail: 'victormartinez@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=victor',
    therapistName: 'Dr. Emily Chen',
    therapistSpecialization: 'Marriage Counselor',
    therapistAvatar: 'https://i.pravatar.cc/150?u=emily',
    date: '24/04/2026',
    time: '02:00 PM',
    duration: '45 Mins',
    status: 'Completed',
  },
  {
    id: 'S-104',
    clientName: 'Jane Hopper',
    clientEmail: 'janehopper@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=jane',
    therapistName: 'Dr. Sarah Smith',
    therapistSpecialization: 'Behavioral Therapist',
    therapistAvatar: 'https://i.pravatar.cc/150?u=sarah',
    date: '24/04/2026',
    time: '04:15 PM',
    duration: '30 Mins',
    status: 'Cancelled',
  },
  {
    id: 'S-105',
    clientName: 'Will Byers',
    clientEmail: 'willbyers@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=will',
    therapistName: 'Dr. Marcus Reed',
    therapistSpecialization: 'Child Psychologist',
    therapistAvatar: 'https://i.pravatar.cc/150?u=marcus',
    date: '23/04/2026',
    time: '09:00 AM',
    duration: '60 Mins',
    status: 'Completed',
  },
  {
    id: 'S-106',
    clientName: 'Bethany Kay',
    clientEmail: 'bethanykay@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=bethany',
    therapistName: 'Dr. Ajesh Anand',
    therapistSpecialization: 'Clinical Psychologist',
    therapistAvatar: 'https://i.pravatar.cc/150?u=ajesh',
    date: '23/04/2026',
    time: '11:00 AM',
    duration: '45 Mins',
    status: 'Completed',
  },
  {
    id: 'S-107',
    clientName: 'Max Mayfield',
    clientEmail: 'maxmayfield@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=max',
    therapistName: 'Dr. David Kim',
    therapistSpecialization: 'Addiction Counselor',
    therapistAvatar: 'https://i.pravatar.cc/150?u=david',
    date: '22/04/2026',
    time: '01:30 PM',
    duration: '60 Mins',
    status: 'Completed',
  },
  {
    id: 'S-108',
    clientName: 'Mike Wheeler',
    clientEmail: 'mikewheel@gmail.com',
    clientAvatar: 'https://i.pravatar.cc/150?u=mike',
    therapistName: 'Dr. Sophia Patel',
    therapistSpecialization: 'Behavioral Therapist',
    therapistAvatar: 'https://i.pravatar.cc/150?u=sophia',
    date: '22/04/2026',
    time: '03:00 PM',
    duration: '45 Mins',
    status: 'Cancelled',
  },
];

const perPage = 8;

const statusColorMap: Record<string, { bg: string; text: string }> = {
  Upcoming: { bg: '#e0f2fe', text: '#1e40af' },
  Ongoing: { bg: '#fef08a', text: '#854d0e' },
  Completed: { bg: '#dcfce7', text: '#166534' },
  Cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

const SchedulePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return sessionsData.filter((s) => {
      const matchesTab =
        activeTab === 'all' ||
        s.status.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const ongoingCount = sessionsData.filter((s) => s.status === 'Ongoing').length;

  const tabs: { key: TabFilter; label: string; badge?: number }[] = [
    { key: 'all', label: 'All Sessions' },
    { key: 'ongoing', label: 'Ongoing', badge: ongoingCount },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Past / Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const tabLabel =
    tabs.find((t) => t.key === activeTab)?.label || 'All Sessions';

  // Calendar data
  const calDays = [
    { label: 'Mon 20', top: 60, height: 120, bg: '#fef9c3', border: '#fef08a', text: '#854d0e', title: 'Moderate Demand', detail: '45/90 Slots Booked' },
    { label: 'Tue 21', top: 0, height: 180, bg: '#fee2e2', border: '#fecaca', text: '#991b1b', title: 'Peak Demand', detail: '88/90 Slots Booked' },
    { label: 'Wed 22', top: 180, height: 120, bg: '#dcfce7', border: '#bbf7d0', text: '#166534', title: 'Low Demand', detail: '15/90 Slots Booked' },
    { label: 'Thu 23', top1: 120, height1: 60, bg1: '#fef9c3', border1: '#fef08a', text1: '#854d0e', title1: 'Moderate Demand', detail1: '50/90 Slots Booked', top2: 300, height2: 120, bg2: '#fee2e2', border2: '#fecaca', text2: '#991b1b', title2: 'Peak Demand', detail2: '85/90 Slots Booked' },
    { label: 'Fri 24', top: 60, height: 240, bg: '#fee2e2', border: '#fecaca', text: '#991b1b', title: 'Peak Demand', detail: '89/90 Slots Booked' },
    { label: 'Sat 25', top: 60, height: 180, bg: '#dcfce7', border: '#bbf7d0', text: '#166534', title: 'Low Demand', detail: '20/90 Slots Booked' },
    { label: 'Sun 26', top: 120, height: 240, bg: '#dcfce7', border: '#bbf7d0', text: '#166534', title: 'Low Demand', detail: '10/90 Slots Booked' },
  ];

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  return (
    <div className="flex flex-col" style={{ gap: '20px', padding: 0 }}>
      {/* Page Header */}
      <div
        className="flex items-end justify-between"
        style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '12px', paddingBottom: 0 }}
      >
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
            padding: '0 0 12px 0',
            position: 'relative',
          }}
        >
          Sessions & Schedule
          <span
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
        </h1>
        <img
          src="/assets/Heali.png"
          alt="Heali"
          style={{ height: '48px', marginBottom: '-1px' }}
        />
      </div>

      {/* Tabs Navigation */}
      <div
        className="flex"
        style={{ gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}
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
            {tab.badge !== undefined && (
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

      {/* Toolbar */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: '10px' }}
      >
        <div className="flex items-center" style={{ gap: '16px' }}>
          <div style={{ fontSize: '16px', color: '#475569' }}>
            <strong style={{ color: '#0f172a', fontWeight: 700 }}>{tabLabel}</strong>{' '}
            <strong style={{ color: '#0f172a', fontWeight: 700 }}>{filtered.length}</strong>
          </div>
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
              placeholder="Search sessions..."
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
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
          </div>
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
              transition: 'all 0.2s',
              border: '1px solid #0f172a',
              background: 'transparent',
              color: '#0f172a',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
          </button>
        </div>
        <div className="flex items-center" style={{ gap: '16px' }}>
          {/* View Toggle */}
          <div
            style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}
          >
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#ffffff' : 'transparent',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: viewMode === 'list' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                background: viewMode === 'calendar' ? '#ffffff' : 'transparent',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: viewMode === 'calendar' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Calendar
            </button>
          </div>
          {/* Export CSV */}
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
              transition: 'all 0.2s',
              border: '1px solid #0f172a',
              background: 'transparent',
              color: '#0f172a',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Export CSV
          </button>
          {/* New Session */}
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
              transition: 'all 0.2s',
              border: '1px solid #2563eb',
              background: '#2563eb',
              color: '#ffffff',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Session
          </button>
        </div>
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
        {/* List View */}
        {viewMode === 'list' && (
          <div className="flex flex-col" style={{ gap: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748b',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9',
                      width: '5%',
                    }}
                  >
                    Sl No
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748b',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9',
                      width: '22%',
                    }}
                  >
                    Client
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748b',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9',
                      width: '22%',
                    }}
                  >
                    Therapist
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748b',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9',
                      width: '18%',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Date & Time
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748b',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9',
                      width: '12%',
                    }}
                  >
                    Duration
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748b',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9',
                      width: '15%',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748b',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9',
                      width: '6%',
                    }}
                  />
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: 'center', color: '#64748b', padding: '48px 0' }}
                    >
                      No sessions found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((session) => {
                    const sc = statusColorMap[session.status] || { bg: '#f1f5f9', text: '#475569' };
                    return (
                      <tr key={session.id}>
                        <td
                          style={{
                            padding: '16px 0',
                            borderBottom: '1px solid #f1f5f9',
                            fontSize: '14px',
                            color: '#64748b',
                          }}
                        >
                          {session.id}
                        </td>
                        <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={session.clientAvatar}
                              alt={session.clientName}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                background: '#f1f5f9',
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span
                                style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}
                              >
                                {session.clientName}
                              </span>
                              <span
                                style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}
                              >
                                {session.clientEmail}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={session.therapistAvatar}
                              alt={session.therapistName}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                background: '#f1f5f9',
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span
                                style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}
                              >
                                {session.therapistName}
                              </span>
                              <span
                                style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}
                              >
                                {session.therapistSpecialization}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <div>
                            <span style={{ fontSize: '14px', color: '#334155' }}>
                              {session.date}
                            </span>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '11px',
                                color: '#94a3b8',
                                marginTop: '4px',
                              }}
                            >
                              {session.time}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px 0',
                            borderBottom: '1px solid #f1f5f9',
                            fontSize: '14px',
                            color: '#334155',
                          }}
                        >
                          {session.duration}
                        </td>
                        <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '99px',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: sc.bg,
                              color: sc.text,
                            }}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '16px 0',
                            borderBottom: '1px solid #f1f5f9',
                            textAlign: 'center',
                          }}
                        >
                          <button
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: '50%',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
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
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                        transition: 'all 0.2s',
                      }}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="flex flex-col" style={{ gap: '16px' }}>
            {/* Calendar Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                Weekly Capacity: Apr 20 - Apr 26
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    border: '1px solid #0f172a',
                    background: 'transparent',
                    color: '#0f172a',
                    borderRadius: '99px',
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  style={{
                    border: '1px solid #0f172a',
                    background: 'transparent',
                    color: '#0f172a',
                    borderRadius: '99px',
                    padding: '6px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Today
                </button>
                <button
                  style={{
                    border: '1px solid #0f172a',
                    background: 'transparent',
                    color: '#0f172a',
                    borderRadius: '99px',
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px repeat(7, 1fr)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: '#ffffff',
                overflow: 'hidden',
              }}
            >
              {/* Header row - Time */}
              <div
                style={{
                  padding: '12px',
                  background: '#f8fafc',
                  textAlign: 'center',
                  borderBottom: '1px solid #e2e8f0',
                  borderRight: '1px solid #e2e8f0',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                }}
              >
                Time
              </div>
              {/* Header row - Days */}
              {calDays.map((day) => (
                <div
                  key={day.label}
                  style={{
                    padding: '12px',
                    background: '#f8fafc',
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    borderRight: '1px solid #e2e8f0',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                  }}
                >
                  {day.label}
                </div>
              ))}

              {/* Time column */}
              <div style={{ background: '#f8fafc', position: 'relative' }}>
                {timeSlots.map((t) => (
                  <div
                    key={t}
                    style={{
                      height: '60px',
                      padding: '8px 12px',
                      textAlign: 'right',
                      fontSize: '11px',
                      color: '#94a3b8',
                      fontWeight: 500,
                      borderBottom: '1px dashed #e2e8f0',
                      boxSizing: 'border-box',
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {calDays.map((day) => (
                <div
                  key={day.label}
                  style={{
                    borderRight: '1px solid #e2e8f0',
                    position: 'relative',
                  }}
                >
                  {timeSlots.map((t) => (
                    <div
                      key={t}
                      style={{
                        height: '60px',
                        borderBottom: '1px dashed #e2e8f0',
                        boxSizing: 'border-box',
                      }}
                    />
                  ))}
                  {/* Single event */}
                  {day.top !== undefined && day.title && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '4px',
                        right: '4px',
                        top: `${day.top}px`,
                        height: `${day.height}px`,
                        borderRadius: '6px',
                        padding: '8px',
                        fontSize: '11px',
                        fontWeight: 500,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        zIndex: 2,
                        transition: 'transform 0.2s',
                        background: day.bg,
                        border: `1px solid ${day.border}`,
                        color: day.text,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '12px' }}>
                        {day.title}
                      </span>
                      <span>{day.detail}</span>
                    </div>
                  )}
                  {/* Two events (Thu) */}
                  {day.top1 !== undefined && (
                    <>
                      <div
                        style={{
                          position: 'absolute',
                          left: '4px',
                          right: '4px',
                          top: `${day.top1}px`,
                          height: `${day.height1}px`,
                          borderRadius: '6px',
                          padding: '8px',
                          fontSize: '11px',
                          fontWeight: 500,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          zIndex: 2,
                          background: day.bg1,
                          border: `1px solid ${day.border1}`,
                          color: day.text1,
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '12px' }}>
                          {day.title1}
                        </span>
                        <span>{day.detail1}</span>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          left: '4px',
                          right: '4px',
                          top: `${day.top2}px`,
                          height: `${day.height2}px`,
                          borderRadius: '6px',
                          padding: '8px',
                          fontSize: '11px',
                          fontWeight: 500,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          zIndex: 2,
                          background: day.bg2,
                          border: `1px solid ${day.border2}`,
                          color: day.text2,
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '12px' }}>
                          {day.title2}
                        </span>
                        <span>{day.detail2}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
