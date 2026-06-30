import { useMemo, useState, useEffect } from "react";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import ProgramToolbar from "../components/ProgramToolbar";
import ProgramModal from "../components/ProgramModal";

import useCrud from "../../../../../hooks/useCrud";
import useProgram from "../hooks/useProgram";
import useDepartment from "../../department/hooks/useDepartment";

import {
    createProgram,
    updateProgram,
    deleteProgram,
} from "../services/program.services";

import ActionButtons from "../../../../../components/actions/ActionButton";
import ProgramTable from "../components/ProgramTable";
import DepartmentFilter from "../components/DepartmentFilter";

const Program = () => {

    /*
    =====================================
    Hooks
    =====================================
    */

    const {
        programs,
        loading,
        refreshPrograms,
    } = useProgram();

    const {
        department = [],
    } = useDepartment();

    // Selected Department State
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("all");

    // Responsive state
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Compute program counts per department dynamically
    const programCounts = useMemo(() => {
        const counts = {};
        programs.forEach((prog) => {
            const deptId = prog.department?._id || prog.department;
            if (deptId) {
                counts[deptId] = (counts[deptId] || 0) + 1;
            }
        });
        return counts;
    }, [programs]);

    const {
        search,
        setSearch,
        selectedItem,
        isModalOpen,
        isDeleteOpen,
        openCreate,
        openEdit,
        openDelete,
        closeModal,
        closeDelete,
    } = useCrud();

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    /*
    =====================================
    Search
    =====================================
    */

    const filteredPrograms = useMemo(() => {
        const keyword = search.toLowerCase();

        return programs.filter((program) => {
            // First check department filter
            const programDeptId = program.department?._id || program.department;
            if (selectedDepartmentId !== "all" && programDeptId !== selectedDepartmentId) {
                return false;
            }

            // Then check search keyword
            return (
                program.programCode?.toLowerCase().includes(keyword) ||
                program.programName?.toLowerCase().includes(keyword) ||
                program.department?.departmentName?.toLowerCase().includes(keyword)
            );
        });
    }, [programs, search, selectedDepartmentId]);

    /*
    =====================================
    Save
    =====================================
    */

    const handleSave = async (formData) => {

        try {

            setSaving(true);

            if (selectedItem) {

                await updateProgram(
                    selectedItem._id,
                    formData
                );

            } else {

                await createProgram(formData);

            }

            closeModal();

            await refreshPrograms();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to save program."

            );

        }

        finally {

            setSaving(false);

        }

    };

    /*
    =====================================
    Delete
    =====================================
    */

    const handleDelete = async () => {

        try {

            setDeleting(true);

            await deleteProgram(selectedItem._id);

            closeDelete();

            await refreshPrograms();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to delete program."

            );

        }

        finally {

            setDeleting(false);

        }

    };

    /*
    =====================================
    Table
    =====================================
    */

    const columns = [

        {
            header: "Code",
            accessor: "programCode",
        },

        {
            header: "Program",
            accessor: "programName",
        },

        {
            header: "Department",
            render: (program) =>
                program.department?.departmentName || "-",
        },

        {
            header: "Status",
            accessor: "status",
        },

        {
            header: "Actions",
            render: (program) => (

                <ActionButtons

                    onEdit={() => openEdit(program)}

                    onDelete={() => openDelete(program)}

                />

            ),
        },

    ];

    return (
        <DashboardLayout>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "280px 1fr",
                    gap: 24,
                    alignItems: "start",
                }}
            >
                <DepartmentFilter
                    departments={department}
                    selectedDepartmentId={selectedDepartmentId}
                    onSelectDepartment={setSelectedDepartmentId}
                    programCounts={programCounts}
                    totalProgramsCount={programs.length}
                    isMobile={isMobile}
                />

                <Card
                    title="Programs"
                    subtitle="Manage academic programs"
                    actions={
                        <ProgramToolbar
                            search={search}
                            setSearch={setSearch}
                            onAdd={openCreate}
                        />
                    }
                >
                    <ProgramTable
                        programs={filteredPrograms}
                        onEdit={openEdit}
                        onDelete={openDelete}
                        loading={loading}
                        emptyMessage="No programs found."
                    />
                </Card>
            </div>

            <ProgramModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                loading={saving}
                program={selectedItem}
                department={department}
            />

            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete Program"
                message={
                    selectedItem
                        ? `Are you sure you want to delete "${selectedItem.programName}"?`
                        : ""
                }
                onCancel={closeDelete}
                onConfirm={handleDelete}
            />
        </DashboardLayout>
    );

};

export default Program;