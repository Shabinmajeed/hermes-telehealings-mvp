import React, { useState } from 'react';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

const AvailabilityPage: React.FC = () => {
  const [availability, setAvailability] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(day => {
      timeSlots.forEach(slot => {
        const key = `${day}-${slot}`;
        initial[key] = day !== 'Sat' && day !== 'Sun' && slot >= '09:00' && slot <= '17:00';
      });
    });
    return initial;
  });

  const toggleSlot = (key: string) => {
    setAvailability(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Availability</h1>
        <p className="text-sm text-text-tertiary mt-1">Set your weekly availability for appointments</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-neutral-200">
          <div className="py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider border-r border-neutral-100">
            Time
          </div>
          {days.map(day => (
            <div key={day} className="py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider text-center border-r border-neutral-100 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {timeSlots.map(slot => (
          <div key={slot} className="grid grid-cols-8 border-b border-neutral-50">
            <div className="py-3 px-4 text-xs text-text-tertiary border-r border-neutral-100 flex items-center">
              {slot}
            </div>
            {days.map(day => {
              const key = `${day}-${slot}`;
              const isAvailable = availability[key] || false;
              return (
                <div
                  key={key}
                  className="border-r border-neutral-100 last:border-r-0 flex items-center justify-center"
                >
                  <button
                    onClick={() => toggleSlot(key)}
                    className={`w-8 h-8 rounded-md border transition-colors ${
                      isAvailable
                        ? 'bg-primary-100 border-primary-300'
                        : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    {isAvailable && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-primary-600 mx-auto">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-brand-blueDark transition-colors">
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default AvailabilityPage;
