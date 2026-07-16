import { PrimaryButton } from "@/components/buttons";
import ActionButtons from "../../../../../components/actions/ActionButton";
import CurriculumStatusBadge from "./CurriculumStatusBadge";
import {
    Pencil, History, Upload, Archive, BookOpen
} from "lucide-react"

import ActionMenu from "../../../../../components/actions/ActionMenu";
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

            if (curriculum.status === "Draft") {

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