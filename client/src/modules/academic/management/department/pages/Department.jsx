import { useMemo, useState } from "react";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import DepartmentToolbar from "../components/DepartmentToolbar";
import DepartmentModal from "../components/DepartmentModal";

import useCrud from "../../../../../hooks/useCrud";
import useDepartments from "../hooks/useDepartment";

import {
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../services/department.services";

import ActionButtons from "../../../../../components/actions/ActionButton";

const Department = () => {

    /*
    =====================================
    Department Hook
    =====================================
    */

    const {

        department,

        loading,

        refreshDepartments,

    } = useDepartments();

    /*
    =====================================
    CRUD Hook
    =====================================
    */

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

    const filteredDepartments = useMemo(() => {

        return department.filter((department) => {

            const keyword = search.toLowerCase();

            return (

                department.departmentCode
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                department.departmentName
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                department.description
                    ?.toLowerCase()
                    .includes(keyword)

            );

        });

    }, [department, search]);
    /*
=====================================
Save
=====================================
*/

    const handleSave = async (formData) => {

        try {

            setSaving(true);

            if (selectedItem) {

                await updateDepartment(
                    selectedItem._id,
                    formData
                );

            } else {

                await createDepartment(formData);

            }

            closeModal();

            await refreshDepartments();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to save department."
            );

        } finally {

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

            await deleteDepartment(

                selectedItem._id

            );

            closeDelete();

            await refreshDepartments();

        }

        catch (error) {

            alert(
                error.response?.data?.message || "Failed to delete department."
            )

        } finally {

            setDeleting(false);
        }

    };

    /*
=====================================
Table Columns
=====================================
*/

    const columns = [

        {

            header: "Code",

            accessor: "departmentCode",

        },

        {

            header: "Department",

            accessor: "departmentName",

        },

        {

            header: "Description",

            accessor: "descriptions",

        },
        {
            header: 'Department Head',
            accessor: 'departmentHead'
        },

        {

            header: "Status",

            accessor: "status",

        },

        {

            header: "Actions",

            render: (department) => (

                <ActionButtons

                    onEdit={() => openEdit(department)}

                    onDelete={() => openDelete(department)}

                />

            ),

        },

    ];

    return (

        <DashboardLayout>

            <Card

                title="Departments"

                subtitle="Manage academic departments"

                actions={

                    <DepartmentToolbar

                        search={search}

                        setSearch={setSearch}

                        onAdd={openCreate}

                    />

                }

            >

                <DataTable

                    columns={columns}

                    data={filteredDepartments}

                    loading={loading}

                    emptyMessage="No departments found."

                />

            </Card>
            <DepartmentModal

                isOpen={isModalOpen}

                onClose={closeModal}

                onSubmit={handleSave}

                department={selectedItem}
                loading={saving}

            />
            <ConfirmModal

                isOpen={isDeleteOpen}

                title="Delete Department"

                message={

                    selectedItem

                        ? `Are you sure you want to delete "${selectedItem.departmentName}"?`

                        : ""

                }

                onCancel={closeDelete}

                onConfirm={handleDelete}

            />
        </DashboardLayout>

    );

};

export default Department


