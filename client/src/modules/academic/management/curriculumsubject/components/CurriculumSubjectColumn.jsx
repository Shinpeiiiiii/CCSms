import ActionButtons from "../../../../../components/actions/ActionButton";

const CurriculumSubjectColumn = ({ onEdit, onDelete }) => [
    {
        header: "Subject Code",
        render: (row) => row.subject?.subjectCode || "-",
    },
    {
        header: "Subject Name",
        render: (row) => row.subject?.subjectName || "-",
    },
    {
        header: "Units",
        render: (row) => row.subject?.units || "-",
    },
    {
        header: "Year Level",
        accessor: "yearLevel",
    },
    {
        header: "Semester",
        accessor: "semester",
    },
    {
        header: "Required",
        render: (row) => (row.isRequired ? "Yes" : "No"),
    },
    {
        header: "Display Order",
        accessor: "displayOrder",
    },
    {
        header: "Actions",
        render: (row) => (
            <ActionButtons
                onEdit={() => onEdit(row)}
                onDelete={() => onDelete(row)}
            />
        ),
    },
];

export default CurriculumSubjectColumn;