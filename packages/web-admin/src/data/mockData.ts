export const kpiData = [
  {
    id: 'total-sales',
    value: '₹ 123 K',
    label: 'Total Sales',
    trend: '+8% from yesterday',
    direction: 'up' as const,
    icon: 'bar-chart',
  },
  {
    id: 'completed-sessions',
    value: '300',
    label: 'Completed Sessions',
    trend: '+5% from yesterday',
    direction: 'up' as const,
    icon: 'file-check',
  },
  {
    id: 'cancellations',
    value: '5',
    label: 'Session Cancellations',
    trend: '-1.2% from yesterday',
    direction: 'up' as const,
    icon: 'tag',
  },
  {
    id: 'new-customers',
    value: '8',
    label: 'New Customers',
    trend: '-0.5% from yesterday',
    direction: 'down' as const,
    icon: 'user-plus',
  },
];

export const userInsightsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Sep', 'Oct', 'Nov', 'Dec'],
  series: {
    registered: [60, 80, 120, 90, 150, 180, 140, 200, 160, 220, 190],
    newUsers: [40, 60, 80, 70, 100, 130, 90, 150, 110, 170, 140],
    others: [80, 100, 60, 110, 80, 50, 100, 70, 120, 90, 110],
  },
};

export const bookingsData = {
  thisMonth: 278,
  lastMonth: 150,
  points: {
    thisMonth: [20, 40, 30, 60, 25, 80, 10],
    lastMonth: [80, 100, 110, 110, 100, 100, 80],
  },
};

export const revenueData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  thisWeek: [55, 70, 25, 60, 45, 65, 85],
  lastWeek: [45, 50, 85, 25, 40, 55, 35],
};

export const insightsData = [
  'Churn Risk: 3 users who signed up in March haven\'t booked a second session. Action: Trigger "Reengagement Email" with a 10% discount code.',
  'Revenue Optimization: Wednesday\'s revenue peak (₹23k) is tied to the "Premium Wellness" package. Action: Feature this package on the homepage for the upcoming weekend.',
  'Marketing ROI: The "Promotion & Offers" campaign from Monday resulted in an 8% lift in New Customers. Follow-up: Extend the campaign for another 48 hours to capitalize on the trend.',
];

export const infoInsight =
  'Wednesday is your peak revenue day. Launch a "Mid-Week Wellness" flash offer on Tuesday evenings targeting the "Others" segment. Converting just 10% of these visitors into active bookings could increase your weekly revenue by an estimated ₹12,000.';

export const recentSessions = [
  { id: 'S001', client: 'Priya Sharma', therapist: 'Dr. Meera Nair', date: '2026-06-07', time: '10:00 AM', status: 'Completed', amount: '₹1,200' },
  { id: 'S002', client: 'Rahul Verma', therapist: 'Dr. Arun Kumar', date: '2026-06-07', time: '11:30 AM', status: 'Completed', amount: '₹1,500' },
  { id: 'S003', client: 'Sneha Patel', therapist: 'Dr. Meera Nair', date: '2026-06-07', time: '2:00 PM', status: 'Cancelled', amount: '₹0' },
  { id: 'S004', client: 'Vikram Singh', therapist: 'Dr. Kavya Reddy', date: '2026-06-08', time: '9:00 AM', status: 'Scheduled', amount: '₹1,200' },
  { id: 'S005', client: 'Ananya Roy', therapist: 'Dr. Arun Kumar', date: '2026-06-08', time: '3:30 PM', status: 'Scheduled', amount: '₹1,500' },
];
