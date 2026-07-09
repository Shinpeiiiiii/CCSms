import ActionButtons from "../../../../../components/actions/ActionButton";

const PrerequisiteColumn = (
    handleEdit,
    handleDeactivate
) => [
    {
        header: "Subject",
        accessor: (row) =>
            `${row.subject?.subjectCode} - ${row.subject?.subjectName}`,
    },
    {
        header: "Required Subject",
        accessor: (row) =>
            `${row.requiredSubject?.subjectCode} - ${row.requiredSubject?.subjectName}`,
    },
    {
        header: "Type",
        accessor: "type",
    },
    {
        header: "Minimum Grade",
        accessor: (row) => `${row.minimumGrade}%`,
    },
    {
        header: "Status",
        accessor: (row) => row.status,
    },
    {
        header: "Actions",
        accessor: (row) => (
            <ActionButtons
                onEdit={() => handleEdit(row)}
                onDelete={() => handleDeactivate(row._id)}
            />
        ),
    },
];

export default PrerequisiteColumn;