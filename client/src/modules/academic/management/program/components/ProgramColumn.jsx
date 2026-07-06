import ActionButtons from "../../../../../components/actions/ActionButton";

const ProgramColumns = ({ openEdit, openDelete }) => [

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
        render: (program) => program.department?.departmentName || "-",
    },

    {
        header: "Level",
        accessor: "programLevel",
    },

    {
        header: "Duration",
        render: (program) => `${program.durationYears} Year(s)`,
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

export default ProgramColumns;