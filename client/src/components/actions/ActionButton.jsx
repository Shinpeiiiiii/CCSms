import { useState } from "react";

const ActionButtons = ({
    onEdit,
    onDelete,
    editLabel = "Edit",
    deleteLabel = "Delete",
}) => {
    const [editHovered, setEditHovered] = useState(false);
    const [deleteHovered, setDeleteHovered] = useState(false);

    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <button
                onClick={onEdit}
                style={{
                    padding: '6px 14px',
                    borderRadius: 100,
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    background: editHovered 
                        ? 'rgba(245, 158, 11, 0.15)' 
                        : 'rgba(245, 158, 11, 0.05)',
                    color: '#F59E0B',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: editHovered ? '0 0 12px rgba(245, 158, 11, 0.25)' : 'none',
                }}
                onMouseEnter={() => setEditHovered(true)}
                onMouseLeave={() => setEditHovered(false)}
            >
                {editLabel}
            </button>

            <button
                onClick={onDelete}
                style={{
                    padding: '6px 14px',
                    borderRadius: 100,
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: deleteHovered 
                        ? 'rgba(239, 68, 68, 0.15)' 
                        : 'rgba(239, 68, 68, 0.05)',
                    color: '#EF4444',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: deleteHovered ? '0 0 12px rgba(239, 68, 68, 0.25)' : 'none',
                }}
                onMouseEnter={() => setDeleteHovered(true)}
                onMouseLeave={() => setDeleteHovered(false)}
            >
                {deleteLabel}
            </button>
        </div>
    );
};

export default ActionButtons;