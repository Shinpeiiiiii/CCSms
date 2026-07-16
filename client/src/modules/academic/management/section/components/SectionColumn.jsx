import SectionStatusBadge from "./SectionStatusBadge";
import ActionMenu from "../../../../../components/actions/ActionMenu";

const SectionColumns = ({

    openEdit,

    onActivate,

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
            row.curriculum?.program?.programName || "yawa",
    },  

    {
        header: "Curriculum",

        render: (row) =>
            row.curriculum?.curriculumName || "yawa",
    },

    {
        header: "Year Level",

        accessor: "yearLevel",
    },

    {
        header: "Capacity",

        accessor: "capacity",
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

                    label: "Activate",

                    icon: "publish",

                    onClick: () => onActivate(section),

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