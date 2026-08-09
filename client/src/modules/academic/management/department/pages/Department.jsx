import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import DepartmentToolbar from "../components/DepartmentToolbar";
import DepartmentModal from "../components/DepartmentModal";
import DepartmentColumns from "../components/DepartmentColumn";

import useCrud from "../../../../../hooks/useCrud";
import useDepartment from "../hooks/useDepartment";


const Department = () => {

    /*
    =====================================
    Department Hook
    =====================================
    */

    const {

        filteredDepartments,

        loading,

        search,

        setSearch,

        create,

        update,

        remove,

    } = useDepartment();

    /*
    =====================================
    CRUD Hook
    =====================================
    */

    const {
        selectedItem,
        isModalOpen,
        isDeleteOpen,
        openCreate,
        openEdit,
        openDelete,
        closeModal,
        closeDelete,
    } = useCrud();

    /*
    =====================================
    Save
    =====================================
    */

    const handleSave = async (formData) => {

        try {

            if (selectedItem) {

                await update.mutateAsync({

                    id: selectedItem._id,

                    data: formData,

                });

            } else {

                await create.mutateAsync(formData);

            }

            closeModal();

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to save department."

            );

        }

    };

    /*
    =====================================
    Delete
    =====================================
    */

    const handleDelete = async () => {

        try {

            await remove.mutateAsync(

                selectedItem._id

            );

            closeDelete();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to delete department."

            );

        }

    };

    /*
    =====================================
    Columns
    =====================================
    */

    const columns = DepartmentColumns({

        openEdit,

        openDelete,

    });

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
                loading={
                    create.isPending ||
                    update.isPending
                }
            />
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete Department"
                onCancel={closeDelete}
                onClose={closeDelete}
                onConfirm={handleDelete}
                message={
                    selectedItem
                        ? `Are you sure you want to delete "${selectedItem.departmentName}"?`
                        : ""
                }
            />
        </DashboardLayout>
    );
};

export default Department;