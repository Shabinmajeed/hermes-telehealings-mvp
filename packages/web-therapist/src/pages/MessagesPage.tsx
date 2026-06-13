import React, { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { TherapistUser } from '@/types';

interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  senderEmail: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  name: string;
  sessionId: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
  messages: Message[];
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5172/chat';

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch conversations from sessions
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.sessions.list();
        const sessions = response.data || [];
        const convs: Conversation[] = sessions.map((s: any) => ({
          id: `conv-${s.id}`,
          name: s.clientName || 'Client',
          sessionId: s.id,
          lastMessage: s.notes || 'No messages yet',
          time: s.scheduledAt
            ? new Date(s.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : '',
          unread: false,
          online: false,
          messages: [],
        }));
        setConversations(convs);
      } catch (err) {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const activeConv = conversations.find((c) => c.id === activeId);

  // WebSocket for active chat
  useEffect(() => {
    if (!activeId || !activeConv) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnected(false);
      return;
    }

    const token = localStorage.getItem('therapist_token') || '';
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ event: 'joinRoom', data: { sessionId: activeConv.sessionId } }));
      // Fetch history
      api.sessions.get(activeConv.sessionId).catch(() => {});
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.event === 'newMessage' && payload.data) {
          const msg = payload.data as Message;
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === activeId) {
                const exists = c.messages.find((m) => m.id === msg.id);
                if (exists) return c;
                return { ...c, messages: [...c.messages, msg] };
              }
              return c;
            })
          );
        }
      } catch {
        // ignore
      }
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, [activeId, activeConv?.sessionId]);

  // Load message history when selecting a conversation
  useEffect(() => {
    if (!activeConv || !activeId) return;
    const loadHistory = async () => {
      try {
        const history = await api.sessions.get(activeConv.sessionId);
        // If the backend returns chat history, use it
        if (history?.data) {
          setConversations((prev) =>
            prev.map((c) => (c.id === activeId ? { ...c, messages: history.data?.chatMessages || [] } : c))
          );
        }
      } catch {
        // ignore
      }
    };
    if (activeConv.messages.length === 0) {
      loadHistory();
    }
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || !wsRef.current || !activeConv) return;
    wsRef.current.send(
      JSON.stringify({
        event: 'sendMessage',
        data: { sessionId: activeConv.sessionId, content: inputValue.trim() },
      })
    );
    setInputValue('');
  }, [inputValue, activeConv]);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexShrink: 0,
          paddingBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.5px',
              margin: 0,
            }}
          >
            Communications
          </h1>
          <p
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: 15,
              color: '#64748b',
              marginTop: 4,
              margin: 0,
            }}
          >
            {loading ? 'Loading...' : `${conversations.length} conversations`}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 10,
            background: connected ? '#dcfce7' : '#f1f5f9',
            color: connected ? '#16a34a' : '#64748b',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: connected ? '#16a34a' : '#94a3b8',
            }}
          />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Communications Container */}
      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
        {/* Left Pane: Chat Sidebar */}
        <div
          style={{
            width: 360,
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          {/* Search */}
          <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px 10px 36px', borderRadius: 10,
                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                color: '#0f172a', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Chat List */}
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            {loading ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                    background: activeId === conv.id ? '#eff6ff' : 'transparent',
                    borderLeft: activeId === conv.id ? '3px solid #2a73d4' : '3px solid transparent',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: 46, height: 46, borderRadius: '50%', background: '#eff6ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#2a73d4', fontSize: 16 }}>
                      {conv.name.charAt(0)}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <h4
                        style={{
                          fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        }}
                      >
                        {conv.name}
                      </h4>
                      <span
                        style={{
                          fontSize: 11, color: '#94a3b8', fontWeight: 500, flexShrink: 0, marginLeft: 8,
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        }}
                      >
                        {conv.time}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13, color: '#64748b', fontWeight: 400, margin: 0,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      }}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <div style={{ width: 10, height: 10, background: '#2a73d4', borderRadius: '50%', flexShrink: 0 }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Chat Main */}
        <div
          style={{
            flex: 1, background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          {activeConv ? (
            <>
              {/* Chat Main Header */}
              <div
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '20px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%', background: '#eff6ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#2a73d4', fontSize: 16 }}>
                      {activeConv.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>
                      {activeConv.name}
                    </h3>
                    <p style={{ fontSize: 12, color: connected ? '#10b981' : '#94a3b8', fontWeight: 500, margin: 0 }}>
                      {'\u2022'} {connected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                style={{
                  flex: 1, overflowY: 'auto', padding: 24,
                  display: 'flex', flexDirection: 'column', gap: 20, background: '#f8fafc',
                }}
              >
                {activeConv.messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, paddingTop: 40 }}>
                    No messages yet. Start the conversation.
                  </div>
                )}
                {activeConv.messages.map((msg) => {
                  const isReceived = msg.senderRole === 'CLIENT';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex', gap: 12, maxWidth: '80%',
                        alignSelf: isReceived ? 'flex-start' : 'flex-end',
                        flexDirection: isReceived ? 'row' : 'row-reverse',
                      }}
                    >
                      {isReceived && (
                        <div
                          style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#eff6ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, alignSelf: 'flex-end',
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#2a73d4' }}>
                            {activeConv.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: isReceived ? 'flex-start' : 'flex-end' }}>
                        <div
                          style={{
                            padding: '12px 16px', borderRadius: 16, fontSize: 14, lineHeight: 1.5,
                            color: isReceived ? '#0f172a' : '#ffffff',
                            backgroundColor: isReceived ? '#ffffff' : '#2a73d4',
                            border: isReceived ? '1px solid #e2e8f0' : 'none',
                            borderBottomLeftRadius: isReceived ? 4 : 16,
                            borderBottomRightRadius: isReceived ? 16 : 4,
                          }}
                        >
                          <p style={{ margin: 0 }}>{msg.content}</p>
                        </div>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, margin: '0 4px' }}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder={connected ? 'Type a message...' : 'Connecting...'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    disabled={!connected}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: 12,
                      border: '1px solid #e2e8f0', background: '#f8fafc',
                      fontSize: 14, outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!connected || !inputValue.trim()}
                    style={{
                      padding: '12px 24px', borderRadius: 12, background: '#2a73d4',
                      color: '#fff', border: 'none', fontSize: 14, fontWeight: 600,
                      cursor: connected && inputValue.trim() ? 'pointer' : 'not-allowed',
                      opacity: connected && inputValue.trim() ? 1 : 0.5,
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <div style={{ textAlign: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p style={{ fontSize: 15, fontWeight: 500 }}>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
