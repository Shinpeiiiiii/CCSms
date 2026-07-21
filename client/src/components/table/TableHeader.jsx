const TableHeader = ({
    columns,
    sortField,
    sortDirection,
    onSort,
}) => {
    

    return (
        <thead>
            <tr
                style={{
                    background: '#F1F3F4',
                }}
            >
                {columns.map((column) => (
                    <th
                        key={column.header}
                        onClick={() => column.sortable && onSort(column)}
                        style={{
                            padding: '14px 24px',
                            textAlign: column.align || "left",
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#5F6368',
                            borderBottom: '1px solid #DADCE0',
                            whiteSpace: 'nowrap',
                            cursor: column.sortable ? "pointer" : "default", userSelect: "none",
                        }} 
                       
                    >
                        {column.renderHeader ? column.renderHeader() : column.header}

                        {
                            column.sortable && !column.renderHeader && (
                                <span style={{marginLeft: 6,}}>
                                    {
                                        sortField === column.accessor ? (
                                            sortDirection === "asc" ? "▲" : "▼"
                                        )

                                        : "↕"
                                    }
                                </span>
                            )
                        }
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHeader