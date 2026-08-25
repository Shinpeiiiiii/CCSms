import TableRow from "./TableRow";

const TableBody = ({
    columns,
    data,
    className = "",
}) => {

    return (

        <tbody>

            {data.map((row, index) => (

                <TableRow
                    key={row._id ?? row.id ?? index}
                    row={row}
                    columns={columns}
                    className={className}
                />

            ))}

        </tbody>

    )

}

export default TableBody