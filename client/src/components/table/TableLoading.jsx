import { TableSkeleton } from '../toast/Skeleton';

const TableLoading = () => {
    return (
        <div style={{ padding: '24px 20px' }}>
            <TableSkeleton rows={5} cols={5} isDark={false} />
        </div>
    );
};

export default TableLoading;