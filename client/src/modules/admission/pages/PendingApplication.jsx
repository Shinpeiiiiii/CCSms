import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


import {
  getPendingApplications,
  approveApplication,
  rejectApplication,
  requestRevision,
} from '../services/studentApplicationServices';

import DashboardLayout from '@/shared/layouts/DashboardLayout';
import ApplicationStats from '../components/ApplicationStats';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import DataTable from '@/components/table/DataTable';
import ApplicationColumn from '../components/ApplicationColumn';
import Card from '@/components/cards/Cards';
import ApplicationToolbar from '../components/ApplicationToolbar';

const PendingApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [search, setSearch] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getPendingApplications();
      const safeData = Array.isArray(data) ? data : [];
      setApplications(safeData);
      setFilteredApplications(safeData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load applications.');
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);
   // Responsive state
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const filtered = applications.filter((app) => {
      const fullName =
        `${app.firstName || ''} ${app.middleName || ''} ${app.lastName || ''}`
          .toLowerCase();

      return (
        fullName.includes(keyword) ||
        app.email?.toLowerCase().includes(keyword) ||
        app.applicationNumber?.toLowerCase().includes(keyword)
      );
    });

    setFilteredApplications(filtered);
  }, [search, applications]);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await approveApplication(id);
      toast.success('Application approved successfully.');
      await loadApplications();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to approve application.'
      );
    } finally {
      setActionLoading('');
    }
  };

  const handleReject = async (id) => {
    const remarks = window.prompt('Enter rejection remarks:');
    if (!remarks) return;

    try {
      setActionLoading(id);
      await rejectApplication(id, remarks);
      toast.success('Application rejected.');
      await loadApplications();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to reject application.'
      );
    } finally {
      setActionLoading('');
    }
  };

  const handleRevision = async (id) => {
    const remarks = window.prompt('Enter revision remarks:');
    if (!remarks) return;

    try {
      setActionLoading(id);
      await requestRevision(id, remarks);
      toast.success('Revision requested.');
      await loadApplications();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to request revision.'
      );
    } finally {
      setActionLoading('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ApplicationStats applications={applications}/>
        {/* Table & Content Container */}
        <Card
          title="Pending Applications"
          subtitle="Review and manage student enrollment applications"
          actions={<ApplicationToolbar search={search} setSearch={setSearch}/>}
        >
          <DataTable
            columns={ApplicationColumn({
              onView: setSelectedApplication,
              onApprove: handleApprove,
              onReject: handleReject,
              onRevision: handleRevision,
              actionLoading,
            })}
            data={filteredApplications}
            loading={loading}
            emptyMessage={search ? `No applications matching "${search}" were found.` : "There are currently no pending student applications awaiting review."}
          />
        </Card>

        {/* Application Details Modal */}
        {selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onApprove={handleApprove}
            actionLoading={actionLoading}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingApplications;