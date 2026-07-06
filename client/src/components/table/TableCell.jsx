const TableCell = ({
    children,
}) => {
    return (
        <td
            style={{
                padding: '14px 24px',
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