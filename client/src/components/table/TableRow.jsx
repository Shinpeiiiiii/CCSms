import { useState } from "react";
import TableCell from "./TableCell";

const TableRow = ({
    row,
    columns,
}) => {

    const [hovered, setHovered] = useState(false);

    return (

        <tr
            style={{
                background: hovered ? 'rgba(99,102,241,0.06)' : 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'background 0.2s ease',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >

            {columns.map((column) => (

                <TableCell
                    key={column.header}
                >

                    {
                        column.render
                            ? column.render(row)
                            : row[column.accessor]
                    }

                </TableCell>

            ))}

        </tr>

    )

}

export default TableRow