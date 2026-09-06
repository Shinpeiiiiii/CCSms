import { useState } from 'react';
import { Save, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getMyProfile,
  updateMyProfile,
} from '../services/studentProfileServices';
import { QUERY_KEYS } from '@/constants/queryKey';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';

const ProfileForm = ({ profile }) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    contactNumber: profile?.contactNumber || '',
    address: profile?.address || '',
    civilStatus: profile?.civilStatus || '',
    nationality: profile?.nationality || '',
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENT_PROFILE }),
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileMutation.mutateAsync(form);
      toast.success('Profile updated successfully.');
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'Failed to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Read-only information */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Student Information
        </h2>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Contact Number
          </label>
          <input
            type="text"
            value={profile.contactNumber}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Middle Name
          </label>
          <input
            type="text"
            value={profile.middleName || 'N/A'}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Program
          </label>
          <input
            type="text"
            value={profile.program?.programName || ''}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Year Level
          </label>
          <input
            type="text"
            value={profile.yearLevel}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Section
          </label>
          <input
            type="text"
            value={profile.section?.sectionName || 'Unassigned'}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm"
          />
        </div>
      </Card>

      {/* Editable information */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
              Civil Status
            </label>
            <select
              name="civilStatus"
              value={form.civilStatus}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-gray-900"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-gray-900 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
              Nationality
            </label>
            <input
              type="text"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-gray-900"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

const MyProfile = () => {
  const { data: profile = {}, isLoading: loading } = useQuery({
    queryKey: QUERY_KEYS.STUDENT_PROFILE,
    queryFn: getMyProfile,
  });

  if (loading) {
    return (
      <div className="p-6">Loading profile...</div>
    );
  }

  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center">
          <User className="text-gray-600" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your personal information.
          </p>
        </div>
      </div>

      <ProfileForm profile={profile} />
    </div>
    </DashboardLayout>
  );
};

export default MyProfile;
