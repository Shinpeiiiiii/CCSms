import SectionStatusBadge from "./SectionStatusBadge";
import ActionMenu from "../../../../../components/actions/ActionMenu";

const SectionColumns = ({

    openEdit,
    onOpen,
    onClose,
    onArchive,

}) => [

    {
        header: "Code",
        accessor: "sectionCode",
    },

    {
        header: "Section",
        accessor: "sectionName",
    },

    {
        header: "Program",

        render: (row) =>
            row.curriculum?.program?.programName || "-",
    },

    {
        header: "Curriculum",
        render: (row) =>
            row.curriculum?.curriculumName || "-",
    },

    {
        header: "Year Level",
        accessor: "yearLevel",
    },

    {
        header: "Capacity",
        render: (row) =>
            `${row.enrolledCount ?? 0} / ${row.capacity}`,
    },

    {
        header: "Subjects",

        render: (row) =>
            `${row.generatedSubjectCount ?? 0} generated`,
    },

    {
        header: "Status",

        render: (row) => (

            <SectionStatusBadge
                status={row.status}
            />

        ),
    },

    {
        header: "Actions",
        render: (section) => {
            const actions = [];

            if (section.status === "Planning") {
                actions.push({
                    label: "Edit",
                    icon: "edit",
                    onClick: () => openEdit(section),
                });
                actions.push({
                    label: "Open",
                    icon: "publish",
                    onClick: () => onOpen(section),
                });
            }
            if(section.status === "Open"){
                actions.push({
                    label: "Close",
                    icon: "close",
                    onClick: () => onClose(section),
                });
            }
            if (section.status !== "Archived") {

                actions.push({
                    label: "Archive",
                    icon: "archive",
                    onClick: () => onArchive(section),
                });
            }
            return (
                <ActionMenu
                    actions={actions}
                />
            );
        },

    },
];

export default SectionColumns;