import React, { useState, useRef } from 'react';
import '@/styles/globals.css';
import logoImg from 'shared/assets/logo.png';
import healiImg from 'shared/assets/Heali-peak.png';

const SPECIALIZATIONS = [
  'Clinical Psychology',
  'Counseling',
  'Psychiatry',
  'Social Work (LCSW)',
  'Marriage & Family Therapy',
];

const RegistrationProfessionalDetailsPage: React.FC = () => {
  const [specialization, setSpecialization] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = () => {
    alert('Proceeding to Step 3: Verification Pending Screen');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        overflow: 'hidden',
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header & Branding */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: 30,
        }}
      >
        <img
          src={logoImg}
          alt="Telehealings Logo"
          style={{ width: 70, height: 70, marginBottom: 12 }}
        />
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-1px',
            color: '#0745b1',
            marginBottom: 6,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Telehealings
        </h1>
      </div>

      {/* Registration Card Container */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 550 }}>
        {/* Heali Mascot - peeking from top-right */}
        <img
          src={healiImg}
          alt="Penguin Mascot"
          className="hidden md:block"
          style={{
            position: 'absolute',
            top: -140,
            right: -120,
            width: 250,
            height: 'auto',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '80vh',
          }}
        >
          {/* Card Body */}
          <div
            className="professional-details-card-body"
            style={{
              padding: 40,
              overflowY: 'auto',
            }}
          >
            {/* Step Indicator */}
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#2a73d4',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 8,
                display: 'block',
              }}
            >
              Step 2 of 2
            </span>

            {/* Page Title */}
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: 8,
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Professional Details
            </h2>

            {/* Page Subtitle */}
            <p
              style={{
                fontSize: 14,
                color: '#64748b',
                marginBottom: 30,
                lineHeight: 1.5,
                textAlign: 'center',
              }}
            >
              Provide your credentialing information so we can verify your practice.
            </p>

            {/* Form Fields Group */}
            <div
              className="professional-details-form-group"
              style={{
                maxHeight: 280,
                overflowY: 'auto',
                paddingRight: 8,
              }}
            >
              {/* Row: Specialization + NPI */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ position: 'relative', marginBottom: 20, flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: 8,
                    }}
                  >
                    Primary Specialization
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      fontSize: 15,
                      fontFamily: "'Inter', sans-serif",
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2a73d4';
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(42, 115, 212, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="" disabled>Select specialization</option>
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div style={{ position: 'relative', marginBottom: 20, flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: 8,
                    }}
                  >
                    NPI Number
                  </label>
                  <input
                    type="text"
                    value={npiNumber}
                    onChange={(e) => setNpiNumber(e.target.value)}
                    placeholder="10-digit NPI"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      fontSize: 15,
                      fontFamily: "'Inter', sans-serif",
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2a73d4';
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(42, 115, 212, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* State License Number */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#475569',
                    marginBottom: 8,
                  }}
                >
                  State License Number
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. PSY123456"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    fontSize: 15,
                    fontFamily: "'Inter', sans-serif",
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2a73d4';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(42, 115, 212, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* File Upload Zone */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#475569',
                    marginBottom: 8,
                  }}
                >
                  Upload Medical License
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: 8,
                    padding: '30px 20px',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2a73d4';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginBottom: 10 }}
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p style={{ fontSize: 14, color: '#475569', margin: '0 0 4px 0' }}>
                    <span style={{ color: '#2a73d4', fontWeight: 600 }}>Click to upload</span> or drag and drop
                  </p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>PDF, JPG, or PNG (Max. 5MB)</p>
                  {fileName && (
                    <p style={{ fontSize: 12, color: '#2a73d4', marginTop: 8, fontWeight: 600 }}>
                      Selected: {fileName}
                    </p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: 16,
                backgroundColor: '#2a73d4',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                marginTop: 10,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2361b5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2a73d4')}
            >
              Submit Application
            </button>
          </div>

          {/* Card Footer */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              padding: 22,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 500,
              color: '#475569',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                color: '#64748b',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to previous step
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationProfessionalDetailsPage;
