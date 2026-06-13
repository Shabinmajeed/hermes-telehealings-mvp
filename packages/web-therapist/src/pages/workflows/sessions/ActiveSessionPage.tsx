import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PATIENT = {
  name: 'Sarah Jenkins',
  avatar: '/assets/icons/user-call.png',
};

const THERAPIST_AVATAR = '/assets/icons/therapist-call.png';

const INITIAL_MESSAGES = [
  { id: 1, sender: 'client' as const, text: 'Hi Dr. Anand, can you see my screen?', time: '14:15' },
  { id: 2, sender: 'therapist' as const, text: 'Yes, it looks good.', time: '14:16' },
];

const ActiveSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [notes, setNotes] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: messages.length + 1,
      sender: 'therapist' as const,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const handleEndCall = () => {
    navigate('/workflows/session-summary');
  };

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex' }}>
      {/* Sidebar placeholder — injected by DashboardLayout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top Header */}
          <div
            style={{
              padding: '20px 40px',
              borderBottom: '1px solid #e2e8f0',
              background: 'rgba(248, 250, 252, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                Session with {PATIENT.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                  {formatTime(sessionTime)} elapsed
                </span>
              </div>
            </div>
          </div>

          {/* Session Container */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              gap: '24px',
              padding: '24px 40px',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            {/* Left: Main Session Column (Video + Chat) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: '24px',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {/* Active Video Call Area */}
              <div
                style={{
                  flexGrow: 1,
                  minHeight: '0',
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#0f172a',
                  border: '1px solid #e2e8f0',
                }}
              >
                {/* Patient Video Placeholder */}
                <img
                  src={PATIENT.avatar}
                  alt="Patient Video"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Patient Name Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  {PATIENT.name}
                </div>

                {/* Picture-in-Picture: Therapist Camera */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    width: '160px',
                    height: '120px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid #ffffff',
                    background: '#0f172a',
                  }}
                >
                  <img
                    src={THERAPIST_AVATAR}
                    alt="Therapist Video"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'filter 0.3s ease',
                      filter: isCameraOff ? 'blur(8px)' : 'none',
                    }}
                  />
                  {isCameraOff && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(15, 23, 42, 0.6)',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        gap: '8px',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                      Camera Off
                    </div>
                  )}
                </div>

                {/* Floating Controls */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  {/* Mute Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: isMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {isMuted ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                    )}
                  </button>

                  {/* Camera Button */}
                  <button
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    title={isCameraOff ? 'Turn On Camera' : 'Turn Off Camera'}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: isCameraOff ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {isCameraOff ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    )}
                  </button>

                  {/* Chat Toggle Button */}
                  <button
                    onClick={() => setIsChatVisible(!isChatVisible)}
                    title="Open Chat"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>

                  {/* End Call Button */}
                  <button
                    onClick={handleEndCall}
                    title="End Call"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                      <line x1="23" y1="1" x2="1" y2="23" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* In-Session Chat Area (Hidden by default) */}
              {isChatVisible && (
                <div
                  style={{
                    height: '35%',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    overflow: 'hidden',
                    minHeight: '200px',
                  }}
                >
                  {/* Chat Header */}
                  <div
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 700,
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Session Chat
                    </h3>
                    <button
                      onClick={() => setIsChatVisible(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '4px',
                        borderRadius: '6px',
                        display: 'flex',
                        transition: 'color 0.2s, background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                        e.currentTarget.style.color = '#0f172a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#64748b';
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div
                    style={{
                      flexGrow: 1,
                      padding: '20px',
                      overflowY: 'auto',
                      background: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: msg.sender === 'therapist' ? 'flex-end' : 'flex-start',
                          background: msg.sender === 'therapist' ? '#387bd5' : '#ffffff',
                          color: msg.sender === 'therapist' ? '#ffffff' : '#0f172a',
                          border: msg.sender === 'therapist' ? 'none' : '1px solid #e2e8f0',
                          padding: '10px 14px',
                          borderRadius: '16px',
                          borderBottomLeftRadius: msg.sender === 'client' ? '4px' : '16px',
                          borderBottomRightRadius: msg.sender === 'therapist' ? '4px' : '16px',
                          fontSize: '14px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                          maxWidth: '75%',
                        }}
                      >
                        <p style={{ margin: 0 }}>{msg.text}</p>
                        <span
                          style={{
                            fontSize: '11px',
                            color: msg.sender === 'therapist' ? '#bfdbfe' : '#94a3b8',
                            display: 'block',
                            marginTop: '4px',
                            textAlign: msg.sender === 'therapist' ? 'right' : 'left',
                          }}
                        >
                          {msg.time}
                        </span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div
                    style={{
                      padding: '16px 20px',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      background: '#ffffff',
                    }}
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      style={{
                        flexGrow: 1,
                        padding: '10px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        outline: 'none',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      style={{
                        background: '#387bd5',
                        color: 'white',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.opacity = '1';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Session Notes Panel */}
            <div
              style={{
                width: isNotesCollapsed ? '72px' : '320px',
                padding: isNotesCollapsed ? '24px 12px' : '24px',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'width 0.3s ease, padding 0.3s ease',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {/* Notes Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isNotesCollapsed ? 'center' : 'space-between',
                  width: '100%',
                  flexDirection: isNotesCollapsed ? 'column' : 'row',
                  gap: isNotesCollapsed ? '24px' : '0',
                }}
              >
                {!isNotesCollapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Session Notes</span>
                  </div>
                )}
                <button
                  onClick={() => setIsNotesCollapsed(!isNotesCollapsed)}
                  title="Toggle Notes"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: isNotesCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Notes Textarea */}
              {!isNotesCollapsed && (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Type your observations and clinical notes here. These will be saved securely to the client's file..."
                  style={{
                    flex: 1,
                    minHeight: '200px',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    color: '#0f172a',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: '1.6',
                  }}
                />
              )}

              {/* Save Notes Button */}
              {!isNotesCollapsed && (
                <button
                  style={{
                    background: '#387bd5',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = '#387bd5';
                  }}
                >
                  Save Notes
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Pulse animation for live indicator */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default ActiveSessionPage;
