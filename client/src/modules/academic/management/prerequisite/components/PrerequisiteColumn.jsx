import ActionButtons from "../../../../../components/actions/ActionButton";

const PrerequisiteColumn = ({
    openEdit,
    openDelete,
}) => [
    {
        header: "Subject",
        render: (row) =>
            `${row.subject?.subjectCode} - ${row.subject?.subjectName}`,
    },
    {
        header: "Required Subject",
        render: (row) =>
            `${row.requiredSubject?.subjectCode} - ${row.requiredSubject?.subjectName}`,
    },
    {
        header: "Year Level",
        render: (row) => (row.yearLevel ? `Year ${row.yearLevel}` : "—"),
    },
    {
        header: "Semester",
        render: (row) => (row.semester ? `Semester ${row.semester}` : "—"),
    },
    {
        header: "Type",
        accessor: "type",
    },
    {
        header: "Minimum Grade",
        render: (row) => `${row.minimumGrade}%`,
    },
    {
        header: "Status",
        accessor: "status",
    },
    {
        header: "Actions",
        render: (row) => (
            <ActionButtons
                onEdit={() => openEdit(row)}
                onDelete={() => openDelete(row)}
            />
        ),
    },
];

export default PrerequisiteColumn;