import React, { useState } from 'react';

type TabKey = 'general' | 'security' | 'notifications';

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onChange}
    className="relative inline-flex items-center cursor-pointer flex-shrink-0 transition-colors duration-200 rounded-full"
    style={{
      width: '44px',
      height: '24px',
      padding: '2px',
      backgroundColor: enabled ? '#2a73d4' : '#cbd5e1',
    }}
  >
    <span
      className="bg-white rounded-full shadow-sm transition-transform duration-200"
      style={{
        width: '20px',
        height: '20px',
        transform: enabled ? 'translateX(20px)' : 'translateX(0)',
        display: 'block',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    />
  </button>
);

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  // General settings state
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('dd/mm/yyyy');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontFamily: 'inherit',
    fontSize: '14px',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s, background-color 0.2s',
    boxSizing: 'border-box',
    color: '#111111',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'auto',
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: 'general',
      label: 'General Settings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      key: 'security',
      label: 'Security & Password',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
  ];

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    padding: '32px',
  };

  const btnPrimaryStyle: React.CSSProperties = {
    background: '#2a73d4',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Page Header - sticky with blur */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '40px 40px 20px 40px',
          margin: '0 -40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 4px 0',
              letterSpacing: '-0.5px',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            Account Settings
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#64748b',
              margin: 0,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            Manage your account preferences, security, and notifications.
          </p>
        </div>
      </div>

      {/* Settings Layout */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          margin: '24px 0 40px 0',
          alignItems: 'stretch',
        }}
      >
        {/* Horizontal Tabs */}
        <div
          style={{
            width: 'auto',
            background: '#ffffff',
            border: '1px solid #f1f5f9',
            borderRadius: '16px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab.key ? '#e2effb' : 'transparent',
                border: 'none',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === tab.key ? '#2a73d4' : '#64748b',
                cursor: 'pointer',
                borderRadius: '10px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = '#0f172a';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div style={cardStyle}>
          {/* General Settings Panel */}
          {activeTab === 'general' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '0 0 4px 0',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  General Settings
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  Manage your regional and platform preferences.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Timezone - full width */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '8px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    style={selectStyle}
                    onFocus={(e) => {
                      e.target.style.background = '#ffffff';
                      e.target.style.borderColor = '#2a73d4';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <option value="Asia/Kolkata">(GMT+05:30) India Standard Time - Kolkata</option>
                    <option value="America/New_York">(GMT-04:00) Eastern Time - New York</option>
                    <option value="Europe/London">(GMT+01:00) British Summer Time - London</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '8px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={selectStyle}
                    onFocus={(e) => {
                      e.target.style.background = '#ffffff';
                      e.target.style.borderColor = '#2a73d4';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '8px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    style={selectStyle}
                    onFocus={(e) => {
                      e.target.style.background = '#ffffff';
                      e.target.style.borderColor = '#2a73d4';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button type="button" style={btnPrimaryStyle}>
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security Panel */}
          {activeTab === 'security' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '0 0 4px 0',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  Security & Password
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  Update your password and secure your account.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Current Password - full width */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '8px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.background = '#ffffff';
                      e.target.style.borderColor = '#2a73d4';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  />
                </div>

                {/* New Password */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '8px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.background = '#ffffff';
                      e.target.style.borderColor = '#2a73d4';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '8px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.background = '#ffffff';
                      e.target.style.borderColor = '#2a73d4';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button type="button" style={btnPrimaryStyle}>
                  Update Password
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '16px 0' }} />

              {/* 2FA Toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: '0 0 4px 0',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: 0,
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Add an extra layer of security to your account using an authenticator app.
                  </p>
                </div>
                <Toggle
                  enabled={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                />
              </div>
            </div>
          )}

          {/* Notifications Panel */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '0 0 4px 0',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  Notifications
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  Control when and how you are notified.
                </p>
              </div>

              {/* Email Notifications */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: '0 0 4px 0',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Email Notifications
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: 0,
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Receive daily summaries and important account updates via email.
                  </p>
                </div>
                <Toggle
                  enabled={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
              </div>
              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

              {/* Push Notifications */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: '0 0 4px 0',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    New Message Alerts (Push)
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: 0,
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Get instant browser push notifications when a client sends a message.
                  </p>
                </div>
                <Toggle
                  enabled={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                />
              </div>
              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

              {/* SMS Reminders */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: '0 0 4px 0',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Session Reminders (SMS)
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: 0,
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    Receive a text message 15 minutes before a scheduled session begins.
                  </p>
                </div>
                <Toggle
                  enabled={smsReminders}
                  onChange={() => setSmsReminders(!smsReminders)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
