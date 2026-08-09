import ActionMenu from "../../../../../components/actions/ActionMenu";
import CurriculumStatusBadge from "./CurriculumStatusBadge";
import {
    Lock
} from "lucide-react"
const CurriculumColumn = ({
    openEdit,
    onPublish,
    openHistory,
    onArchive,
    navigate,
}) => [

    {
        header: "Code",
        accessor: "curriculumCode",
    },

    {
        header: "Curriculum",
        accessor: "curriculumName",
    },

    {
        header: "Program",
        render: (curriculum) =>
            curriculum.program?.programName || "-",
    },

    {
        header: "Academic Year",
        render: (curriculum) =>
            curriculum.academicYear?.academicYearName || "-",
    },

    {
        header: "Years",
        render: (curriculum) =>
            `${curriculum.totalYears} Years`,
    },

    {
        header: "Status",
        render: (curriculum) => (
            <CurriculumStatusBadge
                status={curriculum.status}
            />

        ),
    },

    {
        header: "Lock",
        render: (curriculum) => {
            if (curriculum.lock?.lockedBy) {
                return (
                    <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 8px",
                        borderRadius: 100,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        background: "#FEF3C7",
                        color: "#92400E",
                    }}>
                        <Lock size={10} />
                        Locked
                    </span>
                );
            }
            return <span style={{ color: "#9CA3AF", fontSize: "0.75rem" }}>—</span>;
        },
    },

   {
        header: "Actions",

        render: (curriculum) => {

            const actions = [];

            actions.push({
                label: "History",
                icon: "history",
                onClick: () => openHistory(curriculum),
            });

            actions.push({
                label: "View Subjects",
                icon: "edit",
                onClick: () =>
                    navigate(
                        `/curriculum/${curriculum._id}/subjects`
                    ),
            });

            if (curriculum.status === "Draft" && !curriculum.lock?.lockedBy) {

                actions.push({
                    label: "Edit",
                    icon: "edit",
                    onClick: () => openEdit(curriculum),
                });

                actions.push({
                    label: "Publish",
                    icon: "publish",
                    onClick: () => onPublish(curriculum),
                });

            }

            if (curriculum.status === "Published") {

                actions.push({
                    label: "Archive",
                    icon: "archive",
                    onClick: () => onArchive(curriculum),
                });

            }

            return (
                <ActionMenu
                    actions={actions}
                />
            );
       
        },
    }
];

export default CurriculumColumn;