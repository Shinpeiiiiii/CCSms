import React from 'react';
import { Users, FileText, ClipboardList, UserCheck } from 'lucide-react';

const ApplicationStats = ({ applications = [] }) => {
  const total = applications.length;
  const regularCount = applications.filter(app => app.studentType === 'Regular').length;
  const transfereeCount = applications.filter(app => app.studentType === 'Transferee').length;
  const otherCount = total - regularCount - transfereeCount;

  const stats = [
    {
      label: 'Pending Reviews',
      value: total,
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Regular Applicants',
      value: regularCount,
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Transferees',
      value: transfereeCount,
      icon: ClipboardList,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Others',
      value: otherCount,
      icon: UserCheck,
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.textColor}`}>
              <Icon size={24} className="stroke-[2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationStats;
