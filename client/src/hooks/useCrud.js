import { useState } from "react";

const useCrud = () => {

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);

    const [isModalOpen, setModalOpen] = useState(false);

    const [isDeleteOpen, setDeleteOpen] = useState(false);

    const openCreate = () => {

        setSelectedItem(null);

        setModalOpen(true);

    };

    const openEdit = (item) => {

        setSelectedItem(item);

        setModalOpen(true);

    };

    const closeModal = () => {

        setSelectedItem(null);

        setModalOpen(false);

    };

    const openDelete = (item) => {

        setSelectedItem(item);

        setDeleteOpen(true);

    };

    const closeDelete = () => {

        setSelectedItem(null);

        setDeleteOpen(false);

    };

    return {

        loading,
        setLoading,

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

    };

};

export default useCrud;