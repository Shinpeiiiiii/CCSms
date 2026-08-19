import { PrimaryButton } from "@/components/buttons";
import ActionButtons from "../../../../../components/actions/ActionButton";
import ActionMenu from "@/components/actions/ActionMenu";

const SubjectColumns = ({
    openEdit,
    openDelete,
    openHistory,
    navigate,
    sortable,
}) => [

    {
        header: "Code",
        accessor: "subjectCode",
        sortable: true,
    },

    {
        header: "Subject",
        accessor: "subjectName",
        sortable: true,
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
        render: (subject) => {
            const actions = [];

            actions.push({
                label: "Edit",
                icon: "edit",

                onClick: () => openEdit(subject),
            });

            actions.push({
                label: "Delete",
                icon: "delete",

                onClick: () => openDelete(subject),
            });

            actions.push({
                label: "History",
                icon: "history",

                onClick: () => openHistory(subject),
            })

            return(<ActionMenu actions={actions}/>);
        },
    },

];

export default SubjectColumns;