import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableLoading from "./TableLoading";
import TableEmpty from "./TableEmpty";
import TablePagination from "./TablePagination";
import { useMemo, useState, useEffect, useCallback } from "react";


const DataTable = ({
    columns,
    data = [],
    loading = false,
    emptyMessage = "No records found.",
    pagination = null,
    rowsPerPage = 5,
    showPagination = true,
}) => {

    const [page, setPage] = useState(0);
    const [internalRowsPerPage, setRowsPerPage] = useState(rowsPerPage);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc")

    useEffect(() => {
        setPage(0);
    }, [data]);

    const handleSort = (column) => {
        if(!column.sortable) return;

        setPage(0);

        if(sortField === column.accessor){
            setSortDirection((previous) => previous === "asc" ? "desc" : "asc");
        }else{
            setSortField(column.accessor);
            setSortDirection("asc");
        }
    };

    const sortedData = useMemo(() => {
        if(!sortField) return data;

        return [...data].sort((a, b) => {
            const avalue = a[sortField];
            const bvalue = b[sortField];

            if(avalue < bvalue)
                return sortDirection === "asc" ? -1 : 1;

            if(avalue > bvalue)
                return sortDirection === "asc" ? 1 : -1;

            return 0;
        });

    }, [data, sortField, sortDirection]);

    const paginatedData = useMemo(() => {

        if(internalRowsPerPage === -1) return sortedData;

        const start = page * internalRowsPerPage;

        return sortedData.slice(start, start + internalRowsPerPage);
    }, [sortedData, page, internalRowsPerPage]);

    if (loading) {
        return <TableLoading />
    }

    if (!loading && data.length === 0) 
        return <TableEmpty message={emptyMessage}/>;

    return (
        <div style={{ overflowX: 'auto', border: "1px solid #DADCE0", borderRadius: 12,  }}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                }}
            >
                <TableHeader
                    columns={columns}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                />
                <TableBody
                    columns={columns}
                    data={paginatedData}
                />
            </table>

            {showPagination && (
                <TablePagination
                    count={sortedData.length}
                    page={page}
                    rowsPerPage={internalRowsPerPage}
                    onPageChange={setPage}
                    onRowsPerPageChange={(rows) => {
                        setRowsPerPage(rows);
                        setPage(0);
                    }}
                />
            )}
        </div>
    )
}

export default DataTable