import React, { useState } from 'react';

/* ─── Data ─── */

const CLIENT = {
  name: 'Sarah Johnson',
  avatar: 'https://i.pravatar.cc/150?img=5',
  program: 'Cognitive Behavioral Therapy',
  sessionProgress: 'Session 4 of 12',
  status: 'Active Client',
  personalInfo: {
    fullName: 'Sarah Johnson',
    dob: 'May 14, 1990 (33 y/o)',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
  },
  clinical: {
    diagnosis: 'Generalized Anxiety Disorder (GAD) with a focus on workplace-induced panic attacks.',
    treatmentPlan:
      '12-week Cognitive Behavioral Therapy (CBT) focusing on identifying triggers, reframing core beliefs, and practicing somatic grounding techniques.',
    medications: 'None reported currently.',
  },
};

const SESSION_NOTES = [
  {
    title: 'Session 3: Cognitive Reframing',
    date: 'Oct 17, 2023',
    content: `S: Sarah reports feeling slightly less overwhelmed since implementing the 4-7-8 breathing technique, though she still experiences significant anxiety spikes prior to team meetings.
O: Patient was punctual, properly groomed, and engaged actively throughout the session. Eye contact was consistent. Mood appeared slightly anxious but stable.
A: Generalized Anxiety Symptoms appear to be improving slightly with new coping mechanisms, though specific situational triggers remain potent.
P: Continue practicing 4-7-8 breathing. Assigned "Core Beliefs Matrix" worksheet to begin unearthing the root of the workplace performance anxiety. Follow up scheduled for next week.`,
  },
  {
    title: 'Session 2: Trigger Identification',
    date: 'Oct 10, 2023',
    content: `S: Patient describes feeling "paralyzed" during unexpected check-ins from her manager.
O: Alert and oriented. Speech was slightly pressured when discussing work environments.
A: Clear correlation between lack of control/predictability and onset of panic symptoms.
P: Educated patient on physiological anxiety responses. Taught 4-7-8 breathing technique. Tasked with logging 3 instances of anxiety onset before the next session.`,
  },
];

/* ─── Helpers ─── */

type TabId = 'tab-details' | 'tab-notes';

/* ─── Page ─── */

const ClientsProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('tab-details');

  return (
    <div className="flex flex-col h-full">
      {/* ── Sticky Top Header ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between"
        style={{
          padding: '40px 40px 20px 40px',
          margin: '0 -40px',
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="flex items-center gap-5">
          <img
            src={CLIENT.avatar}
            alt={CLIENT.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-[28px] font-bold text-neutral-900 leading-tight" style={{ letterSpacing: '-0.5px' }}>
              {CLIENT.name}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {CLIENT.program} • {CLIENT.sessionProgress}
            </p>
            <span
              className="inline-block mt-1.5 px-2.5 py-1 rounded-[20px] text-[11px] font-bold uppercase"
              style={{ background: '#dcfce7', color: '#166534', letterSpacing: '0.5px' }}
            >
              {CLIENT.status}
            </span>
          </div>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-neutral-900 border border-neutral-200 rounded-[10px] text-sm font-semibold hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer"
          onClick={() => window.history.back()}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Clients
        </button>
      </header>

      {/* ── Tab Navigation ── */}
      <div
        className="flex"
        style={{
          gap: '32px',
          borderBottom: '1px solid #e2e8f0',
          marginTop: '24px',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={() => setActiveTab('tab-details')}
          className={`pb-3 text-[15px] font-semibold transition-all border-b-2 cursor-pointer bg-transparent ${
            activeTab === 'tab-details'
              ? 'text-[#2a73d4] border-[#2a73d4]'
              : 'text-neutral-500 border-transparent hover:text-neutral-900'
          }`}
        >
          Client Details
        </button>
        <button
          onClick={() => setActiveTab('tab-notes')}
          className={`pb-3 text-[15px] font-semibold transition-all border-b-2 cursor-pointer bg-transparent ${
            activeTab === 'tab-notes'
              ? 'text-[#2a73d4] border-[#2a73d4]'
              : 'text-neutral-500 border-transparent hover:text-neutral-900'
          }`}
        >
          Session Notes
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* ── Tab: Client Details ── */}
        <div
          className={`flex flex-col gap-6 pb-10 ${
            activeTab === 'tab-details' ? 'flex' : 'hidden'
          }`}
        >
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
            <h3 className="text-base font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <InfoItem label="Full Name" value={CLIENT.personalInfo.fullName} />
              <InfoItem label="Date of Birth" value={CLIENT.personalInfo.dob} />
              <InfoItem label="Email Address" value={CLIENT.personalInfo.email} />
              <InfoItem label="Phone Number" value={CLIENT.personalInfo.phone} />
            </div>
          </div>

          {/* Clinical History & Goals */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
            <h3 className="text-base font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
              Clinical History &amp; Goals
            </h3>
            <div className="flex flex-col gap-5">
              <InfoItem label="Primary Diagnosis / Focus" value={CLIENT.clinical.diagnosis} />
              <InfoItem label="Current Treatment Plan" value={CLIENT.clinical.treatmentPlan} />
              <InfoItem label="Medications" value={CLIENT.clinical.medications} />
            </div>
          </div>
        </div>

        {/* ── Tab: Session Notes ── */}
        <div
          className={`flex flex-col gap-6 pb-10 ${
            activeTab === 'tab-notes' ? 'flex' : 'hidden'
          }`}
        >
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
            <h3 className="text-base font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
              Recent Clinical Notes
            </h3>

            {SESSION_NOTES.map((note, idx) => (
              <div
                key={idx}
                className={`py-4 ${
                  idx !== SESSION_NOTES.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
                style={idx === SESSION_NOTES.length - 1 ? { paddingBottom: 0 } : undefined}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[15px] font-semibold text-neutral-900 m-0">
                    {note.title}
                  </h4>
                  <span className="text-[13px] text-neutral-500">{note.date}</span>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap m-0" style={{ lineHeight: 1.6 }}>
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Info Item sub-component ─── */

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div>
    <label className="block text-[13px] text-neutral-500 mb-1">{label}</label>
    <p className="text-[15px] font-medium text-neutral-900 m-0">{value}</p>
  </div>
);

export default ClientsProfilePage;
