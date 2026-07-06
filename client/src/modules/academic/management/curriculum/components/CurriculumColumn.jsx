import ActionButtons from "../../../../../components/actions/ActionButton";

const CurriculumColumn = ({
    openEdit,
    onPublish,
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
        accessor: "status",
    },

   {
        header: "Actions",

        render: (curriculum) => {

        return (

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}
            >

                <button
                    style={{
                        background: "#2563EB",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                    }}
                    onClick={() =>{
                        console.log('Clicked the view subjects at the curriculum', curriculum._id)
                        navigate(
                            `/curriculum/${curriculum._id}/subjects`
                        )
                    }
                        
                    }
                >
                    View Subject
                </button>

                {curriculum.status === "Draft" && (
                    <ActionButtons
                        onEdit={() => openEdit(curriculum)}
                        customButtons={[
                            {
                                label: "Publish",
                                onClick: () => onPublish(curriculum),
                            },
                        ]}
                    />
                )}

                {curriculum.status === "Published" && (
                    <ActionButtons
                        customButtons={[
                            {
                                label: "Archive",
                                onClick: () => onArchive(curriculum),
                            },
                        ]}
                    />
                )}

                {curriculum.status === "Archived" && (
                    <span
                        style={{
                            color: "#94A3B8",
                            fontSize: 13,
                        }}
                    >
                        Archived
                    </span>
                )}

            </div>

        );},
   }
];

export default CurriculumColumn;