import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


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
import { QUERY_KEYS } from '@/constants/queryKey';

const PendingApplications = () => {
  const [actionLoading, setActionLoading] = useState('');
  const [search, setSearch] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading: loading } = useQuery({
    queryKey: QUERY_KEYS.PENDING_APPLICATIONS,
    queryFn: getPendingApplications,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_APPLICATIONS });

  const approveMutation = useMutation({
    mutationFn: (id) => approveApplication(id),
    onMutate: (id) => setActionLoading(id),
    onSuccess: () => {
      toast.success('Application approved successfully.');
      refresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve application.');
    },
    onSettled: () => setActionLoading(''),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, remarks }) => rejectApplication(id, remarks),
    onMutate: ({ id }) => setActionLoading(id),
    onSuccess: () => {
      toast.success('Application rejected.');
      refresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject application.');
    },
    onSettled: () => setActionLoading(''),
  });

  const revisionMutation = useMutation({
    mutationFn: ({ id, remarks }) => requestRevision(id, remarks),
    onMutate: ({ id }) => setActionLoading(id),
    onSuccess: () => {
      toast.success('Revision requested.');
      refresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to request revision.');
    },
    onSettled: () => setActionLoading(''),
  });

  const handleApprove = (id) => approveMutation.mutate(id);

  const handleReject = (id) => {
    const remarks = window.prompt('Enter rejection remarks:');
    if (!remarks) return;
    rejectMutation.mutate({ id, remarks });
  };

  const handleRevision = (id) => {
    const remarks = window.prompt('Enter revision remarks:');
    if (!remarks) return;
    revisionMutation.mutate({ id, remarks });
  };

  const filteredApplications = useMemo(() => {
    const keyword = search.toLowerCase();

    return applications.filter((app) => {
      const fullName =
        `${app.firstName || ''} ${app.middleName || ''} ${app.lastName || ''}`
          .toLowerCase();

      return (
        fullName.includes(keyword) ||
        app.email?.toLowerCase().includes(keyword) ||
        app.applicationNumber?.toLowerCase().includes(keyword)
      );
    });
  }, [search, applications]);

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