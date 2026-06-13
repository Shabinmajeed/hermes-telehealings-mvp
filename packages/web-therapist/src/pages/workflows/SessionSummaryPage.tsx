import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_NOTES = `S: Sarah reports feeling slightly less overwhelmed since implementing the 4-7-8 breathing technique, though she still experiences significant anxiety spikes prior to team meetings.

O: Patient was punctual, properly groomed, and engaged actively throughout the session. Eye contact was consistent. Mood appeared slightly anxious but stable.

A: Generalized Anxiety Symptoms appear to be improving slightly with new coping mechanisms, though specific situational triggers remain potent.

P: Continue practicing 4-7-8 breathing. Assigned "Core Beliefs Matrix" worksheet to begin unearthing the root of the workplace performance anxiety. Follow up scheduled for next week.`;

const SessionSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('Notes Saved!');

  const handleAction = (actionType: string) => {
    const actionText = actionType.charAt(0).toUpperCase() + actionType.slice(1);
    setToastTitle(`Notes ${actionText}!`);
    setShowToast(true);

    setTimeout(() => {
      navigate('/workflows/session-prep');
    }, 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Sticky Header */}
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
            Session Summary: Sarah Jenkins
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#64748b',
              margin: 0,
            }}
          >
            Review, modify, and finalize your clinical notes from this session.
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          padding: '32px',
          margin: '24px 0 40px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Clinical Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
            }}
          >
            Clinical Notes (SOAP Format)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%',
              minHeight: '300px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontFamily: 'inherit',
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#334155',
              background: '#f8fafc',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#2a73d4';
            }}
            onBlur={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}
          />
        </div>

        {/* Action Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            marginTop: '12px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '24px',
          }}
        >
          <button
            onClick={() => handleAction('saved as draft')}
            style={{
              backgroundColor: '#ffffff',
              color: '#475569',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f8fafc';
              (e.currentTarget as HTMLButtonElement).style.color = '#0f172a';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffffff';
              (e.currentTarget as HTMLButtonElement).style.color = '#475569';
            }}
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleAction('published to client file')}
            style={{
              backgroundColor: '#2a73d4',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2361b5';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a73d4';
            }}
          >
            Publish Notes
          </button>
        </div>
      </div>

      {/* Success Toast Overlay */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '32px 40px',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: '#dcfce7',
                color: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2
              style={{
                margin: 0,
                color: '#0f172a',
                fontSize: '20px',
              }}
            >
              {toastTitle}
            </h2>
            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: '14px',
              }}
            >
              Redirecting back to your sessions dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionSummaryPage;
