import React, { useState } from 'react';
import '@/styles/globals.css';
import logoImg from 'shared/assets/logo.png';
import healiImg from 'shared/assets/Heali-peak.png';

const SPECIALIZATIONS = [
  'Clinical Psychology',
  'Cognitive Behavioral Therapy',
  'Couples Therapy',
  'Child Psychology',
];

const RegistrationPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [dobType, setDobType] = useState<'text' | 'date'>('text');
  const [specialization, setSpecialization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleToggleTerms = () => {
    if (termsAccepted) {
      setTermsAccepted(false);
    } else {
      setShowTermsModal(true);
    }
  };

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    setTermsAccepted(true);
  };

  const handleDenyTerms = () => {
    setShowTermsModal(false);
    setTermsAccepted(false);
  };

  const handleRegister = () => {
    if (!termsAccepted) {
      alert('Please accept the Terms and Conditions before registering.');
      return;
    }
    setShowSuccessModal(true);
  };

  const handleBackToLogin = () => {
    setShowSuccessModal(false);
    window.location.href = '/login';
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
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#144db9',
            marginTop: -4,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Continuity-First Wellness Care Platform
        </p>
      </div>

      {/* Registration Card Container */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 550 }}>
        {/* Heali Mascot - peeking from left */}
        <img
          src={healiImg}
          alt="Penguin Mascot"
          className="hidden md:block"
          style={{
            position: 'absolute',
            top: -140,
            left: -120,
            width: 250,
            height: 'auto',
            zIndex: 0,
            transform: 'scaleX(-1)',
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
            style={{
              padding: 40,
              overflowY: 'auto',
            }}
          >
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
              Create an Account
            </h2>

            {/* Page Subtitle */}
            <p
              style={{
                fontSize: 14,
                color: '#64748b',
                marginBottom: 24,
                lineHeight: 1.5,
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Join the Telehealings provider network to expand your practice and manage your clients seamlessly.
            </p>

            {/* Form Fields Group (scrollable) */}
            <div
              style={{
                maxHeight: 280,
                overflowY: 'auto',
                paddingRight: 8,
              }}
            >
              {/* Row: First Name + Last Name */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ position: 'relative', marginBottom: 20, flex: 1 }}>
                  <svg
                    className="absolute"
                    style={{
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 20,
                      height: 20,
                      color: '#64748b',
                      pointerEvents: 'none',
                    }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 42px',
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

                <div style={{ position: 'relative', marginBottom: 20, flex: 1 }}>
                  <svg
                    className="absolute"
                    style={{
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 20,
                      height: 20,
                      color: '#64748b',
                      pointerEvents: 'none',
                    }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 42px',
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

              {/* Email Input */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <svg
                  className="absolute"
                  style={{
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 20,
                    height: 20,
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 42px',
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

              {/* Date of Birth Input */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <svg
                  className="absolute"
                  style={{
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 20,
                    height: 20,
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input
                  type={dobType}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="Date of Birth"
                  onFocus={() => setDobType('date')}
                  onBlur={() => {
                    if (!dob) setDobType('text');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 42px',
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
                  onFocusCapture={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.style.borderColor = '#2a73d4';
                    target.style.backgroundColor = '#ffffff';
                    target.style.boxShadow = '0 0 0 3px rgba(42, 115, 212, 0.1)';
                  }}
                  onBlurCapture={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.style.borderColor = '#cbd5e1';
                    target.style.backgroundColor = '#f8fafc';
                    target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Specialization Select */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <svg
                  className="absolute"
                  style={{
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 20,
                    height: 20,
                    color: '#64748b',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <select
                  value={specialization}
                  onChange={(e) => {
                    setSpecialization(e.target.value);
                    e.target.style.color = '#0f172a';
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 42px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    fontSize: 15,
                    fontFamily: "'Inter', sans-serif",
                    color: specialization ? '#0f172a' : '#64748b',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    appearance: 'auto',
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
                  <option value="" disabled>Select Specialization</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Password Input */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <svg
                  className="absolute"
                  style={{
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 20,
                    height: 20,
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 42px',
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

              {/* Confirm Password Input */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <svg
                  className="absolute"
                  style={{
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 20,
                    height: 20,
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 42px',
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

            {/* Terms Checkbox */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 20,
                marginBottom: 24,
                textAlign: 'left',
              }}
            >
              <div
                onClick={handleToggleTerms}
                style={{
                  width: 20,
                  height: 20,
                  border: termsAccepted ? '2px solid #2a73d4' : '2px solid #cbd5e1',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  backgroundColor: termsAccepted ? '#2a73d4' : '#ffffff',
                }}
              >
                {termsAccepted && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#475569',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                I agree to the{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  style={{
                    color: '#2a73d4',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Terms and Conditions
                </a>
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
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
              Register
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
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Already have an account?{' '}
            <a
              href="/login"
              style={{
                color: '#2a73d4',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Log in
            </a>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '32px 24px',
              width: '90%',
              maxWidth: 400,
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                background: '#e2effb',
                color: '#2a73d4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Check Your Email
            </h3>
            <p
              style={{
                fontSize: 14,
                color: '#64748b',
                lineHeight: 1.5,
                marginBottom: 24,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              We've sent a verification link to your email address. Please verify your account to continue.
            </p>
            <button
              onClick={handleBackToLogin}
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
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2361b5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2a73d4')}
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '32px 24px',
              width: '90%',
              maxWidth: 500,
              textAlign: 'left',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: 16,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Terms and Conditions
            </h3>

            <div
              style={{
                maxHeight: 250,
                overflowY: 'auto',
                fontSize: 13,
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: 24,
                paddingRight: 10,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <p>
                <strong>1. Introduction</strong>
                <br />
                Welcome to Telehealings. By signing up, you agree to abide by our terms of service.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>2. Professional Conduct</strong>
                <br />
                As a therapist on our platform, you are expected to maintain professional standards, verify your credentials, and uphold the platform's guidelines.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>3. Privacy & HIPAA Compliance</strong>
                <br />
                All patient data must be handled in strict accordance with HIPAA regulations and our internal privacy policy.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>4. Payments</strong>
                <br />
                Platform fees and payout schedules are detailed in your provider agreement. Terms are subject to change with 30 days notice.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>5. Termination</strong>
                <br />
                We reserve the right to suspend or terminate accounts violating these terms.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>6. Liability</strong>
                <br />
                Telehealings is a technology platform and does not provide medical advice. Therapists are independent contractors.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>7. Dispute Resolution</strong>
                <br />
                Any disputes arising from these terms will be handled in arbitration according to local laws.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleDenyTerms}
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              >
                Deny
              </button>
              <button
                onClick={handleAcceptTerms}
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: '#2a73d4',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2361b5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2a73d4')}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
