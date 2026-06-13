import React, { useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';

const CLIENT = {
  name: 'Sarah Johnson',
  email: 'sarah.j@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://i.pravatar.cc/150?img=5',
  status: 'Active' as const,
  joinedAt: 'Sep 12, 2023',
  totalSessions: 24,
  completedModules: 8,
  totalModules: 12,
  nextSession: 'Oct 24, 2023',
  nextTime: '09:00 AM',
  diagnosis: 'Generalized Anxiety Disorder (GAD)',
  therapist: 'Dr. Sarah Miller',
  notes: 'Responds well to CBT techniques. Making steady progress on cognitive reframing exercises.',
};

const SESSION_HISTORY = [
  { date: 'Oct 20, 2023', type: 'Video Call', duration: '50 min', status: 'completed' as const, topic: 'Cognitive Reframing - Week 4' },
  { date: 'Oct 17, 2023', type: 'Video Call', duration: '45 min', status: 'completed' as const, topic: 'Thought Log Review' },
  { date: 'Oct 13, 2023', type: 'Audio Call', duration: '30 min', status: 'completed' as const, topic: 'Check-in Session' },
  { date: 'Oct 10, 2023', type: 'Video Call', duration: '50 min', status: 'completed' as const, topic: 'Exposure Hierarchy Planning' },
  { date: 'Oct 06, 2023', type: 'Video Call', duration: '50 min', status: 'cancelled' as const, topic: 'Cognitive Reframing - Week 3' },
];

const MODULES = [
  { name: 'Psychoeducation', progress: 100, status: 'completed' as const },
  { name: 'Thought Monitoring', progress: 100, status: 'completed' as const },
  { name: 'Cognitive Reframing', progress: 75, status: 'in_progress' as const },
  { name: 'Core Belief Work', progress: 0, status: 'locked' as const },
];

const ClientsProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'modules'>('overview');

  const completionPercent = Math.round((CLIENT.completedModules / CLIENT.totalModules) * 100);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img
            src={CLIENT.avatar}
            alt={CLIENT.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200 flex-shrink-0"
          />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{CLIENT.name}</h1>
            <p className="text-sm text-text-tertiary mt-0.5">{CLIENT.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge label={CLIENT.status} status="success" />
              <span className="text-xs text-text-tertiary">Client since {CLIENT.joinedAt}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 border border-neutral-200 text-text-secondary rounded-lg text-sm font-semibold hover:bg-neutral-50 transition-colors">
            Message
          </button>
          <button className="px-4 py-2.5 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-brand-blueDark transition-colors">
            Schedule Session
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Sessions"
          value={CLIENT.totalSessions}
          iconBg="bg-primary-50"
          iconColor="text-brand-blue"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
        <StatCard
          label="Modules Completed"
          value={`${CLIENT.completedModules}/${CLIENT.totalModules}`}
          iconBg="bg-status-successLight"
          iconColor="text-status-successDark"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
        <StatCard
          label="Progress"
          value={`${completionPercent}%`}
          iconBg="bg-status-warningLight"
          iconColor="text-status-warningDark"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          }
        />
        <StatCard
          label="Next Session"
          value={CLIENT.nextTime}
          subtitle={CLIENT.nextSession}
          iconBg="bg-status-infoLight"
          iconColor="text-status-info"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg w-fit">
        {(['overview', 'sessions', 'modules'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all capitalize ${
              activeTab === tab
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Clinical Notes */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-card">
              <h3 className="text-base font-bold text-text-primary mb-4">Clinical Notes</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{CLIENT.notes}</p>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Diagnosis</p>
                    <p className="text-sm text-text-primary">{CLIENT.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Assigned Therapist</p>
                    <p className="text-sm text-text-primary">{CLIENT.therapist}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-card">
              <h3 className="text-base font-bold text-text-primary mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-text-primary">{CLIENT.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-text-primary">{CLIENT.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Progress */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-card">
            <h3 className="text-base font-bold text-text-primary mb-4">Treatment Progress</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none" stroke="#387bd5" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(completionPercent / 100) * 327} 327`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-text-primary">{completionPercent}%</span>
                  <span className="text-xs text-text-tertiary">Complete</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {MODULES.map((mod) => (
                <div key={mod.name} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{mod.name}</span>
                  {mod.status === 'completed' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  )}
                  {mod.status === 'in_progress' && (
                    <span className="text-xs font-semibold text-brand-blue bg-primary-50 px-2 py-0.5 rounded-full">Active</span>
                  )}
                  {mod.status === 'locked' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Duration</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Topic</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {SESSION_HISTORY.map((session, i) => (
                  <tr key={i} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-text-primary">{session.date}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{session.type}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{session.duration}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{session.topic}</td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={session.status === 'completed' ? 'Completed' : 'Cancelled'}
                        status={session.status === 'completed' ? 'success' : 'error'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="space-y-4">
          {MODULES.map((mod) => (
            <div key={mod.name} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {mod.status === 'completed' ? (
                    <div className="w-8 h-8 rounded-full bg-status-successLight flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : mod.status === 'in_progress' ? (
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#387bd5" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{mod.name}</h4>
                    <p className="text-xs text-text-tertiary">
                      {mod.status === 'completed' ? 'Completed' : mod.status === 'in_progress' ? 'In Progress' : 'Locked'}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-text-primary">{mod.progress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    mod.status === 'completed' ? 'bg-status-success' : mod.status === 'in_progress' ? 'bg-brand-blue' : 'bg-neutral-200'
                  }`}
                  style={{ width: `${mod.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsProfilePage;
