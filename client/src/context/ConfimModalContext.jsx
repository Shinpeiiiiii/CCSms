import { createContext, useContext, useState } from "react";

const ConfirmModalContext = createContext();

export function ConfirmModalProvider({ children }) {
    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        onConfirm: null,
    });

    const openConfirm = ({
        title,
        message,
        confirmText = "Confirm",
        cancelText = "Cancel",
        onConfirm
    }) => {
        setModal({
            isOpen: true,
            title,
            message,
            confirmText,
            cancelText,
            onConfirm
        });
    };

    const closeConfirm = () => {
        setModal((prev) => ({
            ...prev,
            isOpen: false,
        }));
    };

    return (
        <ConfirmModalContext.Provider
            value={{
                modal,
                openConfirm,
                closeConfirm
            }}
        >
            {children}
        </ConfirmModalContext.Provider>
    )
}


export function useConfirmModal() {
    return useContext(ConfirmModalContext);
}