import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";

import EnrollmentPeriodToolbar from "../components/EnrollmentPeriodToolbar";
import EnrollmentPeriodColumns from "../components/EnrollmentPeriodColumn";
import EnrollmentPeriodModal from "../components/EnrollmentPeriodModal";

import useCrud from "../../../../../hooks/useCrud";
import useEnrollmentPeriod from "../hooks/useEnrollmentPeriod";


import {
    createEnrollmentPeriod,
    updateEnrollmentPeriod,
    publishEnrollmentPeriod,
    openEnrollmentPeriod,
    closeEnrollmentPeriod,
    archiveEnrollmentPeriod,
} from "../services/enrollmentPeriodService";

const EnrollmentPeriod = () => {

    const { enrollmentPeriods, loading, refreshEnrollmentPeriods,
    } = useEnrollmentPeriod();

    const {
        search,
        setSearch,
        selectedItem,
        isModalOpen,
        openCreate,
        openEdit,
        closeModal,
    } = useCrud();

    const [saving, setSaving] = useState(false);
    const filteredEnrollmentPeriods = useMemo(() => {
    const keyword = search.toLowerCase();
    console.log(enrollmentPeriods);

    return enrollmentPeriods.filter(Boolean).filter((item) =>

        item.enrollmentPeriodName
            ?.toLowerCase()
            .includes(keyword)
        ||
        item.academicYear?.academicYearName
            ?.toLowerCase()
            .includes(keyword)
    );

    }, [enrollmentPeriods, search]);

    const handleSave = async (formData) => {

        try {
            setSaving(true);
            if (selectedItem) {
                await updateEnrollmentPeriod(
                    selectedItem._id,
                    formData
                );
            }
            else {
                await createEnrollmentPeriod(
                    formData
                );
            }
            closeModal();
            toast.success("Enrollment created successfully.");
            await refreshEnrollmentPeriods();
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to save enrollment period."
            );
        }
        finally {
            setSaving(false);
        }
    };

    const handleOpen = async (period) => {
        try{
            await openEnrollmentPeriod(period._id);
            toast.success("Enrollment Period opened successfully.")
            refreshEnrollmentPeriods();
        }catch(error){
            toast.error(error.response?.data?.message || "Failed to open enrollment period.")
        }
    }
    const handlePublish = async (period) => {
        try {
            await publishEnrollmentPeriod(period._id);
            await refreshEnrollmentPeriods();
            toast.success("Enrollment published successfully.");
        }
        catch (error) {
            alert(error.response?.data?.message);
        }
    };

    const handleClose = async (period) => {

        try {
            await closeEnrollmentPeriod(period._id);
            await refreshEnrollmentPeriods();
            toast.success("Enrollment Period closed successfully.")
        }
        catch (error) {
            alert(error.response?.data?.message);
        }

    };

    const handleArchive = async (period) => {

        try {

            await archiveEnrollmentPeriod(period._id);
            await refreshEnrollmentPeriods();
            toast.success("Enrollment Period archived successfully.")
        }
        catch (error) {
            alert(error.response?.data?.message);
        }
    };

    const columns = EnrollmentPeriodColumns({

        openEdit,
        onPublish: handlePublish,
        onOpen: handleOpen,
        onClose: handleClose,
        onArchive: handleArchive,
    });

    return (

        <DashboardLayout>

            <Card
                title="Enrollment Periods"
                subtitle="Manage enrollment schedules"
                actions={
                    <EnrollmentPeriodToolbar
                        search={search}
                        setSearch={setSearch}
                        onAdd={openCreate}
                    />
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredEnrollmentPeriods}
                    loading={loading}
                    emptyMessage="No enrollment periods found."
                />
            </Card>
            <EnrollmentPeriodModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                enrollmentPeriod={selectedItem}
                loading={saving}
            />
        </DashboardLayout>
    );
};
export default EnrollmentPeriod;
