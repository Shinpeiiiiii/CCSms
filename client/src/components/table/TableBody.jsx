import TableRow from "./TableRow";

const TableBody = ({
    columns,
    data,
}) => {

    return (

        <tbody>

            {data.map((row, index) => (

                <TableRow
                    key={row._id ?? row.id ?? index}
                    row={row}
                    columns={columns}
                />

            ))}

        </tbody>

    )

}

export default TableBody