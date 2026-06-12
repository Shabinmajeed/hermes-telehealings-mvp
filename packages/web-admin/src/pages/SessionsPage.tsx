import React, { useState, useMemo } from 'react';
import { PageHeader, StatusBadge } from '../components';

interface SessionRow {
  id: string;
  client: string;
  clientEmail: string;
  therapist: string;
  therapistAvatar: string;
  date: string;
  time: string;
  type: 'individual' | 'group' | 'couples' | 'family';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  duration: string;
  notes: string;
}

const allSessions: SessionRow[] = [
  { id: 'S-1042', client: 'Sarah Mitchell', clientEmail: 'sarah@email.com', therapist: 'Dr. Lisa Chen', therapistAvatar: '', date: 'Jun 9, 2026', time: '10:00 AM', type: 'individual', status: 'scheduled', duration: '50 min', notes: 'Follow-up on anxiety management' },
  { id: 'S-1043', client: 'James Rodriguez', clientEmail: 'james@email.com', therapist: 'Dr. Mark Thompson', therapistAvatar: '', date: 'Jun 9, 2026', time: '11:30 AM', type: 'individual', status: 'in-progress', duration: '50 min', notes: 'CBT session - week 4' },
  { id: 'S-1044', client: 'Emily Patel', clientEmail: 'emily@email.com', therapist: 'Dr. Sarah Kim', therapistAvatar: '', date: 'Jun 9, 2026', time: '2:00 PM', type: 'group', status: 'scheduled', duration: '60 min', notes: 'Group mindfulness session' },
  { id: 'S-1045', client: 'Michael Brown', clientEmail: 'michael@email.com', therapist: 'Dr. Lisa Chen', therapistAvatar: '', date: 'Jun 9, 2026', time: '3:30 PM', type: 'individual', status: 'scheduled', duration: '50 min', notes: 'Initial consultation' },
  { id: 'S-1046', client: 'Anna Wilson', clientEmail: 'anna@email.com', therapist: 'Dr. James Park', therapistAvatar: '', date: 'Jun 8, 2026', time: '9:00 AM', type: 'individual', status: 'cancelled', duration: '50 min', notes: 'Client requested reschedule' },
  { id: 'S-1047', client: 'David Lee', clientEmail: 'david@email.com', therapist: 'Dr. Mark Thompson', therapistAvatar: '', date: 'Jun 8, 2026', time: '1:00 PM', type: 'couples', status: 'completed', duration: '60 min', notes: 'Couples therapy - session 6' },
  { id: 'S-1048', client: 'Maria Garcia', clientEmail: 'maria@email.com', therapist: 'Dr. Sarah Kim', therapistAvatar: '', date: 'Jun 8, 2026', time: '3:00 PM', type: 'individual', status: 'completed', duration: '50 min', notes: 'Progress review' },
  { id: 'S-1049', client: 'Robert Taylor', clientEmail: 'robert@email.com', therapist: 'Dr. Lisa Chen', therapistAvatar: '', date: 'Jun 8, 2026', time: '4:30 PM', type: 'individual', status: 'no-show', duration: '50 min', notes: 'No-show, follow-up required' },
  { id: 'S-1050', client: 'Lisa Wong', clientEmail: 'lisa@email.com', therapist: 'Dr. James Park', therapistAvatar: '', date: 'Jun 7, 2026', time: '10:00 AM', type: 'family', status: 'completed', duration: '60 min', notes: 'Family therapy - session 3' },
  { id: 'S-1051', client: 'Kevin Harris', clientEmail: 'kevin@email.com', therapist: 'Dr. Mark Thompson', therapistAvatar: '', date: 'Jun 7, 2026', time: '2:00 PM', type: 'individual', status: 'completed', duration: '50 min', notes: 'Stress management techniques' },
  { id: 'S-1052', client: 'Jessica Adams', clientEmail: 'jessica@email.com', therapist: 'Dr. Sarah Kim', therapistAvatar: '', date: 'Jun 7, 2026', time: '4:00 PM', type: 'group', status: 'completed', duration: '60 min', notes: 'Group CBT - week 8' },
  { id: 'S-1053', client: 'Daniel Kim', clientEmail: 'daniel@email.com', therapist: 'Dr. Lisa Chen', therapistAvatar: '', date: 'Jun 6, 2026', time: '11:00 AM', type: 'individual', status: 'completed', duration: '50 min', notes: 'Depression screening follow-up' },
];

const statusVariant = (s: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
  switch (s) {
    case 'completed': return 'success';
    case 'in-progress': return 'warning';
    case 'scheduled': return 'info';
    case 'cancelled': return 'error';
    case 'no-show': return 'error';
    default: return 'neutral';
  }
};

const statusLabels: Record<string, string> = {
  'scheduled': 'Scheduled',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'no-show': 'No Show',
};

const typeLabels: Record<string, string> = {
  'individual': 'Individual',
  'group': 'Group',
  'couples': 'Couples',
  'family': 'Family',
};

const perPage = 8;

const SessionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRow | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    return allSessions.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.therapist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesType = typeFilter === 'all' || s.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const activeFilterCount = [statusFilter, typeFilter].filter((f) => f !== 'all').length;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const openSessionModal = (session: SessionRow) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'bg-primary-100 text-primary-700',
    'bg-status-successLight text-status-successDark',
    'bg-status-warningLight text-status-warningDark',
    'bg-status-infoLight text-primary-700',
    'bg-neutral-100 text-neutral-600',
  ];

  const getAvatarColor = (id: string) => {
    const num = parseInt(id.replace(/\D/g, ''), 10);
    return avatarColors[num % avatarColors.length];
  };

  return (
    <div className="flex flex-col gap-5" style={{ padding: '0' }}>
      {/* Page Header */}
      <PageHeader title="Sessions" subtitle="Manage and track all therapy sessions">
        <button
          onClick={() => openSessionModal({ id: '', client: '', clientEmail: '', therapist: '', therapistAvatar: '', date: '', time: '', type: 'individual', status: 'scheduled', duration: '', notes: '' })}
          className="px-5 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-full hover:bg-brand-blueDark transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Session
        </button>
      </PageHeader>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden" style={{ borderRadius: '16px' }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4" style={{ gap: '16px' }}>
          <p className="text-base text-text-primary">
            <span className="font-bold">{filtered.length}</span>{' '}
            <span className="font-normal text-text-tertiary">sessions</span>
          </p>
          <div className="flex items-center" style={{ gap: '16px' }}>
            {/* Search */}
            <div className="relative" style={{ width: '240px' }}>
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
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
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full py-2.5 pl-10 pr-4 text-sm rounded-full border border-neutral-200 bg-white outline-none focus:border-primary-500 transition-colors"
              />
            </div>
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-full border transition-colors flex items-center gap-2 ${
                showFilters || activeFilterCount > 0
                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                  : 'bg-white text-text-secondary border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-primary-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* Export */}
            <button className="px-5 py-2.5 text-sm font-semibold rounded-full border border-neutral-200 bg-white text-text-secondary hover:bg-neutral-50 transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mx-8 mb-5 p-4 rounded-xl bg-neutral-50 border border-neutral-200" style={{ padding: '16px 24px' }}>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Filters</span>
              {/* Status Filter Tags */}
              {['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(statusFilter === s ? 'all' : s); setCurrentPage(1); }}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full border transition-colors capitalize ${
                    statusFilter === s
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'bg-white text-text-secondary border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
              <span className="w-px h-5 bg-neutral-200" />
              {/* Type Filter Tags */}
              {['individual', 'group', 'couples', 'family'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(typeFilter === t ? 'all' : t); setCurrentPage(1); }}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full border transition-colors capitalize ${
                    typeFilter === t
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'bg-white text-text-secondary border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {typeLabels[t]}
                </button>
              ))}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-sm font-semibold rounded-full border border-dashed border-neutral-300 text-text-tertiary hover:text-text-primary hover:border-neutral-400 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-8 py-4 text-sm font-medium text-text-tertiary" style={{ paddingBottom: '16px' }}>
                  Session ID
                </th>
                <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary">
                  Client
                </th>
                <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary">
                  Therapist
                </th>
                <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary">
                  Date & Time
                </th>
                <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary">
                  Type
                </th>
                <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary">
                  Duration
                </th>
                <th className="text-left px-4 py-4 text-sm font-medium text-text-tertiary">
                  Status
                </th>
                <th className="text-right px-8 py-4 text-sm font-medium text-text-tertiary" style={{ width: '7%' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-12 text-center text-text-tertiary">
                    No sessions found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                paginated.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => openSessionModal(session)}
                  >
                    <td className="px-8 py-4 text-sm font-semibold text-text-primary" style={{ padding: '16px 0 16px 32px' }}>
                      {session.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center" style={{ gap: '12px' }}>
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarColor(session.id)}`}
                          style={{ width: '36px', height: '36px' }}
                        >
                          {getInitials(session.client)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">{session.client}</p>
                          <p className="text-xs text-text-tertiary truncate">{session.clientEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center" style={{ gap: '10px' }}>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${getAvatarColor(session.therapist)}`}
                        >
                          {getInitials(session.therapist.replace('Dr. ', ''))}
                        </div>
                        <span className="text-sm text-text-secondary">{session.therapist}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm text-text-secondary">{session.date}</p>
                        <p className="text-xs text-text-tertiary">{session.time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-text-secondary capitalize">
                        {typeLabels[session.type]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{session.duration}</td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        label={statusLabels[session.status]}
                        variant={statusVariant(session.status)}
                      />
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openSessionModal(session); }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-text-secondary hover:bg-neutral-100 transition-colors"
                          title="View"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-text-secondary hover:bg-neutral-100 transition-colors"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-status-errorDark hover:bg-status-errorLight transition-colors"
                          title="Cancel"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-neutral-100" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
            <p className="text-sm text-text-tertiary">
              Showing <span className="font-medium text-text-secondary">{(currentPage - 1) * perPage + 1}</span> to{' '}
              <span className="font-medium text-text-secondary">{Math.min(currentPage * perPage, filtered.length)}</span> of{' '}
              <span className="font-medium text-text-secondary">{filtered.length}</span> sessions
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-brand-blue text-white'
                      : 'border border-neutral-200 hover:bg-neutral-50 text-text-secondary'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      {showModal && selectedSession && selectedSession.id && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-modal"
            style={{ borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50" style={{ borderRadius: '16px 16px 0 0' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-text-primary">{selectedSession.id}</p>
                  <p className="text-xs text-text-tertiary">Session Details</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-text-secondary hover:bg-neutral-200 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Client</label>
                  <p className="text-sm text-text-primary mt-1">{selectedSession.client}</p>
                  <p className="text-xs text-text-tertiary">{selectedSession.clientEmail}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Therapist</label>
                  <p className="text-sm text-text-primary mt-1">{selectedSession.therapist}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Date & Time</label>
                  <p className="text-sm text-text-primary mt-1">{selectedSession.date}</p>
                  <p className="text-xs text-text-tertiary">{selectedSession.time}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Type</label>
                  <p className="text-sm text-text-primary mt-1 capitalize">{typeLabels[selectedSession.type]}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Duration</label>
                  <p className="text-sm text-text-primary mt-1">{selectedSession.duration}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <StatusBadge label={statusLabels[selectedSession.status]} variant={statusVariant(selectedSession.status)} />
                  </div>
                </div>
              </div>

              {selectedSession.notes && (
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Notes</label>
                  <p className="text-sm text-text-secondary mt-1 p-3 rounded-lg bg-neutral-50 border border-neutral-100">{selectedSession.notes}</p>
                </div>
              )}

              {/* Session Actions Notice */}
              <div className="p-3 rounded-lg bg-status-infoLight border border-status-infoLight" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                <p className="text-sm text-text-secondary">
                  <strong className="text-primary-700">Session Actions</strong> — Use the action buttons to edit, cancel, or mark this session as complete.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50" style={{ borderRadius: '0 0 16px 16px' }}>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold text-text-secondary border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {}}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue rounded-lg hover:bg-brand-blueDark transition-colors"
              >
                Edit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
