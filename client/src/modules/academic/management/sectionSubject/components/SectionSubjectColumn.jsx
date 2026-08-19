import ActionButtons from "../../../../../components/actions/ActionButton";

const SectionSubjectColumn = ({ onEdit, onDelete }) => [
    {
        header: "Code",
        render: (row) => row.subject?.subjectCode || "-",
    },
    {
        header: "Subject",
        render: (row) => row.subject?.subjectName || "-",
    },
    {
        header: "Semester",
        render: (row) => row.semester ?? "-",
    },
    {
        header: "Units",
        render: (row) => row.subject?.totalUnits || row.subject?.lectureUnits || row.subject?.laboratoryUnits || "-",
    },
    {
        header: "Instructor",
        render: (row) => row.instructor ? `${row.instructor.firstName} ${row.instructor.lastName}` : "-",
    },
    {
        header: "Room",
        render: (row) => row.room || "-",
    },
    {
        header: "Day",
        render: (row) => row.day || "-",
    },
    {
        header: "Start",
        render: (row) => row.startTime || "-",
    },
    {
        header: "End",
        render: (row) => row.endTime || "-",
    },
    {
        header: "Status",
        render: (row) => row.status || "-",
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

export default SectionSubjectColumn;
