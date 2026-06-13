import React, { useState, useRef, useEffect, useCallback } from 'react';

interface EducationBlock {
  id: string;
  degreeType: string;
  fieldOfStudy: string;
  yearCompleted: string;
}

interface LicenseBlock {
  id: string;
  licenseType: string;
  licenseNumber: string;
  validity: string;
}

const SPECIALIZATIONS = [
  'Trauma',
  'Couples Therapy',
  'Addiction',
  'Depression',
  'Anxiety',
  'Child Psychology',
  'Eating Disorders',
  'Grief',
];

const CLIENT_TYPES = [
  'Adults',
  'Adolescents',
  'Couples',
  'Families',
  'Children',
  'Groups',
];

const LICENSE_OPTIONS = [
  'RCI Registration (India)',
  'Medical Council Registration',
  'Counsellor Council of India',
  'Other',
];

const VerificationHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(25);

  // Identity fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');

  // Education blocks
  const [educationBlocks, setEducationBlocks] = useState<EducationBlock[]>([
    { id: 'edu-1', degreeType: 'Degree', fieldOfStudy: '', yearCompleted: '' },
  ]);

  // License blocks
  const [licenseBlocks, setLicenseBlocks] = useState<LicenseBlock[]>([
    { id: 'lic-1', licenseType: 'RCI Registration (India)', licenseNumber: '', validity: '' },
  ]);

  // Clinical fields
  const [yearsExperience, setYearsExperience] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<Record<string, boolean>>({});
  const [selectedClientTypes, setSelectedClientTypes] = useState<Record<string, boolean>>({});

  // Signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const switchTab = useCallback((index: number) => {
    setActiveTab(index);
    setProgress([25, 50, 75, 100][index]);
  }, []);

  const addEducationBlock = () => {
    setEducationBlocks((prev) => [
      ...prev,
      { id: `edu-${Date.now()}`, degreeType: 'Degree', fieldOfStudy: '', yearCompleted: '' },
    ]);
  };

  const removeEducationBlock = (id: string) => {
    setEducationBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateEducationBlock = (id: string, field: keyof EducationBlock, value: string) => {
    setEducationBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const addLicenseBlock = () => {
    setLicenseBlocks((prev) => [
      ...prev,
      { id: `lic-${Date.now()}`, licenseType: 'RCI Registration (India)', licenseNumber: '', validity: '' },
    ]);
  };

  const removeLicenseBlock = (id: string) => {
    setLicenseBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateLicenseBlock = (id: string, field: keyof LicenseBlock, value: string) => {
    setLicenseBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const toggleSpecialization = (key: string) => {
    setSelectedSpecializations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleClientType = (key: string) => {
    setSelectedClientTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Signature pad logic
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0f172a';
    }
  }, []);

  useEffect(() => {
    if (activeTab === 3) {
      setTimeout(initCanvas, 100);
    }
  }, [activeTab, initCanvas]);

  useEffect(() => {
    const handleResize = () => {
      if (activeTab === 3) {
        initCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, initCanvas]);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.preventDefault();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    e.preventDefault();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const tabs = [
    {
      label: 'Identity & Basic',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: 'Qualifications',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      label: 'Clinical Resume',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      label: 'Consents & Ethics',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
  ];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#e5e5e5',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  };

  const verificationContainerStyle: React.CSSProperties = {
    background: '#ffffff',
    width: '100%',
    maxWidth: '1000px',
    height: '90vh',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: '24px 32px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const bodyStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  };

  const sidebarStyle: React.CSSProperties = {
    width: '260px',
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto',
    background: '#ffffff',
  };

  const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  };

  const getTabStyle = (index: number): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    color: activeTab === index ? '#2a73d4' : '#475569',
    cursor: 'pointer',
    border: 'none',
    background: activeTab === index ? '#e2effb' : 'transparent',
    textAlign: 'left',
    transition: 'all 0.2s',
    width: '100%',
  });

  const getPanelStyle = (index: number): React.CSSProperties => ({
    display: activeTab === index ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.3s ease',
  });

  const formGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const formLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    background: '#f8fafc',
    fontFamily: 'inherit',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const uploadZoneStyle: React.CSSProperties = {
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    background: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const dynamicBlockStyle: React.CSSProperties = {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    position: 'relative',
    background: '#f8fafc',
  };

  const ethicsBoxStyle: React.CSSProperties = {
    height: '200px',
    overflowY: 'auto',
    border: '1px solid #cbd5e1',
    padding: '16px',
    borderRadius: '8px',
    background: '#f8fafc',
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#334155',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .v-content::-webkit-scrollbar { width: 6px; }
        .v-content::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .upload-zone-hover:hover { border-color: #2a73d4 !important; background: #eff6ff !important; }
        .pill-hover:hover { background: #e2effb !important; border-color: #93c5fd !important; }
      `}</style>

      <div style={verificationContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
              Profile & Verification Hub
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Complete your professional resume to get verified.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 600, color: '#2a73d4' }}>
              <span>{progress}% Complete</span>
              <div style={{ width: '120px', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#2a73d4', borderRadius: '10px', transition: 'width 0.3s ease' }} />
              </div>
            </div>
            <button
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          {/* Sidebar */}
          <div style={sidebarStyle}>
            {tabs.map((tab, index) => (
              <button
                key={index}
                style={getTabStyle(index)}
                onClick={() => switchTab(index)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="v-content" style={contentStyle}>
            {/* Panel 1: Identity & Basic */}
            <div style={getPanelStyle(0)}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 4px 0' }}>Identity & Basic Verification</h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0' }}>
                Provide your legal identity documents for background checks.
              </p>

              <div style={formGridStyle}>
                <div style={formGroupStyle}>
                  <label style={formLabelStyle}>First Name</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="e.g. Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={formLabelStyle}>Last Name</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="e.g. Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={formLabelStyle}>Date of Birth</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Government-Issued ID (Aadhaar / Passport / License)</label>
                  <div className="upload-zone-hover" style={uploadZoneStyle}>
                    <svg style={{ color: '#94a3b8', marginBottom: '8px' }} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 4px 0' }}>
                      <span style={{ color: '#2a73d4', fontWeight: 600 }}>Click to upload</span> or drag and drop
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>PDF, JPG, or PNG (Max. 5MB)</p>
                  </div>
                </div>
                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Recent Professional Photograph</label>
                  <div className="upload-zone-hover" style={uploadZoneStyle}>
                    <svg style={{ color: '#94a3b8', marginBottom: '8px' }} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 4px 0' }}>
                      <span style={{ color: '#2a73d4', fontWeight: 600 }}>Upload Photo</span>
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Square aspect ratio preferred</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: '#2a73d4', color: '#ffffff', border: 'none' }}
                  onClick={() => switchTab(1)}
                >
                  Save & Continue
                </button>
              </div>
            </div>

            {/* Panel 2: Qualifications */}
            <div style={getPanelStyle(1)}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 4px 0' }}>Educational Qualifications & Licenses</h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0' }}>
                Detail your academic background and professional registrations.
              </p>

              {/* Education Blocks */}
              {educationBlocks.map((block) => (
                <div key={block.id} style={dynamicBlockStyle}>
                  {educationBlocks.length > 1 && (
                    <button
                      type="button"
                      style={{ position: 'absolute', top: '12px', right: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                      onClick={() => removeEducationBlock(block.id)}
                    >
                      Remove
                    </button>
                  )}
                  <h3 style={{ fontSize: '15px', margin: '0 0 16px 0', color: '#0f172a' }}>
                    {block.id === 'education-blocks' ? 'Education Details' : 'Education Details'}
                  </h3>
                  <div style={formGridStyle}>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Degree Type</label>
                      <select
                        style={{ ...inputStyle, background: '#fff' }}
                        value={block.degreeType}
                        onChange={(e) => updateEducationBlock(block.id, 'degreeType', e.target.value)}
                      >
                        <option>Degree</option>
                        <option>Post Graduate</option>
                        <option>Certification</option>
                      </select>
                    </div>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Field of Study</label>
                      <input
                        type="text"
                        style={inputStyle}
                        placeholder="e.g. Clinical Psychology"
                        value={block.fieldOfStudy}
                        onChange={(e) => updateEducationBlock(block.id, 'fieldOfStudy', e.target.value)}
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Year Completed</label>
                      <input
                        type="number"
                        style={inputStyle}
                        placeholder="e.g. 2020"
                        value={block.yearCompleted}
                        onChange={(e) => updateEducationBlock(block.id, 'yearCompleted', e.target.value)}
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Upload Certificate</label>
                      <input type="file" style={{ ...inputStyle, padding: '9px 14px' }} />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: '#ffffff', color: '#2a73d4', border: '1px solid #2a73d4', marginTop: '10px' }}
                onClick={addEducationBlock}
              >
                + Add Another Education
              </button>

              {/* License Blocks */}
              <div style={{ marginTop: '32px' }}>
                {licenseBlocks.map((block) => (
                  <div key={block.id} style={dynamicBlockStyle}>
                    {licenseBlocks.length > 1 && (
                      <button
                        type="button"
                        style={{ position: 'absolute', top: '12px', right: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                        onClick={() => removeLicenseBlock(block.id)}
                      >
                        Remove
                      </button>
                    )}
                    <h3 style={{ fontSize: '15px', margin: '0 0 16px 0', color: '#0f172a' }}>License Details</h3>
                    <div style={formGridStyle}>
                      <div style={formGroupStyle}>
                        <label style={formLabelStyle}>License Type</label>
                        <select
                          style={{ ...inputStyle, background: '#fff' }}
                          value={block.licenseType}
                          onChange={(e) => updateLicenseBlock(block.id, 'licenseType', e.target.value)}
                        >
                          {LICENSE_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div style={formGroupStyle}>
                        <label style={formLabelStyle}>License Number</label>
                        <input
                          type="text"
                          style={inputStyle}
                          placeholder="e.g. CRR No. 12345"
                          value={block.licenseNumber}
                          onChange={(e) => updateLicenseBlock(block.id, 'licenseNumber', e.target.value)}
                        />
                      </div>
                      <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Validity (if applicable)</label>
                        <input
                          type="date"
                          style={inputStyle}
                          value={block.validity}
                          onChange={(e) => updateLicenseBlock(block.id, 'validity', e.target.value)}
                        />
                      </div>
                      <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Upload License</label>
                        <input type="file" style={{ ...inputStyle, padding: '9px 14px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: '#ffffff', color: '#2a73d4', border: '1px solid #2a73d4', marginTop: '10px' }}
                onClick={addLicenseBlock}
              >
                + Add Another License
              </button>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: '#2a73d4', color: '#ffffff', border: 'none' }}
                  onClick={() => switchTab(2)}
                >
                  Save & Continue
                </button>
              </div>
            </div>

            {/* Panel 3: Clinical Resume */}
            <div style={getPanelStyle(2)}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 4px 0' }}>Clinical Profile & Resume</h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0' }}>
                Build your platform resume to match with the right clients.
              </p>

              <div style={formGridStyle}>
                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Years of Experience</label>
                  <input
                    type="number"
                    style={inputStyle}
                    placeholder="e.g. 5"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                  />
                </div>
                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Areas of Specialization</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                    {SPECIALIZATIONS.map((spec) => (
                      <div
                        key={spec}
                        className="pill-hover"
                        onClick={() => toggleSpecialization(spec)}
                        style={{
                          background: selectedSpecializations[spec] ? '#2a73d4' : '#f1f5f9',
                          color: selectedSpecializations[spec] ? '#ffffff' : '#475569',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: `1px solid ${selectedSpecializations[spec] ? '#2a73d4' : '#e2e8f0'}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Types of Clients Worked With</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                    {CLIENT_TYPES.map((type) => (
                      <div
                        key={type}
                        className="pill-hover"
                        onClick={() => toggleClientType(type)}
                        style={{
                          background: selectedClientTypes[type] ? '#2a73d4' : '#f1f5f9',
                          color: selectedClientTypes[type] ? '#ffffff' : '#475569',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: `1px solid ${selectedClientTypes[type] ? '#2a73d4' : '#e2e8f0'}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Upload CV / Resume</label>
                  <div className="upload-zone-hover" style={uploadZoneStyle}>
                    <svg style={{ color: '#94a3b8', marginBottom: '8px' }} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 4px 0' }}>
                      <span style={{ color: '#2a73d4', fontWeight: 600 }}>Upload Updated CV</span>
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>PDF preferred</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: '#2a73d4', color: '#ffffff', border: 'none' }}
                  onClick={() => switchTab(3)}
                >
                  Save & Continue
                </button>
              </div>
            </div>

            {/* Panel 4: Consents & Ethics */}
            <div style={getPanelStyle(3)}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 4px 0' }}>Consents & Ethics Agreement</h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0' }}>
                Please review and agree to the Telehealings platform ethics policy.
              </p>

              <div style={formGridStyle}>
                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Code of Ethics</label>
                  <div style={ethicsBoxStyle}>
                    <p><strong>1. Confidentiality:</strong> Therapists must maintain patient confidentiality and protect privacy in all communications, ensuring strict adherence to HIPAA and relevant local guidelines.</p>
                    <p><strong>2. Professional Boundaries:</strong> Therapists must not engage in dual relationships or inappropriate conduct with any patients assigned through the platform.</p>
                    <p><strong>3. Competence & Care:</strong> Practitioners agree to only provide services within their specialized areas of expertise, maintaining high standards of care.</p>
                    <p><strong>4. Emergency Protocols:</strong> In the event of a severe clinical emergency, therapists are obligated to guide the client to local emergency services.</p>
                    <p><strong>5. Platform Conduct:</strong> All communications, scheduling, and billing must remain within the Telehealings application to ensure transparency and proper logging.</p>
                  </div>
                </div>

                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Confidentiality Agreement</label>
                  <div style={ethicsBoxStyle}>
                    <p><strong>1. Client Privacy:</strong> I agree to hold all information shared by clients in strict confidence, both during and after the termination of the therapeutic relationship.</p>
                    <p><strong>2. Data Protection:</strong> I will ensure that all digital and physical records are stored securely and in compliance with applicable data protection laws (e.g., HIPAA or local equivalents).</p>
                    <p><strong>3. Platform Usage:</strong> I understand that session notes and communications within the Telehealings platform are encrypted and must not be exported or shared via unauthorized third-party channels.</p>
                    <p><strong>4. Exceptions:</strong> I am aware of the legal and ethical exceptions to confidentiality, including imminent risk of harm to the client or others, and mandatory reporting laws regarding abuse.</p>
                  </div>
                </div>

                <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={formLabelStyle}>Digital Signature</label>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff', position: 'relative' }}>
                    <canvas
                      ref={canvasRef}
                      style={{ width: '100%', height: '160px', display: 'block', touchAction: 'none', cursor: 'crosshair' }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    <button
                      type="button"
                      onClick={clearSignature}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', color: '#475569' }}
                    >
                      Clear
                    </button>
                  </div>
                  <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    Sign using your mouse, trackpad, or finger.
                  </small>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: '#2a73d4', color: '#ffffff', border: 'none' }}
                  onClick={() => alert('Profile submitted successfully! Telehealings admin will review your application.')}
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationHubPage;
