import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/globals.css';
import logoImg from 'shared/assets/logo.png';
import healiImg from 'shared/assets/Heali-peak.png';
import { api } from '@/services/api';
import { useAuth } from '@/store/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.auth.login(email.trim(), password);
      if (result?.token && result?.user) {
        authLogin(result.user, result.token);
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ backgroundColor: '#e5e5e5' }}
    >
      <div
        className="flex flex-col items-center w-full flex-1"
        style={{
          background: 'linear-gradient(110deg, #ffffff 0%, #eef5fc 35%, #7aaaf6 100%)',
        }}
      >
        {/* Header & Branding */}
        <div className="flex flex-col items-center text-center" style={{ marginTop: 60 }}>
          <img src={logoImg} alt="Telehealings Logo" style={{ width: 90, height: 90, marginBottom: 12 }} />
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: '-1px',
              color: '#0745b1',
              marginBottom: 6,
            }}
          >
            Telehealings
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: '#144db9',
              marginBottom: 35,
            }}
          >
            Continuity-First Wellness Care Platform
          </p>

          {/* Page title - OUTSIDE the card, between header and card */}
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: '#4b4b4b',
              marginBottom: 25,
              textAlign: 'center',
            }}
          >
            Therapist Login
          </h2>
        </div>

        {/* Login Card Wrapper */}
        <div className="relative w-full max-w-[420px] mx-auto" style={{ marginBottom: 40 }}>
          {/* Heali Mascot - positioned behind card, peeking from top-right */}
          <img
            src={healiImg}
            alt="Heali Mascot"
            className="hidden md:block"
            style={{
              position: 'absolute',
              top: -170,
              right: -150,
              width: 300,
              height: 'auto',
              zIndex: 0,
            }}
          />

          <div
            className="relative flex flex-col overflow-hidden"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
              zIndex: 1,
            }}
          >
            <div style={{ padding: '35px 35px 25px 35px' }}>
              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="relative" style={{ marginBottom: 18 }}>
                  <svg
                    className="absolute"
                    style={{
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 20,
                      height: 20,
                      color: '#000000',
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      backgroundColor: '#e8e8e8',
                      border: '1px solid #999999',
                      borderRadius: 8,
                      fontSize: 15,
                      fontFamily: "'Inter', sans-serif",
                      color: '#000000',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2b74d4')}
                    onBlur={(e) => (e.target.style.borderColor = '#999999')}
                  />
                </div>

                {/* Password Input */}
                <div className="relative" style={{ marginBottom: 18 }}>
                  <svg
                    className="absolute"
                    style={{
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 20,
                      height: 20,
                      color: '#a8a8a8',
                    }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="14" height="10" x="5" y="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      backgroundColor: '#e8e8e8',
                      border: '1px solid #999999',
                      borderRadius: 8,
                      fontSize: 15,
                      fontFamily: "'Inter', sans-serif",
                      color: '#000000',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2b74d4')}
                    onBlur={(e) => (e.target.style.borderColor = '#999999')}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: 13,
                      textAlign: 'center',
                      marginBottom: 12,
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: 16,
                    backgroundColor: loading ? '#94a3b8' : '#2a73d4',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: 10,
                    marginBottom: 25,
                    transition: 'background-color 0.2s',
                  }}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>

              {/* Links */}
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <a href="#" style={{ color: '#2a73d4', textDecoration: 'none' }}>
                  Forgot Password?
                </a>
                <div style={{ marginTop: 20, color: '#000000' }}>
                  Need Help?{' '}
                  <a href="#" style={{ color: '#2a73d4', textDecoration: 'none' }}>
                    Contact Admin
                  </a>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div
              style={{
                backgroundColor: '#e5e4df',
                padding: 22,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                color: '#000000',
              }}
            >
              Don't have an account?{' '}
              <a href="#" style={{ color: '#2a73d4', textDecoration: 'none' }}>
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
