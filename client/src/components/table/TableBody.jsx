import TableRow from "./TableRow";

const TableBody = ({
    columns,
    data,
    className = "",
    selectedIds = [],
}) => {

    return (

        <tbody>

            {data.map((row, index) => {

                if (row._isSeparator) {
                    return (
                        <tr key={`separator-${index}`}>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-1.5 bg-zinc-50 border-b border-t border-zinc-300"
                            >
                                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                                    {row._separatorLabel}
                                </span>
                            </td>
                        </tr>
                    );
                }

                return (
                    <TableRow
                        key={row._id ?? row.id ?? index}
                        row={row}
                        columns={columns}
                        className={className}
                        isSelected={selectedIds.includes(row._id)}
                    />
                );

            })}

        </tbody>

    )

}

export default TableBody