import React, { useState } from 'react';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: 'article' | 'video' | 'link' | 'image';
  date: string;
  thumbnail: string;
  thumbnailAlt: string;
}

const CONTENTS: ContentItem[] = [
  {
    id: 1,
    title: 'The Benefits of Morning Yoga',
    description:
      'A comprehensive guide on how introducing a brief yoga routine to your morning can impact your mental well-being throughout the day.',
    type: 'article',
    date: 'Oct 24, 2023',
    thumbnail:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
    thumbnailAlt: 'Yoga',
  },
  {
    id: 2,
    title: '10-Minute Guided Meditation',
    description:
      'A quick guided session focused on breathwork and grounding techniques, perfect for moments of high anxiety.',
    type: 'video',
    date: 'Oct 20, 2023',
    thumbnail:
      'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=400',
    thumbnailAlt: 'Meditation',
  },
  {
    id: 3,
    title: 'The Power of Journaling',
    description:
      'External resource from Psychology Today detailing the cognitive benefits of keeping a daily journal.',
    type: 'link',
    date: 'Oct 15, 2023',
    thumbnail:
      'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&q=80&w=400',
    thumbnailAlt: 'Journaling',
  },
  {
    id: 4,
    title: 'Grounding Exercise Infographic',
    description:
      'A simple visual guide to the 5-4-3-2-1 grounding technique. Easy to share and keep on a mobile device.',
    type: 'image',
    date: 'Oct 10, 2023',
    thumbnail:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
    thumbnailAlt: 'Nature',
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'All Content' },
  { key: 'article', label: 'Articles' },
  { key: 'video', label: 'Videos' },
  { key: 'image', label: 'Images' },
  { key: 'link', label: 'Links' },
];

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  article: { background: '#e0e7ff', color: '#1d4ed8' },
  video: { background: '#fee2e2', color: '#b91c1c' },
  image: { background: '#dcfce7', color: '#15803d' },
  link: { background: '#fef3c7', color: '#b45309' },
};

const BADGE_LABELS: Record<string, string> = {
  article: 'Article',
  video: 'Video',
  image: 'Image',
  link: 'Link',
};

const ContentsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = CONTENTS.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header — matches design: top-header */}
      <div
        className="sticky top-0 z-[100]"
        style={{
          padding: '40px 40px 20px 40px',
          margin: '0 -40px',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="font-bold text-[#0f172a] mb-1"
              style={{ fontSize: '32px', letterSpacing: '-0.5px' }}
            >
              Content Library
            </h1>
            <p className="text-[#64748b]" style={{ fontSize: '15px', margin: 0 }}>
              Create, host, and share resources with your clients.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-[#0f172a] border border-[#e2e8f0] rounded-[10px] px-4 py-2.5 text-sm font-semibold hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Add Link
            </button>
            <button className="flex items-center gap-2 bg-white text-[#0f172a] border border-[#e2e8f0] rounded-[10px] px-4 py-2.5 text-sm font-semibold hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload Media
            </button>
            <button
              className="flex items-center gap-2 text-white border-none rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer"
              style={{ backgroundColor: '#2a73d4' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e5bb0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2a73d4')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Article
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar — matches design: contents-filter-bar */}
      <div className="flex justify-between items-center" style={{ margin: '24px 0' }}>
        <div className="flex gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className="cursor-pointer transition-all"
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid',
                backgroundColor: activeFilter === tab.key ? '#0f172a' : '#ffffff',
                color: activeFilter === tab.key ? '#ffffff' : '#475569',
                borderColor: activeFilter === tab.key ? '#0f172a' : '#e2e8f0',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative" style={{ width: '280px' }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#94a3b8]"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm bg-white outline-none transition-colors"
            style={{
              padding: '10px 16px 10px 40px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#2a73d4')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        </div>
      </div>

      {/* Contents Grid — matches design: contents-grid */}
      <div
        className="grid pb-10"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          paddingBottom: '40px',
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white flex flex-col overflow-hidden"
            style={{
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              transition: 'transform 0.2s, box-shadow 0.2s',
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
            <img
              src={item.thumbnail}
              alt={item.thumbnailAlt}
              className="w-full object-cover bg-[#f1f5f9]"
              style={{ height: '160px', borderBottom: '1px solid #e2e8f0' }}
            />
            <div className="p-5 flex flex-col flex-1">
              {/* content-meta */}
              <div className="flex justify-between items-center mb-3">
                <span
                  className="uppercase font-bold"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    letterSpacing: '0.5px',
                    ...BADGE_STYLES[item.type],
                  }}
                >
                  {BADGE_LABELS[item.type]}
                </span>
                <span className="text-[#94a3b8] font-medium" style={{ fontSize: '12px' }}>
                  {item.date}
                </span>
              </div>
              <h3
                className="font-bold text-[#0f172a] mb-2"
                style={{ fontSize: '17px', lineHeight: '1.3', margin: '0 0 8px 0' }}
              >
                {item.title}
              </h3>
              <p
                className="text-[#64748b] mb-5 flex-1"
                style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  margin: '0 0 20px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.description}
              </p>
              {/* card-actions */}
              <div className="flex gap-3" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-transparent border border-[#e2e8f0] text-[#475569] rounded-lg text-[13px] font-semibold hover:bg-[#f8fafc] hover:text-[#0f172a] hover:border-[#cbd5e1] transition-all cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-white border-none rounded-lg text-[13px] font-semibold transition-all cursor-pointer"
                  style={{ backgroundColor: '#2a73d4' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e5bb0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2a73d4')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentsPage;
