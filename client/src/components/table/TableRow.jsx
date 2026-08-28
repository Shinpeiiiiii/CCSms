import { useState } from "react";
import TableCell from "./TableCell";

const TableRow = ({
    row,
    columns,
    className = "",
    isSelected = false,
}) => {
    const [hovered, setHovered] = useState(false);

    let background = "transparent";
    if (isSelected) background = "#EEF2FF";
    if (hovered && !isSelected) background = "#F1F3F4";
    if (hovered && isSelected) background = "#E0E7FF";

    return (
        <tr
            style={{
                background,
                borderBottom: '1px solid #E8EAED',
                transition: 'background 0.15s ease',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {columns.map((column) => (
                <TableCell
                    key={column.header}
                    className={className}
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