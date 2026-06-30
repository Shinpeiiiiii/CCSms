import DataTable from "../../../../../components/table/DataTable";
import ActionButtons from "../../../../../components/actions/ActionButton";

const ProgramTable = ({
    programs,
    loading,
    onEdit,
    onDelete,
}) => {

    const columns = [
        {
            header: "Code",
            accessor: "programCode",
        },
        {
            header: "Program Name",
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
                    onEdit={() => onEdit(program)}
                    onDelete={() => onDelete(program)}
                />
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={programs}
            loading={loading}
            emptyMessage="No programs found."
        />
    );
};

export default ProgramTable;