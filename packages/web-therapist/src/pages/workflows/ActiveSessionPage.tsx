import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: number;
  sender: 'therapist' | 'client';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, sender: 'therapist', text: "Good morning, Sarah. How have you been feeling since our last session?", timestamp: '10:00 AM' },
  { id: 2, sender: 'client', text: "Hi Doctor. It's been a better week overall. I've been practicing the breathing exercises daily.", timestamp: '10:01 AM' },
  { id: 3, sender: 'therapist', text: "That's wonderful to hear. How many times a day have you been using the 4-7-8 technique?", timestamp: '10:01 AM' },
  { id: 4, sender: 'client', text: "Usually twice — morning and before bed. I noticed it helps me fall asleep faster too.", timestamp: '10:02 AM' },
  { id: 5, sender: 'therapist', text: "Excellent. Sleep is crucial for managing anxiety. Let's discuss any challenging moments from this week.", timestamp: '10:02 AM' },
];

const CLIENT = {
  name: 'Sarah Johnson',
  avatar: 'https://i.pravatar.cc/150?img=5',
  status: 'Connected',
};

const ActiveSessionPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState<'notes' | 'resources' | 'assessment'>('notes');
  const [sessionNotes, setSessionNotes] = useState('');
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
    const msg: ChatMessage = {
      id: messages.length + 1,
      sender: 'therapist',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this session?')) {
      // Navigate to session summary
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src={CLIENT.avatar} alt={CLIENT.name} className="w-9 h-9 rounded-full object-cover border border-neutral-200" />
          <div>
            <p className="text-sm font-semibold text-text-primary">{CLIENT.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="text-xs text-text-tertiary">{CLIENT.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-status-error animate-pulse" />
            <span className="text-sm font-semibold text-text-primary font-mono">{formatTime(sessionTime)}</span>
          </div>
          <button
            onClick={handleEndSession}
            className="px-4 py-2 bg-status-error text-white rounded-lg text-sm font-semibold hover:bg-status-errorDark transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video / Stage Area */}
        <div className={`flex-1 flex flex-col transition-all ${isChatExpanded ? 'w-2/3' : 'w-full'}`}>
          {/* Video Grid */}
          <div className="flex-1 bg-neutral-900 flex items-center justify-center relative">
            {/* Main Video (Client) */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={CLIENT.avatar}
                alt={CLIENT.name}
                className="w-32 h-32 rounded-full object-cover opacity-60"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                {CLIENT.name}
              </div>
            </div>

            {/* Self View (Therapist) */}
            <div className="absolute bottom-4 right-4 w-40 h-28 bg-neutral-800 rounded-xl overflow-hidden border-2 border-neutral-600">
              <div className="w-full h-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white px-2 py-0.5 rounded text-xs">You</div>
            </div>

            {/* Media Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  isMicOn ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-status-error text-white'
                }`}
              >
                {isMicOn ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOn ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-status-error text-white'
                }`}
              >
                {isVideoOn ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsChatExpanded(!isChatExpanded)}
                className="w-11 h-11 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button className="w-11 h-11 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <rect x="9" y="9" width="6" height="6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Side Panel - Notes / Resources / Assessment */}
          <div className="bg-white border-t border-neutral-200 p-4 flex-shrink-0" style={{ height: '200px' }}>
            <div className="flex gap-1 mb-3">
              {(['notes', 'resources', 'assessment'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveToolTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                    activeToolTab === tab
                      ? 'bg-brand-blue text-white'
                      : 'bg-neutral-100 text-text-tertiary hover:bg-neutral-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeToolTab === 'notes' && (
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Type session notes here..."
                className="w-full h-[120px] p-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-text-primary outline-none focus:border-brand-blue resize-none"
              />
            )}
            {activeToolTab === 'resources' && (
              <div className="space-y-2 overflow-y-auto h-[120px]">
                {['Thought Record Worksheet', 'Breathing Exercise Guide', 'Sleep Hygiene Checklist', 'Exposure Hierarchy Template'].map((resource) => (
                  <div key={resource} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span className="text-sm text-text-secondary">{resource}</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
            {activeToolTab === 'assessment' && (
              <div className="space-y-3 overflow-y-auto h-[120px]">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-primary">GAD-7 Score</span>
                    <span className="text-xs font-bold text-brand-blue">12/21</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                    <div className="h-full bg-brand-blue rounded-full" style={{ width: '57%' }} />
                  </div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-primary">PHQ-9 Score</span>
                    <span className="text-xs font-bold text-status-warning">8/27</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                    <div className="h-full bg-status-warning rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-primary">Sleep Quality</span>
                    <span className="text-xs font-bold text-status-success">6/10</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                    <div className="h-full bg-status-success rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {isChatExpanded && (
          <div className="w-80 border-l border-neutral-200 flex flex-col bg-white">
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary">Session Chat</h3>
              <button onClick={() => setIsChatExpanded(false)} className="p-1 rounded hover:bg-neutral-100 text-text-tertiary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'therapist' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.sender === 'therapist'
                      ? 'bg-brand-blue text-white rounded-br-sm'
                      : 'bg-neutral-100 text-text-primary rounded-bl-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'therapist' ? 'text-white/60' : 'text-text-placeholder'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-neutral-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 py-2 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-brand-blue"
                />
                <button
                  onClick={sendMessage}
                  className="px-3 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-brand-blueDark transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSessionPage;
