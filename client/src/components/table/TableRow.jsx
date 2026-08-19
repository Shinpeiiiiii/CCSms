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
                background: hovered ? '#F1F3F4' : 'transparent',
                borderBottom: '1px solid #E8EAED',
                transition: 'background 0.15s ease',
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

export default TableRow;