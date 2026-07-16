import EnrollmentStatusBadge
from "./EnrollmentPeriodStatusBadge";

import ActionMenu from "../../../../../components/actions/ActionMenu";
import { formatDate } from "@/features/formatDate";

const EnrollmentPeriodColumns = ({

    openEdit,
    onPublish,
    onOpen,
    onClose,
    onArchive,
}) => [

{
    header: "Name",
    accessor: "enrollmentPeriodName",
},
{
    header: "Academic Year",
    render: (row) => row.academicYear?.academicYearName,
},
{
    header: "Start",
    render: (row) => formatDate(row.startDate),
},
{
    header: "End",
    render: (row) => formatDate(row.endDate),
},
{
    header: "Status",
    render: (row) => (
        <EnrollmentStatusBadge
            status={row.status}
        />
    ),
},
{
    header: "Actions",
    render: (row) => {
        const actions = [];
        if (row.status === "Draft") {
            actions.push({
                label: "Edit",
                icon: "edit",
                onClick: () => openEdit(row),
            });
            actions.push({
                label: "Publish",
                icon: "publish",
                onClick: () => onPublish(row),
            });
        }
        if (row.status === "Open") {
            actions.push({
                label: "Close",
                icon: "close",
                onClick: () => onClose(row),
            });
        }
        if (row.status === "Closed") {
            actions.push({
                label: "Archive",
                icon: "archive",
                onClick: () => onArchive(row),
            });
        }
        if(row.status === "Published") {
            actions.push({
                label: "Open",
                onClick: () => onOpen(row),
            });
        }
        return (
            <ActionMenu
                actions={actions}
            />
        );

    },
}];

export default EnrollmentPeriodColumns;