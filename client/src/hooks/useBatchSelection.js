import { useState, useMemo, useCallback } from "react";

const useBatchSelection = (data = []) => {
    const [selectedIds, setSelectedIds] = useState([]);

    const selectableData = useMemo(
        () => data.filter((item) => !item._isSeparator),
        [data]
    );

    const toggleSelect = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    }, []);

    const toggleSelectAll = useCallback(() => {
        setSelectedIds((prev) => {
            const allIds = selectableData.map((item) => item._id);
            const allSelected =
                allIds.length > 0 &&
                allIds.every((id) => prev.includes(id));
            return allSelected ? [] : allIds;
        });
    }, [selectableData]);

    const clearSelection = useCallback(() => setSelectedIds([]), []);

    const isSelected = useCallback(
        (id) => selectedIds.includes(id),
        [selectedIds]
    );

    const isAllSelected = useMemo(
        () =>
            selectableData.length > 0 &&
            selectableData.every((item) => selectedIds.includes(item._id)),
        [selectableData, selectedIds]
    );

    const isIndeterminate = useMemo(
        () =>
            selectedIds.length > 0 &&
            !isAllSelected &&
            selectableData.some((item) => selectedIds.includes(item._id)),
        [selectableData, selectedIds, isAllSelected]
    );

    const selectedCount = selectedIds.length;

    return {
        selectedIds,
        setSelectedIds,
        toggleSelect,
        toggleSelectAll,
        clearSelection,
        isSelected,
        isAllSelected,
        isIndeterminate,
        selectedCount,
    };
};

export default useBatchSelection;
