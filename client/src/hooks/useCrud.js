import { useState } from "react";

const useCrud = () => {

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    console.log(isModalOpen,selectedItem);
    const openCreate = () => {
        console.log("Add curriculum button is triggered.")
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

    const openHistory = (item) => {
        console.log("History Clicked", item);
        setSelectedItem(item);
        setIsHistoryOpen(true);
    };

    const closeHistory = () => {
        setSelectedItem(null);
        setIsHistoryOpen(false);
    };

    return {

        loading,
        setLoading,

        search,
        setSearch,

        selectedItem,
        setSelectedItem,

        isModalOpen,
        isDeleteOpen,

        openCreate,
        openEdit,
        openDelete,

        closeModal,
        closeDelete,

        isHistoryOpen,
        openHistory,
        closeHistory,

    };

};

export default useCrud;