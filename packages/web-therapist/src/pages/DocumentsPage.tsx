import React, { useState } from 'react';
import EmptyState from '@/components/EmptyState';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: 'license' | 'certification' | 'insurance' | 'other';
}

const mockDocuments: Document[] = [
  { id: '1', name: 'Psychology License 2026.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2026-01-15', category: 'license' },
  { id: '2', name: 'Board Certification.pdf', type: 'PDF', size: '1.8 MB', uploadedAt: '2026-01-15', category: 'certification' },
  { id: '3', name: 'Malpractice Insurance 2026.pdf', type: 'PDF', size: '3.1 MB', uploadedAt: '2026-02-01', category: 'insurance' },
  { id: '4', name: 'CPR Certification.pdf', type: 'PDF', size: '0.9 MB', uploadedAt: '2025-12-10', category: 'certification' },
  { id: '5', name: 'Professional Headshot.jpg', type: 'Image', size: '4.2 MB', uploadedAt: '2026-03-20', category: 'other' },
  { id: '6', name: 'Tax Documents 2025.pdf', type: 'PDF', size: '1.2 MB', uploadedAt: '2026-04-05', category: 'other' },
];

const categories = [
  { key: 'all', label: 'All Documents' },
  { key: 'license', label: 'Licenses' },
  { key: 'certification', label: 'Certifications' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'other', label: 'Other' },
];

const categoryColors: Record<string, string> = {
  license: 'bg-primary-100 text-primary-700',
  certification: 'bg-status-successLight text-status-successDark',
  insurance: 'bg-status-warningLight text-status-warningDark',
  other: 'bg-neutral-100 text-text-secondary',
};

const DocumentsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [documents] = useState<Document[]>(mockDocuments);

  const filtered =
    activeCategory === 'all'
      ? documents
      : documents.filter((d) => d.category === activeCategory);

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Documents</h1>
          <p className="text-sm text-text-tertiary mt-1">Manage your professional documents</p>
        </div>
        <button className="px-4 py-2.5 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-brand-blueDark transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Document
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-100 rounded-lg p-1 w-fit">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Upload area */}
      <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 mb-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="mx-auto mb-3">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-sm font-medium text-text-primary">Drop files here or click to upload</p>
        <p className="text-xs text-text-tertiary mt-1">PDF, JPG, PNG up to 10MB</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No documents"
          description="Upload documents to get started."
        />
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Document</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Size</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Uploaded</th>
                <th className="text-right py-3 px-5 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                        <p className="text-xs text-text-tertiary">{doc.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${categoryColors[doc.category]}`}>
                      {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-sm text-text-secondary">{doc.size}</td>
                  <td className="py-3.5 px-5 text-sm text-text-secondary">{formatDate(doc.uploadedAt)}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors" title="Download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
