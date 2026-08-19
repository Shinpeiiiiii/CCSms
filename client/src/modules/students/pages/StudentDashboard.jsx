import { useEffect, useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Layers,
  User,
} from 'lucide-react';

import {studentDashboard} from '../services/student.service';
import DashboardLayout from '@/shared/layouts/DashboardLayout';

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await studentDashboard();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">Loading dashboard...</div>
    );
  }

  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="bg-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold">
          Welcome, {dashboard.fullName}!
        </h1>

        <p className="mt-1 text-blue-100">
          Student Number: {dashboard.studentNumber}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-semibold">
                {dashboard.program}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Layers className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Section</p>
              <p className="font-semibold">
                {dashboard.section || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Subjects</p>
              <p className="font-semibold">
                {dashboard.enrolledSubjects}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <User className="text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Year Level</p>
              <p className="font-semibold">
                {dashboard.yearLevel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/student/subjects"
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <BookOpen className="mb-2 text-blue-600" />

            <p className="font-medium">My Subjects</p>

            <p className="text-sm text-gray-500">
              View your enrolled subjects.
            </p>
          </a>

          <a
            href="/student/profile"
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <User className="mb-2 text-green-600" />

            <p className="font-medium">My Profile</p>

            <p className="text-sm text-gray-500">
              Update your personal information.
            </p>
          </a>

          <a
            href="/student/change-password"
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <GraduationCap className="mb-2 text-purple-600" />

            <p className="font-medium">Change Password</p>

            <p className="text-sm text-gray-500">
              Update your account password.
            </p>
          </a>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
