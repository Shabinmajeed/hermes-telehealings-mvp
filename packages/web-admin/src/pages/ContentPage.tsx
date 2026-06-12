import React, { useState, useMemo } from 'react';

// --- Types ---

type ContentType = 'Article' | 'Video' | 'Audio' | 'Interactive';
type ContentStatus = 'Published' | 'Draft' | 'Archived';

interface ContentRow {
  id: string;
  title: string;
  snippet: string;
  type: ContentType;
  tags: string[];
  authorName: string;
  authorAvatar: string;
  views: string;
  completion: string;
  rating: string;
  status: ContentStatus;
}

// --- Mock Data ---

const contentData: ContentRow[] = [
  {
    id: 'C-101',
    title: 'Understanding Anxiety: A Complete Guide',
    snippet: 'Learn the basics of anxiety and how to manage daily triggers.',
    type: 'Article',
    tags: ['#Anxiety', '#CBT'],
    authorName: 'Dr. Sarah Smith',
    authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
    views: '4.2K',
    completion: '78%',
    rating: '4.8',
    status: 'Published',
  },
  {
    id: 'C-102',
    title: 'Guided Meditation for Deep Sleep',
    snippet: 'A 15-minute audio track to help you fall asleep faster.',
    type: 'Audio',
    tags: ['#SleepDisorder', '#Relaxation'],
    authorName: 'Dr. Ajesh Anand',
    authorAvatar: 'https://i.pravatar.cc/150?u=ajesh',
    views: '12.5K',
    completion: '92%',
    rating: '4.9',
    status: 'Published',
  },
  {
    id: 'C-103',
    title: '5 Tips for Better Relationships',
    snippet: 'Video guide on active listening and communication.',
    type: 'Video',
    tags: ['#CouplesTherapy'],
    authorName: 'Dr. Emily Chen',
    authorAvatar: 'https://i.pravatar.cc/150?u=emily',
    views: '-',
    completion: '-',
    rating: '-',
    status: 'Draft',
  },
  {
    id: 'C-104',
    title: 'Box Breathing Exercise Tool',
    snippet: 'Interactive 4-4-4-4 breathing pacing tool.',
    type: 'Interactive',
    tags: ['#PanicAttacks', '#Mindfulness'],
    authorName: 'Dr. David Kim',
    authorAvatar: 'https://i.pravatar.cc/150?u=david',
    views: '8.1K',
    completion: '65%',
    rating: '4.5',
    status: 'Published',
  },
  {
    id: 'C-105',
    title: 'Managing Workplace Stress',
    snippet: 'Practical tips to handle burnout and boundaries.',
    type: 'Article',
    tags: ['#Burnout', '#Stress'],
    authorName: 'Dr. Marcus Reed',
    authorAvatar: 'https://i.pravatar.cc/150?u=marcus',
    views: '2.3K',
    completion: '45%',
    rating: '4.1',
    status: 'Archived',
  },
  {
    id: 'C-106',
    title: 'Morning Yoga Routine',
    snippet: 'A quick 10-minute stretch to start your day.',
    type: 'Video',
    tags: ['#PhysicalWellness'],
    authorName: 'Dr. Sophia Patel',
    authorAvatar: 'https://i.pravatar.cc/150?u=sophia',
    views: '18.4K',
    completion: '88%',
    rating: '4.9',
    status: 'Published',
  },
];

const tabs = [
  { label: 'All Library', filter: 'All' },
  { label: 'Articles', filter: 'Article' },
  { label: 'Video Tutorials', filter: 'Video' },
  { label: 'Audio Tracks', filter: 'Audio' },
  { label: 'Interactive / Breathing', filter: 'Interactive' },
];

// --- SVG Icons ---

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12, color: '#f59e0b', fill: '#f59e0b' }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const typeIcons: Record<ContentType, React.ReactNode> = {
  Article: (
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  ),
  Video: (
    <>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </>
  ),
  Audio: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  Interactive: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </>
  ),
};

// --- Status Badge ---

const StatusBadge: React.FC<{ status: ContentStatus }> = ({ status }) => {
  const style: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
  };

  switch (status) {
    case 'Published':
      style.background = '#dcfce7';
      style.color = '#166534';
      break;
    case 'Draft':
      style.background = '#fef9c3';
      style.color = '#854d0e';
      break;
    case 'Archived':
      style.background = '#f1f5f9';
      style.color = '#475569';
      break;
  }

  return <span style={style}>{status}</span>;
};

// --- Page ---

const perPage = 5;

const ContentPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return contentData.filter((item) => {
      const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #e2e8f0', marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', padding: '0 0 12px 0', position: 'relative' }}>
          Content Management
          <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 3, background: '#0f172a', borderRadius: '2px 2px 0 0' }} />
        </div>
        <img
          src="/src/Heali-peak.png"
          alt="Mascot"
          style={{ height: 48, marginBottom: -1 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </header>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
        {tabs.map((tab) => (
          <button
            key={tab.filter}
            onClick={() => { setActiveFilter(tab.filter); setCurrentPage(1); }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px 4px',
              fontSize: 15,
              fontWeight: 600,
              color: activeFilter === tab.filter ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {tab.label}
            {activeFilter === tab.filter && (
              <span style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: '#2563eb', borderRadius: '2px 2px 0 0' }} />
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 16, color: '#475569' }}>
            <strong style={{ color: '#0f172a', fontWeight: 700 }}>All Content</strong> 128
          </div>
          <div style={{ position: 'relative', width: 240 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '10px 16px 10px 38px',
                borderRadius: 99,
                border: '1px solid #cbd5e1',
                background: 'transparent',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid #0f172a',
              background: 'transparent',
              color: '#0f172a',
            }}
          >
            <FilterIcon />
            Filters
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid #2563eb',
              background: '#2563eb',
              color: '#ffffff',
            }}
          >
            <PlusIcon />
            Add Content
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '24px 32px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '5%' }}>
                Sl No
              </th>
              <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '26%' }}>
                Content Title
              </th>
              <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '10%' }}>
                Category
              </th>
              <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '16%' }}>
                Clinical Tags
              </th>
              <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                Author
              </th>
              <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '15%' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Performance <ChevronDownIcon />
                </span>
              </th>
              <th style={{ textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '8%' }}>
                Status
              </th>
              <th style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#64748b', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', width: '5%' }}>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14, color: '#64748b', verticalAlign: 'middle' }}>
                  {item.id}
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 8,
                      background: '#eff6ff',
                      color: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                        {typeIcons[item.type]}
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{ fontWeight: 600, color: '#0f172a', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 250 }}
                        title={item.title}
                      >
                        {item.title}
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                        {item.snippet}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14, color: '#334155', verticalAlign: 'middle' }}>
                  <span style={{ fontWeight: 500, color: '#475569' }}>{item.type}</span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          fontSize: 11,
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName}
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', background: '#f1f5f9' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span style={{ fontWeight: 500, color: '#334155', fontSize: 13 }}>{item.authorName}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                      <EyeIcon /> <strong style={{ color: '#0f172a' }}>{item.views}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                      <ClockIcon /> <strong style={{ color: '#0f172a' }}>{item.completion}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                      <StarIcon /> <strong style={{ color: '#0f172a' }}>{item.rating}</strong>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' }}>
                  <StatusBadge status={item.status} />
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', textAlign: 'center', verticalAlign: 'middle' }}>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: 8,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MoreIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Showing 1 of {totalPages} pages
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                border: 'none',
                background: '#f1f5f9',
                color: '#334155',
                fontSize: 13,
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeftIcon />
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  border: 'none',
                  background: currentPage === page ? '#2563eb' : '#f1f5f9',
                  color: currentPage === page ? '#ffffff' : '#334155',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                border: 'none',
                background: '#f1f5f9',
                color: '#334155',
                fontSize: 13,
                fontWeight: 600,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
