import DataTable from "../../../../../components/table/DataTable";
import PrerequisiteColumn from "./PrerequisiteColumn";

const PrerequisiteTable = ({
    prerequisites,
    loading,
    onEdit,
    onDeactivate
}) => {

    const columns = PrerequisiteColumn(onEdit, onDeactivate)
    
    return (

        <DataTable
            columns={columns}
            data={prerequisites}
            loading={loading}
            emptyMessage="No subject prerequisites found."
        />

    );

};

export default PrerequisiteTable;