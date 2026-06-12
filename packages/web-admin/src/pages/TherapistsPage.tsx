import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import '@/styles/globals.css';
import healiImg from 'shared/assets/Heali-peak.png';
import profileImg from 'shared/assets/user-profile.jpg';

const allTherapists = [
  { id: 1, name: 'Dr. Ajesh Anand', email: 'ajeshanand@telehealings.com', specialization: 'Clinical Psychologist', phone: '+971 501234567', lastActiveDate: '22/04/2026', lastActiveTime: '11:10 Am', status: 'Available', statusClass: 'available', patientsCount: '15 Active', avatar: 'https://i.pravatar.cc/150?u=ajesh' },
  { id: 2, name: 'Dr. Sarah Smith', email: 'sarahsmith@telehealings.com', specialization: 'Behavioral Therapist', phone: '+971 502345678', lastActiveDate: '22/04/2026', lastActiveTime: '10:45 Am', status: 'Full Capacity', statusClass: 'full', patientsCount: '25 Active', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 3, name: 'Dr. Ethan Hunt', email: 'ethanhunt@telehealings.com', specialization: 'Psychiatrist', phone: '+971 503456789', lastActiveDate: '21/04/2026', lastActiveTime: '04:30 Pm', status: 'On Leave', statusClass: 'leave', patientsCount: '0 Active', avatar: 'https://i.pravatar.cc/150?u=ethan' },
  { id: 4, name: 'Dr. Emily Chen', email: 'emilychen@telehealings.com', specialization: 'Marriage Counselor', phone: '+971 504567890', lastActiveDate: '22/04/2026', lastActiveTime: '09:15 Am', status: 'Available', statusClass: 'available', patientsCount: '8 Active', avatar: 'https://i.pravatar.cc/150?u=emily' },
  { id: 5, name: 'Dr. Marcus Reed', email: 'marcuseed@telehealings.com', specialization: 'Child Psychologist', phone: '+971 505678901', lastActiveDate: '22/04/2026', lastActiveTime: '11:00 Am', status: 'Available', statusClass: 'available', patientsCount: '12 Active', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 6, name: 'Dr. Olivia Wilde', email: 'oliviawilde@telehealings.com', specialization: 'Clinical Psychologist', phone: '+971 506789012', lastActiveDate: '22/04/2026', lastActiveTime: '08:50 Am', status: 'Full Capacity', statusClass: 'full', patientsCount: '20 Active', avatar: 'https://i.pravatar.cc/150?u=olivia' },
  { id: 7, name: 'Dr. David Kim', email: 'davidkim@telehealings.com', specialization: 'Addiction Counselor', phone: '+971 507890123', lastActiveDate: '20/04/2026', lastActiveTime: '02:10 Pm', status: 'Available', statusClass: 'available', patientsCount: '5 Active', avatar: 'https://i.pravatar.cc/150?u=david' },
  { id: 8, name: 'Dr. Sophia Patel', email: 'sophiapatel@telehealings.com', specialization: 'Behavioral Therapist', phone: '+971 508901234', lastActiveDate: '22/04/2026', lastActiveTime: '11:05 Am', status: 'Available', statusClass: 'available', patientsCount: '14 Active', avatar: 'https://i.pravatar.cc/150?u=sophia' },
];

const specializations = ['Clinical Psychologist', 'Behavioral Therapist', 'Psychiatrist', 'Marriage Counselor', 'Child Psychologist', 'Addiction Counselor'];

const TherapistsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTherapistName, setStatusTherapistName] = useState('');
  const [dismissedInsight, setDismissedInsight] = useState(false);

  const filtered = useMemo(() => {
    let data = allTherapists;
    if (activeFilter === 'available') data = data.filter(t => t.statusClass === 'available');
    else if (activeFilter === 'full') data = data.filter(t => t.statusClass === 'full');
    else if (activeFilter === 'leave') data = data.filter(t => t.statusClass === 'leave');
    if (nameFilter) data = data.filter(t => t.name.toLowerCase().includes(nameFilter.toLowerCase()) || t.email.toLowerCase().includes(nameFilter.toLowerCase()));
    if (specFilter) data = data.filter(t => t.specialization === specFilter);
    if (statusFilter) data = data.filter(t => t.status === statusFilter);
    return data;
  }, [activeFilter, nameFilter, specFilter, statusFilter]);

  const counts = {
    all: allTherapists.length,
    available: allTherapists.filter(t => t.statusClass === 'available').length,
    full: allTherapists.filter(t => t.statusClass === 'full').length,
    leave: allTherapists.filter(t => t.statusClass === 'leave').length,
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Sidebar />
      <div className="page-shell">
        {/* Sticky Zone */}
        <div className="sticky-zone">
          <div className="sticky-inner">
            <header className="page-header">
              <div className="header-left">
                <div className="header-tab">Therapist</div>
              </div>
              <div className="header-right">
                {!dismissedInsight && (
                  <div className="heali-inline">
                    <div className="heali-insight">
                      <div className="heali-insight-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M9 21h6"/></svg>
                      </div>
                      <div className="heali-insight-content">
                        <span className="heali-insight-label">Heali Insight</span>
                        <span className="heali-insight-text">3 therapists on leave this week. Consider redistributing their sessions to <strong>Dr. Emily Chen</strong> &amp; <strong>Dr. Marcus Reed</strong>.</span>
                      </div>
                      <button className="heali-insight-dismiss" onClick={() => setDismissedInsight(true)} title="Dismiss">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>
                )}
                <img src={healiImg} className="header-mascot" alt="Mascot" />
              </div>
            </header>

            {/* Filter Row */}
            <div className="filter-row">
              <div className="filter-tabs">
                {(['all', 'available', 'full', 'leave'] as const).map(f => (
                  <button key={f} className={`filter-tab${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
                    {f === 'all' ? 'All' : f === 'available' ? 'Available' : f === 'full' ? 'Full Capacity' : 'On Leave'}
                    <span className="count">{counts[f]}</span>
                  </button>
                ))}
              </div>
              <div className="filter-row-actions">
                <button className="btn-sm btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Export CSV
                </button>
                <button className="btn-sm btn-primary" onClick={() => setShowAddModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Therapist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="content-wrapper">
          <div className="table-card">
            <div className="table-scroll">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th style={{ width: '5%' }}><span className="th-label">Sl No</span></th>
                    <th style={{ width: '22%' }}>
                      <div className="th-filter-wrap">
                        <div className="th-filter-display">
                          <span className="th-label">Therapist Name</span>
                        </div>
                        <input type="text" className="th-filter-input" placeholder="Search name..." value={nameFilter} onChange={e => setNameFilter(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }} />
                      </div>
                    </th>
                    <th style={{ width: '15%' }}>
                      <div className="th-filter-wrap">
                        <span className="th-label">Specialization</span>
                        <select className="th-filter-select" value={specFilter} onChange={e => setSpecFilter(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }}>
                          <option value="">All</option>
                          {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </th>
                    <th style={{ width: '13%' }}><span className="th-label">Contact Number</span></th>
                    <th style={{ width: '13%' }}><span className="th-label">Last Active</span></th>
                    <th style={{ width: '18%' }}>
                      <div className="th-filter-wrap">
                        <span className="th-label">Status</span>
                        <select className="th-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }}>
                          <option value="">All</option>
                          <option>Available</option>
                          <option>Full Capacity</option>
                          <option>On Leave</option>
                          <option>Suspended</option>
                        </select>
                      </div>
                    </th>
                    <th style={{ width: '9%', textAlign: 'center' }}><span className="th-label">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>
                      <div className="empty-state show">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                        <h3>No therapists found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                      </div>
                    </td></tr>
                  ) : filtered.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: '#64748b' }}>{t.id}</td>
                      <td>
                        <div className="user-cell">
                          <img src={t.avatar} className="avatar" alt={t.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <div className="avatar avatar-fallback" style={{ display: 'none' }}>{getInitials(t.name)}</div>
                          <div className="user-details">
                            <span className="user-name">{t.name}</span>
                            <span className="user-email">{t.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{t.specialization}</td>
                      <td>{t.phone}</td>
                      <td>{t.lastActiveDate}<span className="sub-text">{t.lastActiveTime}</span></td>
                      <td>
                        <span className={`status-badge ${t.statusClass}`}>{t.status}</span>
                        <span className="sub-text">{t.patientsCount}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="action-btn" title="Change Status" onClick={() => { setStatusTherapistName(t.name); setShowStatusModal(true); }}>
                          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-left">
                <div className="rows-per-page">
                  <span>Rows per page:</span>
                  <select><option value="10" selected>10</option><option value="25">25</option><option value="50">50</option></select>
                </div>
                <div className="pagination-info">SHOWING 1-{filtered.length} OF {allTherapists.length}</div>
              </div>
              <div className="pagination-nav">
                <button className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Therapist Modal */}
        {showAddModal && (
          <div className="modal-overlay active" onClick={() => setShowAddModal(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  Register New Therapist
                </div>
                <button className="modal-close" onClick={() => setShowAddModal(false)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-input" placeholder="e.g. Sarah" /></div>
                  <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-input" placeholder="e.g. Smith" /></div>
                </div>
                <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-input" placeholder="dr.smith@example.com" /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Contact Number</label><input type="tel" className="form-input" placeholder="+1 (555) 000-0000" /></div>
                  <div className="form-group"><label className="form-label">Years of Experience</label><input type="number" className="form-input" placeholder="e.g. 5" /></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <select className="form-input">
                    {specializations.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-sm btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn-sm btn-primary">Onboard Therapist</button>
              </div>
            </div>
          </div>
        )}

        {/* Change Status Modal */}
        {showStatusModal && (
          <div className="modal-overlay active" onClick={() => setShowStatusModal(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Update Operational Status
                </div>
                <button className="modal-close" onClick={() => setShowStatusModal(false)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: 14, color: '#475569', margin: '0 0 10px 0' }}>
                  Modify system privileges and matching logic for <strong style={{ color: '#0f172a' }}>{statusTherapistName}</strong>.
                </p>
                <div className="form-group">
                  <label className="form-label">System Status</label>
                  <select className="form-input">
                    <option>Available (Active)</option>
                    <option>Full Capacity</option>
                    <option>On Leave</option>
                    <option>Operational Probation</option>
                    <option style={{ color: '#dc2626', fontWeight: 600 }}>Suspended</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-sm btn-outline" onClick={() => setShowStatusModal(false)}>Cancel</button>
                <button className="btn-sm btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistsPage;
