const TableHeader = ({
    columns,
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
                        style={{
                            padding: '14px 24px',
                            textAlign: 'left',
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#5F6368',
                            borderBottom: '1px solid #DADCE0',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {column.header}
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHeader