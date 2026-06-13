import React from 'react';
import { useNavigate } from 'react-router-dom';

const prepSectionTitle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#0f172a',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '0 0 12px 0',
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '8px',
};

const prepCard: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
  padding: '24px',
};

const deviceStatusStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #f1f5f9',
  fontSize: '14px',
  fontWeight: 500,
  color: '#475569',
};

const SessionPrepPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Two Column Prep Layout */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>

        {/* Left Column: Client Data (flex: 2) */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={prepCard}>
            {/* Client Overview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <img
                src="https://i.pravatar.cc/150?img=1"
                alt="Sarah Jenkins"
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Sarah Jenkins
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                  Session 4 of 12 • Cognitive Behavioral Therapy
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
                  Patient waiting in lobby
                </span>
              </div>
            </div>

            {/* Goals & Progress */}
            <h3 style={prepSectionTitle}>Goals & Progress</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Anxiety Score (GAD-7)</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#059669' }}>
                  12 <span style={{ fontSize: '12px', color: '#10b981' }}>(Down from 15)</span>
                </div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Worksheets Completed</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>3 / 3</div>
              </div>
            </div>

            {/* Last Session Summary */}
            <h3 style={prepSectionTitle}>Last Session Summary (Oct 17, 2023)</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Discussed recent workplace anxiety triggers. Sarah identified that speaking in team meetings initiates her panic response. We introduced the 4-7-8 breathing technique and assigned the 'Cognitive Reframing' thought log for homework. <br /><br />
              <strong>Plan for today:</strong> Review the thought log, discuss any roadblocks with the breathing exercises, and potentially transition into identifying core beliefs surrounding workplace competency.
            </p>
          </div>
        </div>

        {/* Right Column: Hardware Check (flex: 1) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={prepCard}>
            <h3 style={prepSectionTitle}>Hardware Check</h3>

            {/* Camera Preview */}
            <div
              style={{
                width: '100%',
                height: '220px',
                backgroundColor: '#1e293b',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>

            {/* Device Statuses */}
            <div style={{ marginTop: '16px' }}>
              <div style={deviceStatusStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Facetime HD Camera
                </div>
                <span style={{ color: '#10b981' }}>Working</span>
              </div>
              <div style={deviceStatusStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                  Internal Microphone
                </div>
                <span style={{ color: '#10b981' }}>Working</span>
              </div>
              <div style={{ ...deviceStatusStyle, borderBottom: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                  Network Quality
                </div>
                <span style={{ color: '#10b981' }}>Excellent</span>
              </div>
            </div>

            {/* Connect Call Button */}
            <button
              onClick={() => navigate('/workflows/active-session')}
              style={{
                width: '100%',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '24px',
              }}
              onMouseOver={(e) => { (e.target as HTMLButtonElement).style.background = '#059669'; }}
              onMouseOut={(e) => { (e.target as HTMLButtonElement).style.background = '#10b981'; }}
            >
              Connect Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPrepPage;
