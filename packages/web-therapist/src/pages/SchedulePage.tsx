import React from 'react';

interface UpcomingSession {
  id: string;
  time: string;
  clientName: string;
  avatar: string;
  sessionType: string;
  badge: string;
  preparation: string;
}

const UPCOMING_SESSIONS: UpcomingSession[] = [
  {
    id: '1',
    time: '09:00 AM',
    clientName: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?img=1',
    sessionType: 'Follow-up CBT',
    badge: 'Video Call',
    preparation:
      'Review week 3 thought log and discuss recent workplace anxiety triggers.',
  },
  {
    id: '2',
    time: '10:30 AM',
    clientName: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=8',
    sessionType: 'First Appointment',
    badge: 'Initial Intake',
    preparation:
      'Patient has not uploaded prior medical history. Ensure to complete the general intake questionnaire.',
  },
  {
    id: '3',
    time: '01:00 PM',
    clientName: 'Priya Patel',
    avatar: 'https://i.pravatar.cc/150?img=32',
    sessionType: 'Routine Check-in',
    badge: 'Video Call',
    preparation:
      'Follow up on the grounding exercises assigned last Tuesday.',
  },
];

const ClockIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SchedulePage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Sticky Header — matches .top-header from sessions-list.css */}
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
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 4px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Upcoming Sessions
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#64748b',
              margin: 0,
            }}
          >
            View and prepare for your scheduled appointments today.
          </p>
        </div>
      </div>

      {/* Sessions Grid — matches .sessions-grid from sessions-list.css */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          padding: '24px 0 40px 0',
        }}
      >
        {UPCOMING_SESSIONS.map((session) => (
          <div
            key={session.id}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-4px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 12px 25px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 4px 20px rgba(0,0,0,0.02)';
            }}
          >
            {/* Session Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  background: '#eff6ff',
                  color: '#2a73d4',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ClockIcon />
                {session.time}
              </div>
              <span
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {session.badge}
              </span>
            </div>

            {/* Client Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <img
                src={session.avatar}
                alt={session.clientName}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #f8fafc',
                }}
              />
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '0 0 4px 0',
                  }}
                >
                  {session.clientName}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0,
                  }}
                >
                  {session.sessionType}
                </p>
              </div>
            </div>

            {/* Preparation Notes */}
            <div
              style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#475569',
                lineHeight: 1.5,
                borderLeft: '3px solid #cbd5e1',
                marginBottom: '8px',
              }}
            >
              <strong style={{ color: '#0f172a' }}>Preparation:</strong>{' '}
              {session.preparation}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: 'auto',
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: '#0f172a',
                }}
              >
                View Profile
              </button>
              <a
                href="/workflows/session-prep"
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#2a73d4',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                Join Session
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
