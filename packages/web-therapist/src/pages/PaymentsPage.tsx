import React, { useState } from 'react';

// --- Types ---

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  isPrimary: boolean;
  isVerified: boolean;
}

interface PayoutHistory {
  id: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Processing' | 'Failed';
  reference: string;
  method: string;
}

interface BillingInvoice {
  id: string;
  period: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
}

// --- Mock Data ---

const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'ba-1',
    bankName: 'HDFC Bank',
    accountNumber: '****4521',
    ifsc: 'HDFC0001234',
    isPrimary: true,
    isVerified: true,
  },
  {
    id: 'ba-2',
    bankName: 'ICICI Bank',
    accountNumber: '****7890',
    ifsc: 'ICIC0005678',
    isPrimary: false,
    isVerified: true,
  },
];

const PAYOUT_HISTORY: PayoutHistory[] = [
  { id: 'po-1', date: 'Oct 21, 2023', amount: '₹12,400', status: 'Completed', reference: 'PAY-20231021-001', method: 'HDFC Bank ****4521' },
  { id: 'po-2', date: 'Oct 14, 2023', amount: '₹9,750', status: 'Completed', reference: 'PAY-20231014-002', method: 'HDFC Bank ****4521' },
  { id: 'po-3', date: 'Oct 07, 2023', amount: '₹11,200', status: 'Completed', reference: 'PAY-20231007-001', method: 'HDFC Bank ****4521' },
  { id: 'po-4', date: 'Sep 30, 2023', amount: '₹8,500', status: 'Failed', reference: 'PAY-20230930-001', method: 'ICICI Bank ****7890' },
  { id: 'po-5', date: 'Sep 23, 2023', amount: '₹10,300', status: 'Completed', reference: 'PAY-20230923-002', method: 'HDFC Bank ****4521' },
];

const BILLING_INVOICES: BillingInvoice[] = [
  { id: 'inv-1', period: 'October 2023', amount: '₹48,000', status: 'Paid', date: 'Oct 31, 2023' },
  { id: 'inv-2', period: 'September 2023', amount: '₹42,500', status: 'Paid', date: 'Sep 30, 2023' },
  { id: 'inv-3', period: 'August 2023', amount: '₹38,000', status: 'Paid', date: 'Aug 31, 2023' },
  { id: 'inv-4', period: 'July 2023', amount: '₹41,200', status: 'Paid', date: 'Jul 31, 2023' },
];

// --- Helpers ---

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'Completed':
    case 'Paid':
      return 'bg-status-successLight text-status-successDark';
    case 'Processing':
    case 'Pending':
      return 'bg-status-warningLight text-status-warningDark';
    case 'Failed':
    case 'Overdue':
      return 'bg-status-errorLight text-status-errorDark';
    default:
      return 'bg-neutral-100 text-text-secondary';
  }
};

// --- Component ---

const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payouts' | 'methods' | 'invoices'>('payouts');
  const [showAddAccount, setShowAddAccount] = useState(false);

  const totalAvailable = '₹24,500';

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Payments</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your payout methods, view payment history, and download invoices.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blueDark transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Withdraw Funds
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-primary-600">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary mb-0.5">{totalAvailable}</p>
          <p className="text-sm font-medium text-text-secondary">Available for Payout</p>
          <p className="text-xs text-text-tertiary mt-1">Next scheduled payout: Oct 28, 2023</p>
        </div>

        {/* Last Payout */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-status-successLight">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-status-successDark">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary mb-0.5">₹12,400</p>
          <p className="text-sm font-medium text-text-secondary">Last Payout</p>
          <p className="text-xs text-text-tertiary mt-1">Processed on Oct 21, 2023</p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-status-warningLight">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-status-warningDark">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary mb-0.5">₹48,000</p>
          <p className="text-sm font-medium text-text-secondary">Earnings This Month</p>
          <p className="text-xs text-status-successDark mt-1 font-semibold">+12% from last month</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-6 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-2.5 text-sm font-semibold transition-colors relative ${
            activeTab === 'payouts' ? 'text-primary-600' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          Payout History
          {activeTab === 'payouts' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('methods')}
          className={`pb-2.5 text-sm font-semibold transition-colors relative ${
            activeTab === 'methods' ? 'text-primary-600' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          Payout Methods
          {activeTab === 'methods' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-2.5 text-sm font-semibold transition-colors relative ${
            activeTab === 'invoices' ? 'text-primary-600' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          Invoices
          {activeTab === 'invoices' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t" />
          )}
        </button>
      </div>

      {/* Tab: Payout History */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h3 className="text-base font-semibold text-text-primary">Payout History</h3>
            <div className="flex items-center gap-3">
              <select className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm text-text-secondary outline-none focus:border-primary-500">
                <option value="all">All Time</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-text-secondary hover:bg-neutral-50 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Method</th>
                </tr>
              </thead>
              <tbody>
                {PAYOUT_HISTORY.map((payout) => (
                  <tr key={payout.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-text-secondary">{payout.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-text-primary">{payout.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(payout.status)}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-text-tertiary bg-neutral-50 px-2 py-1 rounded border border-neutral-200">
                        {payout.reference}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{payout.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Payout Methods */}
      {activeTab === 'methods' && (
        <div className="space-y-4">
          {/* Bank Accounts */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-base font-semibold text-text-primary">Linked Bank Accounts</h3>
              <button
                onClick={() => setShowAddAccount(!showAddAccount)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blueDark transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Account
              </button>
            </div>

            {/* Add Account Form */}
            {showAddAccount && (
              <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50">
                <h4 className="text-sm font-semibold text-text-primary mb-4">Add New Bank Account</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Bank"
                      className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Account Number</label>
                    <input
                      type="text"
                      placeholder="Enter account number"
                      className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">IFSC Code</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Account Holder Name</label>
                    <input
                      type="text"
                      placeholder="As per bank records"
                      className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button className="px-5 py-2.5 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blueDark transition-colors">
                    Save Account
                  </button>
                  <button
                    onClick={() => setShowAddAccount(false)}
                    className="px-5 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-text-secondary hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Account List */}
            <div className="divide-y divide-neutral-100">
              {BANK_ACCOUNTS.map((account) => (
                <div key={account.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-primary-600">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-primary">{account.bankName}</p>
                        {account.isPrimary && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-600 border border-primary-200">
                            Primary
                          </span>
                        )}
                        {account.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-status-successLight text-status-successDark">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        A/C: {account.accountNumber} &bull; IFSC: {account.ifsc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!account.isPrimary && (
                      <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-brand-blue border border-brand-blue hover:bg-primary-50 transition-colors">
                        Set Primary
                      </button>
                    )}
                    <button className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors" title="Remove">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payout Settings */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">Payout Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="text-sm font-medium text-text-primary">Auto-Payout</p>
                  <p className="text-xs text-text-tertiary mt-0.5">Automatically transfer earnings every week</p>
                </div>
                <button className="relative w-11 h-6 rounded-full bg-brand-blue transition-colors">
                  <span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="text-sm font-medium text-text-primary">Payout Schedule</p>
                  <p className="text-xs text-text-tertiary mt-0.5">Current: Every Monday</p>
                </div>
                <select className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm text-text-secondary outline-none focus:border-primary-500">
                  <option>Every Monday</option>
                  <option>Every Friday</option>
                  <option>Monthly (1st)</option>
                  <option>Manual Only</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">Minimum Payout Threshold</p>
                  <p className="text-xs text-text-tertiary mt-0.5">Minimum balance required to trigger payout</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-2 rounded-lg border border-neutral-200 bg-white">
                  <span className="text-sm text-text-tertiary">₹</span>
                  <input
                    type="text"
                    defaultValue="5000"
                    className="w-20 text-sm text-text-primary outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h3 className="text-base font-semibold text-text-primary">Billing Invoices</h3>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-text-secondary hover:bg-neutral-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Invoice Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {BILLING_INVOICES.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-text-primary">{invoice.period}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{invoice.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-text-primary">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors" title="Download Invoice">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors" title="View Details">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
