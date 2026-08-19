import ActionButtons from "../../../../../components/actions/ActionButton";

const DepartmentColumn = ({ openEdit, openDelete }) => [

    {
        header: "Code",
        accessor: "departmentCode",
    },

    {
        header: "Department",
        accessor: "departmentName",
    },

    {
        header: "Description",
        accessor: "description",
    },

    {
        header: "Department Head",
        accessor: "departmentHead",
    },

    {
        header: "Status",
        accessor: "status",
    },

    {
        header: "Actions",

        render: (department) => (

            <ActionButtons
                onEdit={() => openEdit(department)}
                onDelete={() => openDelete(department)}
            />

        ),
    },

];

export default DepartmentColumn;