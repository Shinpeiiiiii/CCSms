import { useMemo, useState } from "react";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";
import Card from "../../../components/cards/Cards";
import DataTable from "../../../components/table/DataTable";
import ConfirmModal from "../../../components/modal/ConfirmModal";

import AccountToolbar from "../components/AccountToolbar";
import AccountModal from "../components/AccountModal";
import AccountColumns from "../components/AccountColumn";

import useCrud from "../../../hooks/useCrud";
import useAccounts from "../hooks/useAccounts";

import {
    createAccount,
    updateAccount,
    deleteAccount,
} from "../services/account.services";

const Accounts = () => {
    const { accounts, loading, refreshAccounts } = useAccounts();

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
    const [selectedRole, setSelectedRole] = useState("");

    const filteredAccounts = useMemo(() => {
        const keyword = search.toLowerCase();
        return accounts.filter((account) => {
            const fullName = `${account.firstName || ""} ${account.lastName || ""}`.toLowerCase();
            const matchesSearch =
                fullName.includes(keyword) ||
                account.email?.toLowerCase().includes(keyword) ||
                account.role?.toLowerCase().includes(keyword);
            const matchesRole = selectedRole ? account.role === selectedRole : true;

            return matchesSearch && matchesRole;
        });
    }, [accounts, search, selectedRole]);

    const handleSave = async (formData) => {
        try {
            setSaving(true);
            if (selectedItem) {
                await updateAccount(selectedItem._id, formData);
            } else {
                await createAccount(formData);
            }
            closeModal();
            await refreshAccounts();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to save account."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteAccount(selectedItem._id);
            closeDelete();
            await refreshAccounts();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete account."
            );
        } finally {
            setDeleting(false);
        }
    };

    const columns = AccountColumns({
        openEdit,
        openDelete,
    });

    return (
        <DashboardLayout>
            <Card
                title="Accounts"
                subtitle="Manage portal user accounts"
                actions={
                    <AccountToolbar
                        search={search}
                        setSearch={setSearch}
                        onAdd={openCreate}
                        selectedRole={selectedRole}
                        onRoleChange={(e) => setSelectedRole(e.target.value)}
                    />
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredAccounts}
                    loading={loading}
                    emptyMessage="No accounts found."
                />
            </Card>

            <AccountModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                loading={saving}
                account={selectedItem}
            />

            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete Account"
                message={
                    selectedItem
                        ? `Are you sure you want to delete "${selectedItem.firstName} ${selectedItem.lastName}"?`
                        : ""
                }
                onCancel={closeDelete}
                onConfirm={handleDelete}
                loading={deleting}
            />
        </DashboardLayout>
    );
};

export default Accounts
