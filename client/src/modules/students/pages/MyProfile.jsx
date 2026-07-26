import { useEffect, useState } from 'react';
import { Save, User } from 'lucide-react';
import { toast } from 'react-toastify';

import {
  getMyProfile,
  updateMyProfile,
} from '../services/studentProfileServices';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';

const MyProfile = () => {
  const [profile, setProfile] = useState([]);
  const [form, setForm] = useState({
    contactNumber: '',
    address: '',
    civilStatus: '',
    nationality: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(false);

      const data = await getMyProfile();
      console.log('data:', data);
      setProfile(data);

      setForm({
        contactNumber: data.contactNumber || '',
        address: data.address || '',
        civilStatus: data.civilStatus || '',
        nationality: data.nationality || '',
      });
    } catch (error) {
      console.error(error?.response?.message);
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateMyProfile(form);

      toast.success('Profile updated successfully.');

      loadProfile();
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
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="text-blue-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-600">
            Manage your personal information.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Read-only information */}
        <Card>

          <h2 className="text-lg font-semibold mb-4 text-black">
            Student Information
          </h2>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Contact Number
              </label>

              <input
                type="text"
                value={profile.contactNumber}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
              />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-500 mb-1">
                    Middle Name
               </label>
               <input
                    type='text' className='w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700'
                    value={profile.middleName || 'N/A'} disabled
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Name
               </label>
               <input
                    type='text' className='w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700'
                    value={profile.lastName} disabled
               />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Program
              </label>

              <input
                type="text"
                value={profile.program?.programName || ''}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Year Level
              </label>

              <input
                type="text"
                value={profile.yearLevel}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Section
              </label>

              <input
                type="text"
                value={profile.section?.sectionName || 'Unassigned'}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
              />
            </div>
          </Card>

        {/* Editable information */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>

              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Civil Status
              </label>

              <select
                name="civilStatus"
                value={form.civilStatus}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>

              <input
                type="text"
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={18} />

              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
    </DashboardLayout>
  );
};

export default MyProfile;
