import { useState } from "react";

const TablePagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
}) => {

    if (totalPages <= 1) {
        return null;
    }

    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    const handlePrevious = () => {

        if (currentPage > 1) {

            onPageChange(currentPage - 1);

        }

    };

    const handleNext = () => {

        if (currentPage < totalPages) {

            onPageChange(currentPage + 1);

        }

    };

    const PaginationButton = ({ onClick, disabled, children }) => {
        const [hovered, setHovered] = useState(false);
        return (
            <button
                onClick={onClick}
                disabled={disabled}
                style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: hovered && !disabled
                        ? 'rgba(99,102,241,0.15)'
                        : 'rgba(255,255,255,0.03)',
                    color: disabled ? '#334155' : '#94A3B8',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {children}
            </button>
        );
    };

    return (

        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                marginTop: 20,
                flexWrap: 'wrap',
            }}
        >

            {/* Left */}

            <div
                style={{
                    fontSize: '0.8125rem',
                    color: '#475569',
                }}
            >

                Showing{' '}

                <span style={{ fontWeight: 600, color: '#94A3B8' }}>

                    {startItem}

                </span>

                {' '}to{' '}

                <span style={{ fontWeight: 600, color: '#94A3B8' }}>

                    {endItem}

                </span>

                {' '}of{' '}

                <span style={{ fontWeight: 600, color: '#94A3B8' }}>

                    {totalItems}

                </span>

                {' '}entries

            </div>

            {/* Right */}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                <PaginationButton
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    Previous
                </PaginationButton>

                <span
                    style={{
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: '#94A3B8',
                        padding: '0 8px',
                    }}
                >

                    Page {currentPage} of {totalPages}

                </span>

                <PaginationButton
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    Next
                </PaginationButton>

            </div>

        </div>

    );

};

export default TablePagination;