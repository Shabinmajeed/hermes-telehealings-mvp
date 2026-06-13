import React, { useState, useMemo, useRef, useEffect } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarEvent {
  id: string;
  time: string;
  clientName: string;
  avatar: string;
}

// Events keyed by "YYYY-MM-DD"
const EVENTS: Record<string, CalendarEvent[]> = {
  '2023-10-05': [
    { id: '1', time: '10:00 AM', clientName: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?img=5' },
  ],
  '2023-10-09': [
    { id: '2', time: '11:30 AM', clientName: 'John D.', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '3', time: '02:00 PM', clientName: 'Emma W.', avatar: 'https://i.pravatar.cc/150?img=9' },
  ],
  '2023-10-12': [
    { id: '4', time: '09:00 AM', clientName: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?img=5' },
  ],
  '2023-10-17': [
    { id: '5', time: '01:00 PM', clientName: 'Priya P.', avatar: 'https://i.pravatar.cc/150?img=32' },
  ],
  '2023-10-24': [
    { id: '6', time: '09:00 AM', clientName: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '7', time: '10:30 AM', clientName: 'Michael C.', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: '8', time: '01:00 PM', clientName: 'Priya P.', avatar: 'https://i.pravatar.cc/150?img=32' },
  ],
  '2023-10-26': [
    { id: '9', time: '04:30 PM', clientName: 'Alex R.', avatar: 'https://i.pravatar.cc/150?img=11' },
  ],
};

function getDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const AppointmentsPage: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // Oct 2023
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(2023);
  const pickerRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Close picker on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: { day: number; isCurrentMonth: boolean; isToday: boolean; dateKey: string }[] = [];

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      cells.push({ day, isCurrentMonth: false, isToday: false, dateKey: getDateKey(y, m, day) });
    }

    // Current month
    const isCurMonthToday = today.getFullYear() === year && today.getMonth() === month;
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        day: i,
        isCurrentMonth: true,
        isToday: isCurMonthToday && today.getDate() === i,
        dateKey: getDateKey(year, month, i),
      });
    }

    // Next month padding to fill 5 rows (35 cells) — matching the design's 5x7 grid
    const remaining = 35 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      cells.push({ day: i, isCurrentMonth: false, isToday: false, dateKey: getDateKey(y, m, i) });
    }

    return cells;
  }, [year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectMonth = (m: number) => {
    setCurrentDate(new Date(pickerYear, m, 1));
    setPickerOpen(false);
  };

  return (
    <div className="flex gap-6 flex-1 pb-10">
      {/* Calendar Main Grid — matches .calendar-main */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden">
        {/* Month Navigation Header — matches .cal-month-header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-white">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg text-text-secondary hover:bg-neutral-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={() => {
              setPickerYear(year);
              setPickerOpen(!pickerOpen);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-bold text-text-primary hover:bg-neutral-100 transition-colors"
          >
            <span>{MONTHS[month]} {year}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <button
            onClick={nextMonth}
            className="p-2 rounded-lg text-text-secondary hover:bg-neutral-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Month Picker Dropdown — matches .month-picker-dropdown */}
          {pickerOpen && (
            <div
              ref={pickerRef}
              className="absolute top-16 left-1/2 -translate-x-1/2 bg-white border border-neutral-200 rounded-xl shadow-dropdown p-4 z-50 w-[260px]"
            >
              <div className="flex items-center justify-between mb-4 font-bold text-text-primary">
                <button
                  onClick={(e) => { e.stopPropagation(); setPickerYear(pickerYear - 1); }}
                  className="p-1 rounded-lg text-text-secondary hover:bg-neutral-100 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span>{pickerYear}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setPickerYear(pickerYear + 1); }}
                  className="p-1 rounded-lg text-text-secondary hover:bg-neutral-100 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS_SHORT.map((m, i) => (
                  <button
                    key={m}
                    onClick={(e) => { e.stopPropagation(); selectMonth(i); }}
                    className={`py-2 text-center rounded-lg text-sm font-medium transition-colors ${
                      i === month && pickerYear === year
                        ? 'bg-brand-blue text-white'
                        : 'text-text-secondary hover:bg-neutral-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Day Names Header — matches .cal-days-header */}
        <div className="grid grid-cols-7 border-b border-neutral-100">
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="py-3.5 text-center text-[11px] font-semibold text-text-tertiary uppercase tracking-wide"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid — matches .cal-grid with 5 rows */}
        <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: 'repeat(5, minmax(110px, 1fr))' }}>
          {calendarCells.map((cell, i) => {
            const events = cell.isCurrentMonth ? (EVENTS[cell.dateKey] || []) : [];

            return (
              <div
                key={i}
                className={`p-3 border-r border-b border-neutral-100 flex flex-col gap-1 ${
                  !cell.isCurrentMonth ? 'bg-neutral-50/50' : ''
                } ${cell.isToday ? 'bg-neutral-50' : ''}`}
                style={{ minWidth: 0, overflow: 'hidden' }}
              >
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 text-[13px] font-semibold ${
                    cell.isToday
                      ? 'text-brand-blue font-bold'
                      : cell.isCurrentMonth
                      ? 'text-text-secondary'
                      : 'text-neutral-400'
                  }`}
                >
                  {cell.day}
                </span>
                {/* Event avatars — matches .cal-avatars */}
                {events.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {events.map((event) => (
                      <img
                        key={event.id}
                        src={event.avatar}
                        alt={event.clientName}
                        title={`${event.time} - ${event.clientName}`}
                        className="w-5 h-5 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-110 hover:border-brand-blue transition-all"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar — matches .calendar-sidebar */}
      <div className="w-[340px] flex-shrink-0 flex flex-col gap-5">
        {/* Clinical Insights — matches .insights-card */}
        <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-primary-800 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Clinical Insights
            </h3>
          </div>
          <div className="flex items-start gap-2.5 mb-3 text-sm font-bold text-text-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Sarah M. completed tasks</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Sarah M.</strong> has successfully completed 100% of her &apos;Cognitive Reframing&apos; modules this week. Suggesting a transition to &apos;Core Belief Work&apos; for the next session.
          </p>
        </div>

        {/* Today's Schedule — matches .side-card */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-text-primary">Today&apos;s Schedule</h3>
            <a href="/appointments" className="text-xs font-semibold text-brand-blue hover:underline">
              View All
            </a>
          </div>

          <div className="flex flex-col gap-5">
            {/* Session Item 1 */}
            <div className="flex gap-3.5">
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt="Sarah Johnson"
                className="w-11 h-11 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-text-primary">Sarah Johnson</h4>
                  <span className="text-[11px] text-text-tertiary font-semibold flex-shrink-0 ml-2">02:00 PM</span>
                </div>
                <p className="text-[13px] text-text-secondary mb-3">Reframing module update</p>
                <a
                  href="/workflows/session-prep"
                  className="block w-full text-center bg-brand-blue text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-blueDark transition-colors"
                >
                  Join Session
                </a>
              </div>
            </div>

            {/* Session Item 2 */}
            <div className="flex gap-3.5">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Alex Rivera"
                className="w-11 h-11 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-text-primary">Alex Rivera</h4>
                  <span className="text-[11px] text-text-tertiary font-semibold flex-shrink-0 ml-2">04:30 PM</span>
                </div>
                <p className="text-[13px] text-text-secondary mb-3">First assessment</p>
                <button
                  className="w-full bg-neutral-100 text-text-secondary py-2.5 rounded-lg text-sm font-semibold cursor-default"
                >
                  Pending
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inbox — matches .side-card */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-text-primary">Inbox</h3>
            <span className="bg-status-infoLight text-status-info px-2.5 py-1 rounded-full text-[11px] font-bold">
              3 NEW
            </span>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-3.5">
              <img
                src="https://i.pravatar.cc/150?img=1"
                alt="Meera Thomas"
                className="w-11 h-11 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-text-primary">Meera Thomas</h4>
                  <span className="text-[11px] text-text-tertiary font-semibold flex-shrink-0 ml-2">08:45 AM</span>
                </div>
                <p className="text-[13px] text-text-secondary truncate">
                  Thank you for the session notes, Doctor...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
