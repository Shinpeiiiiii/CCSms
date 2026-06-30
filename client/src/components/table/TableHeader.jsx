const TableHeader = ({
    columns,
}) => {

    return (

        <thead>

            <tr
                style={{
                    background: 'rgba(99,102,241,0.08)',
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
                            color: '#818CF8',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
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