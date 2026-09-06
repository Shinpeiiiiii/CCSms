import { BookOpen, GraduationCap, Layers, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { studentDashboard } from '../services/student.service';
import { QUERY_KEYS } from '@/constants/queryKey';
import DashboardLayout from '@/shared/layouts/DashboardLayout';

const StudentDashboard = () => {
  const { data: dashboard = {}, isLoading: loading } = useQuery({
    queryKey: QUERY_KEYS.STUDENT_DASHBOARD,
    queryFn: studentDashboard,
    refetchOnWindowFocus: true,
  });

  if (loading) {
    return (
      <div className="p-6">Loading dashboard...</div>
    );
  }

  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold">
          Welcome, {dashboard.fullName}!
        </h1>
        <p className="mt-1 text-gray-400">
          Student Number: {dashboard.studentNumber}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-gray-600" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Program</p>
              <p className="font-semibold text-sm text-gray-900">
                {dashboard.program}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Layers className="text-gray-600" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Section</p>
              <p className="font-semibold text-sm text-gray-900">
                {dashboard.section || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="text-gray-600" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Subjects</p>
              <p className="font-semibold text-sm text-gray-900">
                {dashboard.enrolledSubjects}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <User className="text-gray-600" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Year Level</p>
              <p className="font-semibold text-sm text-gray-900">
                {dashboard.yearLevel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/student/subjects"
            className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="mb-2 text-gray-600" size={20} />
            <p className="font-medium text-sm text-gray-900">My Subjects</p>
            <p className="text-xs text-gray-500 mt-1">
              View your enrolled subjects.
            </p>
          </a>

          <a
            href="/student/profile"
            className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <User className="mb-2 text-gray-600" size={20} />
            <p className="font-medium text-sm text-gray-900">My Profile</p>
            <p className="text-xs text-gray-500 mt-1">
              Update your personal information.
            </p>
          </a>

          <a
            href="/student/change-password"
            className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <GraduationCap className="mb-2 text-gray-600" size={20} />
            <p className="font-medium text-sm text-gray-900">Change Password</p>
            <p className="text-xs text-gray-500 mt-1">
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
