import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

interface ClientRow {
  id: string;
  name: string;
  email: string;
  therapist: string;
  phone: string;
  lastActiveDate: string;
  lastActiveTime: string;
  sessionStatus: string;
  sessionDate: string;
  avatar?: string;
}

const perPage = 8;

const ClientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [statusClientName, setStatusClientName] = useState('');
  const [switchClientName, setSwitchClientName] = useState('');
  const [switchTherapist, setSwitchTherapist] = useState('');
  const [dataTransfer, setDataTransfer] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientRow[]>([]);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.clients.list();
      const data = (response.data || []).map((c: any) => ({
        id: String(c.id || ''),
        name: c.name || c.fullName || 'Unknown',
        email: c.email || '',
        therapist: c.therapistName || c.therapist || 'Unassigned',
        phone: c.phone || 'N/A',
        lastActiveDate: c.joinedAt
          ? new Date(c.joinedAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')
          : 'N/A',
        lastActiveTime: c.joinedAt
          ? new Date(c.joinedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : '',
        sessionStatus: c.status === 'active' ? 'Schedule Booked' : 'Pending',
        sessionDate: c.scheduledAt
          ? new Date(c.scheduledAt).toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : '',
        avatar: c.avatarUrl || `https://i.pravatar.cc/150?u=${c.id}`,
      }));
      setClients(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let result = clients.filter((c) => {
      const matchesSearch =
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        String(c.id).includes(q);
      return matchesSearch;
    });

    if (statusDropdown !== 'all') {
      const statusMap: Record<string, string[]> = {
        active: ['Schedule Booked'],
        pending: ['Pending'],
        inactive: [],
      };
      const statuses = statusMap[statusDropdown];
      if (statuses) {
        result = result.filter((c) => statuses.includes(c.sessionStatus));
      }
    }

    return result;
  }, [clients, searchQuery, statusDropdown, selectedTags]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const paginated = useMemo(() => {
    let items = [...filtered];
    if (sortAsc) {
      items.sort((a, b) => a.lastActiveDate.localeCompare(b.lastActiveDate));
    }
    return items.slice((currentPage - 1) * perPage, currentPage * perPage);
  }, [filtered, currentPage, sortAsc]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusDropdown('all');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const openStatusModal = (name: string) => {
    setStatusClientName(name);
    setShowStatusModal(true);
  };

  const openSwitchModal = (name: string, therapist: string) => {
    setSwitchClientName(name);
    setSwitchTherapist(therapist);
    setDataTransfer(true);
    setShowSwitchModal(true);
  };

  return (
    <div className="flex flex-col" style={{ gap: '0' }}>
      {/* Page Header */}
      <div
        className="flex items-end justify-between"
        style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '12px', paddingBottom: '0' }}
      >
        <h1
          className="text-xl font-bold"
          style={{ color: '#0f172a', padding: '0 0 12px 0', position: 'relative' }}
        >
          Clients
          <span
            style={{
              position: 'absolute', bottom: '-2px', left: '0', right: '0',
              height: '3px', background: '#0f172a', borderRadius: '2px 2px 0 0',
            }}
          />
        </h1>
        <img src="/assets/Heali-peak.png" alt="Heali" style={{ height: '48px', marginBottom: '-1px' }} />
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
            padding: '12px 20px', color: '#dc2626', fontSize: 14,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <span>{error}</span>
          <button
            onClick={fetchClients}
            style={{
              background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6,
              padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <p style={{ fontSize: '16px', color: '#475569' }}>
            <strong style={{ color: '#0f172a', fontWeight: 700 }}>All Users</strong>{' '}
            {filtered.length}
          </p>
          <div className="relative" style={{ width: '240px' }}>
            <svg
              className="absolute"
              style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full text-sm outline-none"
              style={{ padding: '10px 16px 10px 38px', borderRadius: '99px', border: '1px solid #cbd5e1', background: 'transparent' }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            style={{
              padding: '10px 20px', borderRadius: '99px', fontSize: '14px', fontWeight: 600,
              border: showFilters ? '1px solid #0f172a' : '1px solid #0f172a',
              background: 'transparent', color: '#0f172a', cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
          </button>
        </div>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <button
            className="flex items-center gap-2"
            style={{
              padding: '10px 20px', borderRadius: '99px', fontSize: '14px', fontWeight: 600,
              border: '1px solid #0f172a', background: 'transparent', color: '#0f172a', cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
            style={{
              padding: '10px 20px', borderRadius: '99px', fontSize: '14px', fontWeight: 600,
              border: '1px solid #2563eb', background: '#2563eb', color: '#ffffff', cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div
          className="flex flex-wrap items-start"
          style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
            padding: '16px 24px', marginBottom: '20px', gap: '20px',
          }}
        >
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client Status</span>
            <select
              value={statusDropdown}
              onChange={(e) => setStatusDropdown(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '13px', color: '#334155', outline: 'none', fontFamily: 'inherit' }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Session Booking</option>
              <option value="pending">Pending Allocation</option>
              <option value="inactive">Inactive (30+ Days)</option>
            </select>
          </div>
          <div className="flex flex-col" style={{ flex: 1, gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Granular Tags</span>
            <div className="flex flex-wrap items-center" style={{ gap: '8px' }}>
              {['High-Risk', 'Premium Sub'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="inline-flex items-center gap-1.5"
                  style={{
                    padding: '6px 12px', borderRadius: '99px',
                    background: selectedTags.includes(tag) ? '#dbeafe' : '#eff6ff',
                    color: '#2563eb', fontSize: '13px', fontWeight: 600,
                    border: '1px solid #bfdbfe', cursor: 'pointer',
                  }}
                >
                  {tag}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ))}
              <button
                className="inline-flex items-center gap-1.5"
                style={{
                  padding: '6px 12px', borderRadius: '99px', background: '#ffffff',
                  color: '#64748b', fontSize: '13px', fontWeight: 600,
                  border: '1px dashed #cbd5e1', cursor: 'pointer',
                }}
              >
                + Add Tag
              </button>
            </div>
          </div>
          <div className="flex items-end" style={{ marginLeft: 'auto', gap: '12px' }}>
            <button
              onClick={clearFilters}
              style={{ padding: '8px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: 600, border: '1px solid #0f172a', background: 'transparent', color: '#0f172a', cursor: 'pointer' }}
            >
              Clear
            </button>
            <button
              onClick={() => setShowFilters(false)}
              style={{ padding: '8px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: 600, border: '1px solid #2563eb', background: '#2563eb', color: '#ffffff', cursor: 'pointer' }}
            >
              Apply Query
            </button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div
        className="bg-white flex flex-col"
        style={{ borderRadius: '16px', padding: '24px 32px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', gap: '20px' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading clients...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '5%' }}>Sl No</th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '22%' }}>User Name</th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}>Therapist</th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '18%' }}>Contact Number</th>
                  <th
                    className="cursor-pointer select-none"
                    onClick={() => setSortAsc(!sortAsc)}
                    style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '15%' }}
                  >
                    Last Active
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginLeft: '4px' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </th>
                  <th style={{ textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '18%' }}>Session Details</th>
                  <th style={{ textAlign: 'center', fontSize: '13px', fontWeight: 500, color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', width: '7%' }} />
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 0', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      No clients found. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((client, idx) => (
                    <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 0', fontSize: '14px', color: '#64748b' }}>
                        {(currentPage - 1) * perPage + idx + 1}
                      </td>
                      <td style={{ padding: '16px 0' }}>
                        <div className="flex items-center" style={{ gap: '12px' }}>
                          <img
                            src={client.avatar || `https://i.pravatar.cc/150?u=${client.id}`}
                            alt={client.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', background: '#f1f5f9' }}
                          />
                          <div className="flex flex-col">
                            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{client.name}</span>
                            <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{client.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 0', fontSize: '14px', color: '#334155' }}>{client.therapist}</td>
                      <td style={{ padding: '16px 0', fontSize: '14px', color: '#334155' }}>{client.phone}</td>
                      <td style={{ padding: '16px 0', fontSize: '14px', color: '#334155' }}>
                        {client.lastActiveDate}
                        <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{client.lastActiveTime}</span>
                      </td>
                      <td style={{ padding: '16px 0', fontSize: '14px', color: '#334155' }}>
                        <span
                          style={{
                            display: 'inline-block', padding: '4px 12px', borderRadius: '99px',
                            fontSize: '12px', fontWeight: 600,
                            background: client.sessionStatus === 'Schedule Booked' ? '#dcfce7' : '#fef3c7',
                            color: client.sessionStatus === 'Schedule Booked' ? '#16a34a' : '#d97706',
                          }}
                        >
                          {client.sessionStatus}
                        </span>
                        {client.sessionDate && (
                          <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{client.sessionDate}</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 0', textAlign: 'center' }}>
                        <button
                          onClick={() => openStatusModal(client.name)}
                          title="Actions"
                          style={{
                            background: 'transparent', border: 'none', color: '#64748b',
                            cursor: 'pointer', padding: '8px', borderRadius: '50%',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            SHOWING {Math.min((currentPage - 1) * perPage + 1, filtered.length)} OF {totalPages} PAGES
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#334155',
                fontSize: '13px', fontWeight: 600, cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '8px', border: 'none',
                  background: page === currentPage ? '#0f172a' : '#f1f5f9',
                  color: page === currentPage ? '#ffffff' : '#334155',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#334155',
                fontSize: '13px', fontWeight: 600, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setShowStatusModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, padding: 32, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Change Status</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Client: {statusClientName}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {['Schedule Booked', 'Pending', 'Inactive'].map((s) => (
                <button
                  key={s}
                  onClick={() => setShowStatusModal(false)}
                  style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, fontWeight: 500, color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatusModal(false)}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: '#f1f5f9', fontSize: 14, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Add New User</h3>
            {['Full Name', 'Email', 'Phone', 'Assign Therapist'].map((field) => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>{field}</label>
                <input
                  type="text"
                  placeholder={`Enter ${field.toLowerCase()}`}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1, padding: 12, borderRadius: 8, border: 'none', background: '#2563eb', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
