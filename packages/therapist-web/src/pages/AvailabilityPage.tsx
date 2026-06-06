import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
}

export default function AvailabilityPage() {
  const { register, handleSubmit } = useForm<AvailabilitySlot>();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const onSubmit = async (data: AvailabilitySlot) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/therapists/${1}/availability`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAvailability([...availability, response.data]);
      alert('Availability added successfully');
    } catch (error) {
      console.error('Error adding availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await axios.delete(`/api/therapists/1/availability/${slotId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAvailability(availability.filter((s) => s !== s));
      alert('Slot deleted successfully');
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Availability</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Add New Slot Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Time Slot</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Day of Week
              </label>
              <select
                {...register('dayOfWeek', { required: true })}
                className="w-full border rounded-lg px-4 py-2"
              >
                {days.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <input
                  {...register('startTime', { required: true })}
                  type="time"
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <input
                  {...register('endTime', { required: true })}
                  type="time"
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Slot Duration (mins)
                </label>
                <input
                  {...register('slotDuration')}
                  type="number"
                  defaultValue={60}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Buffer Time (mins)
                </label>
                <input
                  {...register('bufferTime')}
                  type="number"
                  defaultValue={15}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              {loading ? 'Adding...' : 'Add Slot'}
            </button>
          </form>
        </div>

        {/* Current Availability */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Availability</h2>
          <div className="space-y-3">
            {availability.length === 0 ? (
              <p className="text-gray-500">No availability slots added yet</p>
            ) : (
              availability.map((slot, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{days[slot.dayOfWeek]}</p>
                    <p className="text-sm text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot.slotDuration} min slots, {slot.bufferTime} min buffer
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSlot(index.toString())}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Blocked Dates Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Block Dates</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            You can block dates when you're unavailable (vacation, sick days, etc.)
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="date"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="From Date"
            />
            <input
              type="date"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="To Date"
            />
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Reason (optional)"
            />
            <button className="w-full bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700">
              Block Dates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
