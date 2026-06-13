import React, { useState } from 'react';

interface Tool {
  id: string;
  title: string;
  description: string;
  badge: 'Assessment' | 'Worksheet' | 'Template';
  outlineLabel: string;
  primaryLabel: string;
}

const FILTER_TABS = [
  { key: 'all', label: 'All Tools' },
  { key: 'assessment', label: 'Assessments' },
  { key: 'worksheet', label: 'Worksheets' },
  { key: 'template', label: 'Templates' },
] as const;

const TOOLS: Tool[] = [
  {
    id: 'phq9',
    title: 'PHQ-9 Depression Scale',
    description:
      'Standardized 9-question instrument for screening, diagnosing, monitoring and measuring the severity of depression.',
    badge: 'Assessment',
    outlineLabel: 'Preview',
    primaryLabel: 'Send to Client',
  },
  {
    id: 'gad7',
    title: 'GAD-7 Anxiety Scale',
    description:
      'Brief clinical measure for assessing generalized anxiety disorder. Automatically scores and tracks over time.',
    badge: 'Assessment',
    outlineLabel: 'Preview',
    primaryLabel: 'Send to Client',
  },
  {
    id: 'cbt-thought-record',
    title: 'CBT Thought Record',
    description:
      'Interactive digital worksheet helping clients identify negative automatic thoughts and restructure them.',
    badge: 'Worksheet',
    outlineLabel: 'Preview',
    primaryLabel: 'Send to Client',
  },
  {
    id: 'core-beliefs-matrix',
    title: 'Core Beliefs Matrix',
    description:
      'A deep-dive exercise allowing clients to map out unhelpful core beliefs and gather evidence for healthier alternatives.',
    badge: 'Worksheet',
    outlineLabel: 'Preview',
    primaryLabel: 'Send to Client',
  },
  {
    id: 'soap-note',
    title: 'Standard SOAP Note',
    description:
      'A quick-fill clinical documentation template covering Subjective, Objective, Assessment, and Plan structures.',
    badge: 'Template',
    outlineLabel: 'Edit Template',
    primaryLabel: 'Use Now',
  },
  {
    id: 'initial-intake',
    title: 'Initial Intake Assessment',
    description:
      "Comprehensive structured outline for a client's first session, covering psychosocial history and goal setting.",
    badge: 'Template',
    outlineLabel: 'Edit Template',
    primaryLabel: 'Use Now',
  },
];

const FILTER_KEY_MAP: Record<string, string[]> = {
  assessment: ['Assessment'],
  worksheet: ['Worksheet'],
  template: ['Template'],
};

const ToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesTab =
      activeTab === 'all' || (FILTER_KEY_MAP[activeTab] ?? []).includes(tool.badge);
    const matchesSearch =
      searchQuery === '' ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sticky Header — matches .top-header in tools.css */}
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
            }}
          >
            Clinical Tools Library
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            Access and assign assessments, worksheets, and templates.
          </p>
        </div>
      </div>

      {/* Filter Bar — matches .tools-filter-bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '24px 0',
        }}
      >
        {/* Filter Tabs — matches .filter-tabs / .filter-tab */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                color: activeTab === tab.key ? '#ffffff' : '#475569',
                background: activeTab === tab.key ? '#0f172a' : '#ffffff',
                border: `1px solid ${activeTab === tab.key ? '#0f172a' : '#e2e8f0'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search — matches .search-tools */}
        <div style={{ position: 'relative', width: '280px' }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontFamily: 'inherit',
              fontSize: '14px',
              background: '#ffffff',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#2a73d4')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        </div>
      </div>

      {/* Tools Grid — matches .tools-grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
          paddingBottom: '40px',
        }}
      >
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
            }}
          >
            {/* Badge — matches .tool-badge */}
            <span
              style={{
                alignSelf: 'flex-start',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '16px',
                ...(tool.badge === 'Assessment'
                  ? { background: '#fee2e2', color: '#b91c1c' }
                  : tool.badge === 'Worksheet'
                    ? { background: '#e0e7ff', color: '#1d4ed8' }
                    : { background: '#fef3c7', color: '#b45309' }),
              }}
            >
              {tool.badge}
            </span>

            {/* Title — matches .tool-card h3 */}
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 8px 0',
              }}
            >
              {tool.title}
            </h3>

            {/* Description — matches .tool-card p */}
            <p
              style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: 1.5,
                margin: '0 0 24px 0',
                flexGrow: 1,
              }}
            >
              {tool.description}
            </p>

            {/* Actions — matches .card-actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {tool.outlineLabel}
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#2a73d4',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1e5bb0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2a73d4';
                }}
              >
                {tool.primaryLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
