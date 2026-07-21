import React, { useState } from 'react';
import { X, User, MapPin, GraduationCap, Calendar, Check } from 'lucide-react';

const ApplicationDetailsModal = ({
  application,
  onClose,
  onApprove,
  actionLoading = '',
}) => {
  const [activeTab, setActiveTab] = useState('personal');

  if (!application) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'contact', label: 'Contact & Location', icon: MapPin },
    { id: 'academic', label: 'Academic Program', icon: GraduationCap },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Application Details
              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {application.applicationNumber}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Submitted on {formatDate(application.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-white px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</label>
                <p className="text-gray-900 font-medium">{application.firstName || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Middle Name</label>
                <p className="text-gray-900 font-medium">{application.middleName || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                <p className="text-gray-900 font-medium">{application.lastName || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sex</label>
                <p className="text-gray-900 font-medium">{application.sex || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Birth Date</label>
                <p className="text-gray-900 font-medium">{formatDate(application.birthDate)}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Civil Status</label>
                <p className="text-gray-900 font-medium">{application.civilStatus || 'Single'}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nationality</label>
                <p className="text-gray-900 font-medium">{application.nationality || 'Filipino'}</p>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                <p className="text-gray-900 font-medium">{application.email}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact Number</label>
                <p className="text-gray-900 font-medium">{application.contactNumber || 'N/A'}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</label>
                <p className="text-gray-900 font-medium leading-relaxed">{application.address || 'N/A'}</p>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferred Program</label>
                <div className="flex items-start gap-2 bg-blue-50/30 p-3 rounded-lg border border-blue-100/50 mt-1">
                  <GraduationCap className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-blue-900 font-semibold">{application.program?.programName || 'N/A'}</p>
                    <p className="text-xs text-blue-600 mt-0.5">Undergraduate Program</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Student Type</label>
                <p className="text-gray-900 font-medium mt-0.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    application.studentType === 'Regular'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : application.studentType === 'Transferee'
                      ? 'bg-purple-50 text-purple-700 border-purple-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {application.studentType || 'Regular'}
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Year Level</label>
                <p className="text-gray-900 font-medium mt-0.5">Year {application.yearLevel || 1}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Academic Year</label>
                <div className="flex items-center gap-1.5 text-gray-700 mt-0.5">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-medium">{application.academicYear?.academicYearName || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-150 shadow-sm cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onApprove(application._id);
              onClose();
            }}
            disabled={actionLoading === application._id}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-150 shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <Check size={16} />
            <span>Approve Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
