import { useRef } from "react";
import ArrowNarrowRightIcon from "../movingicons/arrowNarrowIcon";
import ArrowNarrowerRightIcon from "../movingicons/arrowNarrowerIcon";
import ArrowNarrowLeftIcon from "../movingicons/arrowsNarrowIcon";
import ArrowNarrowerLeftIcon from "../movingicons/arrowsNarrowerIcon";
import arrowDownIcon from "../movingicons/arrowDownIcon"

const TablePagination = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const narrowRef = useRef(null);
    const narrowerRef = useRef(null);
    const narrowLeftRef = useRef(null);
    const narrowerLeftRef = useRef(null);
    const arrowDownRef = useRef(null);

    const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(count / rowsPerPage);
    const from = count === 0 ? 0 : page * rowsPerPage + 1;
    const to = rowsPerPage === -1 ? count : Math.min(count, (page + 1) * rowsPerPage);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 20,
                padding: "16px 8px",
                fontSize: 14,
                color: "black"
            }}
        >
           <span>Rows per page</span>
           <select
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                onMouseEnter={() => arrowDownRef.current?.startAnimation()}
                onMouseLeave={() => arrowDownRef.current?.stopAnimation()}
           >
                <arrowDownIcon ref={arrowDownRef}/>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={-1}>All</option>
           </select>
           <span>{from} - {to} of {count}</span>
           <button
                disabled= {page === 0}
                onClick={() => onPageChange(0)}
                onMouseEnter={() => narrowerLeftRef.current?.startAnimation()}
                onMouseLeave={() => narrowLeftRef.current?.stopAnimation()}
           >
                <ArrowNarrowerLeftIcon ref={narrowerLeftRef} size={18}/>
           </button>
           <button
                disabled = {page >= totalPages - 1}
                onClick={() => onPageChange(page + 1)}
                onMouseEnter={() => narrowLeftRef.current?.startAnimation()}
                onMouseLeave={() => narrowerLeftRef.current?.stopAnimation()}
           >
                <ArrowNarrowLeftIcon ref={narrowLeftRef} size={18}/>
           </button>

            <button
                disabled={page >= totalPages - 1}
                onClick={() =>
                    onPageChange(page + 1)
                }
                onMouseEnter={() => narrowRef.current?.startAnimation()}
                onMouseLeave={() => narrowRef.current?.stopAnimation()}
            >
                <ArrowNarrowRightIcon ref={narrowRef} size={18} />
            </button>

            <button
                disabled={page >= totalPages - 1}
                onClick={() =>
                    onPageChange(totalPages - 1)
                }
                onMouseEnter={() => narrowerRef.current?.startAnimation()}
                onMouseLeave={() => narrowerRef.current?.stopAnimation()}
            >
                <ArrowNarrowerRightIcon size={18} ref={narrowerRef}/>
            </button>
        </div>
    );
};

export default TablePagination;