import React from 'react';
import { useNavigate } from 'react-router-dom';

const CLIENT = {
  name: 'Sarah Jenkins',
  avatar: 'https://i.pravatar.cc/150?img=1',
  sessionInfo: 'Session 4 of 12 \u2022 Cognitive Behavioral Therapy',
  status: 'Patient waiting in lobby',
};

const CAMERA_PREVIEW = '/assets/icons/therapist-call.png';

const SessionPrepPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden', display: 'flex' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top Header */}
          <div
            style={{
              padding: '20px 0',
              flexShrink: 0,
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>
                Session Preparation
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>
                Review notes and check your hardware before joining.
              </p>
            </div>
          </div>

          {/* Prep Layout: Two Columns */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              flex: 1,
              minHeight: 0,
              paddingBottom: '24px',
            }}
          >
            {/* Left Column: Client Data */}
            <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* Client Overview */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <img
                    src={CLIENT.avatar}
                    alt={CLIENT.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                      {CLIENT.name}
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                      {CLIENT.sessionInfo}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        background: '#fef3c7',
                        color: '#b45309',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {CLIENT.status}
                    </span>
                  </div>
                </div>

                {/* Goals & Progress */}
                <h3
                  style={{
                    margin: '24px 0 12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Goals & Progress
                </h3>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div
                    style={{
                      flex: 1,
                      background: '#f8fafc',
                      padding: '12px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      Anxiety Score (GAD-7)
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#059669' }}>
                      12{' '}
                      <span style={{ fontSize: '12px', color: '#10b981' }}>
                        (Down from 15)
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: '#f8fafc',
                      padding: '12px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      Worksheets Completed
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                      3 / 3
                    </div>
                  </div>
                </div>

                {/* Last Session Summary */}
                <h3
                  style={{
                    margin: '0 0 12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Last Session Summary (Oct 17, 2023)
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: '#475569',
                  }}
                >
                  Discussed recent workplace anxiety triggers. Sarah identified that speaking in
                  team meetings initiates her panic response. We introduced the 4-7-8 breathing
                  technique and assigned the 'Cognitive Reframing' thought log for homework.
                  <br />
                  <br />
                  <strong style={{ color: '#0f172a' }}>Plan for today:</strong> Review the thought
                  log, discuss any roadblocks with the breathing exercises, and potentially
                  transition into identifying core beliefs surrounding workplace competency.
                </p>
              </div>
            </div>

            {/* Right Column: Pre-Call Check */}
            <div style={{ width: '340px', flexShrink: 0, overflowY: 'auto' }}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Hardware Check
                </h3>

                {/* Camera Preview */}
                <div
                  style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={CAMERA_PREVIEW}
                    alt="Camera Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Device Statuses */}
                <div style={{ marginTop: '16px' }}>
                  {/* Camera */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>
                        Facetime HD Camera
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                      Working
                    </span>
                  </div>

                  {/* Microphone */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                      >
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                      <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>
                        Internal Microphone
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                      Working
                    </span>
                  </div>

                  {/* Network */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                      >
                        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                        <line x1="12" y1="20" x2="12.01" y2="20" />
                      </svg>
                      <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>
                        Network Quality
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                      Excellent
                    </span>
                  </div>
                </div>

                {/* Connect Call Button */}
                <button
                  onClick={() => navigate('/workflows/active-session')}
                  style={{
                    marginTop: '24px',
                    width: '100%',
                    padding: '14px 0',
                    background: '#2a73d4',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2361b5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#2a73d4';
                  }}
                >
                  Connect Call
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SessionPrepPage;
