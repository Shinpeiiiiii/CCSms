import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableLoading from "./TableLoading";
import TableEmpty from "./TableEmpty";
import TablePagination from "./TablePagination";

const DataTable = ({
    columns,
    data = [],
    loading = false,
    emptyMessage = "No records found.",
    pagination = null,
}) => {

    if (loading) {
        return <TableLoading />
    }

    if (!loading && data.length === 0) {
        return (
            <TableEmpty
                message={emptyMessage}
            />
        )
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    border: '1px solid #DADCE0',
                    borderRadius: 12,
                    overflow: 'hidden',
                }}
            >
                <TableHeader
                    columns={columns}
                />
                <TableBody
                    columns={columns}
                    data={data}
                />
            </table>

            {pagination && (
                <TablePagination
                    {...pagination}
                />
            )}
        </div>
    )
}

export default DataTable