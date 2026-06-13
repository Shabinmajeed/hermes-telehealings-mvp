import React, { useState } from 'react';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [editMode, setEditMode] = useState<Record<string, boolean>>({
    general: false,
    qualifications: false,
    clinical: false,
    admin: false,
  });

  const [specializations, setSpecializations] = useState<Record<string, boolean>>({
    'Couples Therapy': true,
    'Depression': true,
    'Anxiety': true,
    'Trauma': false,
    'Addiction': false,
    'Child Psychology': false,
    'Eating Disorders': false,
    'Grief': false,
  });

  const [clientTypes, setClientTypes] = useState<Record<string, boolean>>({
    'Adults': true,
    'Adolescents': false,
    'Couples': true,
    'Families': false,
    'Children': false,
    'Groups': false,
  });

  const toggleEdit = (section: string) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const togglePill = (
    items: Record<string, boolean>,
    setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    key: string
  ) => {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'general', label: 'General & Identity', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )},
    { id: 'qualifications', label: 'Qualifications', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    )},
    { id: 'clinical', label: 'Clinical Resume', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )},
    { id: 'admin', label: 'Admin & Payouts', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )},
  ];

  const sectionTitle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
    margin: '24px 0 16px 0',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'stretch' }}>

      {/* Header */}
      <header className="h-16 bg-white/60 backdrop-blur-sm border-b border-neutral-200/50 flex items-center justify-between px-8 flex-shrink-0 -mx-10 -mt-6">
        <div className="header-title">
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>My Profile</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Manage your personal and professional details.</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => window.location.href = './workflows/verification/verification-hub.html'}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', borderRadius: '8px',
              backgroundColor: '#2a73d4', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Verification Hub
          </button>
        </div>
      </header>

      {/* Horizontal Tabs */}
      <div
        style={{
          background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '12px',
          display: 'flex', flexDirection: 'row', gap: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)', overflowX: 'auto',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px', background: activeTab === tab.id ? '#e2effb' : 'transparent',
              border: 'none', textAlign: 'center', fontSize: '14px', fontWeight: 600,
              color: activeTab === tab.id ? '#2a73d4' : '#64748b', cursor: 'pointer', borderRadius: '10px',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', whiteSpace: 'nowrap',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1, background: '#ffffff', borderRadius: '16px', padding: '32px',
          border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        }}
      >
        {/* General & Identity Panel */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>General & Identity</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Manage your basic personal information and profile picture.</div>
              </div>
              <button
                onClick={() => toggleEdit('general')}
                style={{
                  backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0',
                  borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', display: editMode.general ? 'none' : 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            </div>

            {/* View Mode */}
            {!editMode.general && (
              <div>
                {/* Hero Section */}
                <div style={{
                  display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px', padding: '24px',
                  background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0',
                }}>
                  <img
                    src="https://i.pravatar.cc/150?img=11" alt="Profile Picture"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', flexShrink: 0 }}
                  />
                  <div>
                    <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#0f172a' }}>Ajesh Anand</h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                      Experienced therapist specializing in cognitive behavioral therapy with over 10 years of practice helping individuals overcome anxiety and depression.
                    </p>
                  </div>
                </div>

                {/* Contact & Identity */}
                <div style={{ ...sectionTitle, marginTop: 0 }}>Contact & Identity</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Email Address</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>ajeshanand@telehealings.com</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Phone Number</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>+91 98765 43210</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Date of Birth</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>June 15, 1985</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Govt ID (Aadhaar/Passport)</label>
                    <p style={{ fontSize: '15px', color: '#2a73d4', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>ID_Proof.pdf</p>
                  </div>
                </div>

                {/* Professional Summary */}
                <div style={sectionTitle}>Professional Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Years of Experience</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>10 Years</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Areas of Specialization</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                      {Object.entries(specializations).filter(([, v]) => v).map(([key]) => (
                        <div key={key} style={{
                          background: '#2a73d4', color: '#ffffff', padding: '8px 16px', borderRadius: '20px',
                          fontSize: '13px', fontWeight: 600, border: '1px solid #2a73d4', cursor: 'default',
                        }}>{key}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Types of Clients Worked With</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                      {Object.entries(clientTypes).filter(([, v]) => v).map(([key]) => (
                        <div key={key} style={{
                          background: '#2a73d4', color: '#ffffff', padding: '8px 16px', borderRadius: '20px',
                          fontSize: '13px', fontWeight: 600, border: '1px solid #2a73d4', cursor: 'default',
                        }}>{key}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {editMode.general && (
              <div>
                {/* Avatar Upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <img
                    src="https://i.pravatar.cc/150?img=11" alt="Profile Picture"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                  />
                  <div>
                    <button style={{
                      background: '#2a73d4', color: '#fff', border: 'none', borderRadius: '8px',
                      padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '4px', display: 'block',
                    }}>Change Picture</button>
                    <button style={{
                      background: 'transparent', color: '#ef4444', border: 'none',
                      padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>Remove</button>
                  </div>
                </div>

                {/* Basic Intro */}
                <div style={{ ...sectionTitle, marginTop: 0 }}>Basic Intro</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>First Name</label>
                    <input type="text" defaultValue="Ajesh" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Last Name</label>
                    <input type="text" defaultValue="Anand" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Bio / About Me</label>
                    <textarea defaultValue="Experienced therapist specializing in cognitive behavioral therapy with over 10 years of practice helping individuals overcome anxiety and depression." style={{
                      width: '100%', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }} />
                  </div>
                </div>

                {/* Contact & Identity */}
                <div style={sectionTitle}>Contact & Identity</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address</label>
                    <input type="email" defaultValue="ajeshanand@telehealings.com" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Phone Number</label>
                    <input type="tel" defaultValue="+91 98765 43210" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Date of Birth</label>
                    <input type="date" defaultValue="1985-06-15" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Govt ID (Aadhaar/Passport)</label>
                    <div style={{
                      border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '16px', textAlign: 'center',
                      background: '#f8fafc', fontSize: '13px', color: '#64748b', cursor: 'pointer',
                    }}>Uploaded: ID_Proof.pdf</div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div style={sectionTitle}>Professional Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Years of Experience</label>
                    <input type="number" defaultValue="10" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Areas of Specialization</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                      {Object.entries(specializations).map(([key, selected]) => (
                        <div
                          key={key}
                          onClick={() => togglePill(specializations, setSpecializations, key)}
                          style={{
                            background: selected ? '#2a73d4' : '#f1f5f9', color: selected ? '#ffffff' : '#475569',
                            padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', border: `1px solid ${selected ? '#2a73d4' : '#e2e8f0'}`, transition: 'all 0.2s',
                          }}
                        >{key}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Types of Clients Worked With</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                      {Object.entries(clientTypes).map(([key, selected]) => (
                        <div
                          key={key}
                          onClick={() => togglePill(clientTypes, setClientTypes, key)}
                          style={{
                            background: selected ? '#2a73d4' : '#f1f5f9', color: selected ? '#ffffff' : '#475569',
                            padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', border: `1px solid ${selected ? '#2a73d4' : '#e2e8f0'}`, transition: 'all 0.2s',
                          }}
                        >{key}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => toggleEdit('general')}
                    style={{
                      padding: '10px 24px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#0f172a',
                      border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >Cancel</button>
                  <button
                    onClick={() => toggleEdit('general')}
                    style={{
                      padding: '10px 24px', borderRadius: '8px', backgroundColor: '#2a73d4', color: '#ffffff',
                      border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >Save Changes</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Qualifications Panel */}
        {activeTab === 'qualifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Educational Qualifications & Licenses</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Update your academic degrees and licensing credentials.</div>
              </div>
              <button
                onClick={() => toggleEdit('qualifications')}
                style={{
                  backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0',
                  borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', display: editMode.qualifications ? 'none' : 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Credentials
              </button>
            </div>

            {/* View Mode */}
            {!editMode.qualifications && (
              <div>
                <div style={{ ...sectionTitle, marginTop: 0 }}>Education Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Degree Type</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>Post Graduate</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Field of Study</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>Clinical Psychology</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Year Completed</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>2013</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Certificate Document</label>
                    <p style={{ fontSize: '15px', color: '#2a73d4', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>Degree_Cert.pdf</p>
                  </div>
                </div>

                <div style={sectionTitle}>License Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>License Type</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>RCI Registration (India)</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>License Number</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>CRR No. 12345</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Validity</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>Dec 31, 2028</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>License Document</label>
                    <p style={{ fontSize: '15px', color: '#2a73d4', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>RCI_License.pdf</p>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {editMode.qualifications && (
              <div>
                <div style={{ ...sectionTitle, marginTop: 0 }}>Education Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Degree Type</label>
                    <select style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#fff',
                    }}>
                      <option>Degree</option>
                      <option selected>Post Graduate</option>
                      <option>Certification</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Field of Study</label>
                    <input type="text" defaultValue="Clinical Psychology" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Year Completed</label>
                    <input type="number" defaultValue="2013" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Upload Certificate</label>
                    <div style={{
                      border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '16px', textAlign: 'center',
                      background: '#f8fafc', fontSize: '13px', color: '#64748b', cursor: 'pointer',
                    }}>Uploaded: Degree_Cert.pdf</div>
                  </div>
                </div>

                <div style={sectionTitle}>License Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>License Type</label>
                    <select style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#fff',
                    }}>
                      <option selected>RCI Registration (India)</option>
                      <option>Medical Council Registration</option>
                      <option>Counsellor Council of India</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>License Number</label>
                    <input type="text" defaultValue="CRR No. 12345" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Validity</label>
                    <input type="date" defaultValue="2028-12-31" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Upload License</label>
                    <div style={{
                      border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '16px', textAlign: 'center',
                      background: '#f8fafc', fontSize: '13px', color: '#64748b', cursor: 'pointer',
                    }}>Uploaded: RCI_License.pdf</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => toggleEdit('qualifications')}
                    style={{
                      padding: '10px 24px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#0f172a',
                      border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >Cancel</button>
                  <button
                    onClick={() => toggleEdit('qualifications')}
                    style={{
                      padding: '10px 24px', borderRadius: '8px', backgroundColor: '#2a73d4', color: '#ffffff',
                      border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >Save Changes</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clinical Resume Panel */}
        {activeTab === 'clinical' && (
          <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Clinical Profile</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Manage your professional resume and other clinical documents.</div>
              </div>
              <button
                onClick={() => toggleEdit('clinical')}
                style={{
                  backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0',
                  borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', display: editMode.clinical ? 'none' : 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Resume
              </button>
            </div>

            {/* View Mode */}
            {!editMode.clinical && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>CV / Resume Document</label>
                    <p style={{ fontSize: '15px', color: '#2a73d4', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>Ajesh_Resume_2023.pdf</p>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {editMode.clinical && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>CV / Resume</label>
                    <div style={{
                      border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '16px', textAlign: 'center',
                      background: '#f8fafc', fontSize: '13px', color: '#64748b', cursor: 'pointer',
                    }}>Uploaded: Ajesh_Resume_2023.pdf</div>
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => toggleEdit('clinical')}
                    style={{
                      padding: '10px 24px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#0f172a',
                      border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >Cancel</button>
                  <button
                    onClick={() => toggleEdit('clinical')}
                    style={{
                      padding: '10px 24px', borderRadius: '8px', backgroundColor: '#2a73d4', color: '#ffffff',
                      border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >Save Changes</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin & Payouts Panel */}
        {activeTab === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Admin & Payouts</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Manage your bank details and scheduling capacity.</div>
              </div>
              <button
                onClick={() => toggleEdit('admin')}
                style={{
                  backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0',
                  borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', display: editMode.admin ? 'none' : 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Payouts
              </button>
            </div>

            {/* View Mode */}
            {!editMode.admin && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Bank Account Number</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>XXXXXXXX9876</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>IFSC / Routing Code</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>HDFC0001234</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Maximum Caseload Capacity (Per Week)</label>
                    <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>20 Sessions</p>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {editMode.admin && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Bank Account Number</label>
                    <input type="password" defaultValue="XXXXXXXX9876" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>IFSC / Routing Code</label>
                    <input type="text" defaultValue="HDFC0001234" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Maximum Caseload Capacity (Per Week)</label>
                    <input type="number" defaultValue="20" style={{
                      width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => toggleEdit('admin')}
                    style={{
                      padding: '10px 24px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#0f172a',
                      border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >Cancel</button>
                  <button
                    onClick={() => toggleEdit('admin')}
                    style={{
                      padding: '10px 24px', borderRadius: '8px', backgroundColor: '#2a73d4', color: '#ffffff',
                      border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >Save Changes</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* fadeIn keyframe */}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default ProfilePage;
