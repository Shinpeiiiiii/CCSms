const CheckboxColumn = ({
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isAllSelected,
    isIndeterminate,
}) => ({
    header: "",
    sortable: false,
    renderHeader: () => (
        <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => {
                if (el) el.indeterminate = isIndeterminate;
            }}
            onChange={toggleSelectAll}
            className="cursor-pointer accent-indigo-500 w-[15px] h-[15px]"
            title="Select all"
        />
    ),
    render: (row) => (
        <input
            type="checkbox"
            checked={selectedIds.includes(row._id)}
            onChange={() => toggleSelect(row._id)}
            className="cursor-pointer accent-indigo-500 w-[15px] h-[15px]"
        />
    ),
});

export default CheckboxColumn;
