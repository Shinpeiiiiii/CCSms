import ActionButtons from "../../../../../components/actions/ActionButton";

const SubjectColumns = ({
    openEdit,
    openDelete,
}) => [

    {
        header: "Code",
        accessor: "subjectCode",
    },

    {
        header: "Subject",
        accessor: "subjectName",
    },

    {
        header: "Units",
        render: (subject) => `${subject.units} Units`,
    },

    {
        header: "Lecture",
        render: (subject) => `${subject.lectureHours} hrs`,
    },

    {
        header: "Laboratory",
        render: (subject) => `${subject.laboratoryHours} hrs`,
    },

    {
        header: "Category",
        accessor: "subjectCategory",
    },

    {
        header: "Status",
        accessor: "status",
    },

    {
        header: "Actions",
        render: (subject) => (

            <ActionButtons
                onEdit={() => openEdit(subject)}
                onDelete={() => openDelete(subject)}
            />

        ),
    },

];

export default SubjectColumns;