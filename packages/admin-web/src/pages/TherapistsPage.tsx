import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Therapist {
  id: string;
  name: string;
  specializations: string[];
  status: string;
  verified: boolean;
  createdAt: string;
}

export default function AdminTherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    loadTherapists();
  }, [filter]);

  const loadTherapists = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/therapists', {
        params: {
          status:
            filter === 'all'
              ? undefined
              : filter === 'verified'
                ? 'verified'
                : 'pending',
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setTherapists(response.data);
    } catch (error) {
      console.error('Error loading therapists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTherapistAction = async (
    therapistId: string,
    action: 'approve' | 'reject'
  ) => {
    try {
      await axios.post(
        `/api/admin/therapists/${therapistId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      alert(`Therapist ${action}ed successfully`);
      loadTherapists();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Therapist Verification</h1>
        <div className="flex gap-2">
          {['pending', 'verified', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {therapists.map((therapist) => (
            <div
              key={therapist.id}
              className="border rounded-lg p-6 bg-white hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{therapist.name}</h3>
                  <p className="text-gray-600">
                    {therapist.specializations.join(', ')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    therapist.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {therapist.verified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Applied: {new Date(therapist.createdAt).toLocaleDateString()}
              </p>

              {!therapist.verified && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleTherapistAction(therapist.id, 'approve')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleTherapistAction(therapist.id, 'reject')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
