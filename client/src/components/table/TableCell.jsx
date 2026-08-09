const TableCell = ({
    children,
}) => {
    return (
        <td
            style={{
                padding: '10px 16px',
                fontSize: '0.875rem',
                color: '#3C4043',
                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </td>
    )
}

export default TableCell