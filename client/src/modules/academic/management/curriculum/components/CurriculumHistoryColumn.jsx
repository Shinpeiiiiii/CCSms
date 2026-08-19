import { PrimaryButton } from "@/components/buttons";

const CurriculumHistoryColumns = ({
    onView,
}) => [
    {
        header: "Version",
        render: (item) => `v${item.version}`,
    },
    {
        header: "Curriculum",
        accessor: "curriculumName",
    },
    {
        header: "Academic Year",
        render: (item) =>item.academicYear?.academicYearName,
    },
    {
        header: "Status",
        accessor: "status",
    },
    {
        header: "Current",
        render: (item) => item.isCurrentVersion ? "🟢 Current" : "⚪ Previous",
    },
    {
        header: "Created By",
        render: (item) => item.createdBy ? `${item.createdBy.firstName} ${item.createdBy.lastName}` : "-",
    },

    {
        header: "Actions",
        render: (item) => (
            <PrimaryButton
                onClick={() => onView(item)}>
                    
                View
            </PrimaryButton>

        ),
    },
];

export default CurriculumHistoryColumns;