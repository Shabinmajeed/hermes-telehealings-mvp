import React, { useState, useMemo } from 'react';

// --- Types ---

interface ChatThread {
  id: string;
  name: string;
  role: string;
  avatar: string;
  time: string;
  preview: string;
  unread: number;
  status: 'open' | 'pending' | 'resolved';
  isEscalated?: boolean;
  ticketId?: string;
  isTherapist?: boolean;
  therapistId?: string;
}

interface ChatMessage {
  id: string;
  direction: 'received' | 'sent';
  text: string;
  time: string;
}

interface TicketRow {
  id: string;
  user: string;
  role: string;
  avatar: string;
  subject: string;
  preview: string;
  status: 'Open' | 'Pending' | 'Resolved';
  hasChat: boolean;
}

// --- Mock Data ---

const chatThreads: ChatThread[] = [
  {
    id: 'th-1',
    name: 'Dr. Sarah Smith',
    role: 'Therapist',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    time: '10:45 AM',
    preview: 'Client requested a sudden refund...',
    unread: 2,
    status: 'open',
    isEscalated: true,
    ticketId: 'TKT-042',
    isTherapist: true,
    therapistId: 'T-0452',
  },
  {
    id: 'th-2',
    name: 'Mike Wheeler (Client)',
    role: 'Client',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    time: 'Yesterday',
    preview: 'Thank you, the issue is resolved now.',
    unread: 0,
    status: 'resolved',
  },
  {
    id: 'th-3',
    name: 'Dr. Ajesh Anand',
    role: 'Therapist',
    avatar: 'https://i.pravatar.cc/150?u=ajesh',
    time: 'Mon',
    preview: 'Can you update my schedule block?',
    unread: 0,
    status: 'pending',
    isTherapist: true,
    therapistId: 'T-0101',
  },
];

const chatMessages: Record<string, ChatMessage[]> = {
  'th-1': [
    { id: 'm1', direction: 'received', text: 'Hello Admin, I have a critical issue. My client (Nathaniel Jacob) requested a sudden refund for the session that was already completed yesterday. He claimed technical difficulties on his side.', time: '10:42 AM' },
    { id: 'm2', direction: 'received', text: 'How should I proceed with this billing escalation? Please advise.', time: '10:43 AM' },
    { id: 'm3', direction: 'sent', text: "Hi Dr. Sarah. Let me pull up the system logs for that specific session to check for any dropped connections.", time: '10:48 AM' },
    { id: 'm4', direction: 'sent', text: 'I will reach out to him directly from the platform billing side. You don\'t need to process anything manually.', time: '10:49 AM' },
  ],
};

const ticketsData: TicketRow[] = [
  { id: 'TKT-042', user: 'Dr. Sarah Smith', role: 'Therapist', avatar: 'https://i.pravatar.cc/150?u=sarah', subject: 'Client refund request (Nathaniel Jacob)', preview: 'Requested refund post-session due to technical difficulties.', status: 'Open', hasChat: true },
  { id: 'TKT-043', user: 'Mike Wheeler', role: 'Client', avatar: 'https://i.pravatar.cc/150?u=mike', subject: 'Video not connecting during call', preview: 'The video stream dropped entirely 10 mins in.', status: 'Resolved', hasChat: true },
  { id: 'TKT-044', user: 'Dr. Ajesh Anand', role: 'Therapist', avatar: 'https://i.pravatar.cc/150?u=ajesh', subject: 'Unable to update schedule block', preview: 'The calendar UI throws an error when saving changes.', status: 'Pending', hasChat: true },
  { id: 'TKT-045', user: 'Jane Hopper', role: 'Client', avatar: 'https://i.pravatar.cc/150?u=jane', subject: 'Invoice mismatch on subscription', preview: 'I was charged twice this month for premium.', status: 'Open', hasChat: false },
];

const statusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open': return 'bg-status-errorLight text-status-errorDark';
    case 'pending': return 'bg-status-warningLight text-status-warningDark';
    case 'resolved': return 'bg-status-successLight text-status-successDark';
    default: return 'bg-neutral-100 text-neutral-600';
  }
};

const filterLabels: Record<string, string> = {
  all: 'All',
  open: 'Open',
  pending: 'Pending Logs',
  resolved: 'Resolved',
};

// --- Component ---

const CommunicationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'tickets'>('messages');
  const [activeThread, setActiveThread] = useState<string>('th-1');
  const [chatFilter, setChatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  const filteredThreads = useMemo(() => {
    return chatThreads.filter((t) => {
      const matchesFilter = chatFilter === 'all' || t.status === chatFilter;
      const matchesSearch =
        searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.preview.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [chatFilter, searchQuery]);

  const filteredTickets = useMemo(() => {
    if (ticketSearch === '') return ticketsData;
    return ticketsData.filter(
      (t) =>
        t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.user.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.id.toLowerCase().includes(ticketSearch.toLowerCase())
    );
  }, [ticketSearch]);

  const currentThread = chatThreads.find((t) => t.id === activeThread);
  const currentMessages = chatMessages[activeThread] || [];

  const unreadCount = chatThreads.reduce((sum, t) => sum + t.unread, 0);
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
  };

  const switchToMessages = () => setActiveTab('messages');
  const switchToTickets = () => setActiveTab('tickets');

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '12px',
        paddingBottom: '0',
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#0f172a',
          padding: '0 0 12px 0',
          position: 'relative',
        }}>
          Communications & Escalations
          <div style={{
            position: 'absolute',
            bottom: '-2px', left: 0, right: 0,
            height: '3px',
            background: '#0f172a',
            borderRadius: '2px 2px 0 0',
          }} />
        </div>
        <img
          src="/assets/Heali-peak.png"
          alt="Heali"
          style={{ height: '48px', marginBottom: '-1px' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </header>

      {/* Tabs Navigation */}
      <div className="flex gap-6 border-b border-neutral-200">
        <button
          onClick={switchToMessages}
          className={`pb-2.5 text-sm font-semibold transition-colors relative ${
            activeTab === 'messages' ? 'text-primary-600' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          Messages
          {activeTab === 'messages' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t" />
          )}
        </button>
        <button
          onClick={switchToTickets}
          className={`pb-2.5 text-sm font-semibold transition-colors relative ${
            activeTab === 'tickets' ? 'text-primary-600' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          Support Tickets
          {activeTab === 'tickets' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t" />
          )}
        </button>
      </div>

      {/* Tab 1: Messages */}
      {activeTab === 'messages' && (
        <div className="flex flex-1 min-h-0 bg-white rounded-2xl shadow-card border border-neutral-200 overflow-hidden" style={{ borderRadius: '16px' }}>
          {/* Chat Sidebar (Left Pane) */}
          <div className="w-[340px] border-r border-neutral-200 flex flex-col bg-neutral-50 flex-shrink-0">
            {/* Search Header */}
            <div className="p-5 border-b border-neutral-200">
              <div className="relative w-full">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
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
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 rounded-lg border border-neutral-300 bg-white text-sm outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              {/* Chat Filters */}
              <div className="flex gap-2 mt-3.5 overflow-x-auto">
                {(['all', 'open', 'pending', 'resolved'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setChatFilter(f)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
                      chatFilter === f
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'bg-neutral-100 text-text-secondary border border-transparent hover:bg-neutral-200'
                    }`}
                  >
                    {filterLabels[f]}
                    {f === 'open' && unreadCount > 0 && ` (${unreadCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setActiveThread(thread.id)}
                  className={`flex p-4 gap-3 cursor-pointer border-b border-neutral-100 transition-colors ${
                    activeThread === thread.id
                      ? 'bg-primary-50 border-l-[3px] border-l-primary-600 pl-[13px]'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-11 h-11 rounded-full object-cover bg-neutral-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-text-primary truncate">{thread.name}</span>
                      <span className="text-[11px] text-text-tertiary whitespace-nowrap ml-2">{thread.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-text-tertiary truncate max-w-[200px]">{thread.preview}</span>
                      {thread.unread > 0 && (
                        <span className="bg-status-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0">
                          {thread.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Window (Right Pane) */}
          <div className="flex-1 flex flex-col bg-white min-w-0">
            {currentThread && (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={currentThread.avatar}
                      alt={currentThread.name}
                      className="w-11 h-11 rounded-full object-cover bg-neutral-200"
                    />
                    <div>
                      <div className="text-base font-bold text-text-primary">{currentThread.name}</div>
                      <div className="text-xs text-text-tertiary">
                        {currentThread.role}
                        {currentThread.isTherapist && currentThread.therapistId && ` • ID: ${currentThread.therapistId}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {currentThread.ticketId && (
                      <button
                        onClick={switchToTickets}
                        className="bg-primary-50 text-primary-700 border border-primary-200 rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors hover:bg-primary-100"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <polyline points="10 17 15 12 10 7" />
                          <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Ticket {currentThread.ticketId}
                      </button>
                    )}
                    {currentThread.isEscalated && (
                      <div className="bg-status-errorLight text-status-errorDark px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        High Priority
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 flex gap-3 items-center">
                  <span className="text-xs font-semibold text-text-tertiary mr-1">Quick Actions:</span>
                  <button
                    onClick={() => setShowRefundModal(true)}
                    className="bg-white border border-neutral-300 text-text-secondary px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors hover:bg-neutral-100 text-status-errorDark border-status-errorLight hover:bg-status-errorLight"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Process Refund
                  </button>
                  <button className="bg-white border border-neutral-300 text-text-secondary px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors hover:bg-neutral-100">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Rebook Session
                  </button>
                  <button className="bg-white border border-neutral-300 text-text-secondary px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors hover:bg-neutral-100">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Pull System Logs
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-neutral-50">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[75%] flex flex-col ${
                        msg.direction === 'received' ? 'self-start' : 'self-end'
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                          msg.direction === 'received'
                            ? 'bg-white text-text-secondary border border-neutral-200 rounded-tl-sm'
                            : 'bg-primary-600 text-white rounded-tr-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className={`text-[11px] text-text-tertiary mt-1.5 ${msg.direction === 'sent' ? 'text-right' : ''}`}>
                        {msg.time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="px-6 py-4 border-t border-neutral-200 flex gap-3 items-center bg-white">
                  <button className="text-text-tertiary p-2 rounded-full transition-colors hover:bg-neutral-100 hover:text-text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                    className="flex-1 py-3.5 px-5 rounded-full border border-neutral-300 outline-none text-sm transition-colors bg-neutral-50 focus:border-primary-500 focus:bg-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary-600 text-white w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-primary-700"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Support Tickets */}
      {activeTab === 'tickets' && (
        <div className="flex flex-col gap-5">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative w-[240px]">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
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
                  placeholder="Search tickets..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 rounded-lg border border-neutral-300 bg-white text-sm outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 bg-white text-sm font-semibold text-text-secondary hover:bg-neutral-50 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>
            </div>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary-600 bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Ticket
            </button>
          </div>

          {/* Tickets Table Card */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-200 overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left px-8 py-4 text-sm font-medium text-text-tertiary" style={{ width: '15%' }}>
                      Ticket ID
                    </th>
                    <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary" style={{ width: '25%' }}>
                      Submitted By
                    </th>
                    <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary" style={{ width: '30%' }}>
                      Subject
                    </th>
                    <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary" style={{ width: '10%' }}>
                      Status
                    </th>
                    <th className="text-right px-8 py-4 text-sm font-medium text-text-tertiary" style={{ width: '20%' }}>
                      Related Comms
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-text-tertiary">
                        No tickets found. Try adjusting your search.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors">
                        <td className="px-8 py-4">
                          <span className="font-mono text-[13px] text-text-tertiary bg-neutral-50 px-2 py-1 rounded border border-neutral-200">
                            {ticket.id}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={ticket.avatar}
                              alt={ticket.user}
                              className="w-8 h-8 rounded-full object-cover bg-neutral-100"
                            />
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{ticket.user}</p>
                              <p className="text-xs text-text-tertiary">{ticket.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-text-primary">{ticket.subject}</p>
                          <p className="text-xs text-text-tertiary mt-1">{ticket.preview}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold min-w-[90px] text-center ${statusBadgeClass(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          {ticket.hasChat ? (
                            <button
                              onClick={switchToMessages}
                              className="bg-primary-50 text-primary-700 border border-primary-200 rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors hover:bg-primary-100"
                            >
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              View Chat
                            </button>
                          ) : (
                            <span className="bg-neutral-100 text-text-tertiary border border-neutral-200 rounded-md px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 cursor-not-allowed">
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              No Chat
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowRefundModal(false)}
        >
          <div
            className="bg-white w-[450px] max-w-[90%] rounded-2xl shadow-modal overflow-hidden"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
              <div className="text-base font-bold text-text-primary flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-600">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Process Refund
              </div>
              <button
                onClick={() => setShowRefundModal(false)}
                className="text-text-tertiary p-1 rounded-full hover:bg-neutral-200 hover:text-text-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 flex flex-col gap-4">
              <p className="text-sm text-text-secondary m-0">
                You are about to issue a refund for <strong>Session S-101</strong> (Nathaniel Jacob). This action cannot be undone.
              </p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Refund Amount</label>
                <input
                  type="text"
                  value="₹ 1,500"
                  disabled
                  className="w-full py-2.5 px-3 rounded-lg border border-neutral-300 text-sm outline-none bg-neutral-100 text-text-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Reason for Refund</label>
                <select className="w-full py-2.5 px-3 rounded-lg border border-neutral-300 text-sm outline-none focus:border-primary-500 transition-colors bg-white text-text-primary">
                  <option>Technical Issues (Platform)</option>
                  <option>Therapist No-Show</option>
                  <option>Client Cancellation (Eligible)</option>
                  <option>Other / Disputed</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-5 py-2.5 rounded-full border border-neutral-300 bg-white text-sm font-semibold text-text-secondary hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-5 py-2.5 rounded-full border border-status-error bg-status-error text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationsPage;
