import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface RegistrationFormData {
  name: string;
  bio: string;
  email: string;
  phone: string;
  specializations: string[];
  languages: string[];
  hourlyRate: number;
}

export default function TherapistRegistrationPage() {
  const { register, handleSubmit } = useForm<RegistrationFormData>();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/therapists/register', data);
      setRegistrationId(response.data.therapistId);
      setStep(2);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('therapistId', registrationId);

    try {
      await axios.post(`/api/therapists/${registrationId}/documents`, formData);
      alert('Document uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Therapist Registration</h1>

      {step === 1 ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              {...register('name', { required: true })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              {...register('bio')}
              className="w-full border rounded-lg px-4 py-2 h-24"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                {...register('email', { required: true })}
                type="email"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                {...register('phone', { required: true })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Specializations</label>
            <input
              {...register('specializations')}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Anxiety, Depression, etc (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Languages</label>
            <input
              {...register('languages')}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="English, Spanish, etc (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
            <input
              {...register('hourlyRate', { required: true })}
              type="number"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="150"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            {loading ? 'Registering...' : 'Continue to Next Step'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-green-900 mb-2">
              Registration Submitted!
            </h2>
            <p className="text-green-800">
              Your registration has been submitted. Please upload your credentials for verification.
            </p>
          </div>

          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <p className="mb-4">Upload your credentials (License, Certification, etc.)</p>
            <input
              type="file"
              onChange={handleDocumentUpload}
              className="hidden"
              id="document-upload"
            />
            <label
              htmlFor="document-upload"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Choose File
            </label>
          </div>

          <button
            onClick={() => alert('Verification process initiated')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Complete Registration
          </button>
        </div>
      )}
    </div>
  );
}
